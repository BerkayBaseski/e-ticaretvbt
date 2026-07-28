# Auth & Domain Modules Overview

The `src/modules/` directory organizes domain features into modular units:

- **`auth/`**: Authentication controllers, JWT generation, password hashing, refresh token rotation.
- **`users/`**: Customer profiles, address management, user preferences.
- **`sellers/`**: Merchant onboarding, seller store settings, seller analytics.
- **`products/`**: Product catalog CRUD, stock tracking, price management, search filters.
- **`categories/`**: Hierarchy trees, taxonomy management.
- **`orders/`**: Order placement, status state transitions, payment integration.
- **`wishlist/`**: Customer wishlist persistence.
- **`reviews/`**: Rating aggregations, product reviews & seller responses.
- **`notifications/`**: Push notifications, order tracking alerts.
