# Backend Architecture & Database Foundation

This directory represents the **Enterprise-Grade Backend & Database Architectural Blueprint**.

> [!NOTE]
> - All executable backend logic, API server endpoints, database connections, and ORM code are omitted to keep the implementation focus 100% on the frontend application.
> - This directory serves as a complete structural specification for future backend development teams.

---

## 🏛️ Directory Architecture

```text
backend/
├── src/
│   ├── config/               # Environment & configuration loaders
│   ├── controllers/          # HTTP request handlers
│   ├── services/             # Core business logic layer
│   ├── repositories/         # Database access layer (Repository Pattern)
│   ├── routes/               # REST API route definitions
│   ├── middlewares/          # Security, Auth Guards & Error Pipeline
│   ├── models/               # Data model entities
│   ├── dto/                  # Data Transfer Objects (Payload Contracts)
│   ├── validators/           # Schema validation pipes (Zod)
│   ├── interfaces/           # TypeScript Interfaces
│   ├── types/                # Domain type definitions
│   ├── utils/                # Utility helpers
│   ├── constants/            # Global constants & enums
│   ├── exceptions/           # Centralized RFC 9457 exceptions
│   │
│   ├── database/
│   │   ├── schema/           # DATABASE_SCHEMA.md (3NF Specifications)
│   │   ├── migrations/       # Database migration placeholders
│   │   ├── seeds/            # Initial seed data placeholders
│   │   └── diagrams/         # ERD.md (Mermaid Entity Relationship Diagram)
│   │
│   ├── modules/              # Domain-Driven Modules
│   │   ├── auth/             # Authentication & JWT management
│   │   ├── users/            # Customer profile management
│   │   ├── sellers/          # Merchant store portal
│   │   ├── products/         # Catalog & inventory management
│   │   ├── categories/       # Category hierarchy
│   │   ├── orders/           # Order placement & fulfillment
│   │   ├── wishlist/         # Saved items
│   │   ├── reviews/          # Ratings & product reviews
│   │   └── notifications/    # Push notifications & alerts
│   │
│   └── app.ts                # Application blueprint entry point
│
├── docs/                     # Additional backend documentation
├── tests/                    # Test suite placeholders
├── package.json              # Backend package declaration
├── tsconfig.json             # TypeScript compiler settings
└── .env.example              # Environment variables template
```

---

## 🗄️ Database Architecture Highlights

The database architecture is fully documented under [`/src/database/`](file:///c:/Users/bbase/OneDrive/Documents/GitHub/e-ticaretvbt/e-ticaretvbt/backend/src/database):

1. **[Entity Relationship Diagram (ERD.md)](file:///c:/Users/bbase/OneDrive/Documents/GitHub/e-ticaretvbt/e-ticaretvbt/backend/src/database/diagrams/ERD.md):** Rendered in Mermaid standard, mapping relationships across all 13 core domain entities:
   - `USERS`, `SELLERS`, `PRODUCTS`, `CATEGORIES`, `PRODUCT_IMAGES`, `INVENTORY`, `ORDERS`, `ORDER_ITEMS`, `WISHLISTS`, `REVIEWS`, `ADDRESSES`, `PAYMENTS`, `NOTIFICATIONS`.

2. **[Schema Specifications (DATABASE_SCHEMA.md)](file:///c:/Users/bbase/OneDrive/Documents/GitHub/e-ticaretvbt/e-ticaretvbt/backend/src/database/schema/DATABASE_SCHEMA.md):**
   - Normalized according to **3NF (Third Normal Form)** rules.
   - Primary Keys (`UUID`), Foreign Keys, Nullability, and `CHECK` constraints.
   - Indexing strategy recommendations (B-Tree, Compound, and Unique indexes) for high throughput query performance.
