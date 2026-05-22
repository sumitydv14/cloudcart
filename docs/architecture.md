# CloudCart Architecture

This document captures the enterprise-grade architecture for CloudCart, a cloud-native e-commerce platform designed for high availability, scalability, security, and operational maturity.

---

## 1. Complete Folder Structure

```
CloudCart/
  README.md
  .gitignore
  docker-compose.yml
  docs/
    architecture.md
  frontend/
    app/
    components/
    features/
    hooks/
    services/
    styles/
    public/
    next.config.mjs
    package.json
    tsconfig.json
    tailwind.config.ts
    postcss.config.js
  services/
    auth-service/
    product-service/
    cart-service/
    order-service/
    payment-service/
    shared/
      api-gateway/
      middleware/
      libs/
      config/
  infra/
    docker/
      Dockerfile.frontend
      Dockerfile.service
      docker-compose.yml
    k8s/
      namespaces.yml
      ingress.yml
      deployments/
      services.yml
      configmaps.yml
      secrets.yml
      hpa.yml
    terraform/
      vpc/
      eks/
      rds/
      iam/
      s3_cloudfront/
    ci-cd/
      github-actions/
        build-and-deploy.yml
        lint-test.yml
    monitoring/
      prometheus/
      grafana/
    logging/
      elk/
      fluentd/

```

---

## 2. High-Level System Design

### Goals
- Multi-service architecture with strong separation of concerns.
- Cloud-ready deployment using AWS EKS and managed services.
- Resilient API Gateway pattern for routing, authentication, and observability.
- Data partitioning: MongoDB for identity, PostgreSQL for relational commerce, Redis for caching and session state.
- Automated CI/CD with GitHub Actions and container registry.

### Core Components
- Frontend: Next.js 15 app with feature-based structure, server-side rendering, and client-side caching.
- API Gateway: centralized request validation, authentication, rate limiting, service routing, and versioning.
- Auth Service: JWT plus refresh tokens, RBAC, secure credential storage.
- Product Service: product catalog, inventory, search indexes.
- Cart Service: user carts, Redis-backed session/cache layer.
- Order Service: order lifecycle orchestration, PostgreSQL storage, event-driven processing.
- Payment Service: payment workflow, third-party gateway integration, secure transaction audit.
- Monitoring: Prometheus, Grafana, ELK stack.
- Infrastructure: Docker, Kubernetes, Terraform deploys VPC, EKS, RDS, S3, CloudFront, IAM.

---

## 3. Frontend Architecture

### Folder Strategy
- `app/`: Next.js routes and pages.
- `components/`: atomic and composite UI components.
- `features/`: domain features such as auth, cart, catalog, checkout, admin.
- `hooks/`: reusable hooks for auth, data fetching, media query, error handling.
- `services/`: RTK Query API slices, adapters, and service clients.
- `styles/`: Tailwind configuration, global styling utilities.

### State Management
- `Redux Toolkit` for global state and business logic.
- `RTK Query` for declarative data fetching and cache invalidation.
- Feature slices per domain: authSlice, cartSlice, orderSlice, adminSlice.
- UI state kept local when possible; shared state stored in Redux only when required by multiple pages.

### API Layer
- RTK Query endpoints grouped by service: `authApi`, `productApi`, `cartApi`, `orderApi`, `paymentApi`.
- Automatic caching and revalidation based on mutation results.
- Tag-based invalidation for cart and product updates.

### Authentication Handling
- `accessToken` in secure `httpOnly` cookie or memory store.
- `refreshToken` handled in secure cookie, rotated on refresh.
- Auth guard component wrapping protected pages.
- `useAuth` hook to provide login, logout, session refresh, and role checks.

### Route Protection
- Client-side protected routes using middleware or wrapper components.
- Role-based route metadata for admin vs customer pages.
- Redirect to login for unauthenticated access.

### Performance Strategy
- Next.js incremental static regeneration for product pages.
- Code splitting by route and feature.
- Prefetch critical API data using RTK Query hydration.
- Image optimization and asset caching via CloudFront.

### Error & Loading Handling
- Global error boundary for rendering failures.
- Suspense-like loading skeletons for key flows.
- Toast notifications for API errors and success states.
- API response standardization with status codes and error messages.

### Reusable Hooks
- `useAuth()`: login, logout, refresh, role checks.
- `useApiError()`: map server error payloads to UI messages.
- `useDebouncedSearch()`: catalog search with debounce.
- `useRouteProtection()`: manage route access and redirects.

---

## 4. Backend Microservices Architecture

### Service Boundary
- `auth-service`: user, roles, permissions, token management.
- `product-service`: catalog, categories, pricing, inventory.
- `cart-service`: user carts, session caching, item validation.
- `order-service`: orders, payments, fulfillment, invoices.
- `payment-service`: gateway orchestration, retries, webhook handling.

### Shared Utilities
- `shared/api-gateway/`: request proxy, service discovery, shared middleware.
- `shared/middleware/`: auth, validation, error handling.
- `shared/libs/`: logger, metrics client, HTTP client wrappers.
- `shared/config/`: common configuration loader with validation.

### Validation & Error Handling
- Use `zod` or `Joi` schemas for request payloads.
- Centralized error middleware returning structured JSON.
- Consistent error objects with `code`, `message`, `details`.
- Validate path params, query params, and bodies per route.

### Logging Strategy
- Structured JSON logs using `winston` or `pino`.
- Include `requestId`, `serviceName`, `traceId`, `userId`, and environment metadata.
- Log levels: `error`, `warn`, `info`, `debug`.
- Send logs to ELK stack for analysis.

### Caching Strategy
- Redis for session caching, cart state, and product listing caches.
- Use Redis for rate limiting and distributed locks.
- Cache product catalog read models with time-based expiration.
- Invalidate cache on writes using event notification or TTL.

### Database Schema Design
- `auth-service`: MongoDB collections for `users`, `roles`, `refreshTokens`.
- `product-service`: PostgreSQL tables `products`, `categories`, `inventory`, `product_images`.
- `cart-service`: Redis hash per user and optional fallback store in PostgreSQL.
- `order-service`: PostgreSQL tables `orders`, `order_items`, `payments`, `shipments`.
- `payment-service`: PostgreSQL table `transactions` and `payment_audit_logs`.

### API Versioning
- Use versioned routes: `/api/v1/auth`, `/api/v1/products`, `/api/v1/cart`.
- API Gateway forwards based on version and service routing.
- Deprecation policy documented in API contract.

### Security Middleware
- `helmet` for secure HTTP headers.
- Rate limiter per IP and per user for sensitive endpoints.
- CORS allowlist with environment-driven domains.
- Input sanitization and validation.
- JWT verify middleware for protected routes.

### Health Checks
- Each service exposes `/health` and `/readiness`.
- Health endpoints verify DB and cache connectivity.
- Kubernetes uses readiness/liveness probes.

---

## 5. Database Architecture

### Polyglot Data Strategy
- MongoDB: identity and auth metadata, flexible user profiles.
- PostgreSQL: relational commerce data, transactions, order history.
- Redis: low-latency caching and session state.

### Data Flow
- Auth service writes users to MongoDB.
- Product service writes product catalog to PostgreSQL.
- Cart service stores ephemeral cart state in Redis.
- Order service persists orders and payment linkages in PostgreSQL.
- Payment service records transactions and audit logs in PostgreSQL.

### High Availability
- AWS DocumentDB or MongoDB Atlas for auth DB in production.
- AWS RDS Aurora PostgreSQL with Multi-AZ replication.
- Elasticache Redis cluster for Redis cache.

---

## 6. API Gateway Architecture

### Responsibilities
- Route requests to the correct microservice.
- Enforce authentication and RBAC.
- Apply rate limiting and request validation.
- Provide a single entry point for frontend and third-party clients.
- Collect tracing and metrics.

### Deployment
- `api-gateway` runs as a dedicated service in Kubernetes.
- Uses environment variables for upstream service endpoints.
- Supports canary or blue-green deployment via Kubernetes service selector.

### Diagram

```
[Client] -> [CloudFront] -> [API Gateway] -> [Auth | Product | Cart | Order | Payment]
                                     \-> [Prometheus metrics]
                                     \-> [ELK logs]
```

---

## 7. Authentication Flow

### Flow Description
1. User submits credentials to `/api/v1/auth/login`.
2. Auth Service validates credentials against MongoDB.
3. If valid, Auth Service issues access token and refresh token.
4. Access token is returned in an `httpOnly` cookie or authorization header.
5. Refresh token is stored securely and rotated on refresh.
6. API Gateway verifies access token on each request.
7. If token is expired, frontend uses `/api/v1/auth/refresh`.

### Sequence

```
User -> Frontend -> API Gateway -> Auth Service
                                       -> MongoDB
Auth Service -> API Gateway -> Frontend
Frontend -> API Gateway -> Product/Cart/Order/Payment
```

---

## 8. Authorization Flow

### Role-Based Access Control
- Roles: `guest`, `customer`, `seller`, `admin`.
- Permissions mapped to actions and endpoints in Auth Service.
- Token payload includes role claims and permission scopes.
- API Gateway checks role claims before forwarding protected requests.

### Enforcement
- Admin dashboard endpoints require `admin` role.
- Checkout and cart operations require `customer` role.
- Product management endpoints require `seller` or `admin`.

### Flow

```
Client request -> API Gateway -> JWT validation -> RBAC middleware -> target service
```

---

## 9. Docker Architecture

### Container Strategy
- One container per service plus frontend and gateway.
- Shared base image for Node.js TypeScript services.
- Build-time type checking and linting.
- Multi-stage Dockerfiles for production images.

### Example Components
- `Dockerfile.frontend`: build Next.js app, expose port 3000.
- `Dockerfile.service`: compile TypeScript and run service.
- `docker-compose.yml`: orchestrate local development with DB and cache.

---

## 10. Kubernetes Architecture

### Namespace Strategy
- `cloudcart-dev`
- `cloudcart-staging`
- `cloudcart-prod`

### Kubernetes Manifests
- `namespaces.yml`
- `deployments/*.yml` for each service.
- `services.yml` for ClusterIP and LoadBalancer.
- `ingress.yml` for external routing.
- `configmaps.yml` for non-sensitive config.
- `secrets.yml` for JWT keys and service credentials.
- `hpa.yml` for autoscaling based on CPU and request latency.

### Rollout Strategy
- RollingUpdate for safe deployment.
- Readiness probes on HTTP `/health`.
- Liveness probes to restart unhealthy pods.
- Canary deployment support through weighted ingress rules.

### Diagram

```
[Internet] -> [Ingress Controller] -> [API Gateway Service]
                                     -> [Frontend Service]
                                     -> [Auth/Product/Cart/Order/Payment Services]

Persistent Storage:
  - RDS
  - DocumentDB
  - Redis
```

---

## 11. CI/CD Pipeline Architecture

### GitHub Actions Workflows
- `lint-test.yml`: run lint, unit tests, security scans.
- `build-and-deploy.yml`: build Docker images, push to ECR, deploy to EKS.

### Pipeline Steps
1. Checkout code.
2. Set up Node.js.
3. Install dependencies.
4. Run lint and type check.
5. Run unit and integration tests.
6. Build Docker images.
7. Push images to AWS ECR.
8. Apply Kubernetes manifests.
9. Run smoke tests.
10. Rollback on failure.

### Rollback Strategy
- Use GitHub Actions on failure to revert deployment manifest.
- Keep previous image tags and use `kubectl rollout undo`.
- Monitor deployment rollout status before marking success.

---

## 12. AWS Cloud Architecture

### Services
- EKS cluster for microservices.
- ECR for container registry.
- S3 for static assets and file uploads.
- CloudFront for CDN and caching.
- RDS Aurora PostgreSQL for relational data.
- Elasticache Redis for caching.
- IAM roles with least privilege.
- AWS Certificate Manager for TLS.

### Network Layout
- VPC with public and private subnets.
- Internet Gateway for public access.
- NAT Gateway for private subnet egress.
- Security groups for service isolation.

---

## 13. Monitoring Architecture

### Prometheus
- Service scraping for app metrics.
- Kubernetes metrics for pod health.
- Custom metrics for order throughput, cart activity, payment success.

### Grafana
- Dashboard strategy: service overview, API latency, error rates, database performance.
- Alerts for high error rates, pod restarts, CPU/memory pressure.

### Alerting Strategy
- Pager duty or Slack webhook integration.
- Threshold alerts for 5xx rate, queue latency, node utilization.
- Alert escalation for production incidents.

---

## 14. Logging Architecture

### ELK Stack
- Fluentd or Beats forwarder from Kubernetes nodes.
- Elasticsearch for log indexing.
- Kibana for searching and dashboards.
- Centralized logs for request tracing and audit.

### Log Strategy
- JSON logs with structured fields.
- Correlate `requestId`, `userId`, `service`, `traceId`.
- Log warnings and errors with context.
- Retain logs long enough for incident investigation.

---

## 15. Security Architecture

### Best Practices
- Enforce HTTPS everywhere using CloudFront and Load Balancer TLS.
- `helmet` and secure headers on every service.
- Strict CORS policy with allowed origins.
- Rate limiting and request throttling.
- JWT access tokens and refresh token rotation.
- Use environment variables and Kubernetes secrets for credentials.
- IAM least privilege roles for EKS, RDS, S3, ECR.
- Separate development, staging, and production environments.

### Kubernetes Secrets
- Store DB passwords, JWT secrets, and third-party API keys in Kubernetes Secrets.
- Avoid embedding secrets in images or config maps.

---

## 16. Infrastructure as Code Architecture

### Terraform Modules
- `vpc/`: VPC, subnets, internet gateway, NAT gateway.
- `eks/`: EKS cluster, node groups, IAM roles, OIDC provider.
- `rds/`: Aurora PostgreSQL, subnet groups, security groups.
- `iam/`: roles for GitHub Actions, EKS service accounts.
- `s3_cloudfront/`: static asset bucket and CDN distribution.

### IaC Principles
- Environment-specific workspaces for dev/staging/prod.
- Remote state storage in S3 with state locking via DynamoDB.
- Use modules to enforce reusable patterns.
- Tag all AWS resources for cost allocation and ownership.

---

## 17. Deployment Flow

### Local Development
- Developer runs `docker-compose up`.
- Services use local PostgreSQL, MongoDB, Redis.
- Frontend runs on port 3000.
- Gateway exposed on port 8080.

### Staging Deployment
- Git branch merged to `staging` triggers CI.
- Build and push images to ECR staging repo.
- Deploy to EKS staging namespace.
- Run integration and smoke tests.

### Production Deployment
- Merge to `main` triggers build-and-deploy.
- Use immutable image tags and Git commit metadata.
- Deploy to EKS production namespace.
- Monitor rollout and rollback on failure.

---

## 18. Development Roadmap

1. Initialize repo structure and add README.
2. Create frontend scaffold with Next.js, Tailwind and RTK Query.
3. Build Auth Service with JWT, refresh tokens, RBAC.
4. Build Product Service with PostgreSQL schema and APIs.
5. Build Cart Service with Redis caching.
6. Build Order Service with transactional PostgreSQL workflows.
7. Build Payment Service and sandbox gateway integration.
8. Add API Gateway and shared middleware.
9. Add Dockerfiles and local Docker Compose environment.
10. Add Kubernetes manifests and deploy to EKS.
11. Add Terraform modules for AWS infrastructure.
12. Add GitHub Actions CI/CD and rollback workflows.
13. Add Prometheus, Grafana, and ELK monitoring/logging.
14. Harden security and conduct enterprise readiness checks.

---

## 19. Engineering Best Practices

- Keep services small and focused.
- Use typed contracts and shared DTO schemas where appropriate.
- Avoid cross-service direct DB access; communicate via APIs/events.
- Permit only necessary AWS IAM permissions.
- Keep secrets out of code and use secure storage.
- Automate testing, linting, and deployments.
- Monitor service health and set alerts before production incidents.
- Use blue-green or canary deployments for critical services.

---

## 20. Interview-Level Architecture Explanations

### Why microservices?
Microservices isolate domains, improve scaling, and allow independent deployment. For an e-commerce platform, it prevents one service failure from taking down the entire storefront.

### Why polyglot persistence?
Different data models fit different workloads: MongoDB for flexible auth and profile metadata, PostgreSQL for transactional order and product data, Redis for fast cart state and caching.

### Why API Gateway?
It centralizes authentication, request validation, routing, and observability. The gateway decouples frontend API shape from backend service boundaries.

### Why AWS EKS + Terraform?
EKS provides managed Kubernetes orchestration, while Terraform codifies infrastructure for reproducibility, versioning, and team collaboration.

### Why Prometheus/Grafana/ELK?
Prometheus provides metrics and alerts, Grafana visualizes service health, and ELK centralizes logs for troubleshooting and compliance.

---

## 21. Text-Based Diagrams

### System Topology
```
[Browser/App] -> [CloudFront CDN] -> [Ingress] -> [API Gateway]
                   |                     |-> [Auth Service]
                   |                     |-> [Product Service]
                   |                     |-> [Cart Service]
                   |                     |-> [Order Service]
                   |                     |-> [Payment Service]
                   |
                   -> [Static Assets S3]
```

### Service Communication
```
Frontend -> API Gateway -> Service
Service -> Redis / MongoDB / PostgreSQL
Order Service -> Payment Service -> External Payment Provider
Gateway -> Prometheus / ELK
```

### Deployment Flow
```
feature branch -> PR -> lint/test -> docker build -> push ECR -> deploy EKS -> smoke test -> production
```

### Authentication Flow
```
User logs in -> Auth Service issues access + refresh tokens -> API Gateway validates access token -> service handles request
If access token expires -> Refresh token flow -> issue new access token
```

---

## 22. Next Steps for Implementation

- Open `C:\Users\siwani\Desktop\CloudCart` in VS Code.
- Add `package.json` and `tsconfig.json` to `frontend/`.
- Add service-specific code and Dockerfiles.
- Build out Terraform modules under `infra/terraform/`.
- Create GitHub Actions workflows in `infra/ci-cd/github-actions/`.
- Add Prometheus and ELK manifests in `infra/monitoring/` and `infra/logging/`.

This architecture document is intentionally comprehensive to support a real enterprise production system for CloudCart.
