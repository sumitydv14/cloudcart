# CloudCart

CloudCart is a production-grade cloud-native e-commerce platform scaffolded for enterprise delivery.

## Overview

This repository contains:
- `frontend/`: Next.js 15 application with React, TypeScript, Tailwind CSS, Redux Toolkit and RTK Query.
- `services/`: Microservices architecture using Node.js, Express and TypeScript.
- `infra/`: Docker, Kubernetes, Terraform, CI/CD and monitoring/logging scaffolding.
- `docs/architecture.md`: Detailed architecture specification and systems design.

## Workflows

- Local development: Docker Compose and frontend/backend services running locally.
- Staging deployment: AWS EKS with feature namespaces and separate environment variables.
- Production deployment: AWS EKS, CloudFront, RDS, Redis, Prometheus and ELK.

## Getting Started

1. Open the folder in VS Code: `C:\Users\siwani\Desktop\CloudCart`
2. Review `docs/architecture.md` for system design and roadmap.
3. Build the frontend and services using the provided DevOps patterns.

## Notes

This scaffold is designed as an architecture-first repository for CloudCart. Detailed service implementations and environment configuration should be added inside each service and infra module.
