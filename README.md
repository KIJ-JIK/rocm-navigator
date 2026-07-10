# ROCm Navigator

ROCm Navigator is an enterprise-grade AI platform that autonomously analyzes, migrates, validates, benchmarks, secures, and optimizes GPU applications from NVIDIA CUDA to AMD ROCm.

---

## 📂 Codebase Layout

```text
rocm-navigator/
├── package.json             # Root monorepo workspaces configuration
├── .gitignore               # Exclusions for dependencies, builds, and secrets
│
├── apps/
│   ├── dashboard/           # Next.js 16 UI Frontend Dashboard (Ansh)
│   │   ├── src/app/
│   │   │   ├── globals.css  # Dark-mode styling, glassmorphism, animations
│   │   │   ├── layout.tsx   # Telemetry navigation header
│   │   │   └── page.tsx     # Telemetry panels, agent visualizer, diff viewer
│   │   └── tsconfig.json    # TypeScript configurations
│   │
│   └── gateway/             # FastAPI Secure Routing Gateway
│       ├── main.py          # Asynchronous REST APIs & WebSocket streams
│       └── requirements.txt # Python dependencies
│
├── services/                # Backend multi-agent services
│   ├── core-scanner/        # Tree-Sitter & NetworkX AST parser (Abdullah)
│   ├── llm-synthesis/       # LangGraph and Gemma rewrites (Malatesh)
│   ├── security-audit/      # Security scanning and Trufflehog (Yashwant)
│   └── sandbox-runtime/     # Docker validation runner (Arya)
│
└── shared/
    └── schemas/
        └── state_contract.json # Shared multi-agent JSON State Contract
```

---

## 🚀 Quick Start Guide

You can run the entire ecosystem (frontend + backend + all 4 python microservices) concurrently with one single command using our global orchestrator:

```bash
# Installs dependencies and launches all 6 servers (Port 3000, 8000, 8001, 8002, 8003, 8004)
python start_all.py
```
Press `CTRL+C` in the terminal to gracefully shutdown all processes at once.

### Running Individual Components (Manual Setup)

If you prefer to boot systems individually:

#### 1. Run the Frontend Dashboard
Navigate to the root directory and execute:
```bash
npm install
npm run dev:frontend
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### 2. Run the FastAPI Gateway
Ensure Python is installed on your environment. Run:
```bash
cd apps/gateway
pip install -r requirements.txt
python main.py
```
The gateway API runs on [http://localhost:8000](http://localhost:8000).

#### 3. Run Microservices
Each Python service inside `services/` contains an `app.py` script. To start them:
```bash
python services/core-scanner/app.py       # Port 8001
python services/llm-synthesis/app.py      # Port 8002
python services/sandbox-runtime/app.py    # Port 8003
python services/security-audit/app.py     # Port 8004
```

---

## 🛠️ Verification Metrics
*   **Next.js Frontend Build:** `✓ Compiled successfully in 5.3s`
*   **Next.js Dev Server Startup:** `✓ Ready in 971ms`
