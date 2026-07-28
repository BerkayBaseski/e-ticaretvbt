# Controllers Layer Architecture

Controllers handle incoming HTTP requests:
- Extracting DTO payloads, path variables, and request query parameters.
- Delegating domain operations to underlying **Services**.
- Returning formatted JSON responses following RFC 9457 standards.
- Managing HTTP status codes (200, 201, 400, 401, 403, 404, 500).
