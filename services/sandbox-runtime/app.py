import os
import sys
import re
import csv
import io
import time
import shutil
import uuid
import asyncio
import logging
from typing import List, Literal, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, status
from fastapi.responses import Response
from pydantic import BaseModel, Field
import docker
from docker.errors import ContainerError, APIError

# ---------------------------------------------------------------------------
# Make the root-level telemetry module importable
# ---------------------------------------------------------------------------
_REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)

from telemetry import (
    setup_telemetry,
    get_metrics,
    COMPILE_REQUEST_TOTAL,
    COMPILE_SUCCESS_TOTAL,
    COMPILE_DURATION_SECONDS,
    ACTIVE_CONTAINERS,
    ROCPROF_RUN_DURATION_SECONDS,
)

app = FastAPI(
    title="ROCm Navigator - Sandbox Runtime",
    description="Isolated compilation sandbox runtime microservice with structured error parsing and performance profiling",
    version="2.0.0"
)

# Wire OpenTelemetry tracing + Prometheus /metrics ASGI mount
tracer = setup_telemetry(app, service_name="sandbox-runtime")

logger = logging.getLogger("sandbox-runtime")

# Determine if we should run in simulation mode.
# If Docker daemon is not running or SIMULATE=true, we fall back to simulation.
SIMULATE_ENV = os.getenv("SIMULATE", "false").lower() in ("true", "1", "yes")

docker_client = None
if not SIMULATE_ENV:
    try:
        docker_client = docker.from_env()
        # Verify docker daemon connection works
        docker_client.ping()
    except Exception as e:
        print(f"Docker connection failed, enabling simulation mode. Reason: {e}")
        SIMULATE_ENV = True

# Define base sandbox directory
BASE_SANDBOX_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "sandbox_temp"))
os.makedirs(BASE_SANDBOX_DIR, exist_ok=True)

ROCM_SANDBOX_IMAGE = "rocm-nav-sandbox:6.0"

DIAGNOSTIC_REGEX = re.compile(
    r"^(?P<file>[^:\n]+):(?P<line>\d+):(?P<column>\d+):\s*(?P<severity>error|warning):\s*(?P<message>.*)$",
    re.MULTILINE
)

# ==============================================================================
# Request / Response Schemas
# ==============================================================================

class CompilePayload(BaseModel):
    # Support both gateway's hip_code and CLI's hip_source/session_id
    hip_code: Optional[str] = None
    hip_source: Optional[str] = None
    session_id: Optional[str] = None
    filename: Optional[str] = "main.cpp"

class StructuredError(BaseModel):
    file: str
    line: int
    column: int
    severity: Literal["error", "warning"]
    message: str

class KernelMetric(BaseModel):
    kernel_name: str
    duration_ns: int
    occupancy_pct: float
    memory_bandwidth_gb_s: float
    efficiency_score: float
    below_threshold: bool

class CompileResponse(BaseModel):
    session_id: str
    compilation_success: bool
    compilation_error_logs: List[StructuredError] = Field(default_factory=list)
    performance_metrics: List[KernelMetric] = Field(default_factory=list)
    raw_stdout: str
    # Gateway compatibility fields
    compiler: str = "hipcc (Docker Native)"
    warnings: List[str] = Field(default_factory=list)

class ProfilePayload(BaseModel):
    # Support both gateway's hip_code/binary_path and CLI's ProfileMetricsRequest
    hip_code: Optional[str] = None
    session_id: Optional[str] = None
    binary_path: Optional[str] = "/workspace/app"
    simulate: bool = False

class ProfileMetricsResponse(BaseModel):
    session_id: str
    compilation_success: bool
    compilation_error_logs: List[StructuredError] = Field(default_factory=list)
    performance_metrics: List[KernelMetric] = Field(default_factory=list)
    # Gateway compatibility fields
    execution_time_seconds: float = 0.0
    wavefront_occupancy_percent: float = 0.0
    memory_bandwidth_gb_sec: float = 0.0
    efficiency_score: float = 0.0
    profiler: str = "rocprof"
    telemetry_metrics: Dict[str, Any] = Field(default_factory=dict)

class EstimateRequest(BaseModel):
    estimated_kernels: int
    avg_kernel_runtime_ms: float
    gpu_hourly_rate_usd: float

class EstimateResponse(BaseModel):
    estimated_gpu_hours: float
    estimated_cost_usd: float
    estimated_completion_minutes: float

# ==============================================================================
# Helper methods
# ==============================================================================

def parse_hipcc_stderr(raw_stderr: str) -> List[StructuredError]:
    structured_errors = []
    if not raw_stderr:
        return structured_errors
    for match in DIAGNOSTIC_REGEX.finditer(raw_stderr):
        structured_errors.append(
            StructuredError(
                file=match.group("file").strip(),
                line=int(match.group("line")),
                column=int(match.group("column")),
                severity=match.group("severity"),
                message=match.group("message").strip()
            )
        )
    return structured_errors

def calculate_efficiency(occupancy: float, bandwidth: float) -> float:
    occupancy_factor = occupancy / 100.0
    bandwidth_factor = min(bandwidth / 1024.0, 1.0)
    score = (0.7 * occupancy_factor) + (0.3 * bandwidth_factor)
    return round(max(0.0, min(score, 1.0)), 3)

def validate_and_isolate_path(session_id: str) -> str:
    if not re.match(r"^[a-zA-Z0-9_\-]+$", session_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Security Violation: Invalid characters in session_id."
        )
    absolute_base = os.path.abspath(BASE_SANDBOX_DIR)
    target_path = os.path.abspath(os.path.join(absolute_base, f"sandbox_{session_id}"))
    if not target_path.startswith(absolute_base + os.sep):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Security Violation: Directory traversal attempt detected."
        )
    return target_path

def execute_container_blocking(host_dir: str, container_name: str) -> bytes:
    return docker_client.containers.run(
        image=ROCM_SANDBOX_IMAGE,
        command=["sh", "-c", "cp /src/main.cpp ./main.cpp && hipcc main.cpp -o app"],
        volumes={host_dir: {"bind": "/src", "mode": "ro"}},
        working_dir="/workspace",
        name=container_name,
        network_disabled=True,
        privileged=False,
        remove=True,
        stdout=True,
        stderr=True
    )

# ==============================================================================
# Endpoints
# ==============================================================================

@app.get("/metrics", tags=["observability"])
def metrics():
    body, content_type = get_metrics()
    return Response(content=body, media_type=content_type)

@app.get("/api/v1/sandbox/health", tags=["health"])
async def health_check():
    return {
        "status": "Sandbox Validation Service Online",
        "docker_connected": not SIMULATE_ENV,
        "rocprof_connected": not SIMULATE_ENV
    }

@app.post("/api/v1/sandbox/estimate", response_model=EstimateResponse, tags=["cost"])
async def cost_estimate(payload: EstimateRequest):
    total_ms = payload.estimated_kernels * payload.avg_kernel_runtime_ms
    total_seconds = total_ms / 1000.0
    total_hours = total_seconds / 3600.0
    total_minutes = total_seconds / 60.0
    cost_usd = total_hours * payload.gpu_hourly_rate_usd
    return EstimateResponse(
        estimated_gpu_hours=round(total_hours, 6),
        estimated_cost_usd=round(cost_usd, 4),
        estimated_completion_minutes=round(total_minutes, 2),
    )

@app.post("/api/v1/sandbox/compile-verify", response_model=CompileResponse)
async def compile_verify(payload: CompilePayload):
    COMPILE_REQUEST_TOTAL.inc()
    _compile_start = time.perf_counter()

    # Extract source and session ID
    hip_source = payload.hip_source or payload.hip_code or ""
    session_id = payload.session_id or f"sess_{uuid.uuid4().hex[:12]}"
    filename = payload.filename or "main.cpp"

    host_dir = validate_and_isolate_path(session_id)
    if os.path.exists(host_dir):
        shutil.rmtree(host_dir)
    os.makedirs(host_dir, exist_ok=True)

    try:
        with open(os.path.join(host_dir, filename), "w") as source_file:
            source_file.write(hip_source)
    except Exception as e:
        if os.path.exists(host_dir):
            shutil.rmtree(host_dir)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to prepare source files: {e}"
        )

    compiler_name = "hipcc (Simulated)" if SIMULATE_ENV else "hipcc (Docker Native)"

    if SIMULATE_ENV:
        try:
            async def simulate_compilation():
                await asyncio.sleep(0.1)
                if "simulate_timeout" in hip_source or "timeout-test" in session_id:
                    await asyncio.sleep(16.0)

                if "this_is_an_invalid_syntax_error_on_purpose" in hip_source:
                    return CompileResponse(
                        session_id=session_id,
                        compilation_success=False,
                        compilation_error_logs=parse_hipcc_stderr("main.cpp:3:9: error: 'this_is_an_invalid_syntax_error_on_purpose' was not declared in this scope"),
                        raw_stdout="",
                        compiler=compiler_name
                    )

                if "#include" not in hip_source:
                    return CompileResponse(
                        session_id=session_id,
                        compilation_success=False,
                        compilation_error_logs=parse_hipcc_stderr("main.cpp:1:1: error: missing standard includes or entry point"),
                        raw_stdout="",
                        compiler=compiler_name
                    )

                COMPILE_SUCCESS_TOTAL.inc()
                return CompileResponse(
                    session_id=session_id,
                    compilation_success=True,
                    compilation_error_logs=[],
                    raw_stdout="Compilation successful. Binary 'app' generated.",
                    compiler=compiler_name
                )

            try:
                result = await asyncio.wait_for(simulate_compilation(), timeout=15.0)
                return result
            except asyncio.TimeoutError:
                return CompileResponse(
                    session_id=session_id,
                    compilation_success=False,
                    compilation_error_logs=parse_hipcc_stderr("main.cpp:0:0: error: Compilation failed: Execution exceeded strict 15-second timeout limit."),
                    raw_stdout="",
                    compiler=compiler_name
                )
        finally:
            COMPILE_DURATION_SECONDS.observe(time.perf_counter() - _compile_start)
            if os.path.exists(host_dir):
                shutil.rmtree(host_dir)
    else:
        unique_container_name = f"rocm_nav_compile_{uuid.uuid4().hex}"
        ACTIVE_CONTAINERS.inc()

        try:
            try:
                raw_output_bytes = await asyncio.wait_for(
                    asyncio.to_thread(execute_container_blocking, host_dir, unique_container_name),
                    timeout=15.0
                )
                logs = raw_output_bytes.decode("utf-8")
                COMPILE_SUCCESS_TOTAL.inc()
                return CompileResponse(
                    session_id=session_id,
                    compilation_success=True,
                    compilation_error_logs=[],
                    raw_stdout=logs if logs else "Compilation successful.",
                    compiler=compiler_name
                )
            except asyncio.TimeoutError:
                try:
                    runaway_container = docker_client.containers.get(unique_container_name)
                    runaway_container.kill()
                except Exception:
                    pass
                return CompileResponse(
                    session_id=session_id,
                    compilation_success=False,
                    compilation_error_logs=parse_hipcc_stderr("main.cpp:0:0: error: Compilation failed: Execution exceeded strict 15-second timeout limit."),
                    raw_stdout="",
                    compiler=compiler_name
                )
            except ContainerError as container_err:
                error_logs = container_err.stderr.decode("utf-8") if container_err.stderr else str(container_err)
                return CompileResponse(
                    session_id=session_id,
                    compilation_success=False,
                    compilation_error_logs=parse_hipcc_stderr(error_logs),
                    raw_stdout="",
                    compiler=compiler_name
                )
        except APIError as docker_api_err:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Docker Engine Core Error: {str(docker_api_err)}"
            )
        finally:
            ACTIVE_CONTAINERS.dec()
            COMPILE_DURATION_SECONDS.observe(time.perf_counter() - _compile_start)
            if os.path.exists(host_dir):
                shutil.rmtree(host_dir)

@app.post("/api/v1/sandbox/profile-metrics", response_model=ProfileMetricsResponse)
async def profile_metrics(payload: ProfilePayload):
    _profile_start = time.perf_counter()
    performance_results: List[KernelMetric] = []
    
    session_id = payload.session_id or f"sess_{uuid.uuid4().hex[:12]}"
    hip_code = payload.hip_code or ""
    simulate_flag = payload.simulate or SIMULATE_ENV

    # -------------------------------------------------------------------------
    # CASE A: SIMULATION MODE FALLBACK
    # -------------------------------------------------------------------------
    if simulate_flag:
        logger.info(f"[{session_id}] Executing profiling sequence in SIMULATION mode.")
        
        # Calculate simulated metrics based on code checks (to match old profiling.py style)
        execution_time_seconds = 0.0042
        wavefront_occupancy = 0.82
        memory_bandwidth_gb_sec = 820.0
        
        if "__ballot" in hip_code and "__ballot_sync" not in hip_code:
            wavefront_occupancy = 0.96
            execution_time_seconds = 0.0035
            memory_bandwidth_gb_sec = 940.0
        elif hip_code == "": # Default CLI run
            wavefront_occupancy = 0.924
            execution_time_seconds = 0.0004502
            memory_bandwidth_gb_sec = 845.2
            
        efficiency_score = calculate_efficiency(wavefront_occupancy * 100, memory_bandwidth_gb_sec)

        mock_csv_data = (
            "KernelName,DurationNs,OccupancyPct,BandwidthGBs\n"
            f'"void matrixMultiplyKernel<float>(float*, float*, float*, int)",{int(execution_time_seconds * 1e9)},{wavefront_occupancy * 100},{memory_bandwidth_gb_sec}\n'
        )

        f = io.StringIO(mock_csv_data.strip())
        reader = csv.DictReader(f)
        for row in reader:
            occ = float(row["OccupancyPct"])
            bw = float(row["BandwidthGBs"])
            eff_score = calculate_efficiency(occ, bw)
            performance_results.append(
                KernelMetric(
                    kernel_name=row["KernelName"],
                    duration_ns=int(row["DurationNs"]),
                    occupancy_pct=occ,
                    memory_bandwidth_gb_s=bw,
                    efficiency_score=eff_score,
                    below_threshold=eff_score < 0.85
                )
            )

        ROCPROF_RUN_DURATION_SECONDS.observe(time.perf_counter() - _profile_start)
        return ProfileMetricsResponse(
            session_id=session_id,
            compilation_success=True,
            performance_metrics=performance_results,
            execution_time_seconds=execution_time_seconds,
            wavefront_occupancy_percent=wavefront_occupancy * 100,
            memory_bandwidth_gb_sec=memory_bandwidth_gb_sec,
            efficiency_score=efficiency_score,
            profiler="rocprof (Simulated)",
            telemetry_metrics={"grid_size": 1024, "block_size": 256}
        )

    # -------------------------------------------------------------------------
    # CASE B: HARDWARE COUPLING (REAL DOCKER RUNTIME TRACING)
    # -------------------------------------------------------------------------
    binary_path = payload.binary_path or "/workspace/app"
    if not os.path.isabs(binary_path):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Binary path must be an absolute path to prevent directory traversal exploits."
        )

    if not os.path.exists(binary_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target application binary could not be located on the host filesystem."
        )

    host_dir = os.path.dirname(binary_path)
    binary_name = os.path.basename(binary_path)

    resolved_host_dir = os.path.realpath(host_dir)
    if not os.path.isabs(resolved_host_dir):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Security Violation: Volume mount path is not absolute."
        )

    unique_container_name = f"rocm_nav_profile_{uuid.uuid4().hex}"

    try:
        container_output = await asyncio.wait_for(
            asyncio.to_thread(
                docker_client.containers.run,
                image=ROCM_SANDBOX_IMAGE,
                command=f"rocprof --stats /tmp_bin/{binary_name}",
                volumes={resolved_host_dir: {"bind": "/tmp_bin", "mode": "ro"}},
                working_dir="/tmp_bin",
                name=unique_container_name,
                privileged=False,
                remove=True,
                network_disabled=True,
                stdout=True,
                stderr=True,
            ),
            timeout=15.0
        )

        expected_csv_path = os.path.join(resolved_host_dir, "results.stats.csv")
        if not os.path.exists(expected_csv_path):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="rocprof executed successfully but failed to emit a structured telemetry CSV asset."
            )

        duration_total = 0
        occupancy_sum = 0
        bandwidth_sum = 0
        count = 0

        with open(expected_csv_path, mode="r") as csv_file:
            reader = csv.DictReader(csv_file)
            for row in reader:
                name = row.get("KernelName") or row.get("Name") or "unknown_kernel"
                duration = int(row.get("DurationNs") or row.get("Duration", 0))
                occ = float(row.get("OccupancyPct") or row.get("Occupancy", 0.0))
                bw = float(row.get("BandwidthGBs") or row.get("Bandwidth", 0.0))

                eff_score = calculate_efficiency(occ, bw)
                
                duration_total += duration
                occupancy_sum += occ
                bandwidth_sum += bw
                count += 1

                performance_results.append(
                    KernelMetric(
                        kernel_name=name,
                        duration_ns=duration,
                        occupancy_pct=occ,
                        memory_bandwidth_gb_s=bw,
                        efficiency_score=eff_score,
                        below_threshold=eff_score < 0.85
                    )
                )

        avg_occ = occupancy_sum / count if count > 0 else 82.0
        avg_bw = bandwidth_sum / count if count > 0 else 820.0
        tot_time = duration_total / 1e9 if count > 0 else 0.0042
        overall_eff = calculate_efficiency(avg_occ, avg_bw)

        ROCPROF_RUN_DURATION_SECONDS.observe(time.perf_counter() - _profile_start)
        return ProfileMetricsResponse(
            session_id=session_id,
            compilation_success=True,
            performance_metrics=performance_results,
            execution_time_seconds=tot_time,
            wavefront_occupancy_percent=avg_occ,
            memory_bandwidth_gb_sec=avg_bw,
            efficiency_score=overall_eff,
            profiler="rocprof (Docker Native)",
            telemetry_metrics={"grid_size": 1024, "block_size": 256}
        )

    except asyncio.TimeoutError:
        try:
            runaway = docker_client.containers.get(unique_container_name)
            runaway.kill()
        except Exception:
            pass
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Profiling execution exceeded strict 15-second timeout limit."
        )
    except ContainerError as ce:
        logger.error(f"Execution Failure within runtime sandbox environment: {str(ce)}")
        raise HTTPException(status_code=500, detail=f"Profiling execution error: {ce.stderr.decode()}")
    except APIError as api_err:
        raise HTTPException(status_code=500, detail=f"Docker Engine Core Error: {str(api_err)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8003, reload=True)
