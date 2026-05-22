# CloudCart Backend Architecture

This document defines the production-grade backend architecture for CloudCart, a cloud-native e-commerce platform built with Node.js, Express, TypeScript, MongoDB, PostgreSQL, Redis, and Kubernetes.

## 1. Backend Folder Structure

```
services/
  auth-service/
    src/
      controllers/
      routes/
      services/
      models/
      middleware/
      utils/
      config/
      index.ts
    Dockerfile
    package.json
    tsconfig.json
  product-service/
    src/
      controllers/
      routes/
      services/
      models/
      middleware/
      utils/
      config/
      index.ts
    Dockerfile
    package.json
    tsconfig.json
  cart-service/
    src/
      controllers/
      routes/
      services/
      models/
      middleware/
      utils/
      config/
      index.ts
    Dockerfile
    package.json
    tsconfig.json
  order-service/
    src/
      controllers/
      routes/
      services/
      models/
      middleware/
      utils/
      config/
      index.ts
    Dockerfile
    package.json
    tsconfig.json
  payment-service/
    src/
      controllers/
      routes/
      services/
      models/
      middleware/
      utils/
      config/
      index.ts
    Dockerfile
    package.json
    tsconfig.json
  shared/
    configs/
    middleware/
    logger/
    utils/
    types/
    constants/
    validation/
    database/
    event-bus/
    index.ts
```

### Why this structure exists

- `auth-service`, `product-service`, `cart-service`, `order-service`, `payment-service`: each service is an independent deployable boundary with its own runtime, dependencies, and data store.
- `src/controllers`: HTTP handlers and API orchestration logic.
- `src/routes`: Express route definitions and versioned endpoint registration.
- `src/services`: business logic and domain orchestration outside HTTP concerns.
- `src/models`: data models, database schema definitions, and object mapping.
- `src/middleware`: auth, validation, error handling, and observability middleware.
- `src/utils`: service-specific helpers and reusable utilities.
- `src/config`: environment loading, feature flags, and service configuration.
- `Dockerfile`, `package.json`, `tsconfig.json`: service-specific build and runtime configuration.
- `shared/`: cross-service utilities, typed contracts, validation schemas, logging, and common infrastructure.

## 2. Microservices Architecture

### High-level design

- Each service is a bounded context.
- Services communicate via REST API and event-driven messaging for asynchronous workflows.
- API Gateway handles ingress, routing, authentication, rate limiting, and request validation.
- Shared library is versioned separately to avoid tight coupling but allows code reuse where necessary.
- Each service owns its own data store and avoids direct cross-service database access.

### Service responsibilities

- **Auth Service**: identity, registration, login, JWT issuance, refresh tokens, RBAC.
- **Product Service**: catalog CRUD, categories, search, filtering, inventory snapshots.
- **Cart Service**: user carts, quantity updates, session persistence, Redis caching.
- **Order Service**: order creation, history, status transitions, relational consistency.
- **Payment Service**: payment sessions, verification, transaction audit.

## 3. Shared Package Architecture

### Shared package contents

- `configs/`: centralized config loader, environment validation, secrets handling.
- `middleware/`: common Express middleware for logging, errors, request parsing.
- `logger/`: structured logger factory compatible with Winston/Pino.
- `utils/`: cross-cutting utilities like response transformers, UUID generators, date helpers.
- `types/`: shared DTOs, domain types, and contract definitions.
- `constants/`: common constants such as roles, API versions, event names.
- `validation/`: Zod schemas for shared request/response validation.
- `database/`: database connection factories, pooling, and shared ORM helpers.
- `event-bus/`: pub/sub client wrappers for Kafka/RabbitMQ/Redis streams.

### Why share code

- Enforces consistent API contracts across microservices.
- Reduces duplicate implementation of security, validation, and logging.
- Enables typed event contracts and shared error formats.
- Keeps services independently deployable by only sharing stable, backward-compatible APIs.

## 4. API Gateway Architecture

### Responsibilities

- Single entry point for client requests.
- Route translation to internal microservices.
- Authentication and authorization enforcement.
- Rate limiting, CORS, and request validation.
- Response standardization and versioning.
- Metrics collection and request tracing.

### Deployment

- API Gateway runs in Kubernetes as a dedicated deployment.
- It can be built with Express/Node or a managed ingress gateway like AWS ALB/Nginx with sidecar filter.
- Gateway handles service discovery by using Kubernetes DNS or environment-configured service endpoints.

### Diagram

```
[Client] -> [CloudFront / ALB] -> [API Gateway]
                        |-> [Auth Service]
                        |-> [Product Service]
                        |-> [Cart Service]
                        |-> [Order Service]
                        |-> [Payment Service]
``` 

## 5. Database Architecture

### Polyglot persistence

- **MongoDB**
  - Flexible schema for user profiles, product metadata, and catalog attributes.
  - Ideal for auth and dynamic catalog objects.
- **PostgreSQL**
  - Relational data for orders, payments, and transactional commerce logic.
  - Supports strong consistency, joins, and ACID workflows.
- **Redis**
  - Fast cache for cart sessions, inventory availability, rate limiting, and ephemeral tokens.

### Service ownership

- Auth Service: MongoDB collections for `users`, `roles`, `refresh_tokens`.
- Product Service: MongoDB or PostgreSQL for `products`, `categories`, `inventory`; MongoDB recommended for dynamic catalog.
- Cart Service: Redis store for carts and optional fallback to PostgreSQL for persistence.
- Order Service: PostgreSQL tables for `orders`, `order_items`, `order_status`, `shipping_details`.
- Payment Service: PostgreSQL tables for `transactions`, `payment_events`, `refunds`.

## 6. Authentication Architecture

### Core features

- JWT Access Tokens: short-lived bearer tokens for API requests.
- Refresh Tokens: rotating secure tokens stored in persistent storage or cookies.
- Password hashing: bcrypt with strong salt rounds.
- RBAC: role and permission claims embedded in JWT and verified by middleware.
- Session management: refresh token rotation and session invalidation.

### Auth flow

1. User registers or logs in with email/password.
2. Auth Service validates credentials and hashes passwords with bcrypt.
3. On success, Auth Service issues:
   - short-lived access token (JWT)
   - refresh token stored in database and returned via `httpOnly` cookie
4. Client sends access token in `Authorization: Bearer` header.
5. API Gateway and service middleware validate JWT signature, expiration, and role claims.
6. If access token expires, client calls `/auth/refresh`.
7. Auth Service validates refresh token, rotates it, and returns a new access token.
8. Logout invalidates the refresh token and session records.

### Token architecture

- Access token contains: `sub`, `email`, `role`, `permissions`, `exp`, `iat`.
- Refresh token contains a securely generated random value and session identifier.
- Refresh tokens are stored hashed in MongoDB to prevent token replay.

## 7. Authorization Architecture

### RBAC policy

- Roles: `guest`, `customer`, `seller`, `admin`.
- Permissions mapped to service actions, not just endpoints.
- Middleware checks JWT claims against required permissions for each route.
- Admin-only and seller-only routes enforced in both gateway and service layers.

### Authorization flow

1. Request enters API Gateway.
2. Gateway verifies JWT.
3. Gateway adds request metadata (`userId`, `roles`, `permissions`) to headers.
4. Downstream service middleware validates the metadata.
5. Service performs any resource-level authorization checks.

## 8. Logging Architecture

### Strategy

- Use structured JSON logs with Winston or Pino.
- Include `timestamp`, `service`, `level`, `requestId`, `traceId`, `userId`, `path`, `statusCode`.
- Log categories:
  - request logs
  - error logs
  - audit logs
  - security logs

### Centralization

- Logs are shipped from Kubernetes pods to ELK via Filebeat or Fluentd.
- Elasticsearch indexes logs; Kibana provides dashboards and search.
- Use log levels to separate production noise from critical failures.

### Example log flow

- Request received -> log request metadata.
- Validation failure -> warn-level structured log.
- Business error -> error-level log with stack trace.
- Transaction completion -> info-level audit log.

## 9. Monitoring Architecture

### Observability

- Expose health endpoints: `/health`, `/readiness`, `/metrics`.
- Use Prometheus exporter middleware to expose metrics.
- Monitor:
  - request rates
  - error rates
  - latency
  - database connections
  - Redis hit/miss

### Dashboards

- Grafana dashboards for:
  - service performance
  - API latency and throughput
  - error trends
  - resource utilization

### Alerting

- Configure alerts for:
  - high 5xx rate
  - slow response time
  - database connection failures
  - pod restarts or crash loops

## 10. Docker Architecture

### Container design

- Each service has its own multi-stage Dockerfile.
- Build stage compiles TypeScript.
- Production stage uses slim Node image.
- Services expose HTTP ports and use environment variables for config.

### Docker Compose

- Use `docker-compose.yml` for local development.
- Include services: auth, product, cart, order, payment, api-gateway, MongoDB, PostgreSQL, Redis.
- Enable dependency order and shared network.

## 11. Kubernetes Architecture

### Manifests

- `Deployment` for each service.
- `Service` resources for internal communication.
- `Ingress` for external traffic to gateway and frontend.
- `ConfigMap` for non-sensitive environment configuration.
- `Secret` for DB passwords, JWT secrets, and third-party keys.
- `HorizontalPodAutoscaler` for each service.

### Deployment strategy

- Rolling updates with readiness/liveness probes.
- Multiple namespaces: `dev`, `staging`, `prod`.
- Canary and blue/green deployment support by controlling service weights and labels.

## 12. CI/CD Architecture

### GitHub Actions workflows

- Lint and type check.
- Unit tests and contract tests.
- Build Docker images.
- Push images to AWS ECR.
- Deploy to AWS EKS using `kubectl` or Helm.
- Run smoke tests after deployment.
- Rollback on failure.

### Pipeline design

- `lint-test.yml`
  - checkout
  - install dependencies
  - run ESLint
  - run typecheck
  - run unit tests
- `build-and-deploy.yml`
  - checkout
  - authenticate AWS
  - build/push Docker images
  - apply Kubernetes manifests
  - verify rollout

## 13. Redis Caching Strategy

### Use cases

- Cart Service:
  - cart sessions stored in Redis hashes keyed by `cart:{userId}`.
  - TTL for abandoned cart cleanup.
- Product Service:
  - cache frequently requested search/filter results.
- Rate limiting:
  - store request counters per IP and per user.

### Performance

- Use Redis clusters or managed ElastiCache in production.
- Keep cache keys stable and include version suffixes for invalidation.
- Cache only read-heavy endpoints with TTL and manual eviction on updates.

## 14. Security Architecture

### Enterprise security best practices

- Use `helmet` to set secure HTTP headers.
- Use strong CORS policy with only allowed origin domains.
- Apply rate limiting per IP and per user.
- Sanitize input and validate all requests with Zod.
- Use parameterized queries or query builders for PostgreSQL.
- Store secrets in Kubernetes Secrets / AWS Secrets Manager.
- Rotate JWT signing keys and refresh tokens regularly.
- Use TLS for all internal and external traffic.
- Maintain least privilege for service accounts and IAM roles.

### API protection

- Enforce HTTPS via API Gateway / ingress.
- Validate request size and reject malformed payloads.
- Use consistent error responses to avoid leaking internal details.

## 15. Production Deployment Strategy

- Use immutable Docker image tags.
- Deploy to EKS with separate namespaces.
- Use managed AWS services for MongoDB, RDS, and Redis.
- Keep environment-specific config out of the image.
- Deploy first to staging, run smoke tests, then promote to production.
- Monitor rollout and rollback on failed readiness.

---

## Recommended next steps

1. Define `shared` package contracts and publish locally via workspace references.
2. Scaffold each service repository with `package.json`, `tsconfig.json`, and `Dockerfile`.
3. Implement Auth Service first to bootstrap JWT and RBAC.
4. Implement Product and Cart APIs with persistence and caching.
5. Implement Order and Payment workflows with transactional consistency.
6. Add Kubernetes manifests and GitHub Actions workflows.

This architecture is designed to satisfy enterprise goals for scalability, security, observability, and maintainability.
