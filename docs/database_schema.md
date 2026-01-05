## Database Schema (Canonical)

### `vendors`
Stores vendor information, linked to `auth.users`.
```sql
create table vendors (
  id uuid primary key references auth.users(id),
  slug text unique not null,
  name text not null,
  category text not null,
  whatsapp_number text not null,
  latitude double precision,
  longitude double precision,
  is_active boolean default true,
  created_at timestamptz default now()
);
```

### `vendor_social_accounts`
Stores social media links for vendors.
```sql
create type social_platform as enum ('instagram', 'facebook', 'whatsapp', 'youtube', 'twitter', 'website');
create table vendor_social_accounts (
  id bigint generated always as identity primary key,
  vendor_id uuid not null references vendors(id) on delete cascade,
  platform social_platform not null,
  handle text not null,
  url text not null,
  is_primary boolean default false,
  created_at timestamptz default now(),
  unique (vendor_id, platform, handle)
);
```

### `vendor_updates`
Stores daily attention slots (specials, announcements). Max 3 active updates per vendor.
```sql
create table vendor_updates (
  id bigint generated always as identity primary key,
  vendor_id uuid not null references vendors(id) on delete cascade,
  title text not null,
  description text,
  media_url text,
  starts_at timestamptz default now(),
  expires_at timestamptz not null,
  created_at timestamptz default now()
);
```

### `update_interactions`
Tracks bounded multi-tap interest on updates (max 5 taps per session per update).
```sql
create table update_interactions (
  id bigint generated always as identity primary key,
  update_id bigint not null references vendor_updates(id) on delete cascade,
  session_id text not null,
  tap_count int default 1,
  last_tapped_at timestamptz default now(),
  unique (update_id, session_id)
);
```

### `dishes`
Stores individual dish details.
```sql
create table dishes (
  id bigint generated always as identity primary key,
  vendor_id uuid not null references vendors(id) on delete cascade,
  category text not null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  is_available boolean default true,
  image_url text,
  created_at timestamptz default now()
);
```

### `menu_events` (Analytics – Single Event Stream)
The core behavioral backbone of YumYum. All metrics and dashboards derive from this table.

**Event Type Definition:**
```sql
create type menu_event_type as enum (
  'menu_view',
  'dish_view',
  'add_to_cart',
  'order_click',
  'update_view',
  'update_click',
  'update_interest',
  'feedback_submit'
);
```

**Table Definition:**
```sql
create table menu_events (
  id bigint generated always as identity primary key,
  vendor_id uuid not null,
  dish_id bigint null,
  update_id bigint null,
  event menu_event_type not null,
  created_at timestamptz default now()
);
```

**Context Invariant:**
At most one of `dish_id` or `update_id` may be non-null. They must never be set together.
```sql
alter table menu_events
add constraint one_context_only
check (
  (dish_id is null and update_id is not null)
  or (dish_id is not null and update_id is null)
  or (dish_id is null and update_id is null)
);
```

**Event Context Matrix:**

| Event | dish_id | update_id | Meaning |
|---|---|---|---|
| `menu_view` | null | null | Menu opened |
| `dish_view` | set | null | Dish viewed |
| `add_to_cart` | set | null | Dish added to cart |
| `order_click` | null | null | WhatsApp order initiated |
| `update_view` | null | set | Vendor update shown |
| `update_click` | null | set | Vendor update opened |
| `update_interest` | null | set | Interest tap |
| `feedback_submit` | null | null | Feedback submitted |
