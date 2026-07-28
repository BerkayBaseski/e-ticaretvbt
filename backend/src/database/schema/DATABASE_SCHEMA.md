# Enterprise Database Schema & Specifications

## Overview & Normalization Strategy

The database schema is designed according to **Third Normal Form (3NF)** principles:
1. **First Normal Form (1NF):** All columns hold atomic, non-divisible values. Arrays or composite objects (like addresses) are broken out into dedicated related tables (`ADDRESSES`, `PRODUCT_IMAGES`).
2. **Second Normal Form (2NF):** Every non-key attribute is fully functionally dependent on the primary key.
3. **Third Normal Form (3NF):** No transitive dependencies exist. Calculated fields (such as `total_amount` in orders) are enforced with strict consistency rules or computed columns.

---

## Entity Definitions & Table Specifications

### 1. `users` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Unique user ID |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | Login email address |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Argon2 / Bcrypt hashed password |
| `first_name` | `VARCHAR(100)` | `NOT NULL` | First name |
| `last_name` | `VARCHAR(100)` | `NOT NULL` | Last name |
| `phone` | `VARCHAR(20)` | `NULL` | Contact phone number |
| `role` | `VARCHAR(20)` | `NOT NULL, DEFAULT 'customer'` | Enum: `customer`, `seller`, `admin` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Record update timestamp |

### 2. `sellers` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Unique seller ID |
| `user_id` | `UUID` | `UNIQUE, NOT NULL, FOREIGN KEY (users.id)` | Associated user account |
| `store_name` | `VARCHAR(150)` | `UNIQUE, NOT NULL` | Public store display name |
| `store_slug` | `VARCHAR(150)` | `UNIQUE, NOT NULL` | URL-friendly store slug |
| `tax_number` | `VARCHAR(50)` | `NOT NULL` | Business tax ID |
| `status` | `VARCHAR(20)` | `NOT NULL, DEFAULT 'pending'` | Enum: `pending`, `active`, `suspended` |
| `rating` | `DECIMAL(3,2)` | `DEFAULT 5.00` | Aggregated store rating |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Registration timestamp |

### 3. `categories` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Unique category ID |
| `parent_id` | `UUID` | `NULL, FOREIGN KEY (categories.id)` | Parent category for hierarchy |
| `name` | `VARCHAR(100)` | `NOT NULL` | Category name |
| `slug` | `VARCHAR(100)` | `UNIQUE, NOT NULL` | URL slug |
| `description` | `TEXT` | `NULL` | Category description |
| `image_url` | `TEXT` | `NULL` | Banner image URL |

### 4. `products` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Unique product ID |
| `seller_id` | `UUID` | `NOT NULL, FOREIGN KEY (sellers.id)` | Product owner seller |
| `category_id` | `UUID` | `NOT NULL, FOREIGN KEY (categories.id)` | Product category |
| `name` | `VARCHAR(255)` | `NOT NULL` | Product title |
| `slug` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | URL slug |
| `description` | `TEXT` | `NOT NULL` | Full description |
| `price` | `DECIMAL(10,2)` | `NOT NULL, CHECK (price >= 0)` | Sales price |
| `original_price` | `DECIMAL(10,2)` | `NULL, CHECK (original_price >= price)` | Regular list price |
| `currency` | `VARCHAR(5)` | `NOT NULL, DEFAULT 'TRY'` | Currency code |
| `is_active` | `BOOLEAN` | `NOT NULL, DEFAULT TRUE` | Active listing status |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Creation timestamp |

### 5. `product_images` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Image ID |
| `product_id` | `UUID` | `NOT NULL, FOREIGN KEY (products.id) ON DELETE CASCADE` | Parent product |
| `image_url` | `TEXT` | `NOT NULL` | CDN Image URL |
| `display_order` | `INT` | `NOT NULL, DEFAULT 0` | Sort order index |
| `is_primary` | `BOOLEAN` | `NOT NULL, DEFAULT FALSE` | Main thumbnail flag |

### 6. `inventory` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Inventory record ID |
| `product_id` | `UUID` | `UNIQUE, NOT NULL, FOREIGN KEY (products.id) ON DELETE CASCADE` | Product reference |
| `quantity` | `INT` | `NOT NULL, CHECK (quantity >= 0)` | Total physical stock |
| `reserved_quantity` | `INT` | `NOT NULL, DEFAULT 0, CHECK (reserved_quantity <= quantity)` | Pending order reservations |
| `low_stock_threshold` | `INT` | `NOT NULL, DEFAULT 5` | Low stock alert threshold |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Stock update timestamp |

### 7. `addresses` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Address ID |
| `user_id` | `UUID` | `NOT NULL, FOREIGN KEY (users.id) ON DELETE CASCADE` | Address owner |
| `title` | `VARCHAR(50)` | `NOT NULL` | e.g. "Ev", "İş" |
| `full_name` | `VARCHAR(100)` | `NOT NULL` | Recipient name |
| `phone` | `VARCHAR(20)` | `NOT NULL` | Contact phone |
| `address_line1` | `VARCHAR(255)` | `NOT NULL` | Primary street address |
| `address_line2` | `VARCHAR(255)` | `NULL` | Apartment / Unit |
| `city` | `VARCHAR(100)` | `NOT NULL` | City |
| `state` | `VARCHAR(100)` | `NOT NULL` | Province / State |
| `zip_code` | `VARCHAR(20)` | `NOT NULL` | Postal code |
| `country` | `VARCHAR(100)` | `NOT NULL, DEFAULT 'Turkey'` | Country |
| `is_default` | `BOOLEAN` | `NOT NULL, DEFAULT FALSE` | Primary delivery address |

### 8. `orders` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Order ID |
| `user_id` | `UUID` | `NOT NULL, FOREIGN KEY (users.id)` | Ordering customer |
| `shipping_address_id` | `UUID` | `NOT NULL, FOREIGN KEY (addresses.id)` | Delivery address |
| `order_number` | `VARCHAR(50)` | `UNIQUE, NOT NULL` | Human readable order code |
| `status` | `VARCHAR(30)` | `NOT NULL, DEFAULT 'pending'` | `pending`, `processing`, `shipped`, `delivered`, `cancelled` |
| `subtotal` | `DECIMAL(10,2)` | `NOT NULL` | Items total price |
| `shipping_fee` | `DECIMAL(10,2)` | `NOT NULL, DEFAULT 0.00` | Shipping cost |
| `discount` | `DECIMAL(10,2)` | `NOT NULL, DEFAULT 0.00` | Promo discount |
| `total_amount` | `DECIMAL(10,2)` | `NOT NULL` | Net final amount |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Order placement time |

### 9. `order_items` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Order item ID |
| `order_id` | `UUID` | `NOT NULL, FOREIGN KEY (orders.id) ON DELETE CASCADE` | Parent order |
| `product_id` | `UUID` | `NOT NULL, FOREIGN KEY (products.id)` | Purchased product |
| `product_name` | `VARCHAR(255)` | `NOT NULL` | Snapshot of product title |
| `unit_price` | `DECIMAL(10,2)` | `NOT NULL` | Snapshot unit price |
| `quantity` | `INT` | `NOT NULL, CHECK (quantity > 0)` | Quantity purchased |
| `total_price` | `DECIMAL(10,2)` | `NOT NULL` | `unit_price * quantity` |

### 10. `payments` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Payment record ID |
| `order_id` | `UUID` | `UNIQUE, NOT NULL, FOREIGN KEY (orders.id)` | Billed order |
| `payment_method` | `VARCHAR(50)` | `NOT NULL` | `credit_card`, `bank_transfer`, `cash_on_delivery` |
| `status` | `VARCHAR(30)` | `NOT NULL` | `pending`, `completed`, `failed`, `refunded` |
| `transaction_id` | `VARCHAR(100)` | `UNIQUE, NULL` | Gateway transaction code |
| `amount` | `DECIMAL(10,2)` | `NOT NULL` | Amount billed |
| `paid_at` | `TIMESTAMPTZ` | `NULL` | Gateway confirmation time |

### 11. `wishlists` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Wishlist entry ID |
| `user_id` | `UUID` | `NOT NULL, FOREIGN KEY (users.id) ON DELETE CASCADE` | Customer ID |
| `product_id` | `UUID` | `NOT NULL, FOREIGN KEY (products.id) ON DELETE CASCADE` | Saved product ID |
| `added_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Timestamp |

### 12. `reviews` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Review ID |
| `user_id` | `UUID` | `NOT NULL, FOREIGN KEY (users.id)` | Reviewer user |
| `product_id` | `UUID` | `NOT NULL, FOREIGN KEY (products.id) ON DELETE CASCADE` | Reviewed product |
| `rating` | `INT` | `NOT NULL, CHECK (rating >= 1 AND rating <= 5)` | Star rating (1 to 5) |
| `comment` | `TEXT` | `NULL` | Review comment body |
| `is_verified_purchase` | `BOOLEAN` | `NOT NULL, DEFAULT FALSE` | Verified buyer badge |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Creation timestamp |

### 13. `notifications` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Notification ID |
| `user_id` | `UUID` | `NOT NULL, FOREIGN KEY (users.id) ON DELETE CASCADE` | Recipient user |
| `title` | `VARCHAR(255)` | `NOT NULL` | Notification title |
| `description` | `TEXT` | `NOT NULL` | Notification body |
| `type` | `VARCHAR(50)` | `NOT NULL` | `order`, `discount`, `security`, `system` |
| `is_read` | `BOOLEAN` | `NOT NULL, DEFAULT FALSE` | Read status |
| `link` | `VARCHAR(255)` | `NULL` | Target web link |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Notification timestamp |

---

## Indexing Strategy Recommendations

1. **Unique Indexes:**
   - `users(email)`
   - `sellers(store_slug)`
   - `products(slug)`
   - `categories(slug)`
   - `orders(order_number)`
   - `payments(transaction_id)`
   - Composite unique: `wishlists(user_id, product_id)` to prevent duplicate wishlist items.

2. **B-Tree Query Performance Indexes:**
   - `products(category_id, price)` -> Accelerates filtered catalog searches.
   - `products(seller_id)` -> Accelerates seller dashboard inventory lists.
   - `orders(user_id, created_at DESC)` -> Accelerates customer order history lookups.
   - `notifications(user_id, is_read)` -> Accelerates unread notification count queries.
