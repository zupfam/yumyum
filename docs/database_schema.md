# YumYum Database Schema (PostgreSQL via SQLModel)

The system uses a relational PostgreSQL database to manage multi-tenant vendor and menu data.

## 1. Core Tables

### `vendor`
Identity and authentication record.
- `id`: UUID (Primary Key)
- `email`: Text (Unique, Index)
- `is_active`: Boolean (Default: True)
- `created_at`: Timestamp with Timezone

### `brand`
The public profile for a vendor.
- `id`: Integer (Primary Key)
- `vendor_id`: UUID (Foreign Key -> `vendor.id`)
- `slug`: Text (Unique, Index)
- `name`: Text
- `logo_url`: Text
- `cuisine`: Text
- `whatsapp_number`: Text
- `payment_link`: Text
- `created_at`: Timestamp with Timezone

### `dishes`
Menu items categorized and priced.
- `id`: Integer (Primary Key)
- `brand_id`: Integer (Foreign Key -> `brand.id`)
- `category`: Text
- `name`: Text
- `price`: Float
- `image_url`: Text
- `video_url`: Text
- `is_available`: Boolean (Default: True)
- `is_veg`: Boolean (Default: True)
- `tag`: Text (Optional: e.g., 'Best Seller')

### `status_item`
Short-term promotional updates.
- `id`: Integer (Primary Key)
- `brand_id`: Integer (Foreign Key -> `brand.id`)
- `type`: Enum ('image', 'video', 'text')
- `content`: Text
- `is_active`: Boolean (Default: True)

## 2. Analytics Tables

### `menu_event`
Event stream for behavioral tracking.
- `id`: Integer (Primary Key)
- `event_type`: Text ('menu_view', 'dish_view', 'add_to_cart', 'order_click')
- `vendor_id`: UUID
- `dish_id`: Integer (Nullable)
- `update_id`: Integer (Nullable)
- `created_at`: Timestamp with Timezone

## 3. Data Isolation Strategy
Multi-tenancy is enforced at the application layer:
1.  **Public Queries:** Always filtered by `brand.slug`.
2.  **Protected Queries:** Always filtered by `vendor_id` derived from the JWT session.
