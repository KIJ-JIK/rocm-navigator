"""
Telemetry module for ROCm Navigator.

Wires up OpenTelemetry tracing + Prometheus metrics for the
compile -> validate -> profile pipeline, so Ansh's dashboard has
something real to plot and Malatesh's rewrite engine can be traced
end-to-end alongside it.

Usage:
    from telemetry import setup_telemetry, traced_stage, traced_block

    tracer = setup_telemetry(app)  # app = FastAPI instance

    @traced_stage("compile")
    def compile_kernel(...):
        ...
"""
import time
import functools
from contextlib import contextmanager

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST

# ---------------------------------------------------------------------------
# Generic pipeline metrics — one counter + one histogram per pipeline stage,
# labeled by stage and outcome so the dashboard can slice by either without
# new metric names.
# ---------------------------------------------------------------------------
STAGE_COUNTER = Counter(
    "rocm_nav_stage_total",
    "Count of pipeline stage executions",
    ["stage", "outcome"],  # outcome: success | failure
)

STAGE_DURATION = Histogram(
    "rocm_nav_stage_duration_seconds",
    "Duration of each pipeline stage",
    ["stage"],
    buckets=(0.1, 0.5, 1, 2, 5, 10, 30, 60, 120, 300),
)

# ---------------------------------------------------------------------------
# Domain-specific metrics — tracked by the sandbox-runtime endpoints.
# ---------------------------------------------------------------------------
COMPILE_REQUEST_TOTAL = Counter(
    "compile_request_total",
    "Total number of compile-verify requests received",
)

COMPILE_SUCCESS_TOTAL = Counter(
    "compile_success_total",
    "Total number of successful compilations",
)

COMPILE_DURATION_SECONDS = Histogram(
    "compile_duration_seconds",
    "Wall-clock duration of each compile-verify request in seconds",
    buckets=(0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, 15, 30),
)

ACTIVE_CONTAINERS = Gauge(
    "active_containers",
    "Number of sandbox containers currently running",
)

ROCPROF_RUN_DURATION_SECONDS = Histogram(
    "rocprof_run_duration_seconds",
    "Wall-clock duration of each rocprof profiling run in seconds",
    buckets=(0.1, 0.5, 1, 2, 5, 10, 15, 30, 60),
)


def get_metrics() -> tuple[bytes, str]:
    """
    Returns (body_bytes, content_type) suitable for a dedicated GET /metrics
    route that serves Prometheus text-format output.

    Usage in FastAPI:
        from fastapi.responses import Response

        @app.get("/metrics")
        def metrics():
            body, content_type = get_metrics()
            return Response(content=body, media_type=content_type)
    """
    return generate_latest(), CONTENT_TYPE_LATEST


def setup_telemetry(app=None, service_name="rocm-navigator", otlp_endpoint=None):
    """
    Call once at service startup.

    app: FastAPI instance (optional) — auto-instruments HTTP routes and
         mounts /metrics for Prometheus to scrape.
    otlp_endpoint: e.g. "http://localhost:4317" to ship traces to an
                   OTel collector. If None, traces print to console,
                   which is enough for a live demo.
    """
    resource = Resource.create({"service.name": service_name})
    provider = TracerProvider(resource=resource)

    exporter = OTLPSpanExporter(endpoint=otlp_endpoint, insecure=True) if otlp_endpoint else ConsoleSpanExporter()
    provider.add_span_processor(BatchSpanProcessor(exporter))
    trace.set_tracer_provider(provider)

    if app is not None:
        FastAPIInstrumentor.instrument_app(app)

    return trace.get_tracer(service_name)


_tracer = trace.get_tracer("rocm-navigator")


def traced_stage(stage_name):
    """
    Decorator for a pipeline stage (compile / validate / profile).
    Wraps the call in an OTel span + records Prometheus counter/histogram.
    Success/failure is inferred from whether the function raises.

    @traced_stage("compile")
    def compile_kernel(source_path, gpu_arch):
        ...
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start = time.perf_counter()
            with _tracer.start_as_current_span(f"pipeline.{stage_name}") as span:
                span.set_attribute("pipeline.stage", stage_name)
                try:
                    result = func(*args, **kwargs)
                    span.set_attribute("pipeline.outcome", "success")
                    STAGE_COUNTER.labels(stage=stage_name, outcome="success").inc()
                    return result
                except Exception as e:
                    span.set_attribute("pipeline.outcome", "failure")
                    span.record_exception(e)
                    STAGE_COUNTER.labels(stage=stage_name, outcome="failure").inc()
                    raise
                finally:
                    STAGE_DURATION.labels(stage=stage_name).observe(time.perf_counter() - start)
        return wrapper
    return decorator


@contextmanager
def traced_block(stage_name, **span_attrs):
    """
    Context-manager version for stages that aren't a clean single function
    call — e.g. wrapping a subprocess.run for rocprof inline.

    with traced_block("profile", kernel="matmul"):
        subprocess.run([...])
    """
    start = time.perf_counter()
    with _tracer.start_as_current_span(f"pipeline.{stage_name}") as span:
        span.set_attribute("pipeline.stage", stage_name)
        for k, v in span_attrs.items():
            span.set_attribute(k, v)
        try:
            yield span
            span.set_attribute("pipeline.outcome", "success")
            STAGE_COUNTER.labels(stage=stage_name, outcome="success").inc()
        except Exception as e:
            span.set_attribute("pipeline.outcome", "failure")
            span.record_exception(e)
            STAGE_COUNTER.labels(stage=stage_name, outcome="failure").inc()
            raise
        finally:
            STAGE_DURATION.labels(stage=stage_name).observe(time.perf_counter() - start)
