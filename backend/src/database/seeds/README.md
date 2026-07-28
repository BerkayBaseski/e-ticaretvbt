# Database Seeds Placeholder

This directory is designated for database seed scripts (e.g. initial demo categories, admin user seeding, sample product listings).

## Guidelines for Seed Execution
- Seed scripts should match the mock datasets currently provided in `/frontend/src/api/mocks/mockData.ts` to ensure data parity between mock development and production databases.
- Password hashes generated in seeds must use secure algorithms (Argon2 / bcrypt).
