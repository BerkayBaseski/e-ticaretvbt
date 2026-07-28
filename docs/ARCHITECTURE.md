# Architecture & Project Structure Documentation

## Overview

This repository follows a strict separation of concerns between the **Frontend Application** (`/frontend`) and a reserved **Backend Workspace** (`/backend`).

```
/
├── frontend/             # Single-Page Application (React, Vite, TypeScript, Tailwind)
│   ├── src/              # Source code (FSD architecture: app, pages, widgets, features, entities, shared)
│   ├── public/           # Static assets & MSW mock worker scripts
│   ├── package.json      # Frontend dependencies and build scripts
│   ├── vite.config.ts    # Vite bundler configuration
│   └── tsconfig.json     # TypeScript configuration
│
├── backend/              # Reserved for future backend service implementation
│   └── README.md         # Backend guidelines and integration placeholder
│
├── docs/                 # Architectural documentation and specifications
│   └── ARCHITECTURE.md
│
├── README.md             # Repository landing documentation
└── .gitignore            # Git exclusion definitions
```

---

## Frontend Architecture

The frontend application is built using:
- **Core Framework:** React 19 + TypeScript + Vite
- **Styling & UI:** Tailwind CSS + Lucide Icons + Framer Motion
- **State Management:** Zustand (Stores for Auth, Cart, Wishlist) + TanStack Query (React Query)
- **Data & Mocking Layer:** Mock Service Worker (MSW) & In-Memory Storage Adapters

### Mock Data Layer & Future Backend Integration

The frontend is architected so that replacing the mock services with a real backend service requires **zero UI refactoring**:

1. **API Abstraction:** All HTTP client requests pass through unified API client adapters (`/frontend/src/shared/api` and `/frontend/src/api`).
2. **MSW Handlers:** Requests to endpoints like `/api/products`, `/api/orders`, and `/api/auth` are intercepted by Mock Service Worker during development.
3. **Environment Switch:** When a real backend becomes available, updating `VITE_API_BASE_URL` in `/frontend/.env` and disabling MSW seamlessly routes API traffic to the live backend server.
