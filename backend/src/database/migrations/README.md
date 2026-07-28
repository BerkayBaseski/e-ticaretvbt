# Database Migrations Placeholder

This directory is designated for database migration files (e.g. Prisma migrations, TypeORM migrations, or Flyway SQL migration scripts).

## Guidelines for Future Migration Files
- Name files chronologically: `0001_initial_schema.sql`, `0002_add_discount_coupons.sql`.
- Ensure migrations are transactional and include rollback routines.
- Strictly adhere to column definitions in `/backend/src/database/schema/DATABASE_SCHEMA.md`.
