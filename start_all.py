import subprocess
import sys
import os
import time
import signal
from typing import List

# Color configurations for terminal logs
class Colors:
    HEADER = '\033[95m'
    GATEWAY = '\033[94m'      # Blue
    SCANNER = '\033[96m'      # Cyan
    SYNTHESIS = '\033[95m'    # Magenta
    SANDBOX = '\033[93m'      # Yellow
    SECURITY = '\033[91m'     # Red
    DASHBOARD = '\033[92m'    # Green
    ENDC = '\033[0m'
    BOLD = '\033[1m'

PROCESSES: List[subprocess.Popen] = []

def run_service(command: List[str], cwd: str, prefix: str, color: str) -> subprocess.Popen:
    """Spawns a background process and pipes stdout to print with prefix colors."""
    # Use shell=True on Windows for command execution
    use_shell = (os.name == 'nt')
    p = subprocess.Popen(
        command,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        shell=use_shell
    )
    
    # Run a thread to non-block read output
    import threading
    def log_reader():
        try:
            for line in iter(p.stdout.readline, ''):
                if line:
                    print(f"{color}[{prefix}]{Colors.ENDC} {line.strip()}")
        except Exception:
            pass
            
    t = threading.Thread(target=log_reader, daemon=True)
    t.start()
    return p

def shutdown_all(signum=None, frame=None):
    print(f"\n{Colors.BOLD}{Colors.HEADER}[SYSTEM] Shutting down all microservices...{Colors.ENDC}")
    for p in PROCESSES:
        try:
            if os.name == 'nt':
                # On Windows, use taskkill to kill process tree
                subprocess.run(["taskkill", "/F", "/T", "/PID", str(p.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            else:
                p.terminate()
                p.wait(timeout=2)
        except Exception:
            pass
    print(f"{Colors.BOLD}{Colors.HEADER}[SYSTEM] All systems offline. Goodbye!{Colors.ENDC}")
    sys.exit(0)

def load_env():
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        print("[SYSTEM] Loading credentials and config from .env...")
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    if key:
                        os.environ[key] = val

def main():
    load_env()
    # Hook exit signals
    signal.signal(signal.SIGINT, shutdown_all)
    signal.signal(signal.SIGTERM, shutdown_all)
    
    print(f"{Colors.BOLD}{Colors.HEADER}==================================================")
    print("         ROCm Navigator Systems Orchestrator      ")
    print(f"=================================================={Colors.ENDC}\n")
    
    python_cmd = "py" if os.name == 'nt' else "python"

    print(f"{Colors.BOLD}[1/6] Launching FastAPI Routing Gateway (Port 8000)...{Colors.ENDC}")
    p_gate = run_service([python_cmd, "main.py"], "apps/gateway", "Gateway", Colors.GATEWAY)
    PROCESSES.append(p_gate)
    time.sleep(1)

    print(f"{Colors.BOLD}[2/6] Launching Core Scanner Service (Port 8001)...{Colors.ENDC}")
    p_scan = run_service([python_cmd, "app.py"], "services/core-scanner", "Scanner", Colors.SCANNER)
    PROCESSES.append(p_scan)
    time.sleep(1)

    print(f"{Colors.BOLD}[3/6] Launching LLM Synthesis Service (Port 8002)...{Colors.ENDC}")
    p_synth = run_service([python_cmd, "app.py"], "services/llm-synthesis", "Synthesis", Colors.SYNTHESIS)
    PROCESSES.append(p_synth)
    time.sleep(1)

    print(f"{Colors.BOLD}[4/6] Launching Sandbox Runtime Service (Port 8003)...{Colors.ENDC}")
    p_sandbox = run_service([python_cmd, "app.py"], "services/sandbox-runtime", "Sandbox", Colors.SANDBOX)
    PROCESSES.append(p_sandbox)
    time.sleep(1)

    print(f"{Colors.BOLD}[5/6] Launching Security Audit Service (Port 8004)...{Colors.ENDC}")
    p_sec = run_service([python_cmd, "app.py"], "services/security-audit", "Security", Colors.SECURITY)
    PROCESSES.append(p_sec)
    time.sleep(1)

    print(f"{Colors.BOLD}[6/6] Launching Next.js UI Dashboard (Port 3000)...{Colors.ENDC}")
    # On Windows, npm commands need shell execution or npm.cmd
    npm_cmd = "npm.cmd" if os.name == 'nt' else "npm"
    p_dash = run_service([npm_cmd, "run", "dev", "--workspace=apps/dashboard"], ".", "Dashboard", Colors.DASHBOARD)
    PROCESSES.append(p_dash)

    print(f"\n{Colors.BOLD}{Colors.HEADER}[SYSTEM] All systems initialized. Press CTRL+C to terminate all services.{Colors.ENDC}\n")
    
    # Keep main thread alive
    while True:
        time.sleep(1)

if __name__ == "__main__":
    main()
