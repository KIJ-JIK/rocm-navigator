import os
import uuid
import typer
import httpx
from rich.console import Console
from rich.table import Table

app = typer.Typer(help="ROCm Navigator CLI")
console = Console()

API_URL = os.getenv("ROCM_NAV_API_URL", "http://localhost:8000").rstrip("/")


@app.command("validate")
def validate_command(file: str = typer.Argument(..., help="Path to the source file to validate")):
    """
    Validate a HIP/C++ source file using the sandbox compiler.
    """
    if not os.path.exists(file):
        console.print(f"[bold red]Error:[/] File '{file}' not found.")
        raise typer.Exit(code=1)

    with open(file, "r") as f:
        source_code = f.read()

    session_id = f"cli-{uuid.uuid4().hex[:8]}"
    
    with console.status(f"Validating '{file}'..."):
        try:
            response = httpx.post(
                f"{API_URL}/api/v1/sandbox/compile-verify",
                json={"session_id": session_id, "hip_source": source_code},
                timeout=20.0
            )
            response.raise_for_status()
            data = response.json()
        except httpx.RequestError as e:
            console.print(f"[bold red]API Connection Error:[/] {e}")
            raise typer.Exit(code=1)
        except httpx.HTTPStatusError as e:
            console.print(f"[bold red]API HTTP Error:[/] {e}")
            raise typer.Exit(code=1)

    if data.get("compilation_success"):
        console.print("[bold green]Success![/] Compilation passed without errors.")
        if data.get("raw_stdout"):
            console.print(data["raw_stdout"])
    else:
        console.print("[bold red]Compilation Failed.[/]")
        errors = data.get("compilation_error_logs", [])
        if errors:
            table = Table(title="Diagnostic Logs")
            table.add_column("Location")
            table.add_column("Severity")
            table.add_column("Message")
            
            for err in errors:
                location = f"{err.get('file', 'unknown')}:{err.get('line', '?')}:{err.get('column', '?')}"
                sev = err.get("severity", "")
                color = "red" if sev == "error" else "yellow"
                table.add_row(location, f"[{color}]{sev}[/]", err.get("message", ""))
                
            console.print(table)
        elif data.get("raw_stdout"):
            console.print(data["raw_stdout"])


@app.command("benchmark")
def benchmark_command(
    binary: str = typer.Argument(..., help="Path to the compiled binary"),
    simulate: bool = typer.Option(False, "--simulate", help="Use simulation mode (if real hardware is absent)")
):
    """
    Profile a compiled binary to get kernel performance metrics.
    """
    if not os.path.exists(binary):
        console.print(f"[bold red]Error:[/] Binary '{binary}' not found.")
        raise typer.Exit(code=1)

    absolute_binary_path = os.path.abspath(binary)
    session_id = f"cli-{uuid.uuid4().hex[:8]}"

    with console.status(f"Profiling '{absolute_binary_path}'..."):
        try:
            response = httpx.post(
                f"{API_URL}/api/v1/sandbox/profile-metrics",
                json={
                    "session_id": session_id,
                    "binary_path": absolute_binary_path,
                    "simulate": simulate
                },
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
        except httpx.RequestError as e:
            console.print(f"[bold red]API Connection Error:[/] {e}")
            raise typer.Exit(code=1)
        except httpx.HTTPStatusError as e:
            console.print(f"[bold red]API HTTP Error {e.response.status_code}:[/] {e.response.text}")
            raise typer.Exit(code=1)

    metrics = data.get("performance_metrics", [])
    if not metrics:
        console.print("[bold yellow]No performance metrics returned.[/]")
        return

    table = Table(title="Performance Metrics")
    table.add_column("Kernel Name")
    table.add_column("Duration (ns)", justify="right")
    table.add_column("Occupancy", justify="right")
    table.add_column("Bandwidth (GB/s)", justify="right")
    table.add_column("Efficiency Score", justify="right")

    for m in metrics:
        eff = m.get("efficiency_score", 0.0)
        eff_color = "green" if not m.get("below_threshold") else "red"
        
        table.add_row(
            m.get("kernel_name", "unknown"),
            str(m.get("duration_ns", 0)),
            f"{m.get('occupancy_pct', 0.0)}%",
            f"{m.get('memory_bandwidth_gb_s', 0.0):.2f}",
            f"[{eff_color}]{eff:.2f}[/]"
        )

    console.print(table)


@app.command("estimate")
def estimate_command():
    """
    Interactively estimate GPU compute cost and completion time.
    """
    console.print("[bold cyan]Cost Estimator[/]")
    
    estimated_kernels = typer.prompt("Estimated number of kernels to run", type=int)
    avg_kernel_runtime_ms = typer.prompt("Average kernel runtime (ms)", type=float)
    gpu_hourly_rate = typer.prompt("GPU hourly rate (USD)", type=float, default=3.50)
    
    with console.status("Calculating estimate..."):
        try:
            response = httpx.post(
                f"{API_URL}/api/v1/sandbox/estimate",
                json={
                    "estimated_kernels": estimated_kernels,
                    "avg_kernel_runtime_ms": avg_kernel_runtime_ms,
                    "gpu_hourly_rate_usd": gpu_hourly_rate
                },
                timeout=10.0
            )
            response.raise_for_status()
            data = response.json()
        except httpx.RequestError as e:
            console.print(f"[bold red]API Connection Error:[/] {e}")
            raise typer.Exit(code=1)
        except httpx.HTTPStatusError as e:
            console.print(f"[bold red]API HTTP Error:[/] {e}")
            raise typer.Exit(code=1)

    table = Table(show_header=False)
    table.add_column("Metric", style="bold")
    table.add_column("Value")
    
    table.add_row("Estimated GPU Hours", f"{data.get('estimated_gpu_hours', 0.0):.6f} h")
    table.add_row("Estimated Completion Time", f"{data.get('estimated_completion_minutes', 0.0):.2f} min")
    table.add_row("Estimated Cost", f"${data.get('estimated_cost_usd', 0.0):.4f} USD")
    
    console.print("\n", table)


if __name__ == "__main__":
    app()
