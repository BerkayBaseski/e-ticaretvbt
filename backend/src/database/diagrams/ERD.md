# Entity Relationship Diagram (ERD)

Below is the complete database architecture diagram rendered using Mermaid GFM standard. It illustrates the 13 core domain entities and their relational cardinality.

```mermaid
erDiagram
    USERS ||--o{ ADDRESSES : "has many"
    USERS ||--o| SELLERS : "can register as"
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ WISHLISTS : "saves"
    USERS ||--o{ NOTIFICATIONS : "receives"

    SELLERS ||--o{ PRODUCTS : "manages"

    CATEGORIES ||--o{ PRODUCTS : "categorizes"
    CATEGORIES ||--o| CATEGORIES : "parent of"

    PRODUCTS ||--o{ PRODUCT_IMAGES : "contains"
    PRODUCTS ||--o| INVENTORY : "has stock"
    PRODUCTS ||--o{ ORDER_ITEMS : "included in"
    PRODUCTS ||--o{ WISHLISTS : "bookmarked in"
    PRODUCTS ||--o{ REVIEWS : "receives"

    ORDERS ||--o{ ORDER_ITEMS : "contains"
    ORDERS ||--o| PAYMENTS : "billed via"
    ORDERS ||--|| ADDRESSES : "delivers to"

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        string phone
        string role
        timestamp created_at
        timestamp updated_at
    }

    SELLERS {
        uuid id PK
        uuid user_id FK,UK
        string store_name UK
        string store_slug UK
        string tax_number
        string status
        decimal rating
        timestamp created_at
    }

    CATEGORIES {
        uuid id PK
        uuid parent_id FK
        string name
        string slug UK
        string description
        string image_url
    }

    PRODUCTS {
        uuid id PK
        uuid seller_id FK
        uuid category_id FK
        string name
        string slug UK
        string description
        decimal price
        decimal original_price
        string currency
        boolean is_active
        timestamp created_at
    }

    PRODUCT_IMAGES {
        uuid id PK
        uuid product_id FK
        string image_url
        int display_order
        boolean is_primary
    }

    INVENTORY {
        uuid id PK
        uuid product_id FK,UK
        int quantity
        int reserved_quantity
        int low_stock_threshold
        timestamp updated_at
    }

    ADDRESSES {
        uuid id PK
        uuid user_id FK
        string title
        string full_name
        string phone
        string address_line1
        string address_line2
        string city
        string state
        string zip_code
        string country
        boolean is_default
    }

    ORDERS {
        uuid id PK
        uuid user_id FK
        uuid shipping_address_id FK
        string order_number UK
        string status
        decimal subtotal
        decimal shipping_fee
        decimal discount
        decimal total_amount
        timestamp created_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        string product_name
        decimal unit_price
        int quantity
        decimal total_price
    }

    PAYMENTS {
        uuid id PK
        uuid order_id FK,UK
        string payment_method
        string status
        string transaction_id UK
        decimal amount
        timestamp paid_at
    }

    WISHLISTS {
        uuid id PK
        uuid user_id FK
        uuid product_id FK
        timestamp added_at
    }

    REVIEWS {
        uuid id PK
        uuid user_id FK
        uuid product_id FK
        int rating
        string comment
        boolean is_verified_purchase
        timestamp created_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        string title
        string description
        string type
        boolean is_read
        string link
        timestamp created_at
    }
```
