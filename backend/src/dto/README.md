# Data Transfer Objects (DTO) & Validators

DTOs define strict contracts for incoming request bodies:
- `CreateProductDTO`, `UpdateOrderStatusDTO`, `CheckoutDTO`, `LoginDTO`.
- Runtime payload validation using Zod or Class-Validator.
- Stripping illegal properties and preventing Mass Assignment vulnerabilities.
