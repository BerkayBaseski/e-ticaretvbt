# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-28

### Added
- **Enterprise Multi-Team Architecture:** Decoupled workspace setup separating `/frontend`, `/backend`, `/tests`, `/docs`, and `/.github`.
- **Frontend Core Application:**
  - Implemented Feature-Sliced Design (FSD) architecture (`app`, `pages`, `widgets`, `features`, `entities`, `shared`).
  - Added full customer workflow: Home, Search & Filtering, Product Details, Cart, Wishlist (`/wishlist`), Notifications (`/notifications`), Checkout, Orders (`/orders`), Profile, FAQ, and Contact.
  - Added Shopify-like Seller Portal (`/seller/*`) and Admin Portal (`/admin/*`).
  - Mock Service Worker (MSW v2) integration for API simulation and local state persistence.
- **Backend Architecture Blueprint:**
  - Scalable domain-driven directory layout (`config`, `controllers`, `services`, `repositories`, `routes`, `middlewares`, `dto`, `modules`).
  - Comprehensive Database Schema Documentation (`3NF` normalized table specs across 13 entities) and Mermaid ERD diagram.
- **Testing Workspace:** Testing blueprints for E2E, Integration, Accessibility, Performance, Visual Regression, Fixtures, and Mocks.
- **Documentation Workspace:** Multi-domain docs tree (`architecture`, `api`, `database`, `design-system`, `development`, `deployment`, `decisions`, `assets`).
- **GitHub Governance:** Pull Request templates, Issue templates (Bug Report, Feature Request), Contributing guidelines, and Code of Conduct.
