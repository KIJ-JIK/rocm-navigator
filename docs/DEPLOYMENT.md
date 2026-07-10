# ROCm Navigator: Deployment Guide

Deploying ROCm Navigator on containerized clusters.

## Kubernetes Deployment
Apply the deployment configuration manifest:
```bash
kubectl apply -f deployment/k8s-manifest.yml
```

## Docker Compose
For localized multi-container testing:
```bash
docker-compose up -d --build
```
