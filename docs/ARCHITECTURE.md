# ROCm Navigator: Architecture Guide

This document describes the microservices and orchestration layers.

## System Components
1. **Frontend (Next.js):** Dotted grid canvas visualizer powered by React Flow and styled using TailwindCSS.
2. **API Gateway (FastAPI):** Synchronizes microservice runs and WebSocket events.
3. **Scanner Service:** Captures CUDA token trees via Tree-sitter parsers.
4. **Architecture Service:** Maps execution pipelines using NetworkX topologies.
5. **Synthesis Service:** Interfaces with Gemma models over Fireworks APIs to rewrite code.
6. **Sandbox Service:** Validates compiler flags inside isolated Docker containers.
7. **Security Service:** Audits memory limits and leaks statically.
8. **Reports Service:** Compiles Markdown audit guides.
