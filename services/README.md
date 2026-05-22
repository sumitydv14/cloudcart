# CloudCart Backend Services

This folder contains the backend microservices for CloudCart.

- `auth-service`: authentication, JWT, refresh tokens, and RBAC.
- `product-service`: product catalog, search, filtering, and inventory.
- `cart-service`: shopping cart persistence and Redis caching.
- `order-service`: order creation, workflow, and history.
- `payment-service`: payment processing, verification, and transaction logging.
- `shared`: cross-service utilities, validation, logging, and configuration.

See `ARCHITECTURE.md` for the full backend system design and recommended implementation approach.
