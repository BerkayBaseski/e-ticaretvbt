# Routes Layer

Routes declare API endpoints and middleware chains:
- Express Router / Fastify Route declarations (`/api/v1/products`, `/api/v1/orders`).
- Mounting validation middlewares (Zod validation pipes).
- Attaching auth guards (`authenticateJWT`, `requireRole('seller')`).
