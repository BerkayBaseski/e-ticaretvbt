# Middlewares Pipeline

Middlewares intercept incoming requests and outgoing responses:
- `auth.middleware.ts`: Verifies Bearer JWT tokens and populates `req.user`.
- `role.middleware.ts`: Enforces RBAC permissions (`customer`, `seller`, `admin`).
- `error.middleware.ts`: Formats uncaught exceptions into RFC 9457 JSON responses.
- `rateLimiter.middleware.ts`: Prevents brute-force and Denial-of-Service attacks.
