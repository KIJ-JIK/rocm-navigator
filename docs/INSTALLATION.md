# ROCm Navigator: Installation Guide

This document describes the environment prerequisites and installation steps to deploy ROCm Navigator.

## Prerequisites
* **Operating System:** Ubuntu 22.04 LTS or Windows 11 (with WSL2 configured)
* **Runtime Environments:** Node.js v18+, Python v3.10+
* **Containerization:** Docker Desktop or Docker Engine (with GPU passthrough enabled)
* **GPU Drivers:** AMD ROCm™ v6.0+ compatible kernel modules

## Setup Steps
1. Clone the repository and navigate to root:
   ```bash
   git clone https://github.com/ansh/rocm-navigator.git
   cd rocm-navigator
   ```

2. Install workspace dependencies:
   ```bash
   npm install
   ```

3. Initialize backend virtual environments:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r services/core-scanner/requirements.txt
   pip install -r services/llm-synthesis/requirements.txt
   pip install -r services/sandbox-runtime/requirements.txt
   pip install -r services/security-audit/requirements.txt
   ```

4. Boot all servers using the orchestrator:
   ```bash
   python start_all.py
   ```
