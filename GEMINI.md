# Project: YumYum

## Project Overview

YumYum is a mobile-first digital storefront for hyperlocal food vendors in India. Its core concept is to replace static paper menus with an Instagram-style, vertical, visual menu that drives measurable demand and provides vendors with a dashboard of key metrics. It's designed to be a demand-generation and measurement engine rather than just a menu app.

**Key Problems Solved:**
*   **Recurring Printing Costs:** Eliminates the need for reprinting menus.
*   **Zero Upselling:** Enables dynamic highlighting of best sellers and combos.
*   **No Demand Visibility:** Provides vendors with insights into menu engagement and order intent.
*   **No Customer Loop:** Facilitates re-engagement through WhatsApp ordering.

**Value Proposition:**
For a small monthly fee, YumYum offers vendors proof that it drives customers, not just clicks, by providing more orders, eliminating printing costs, and offering visibility into sales performance.

**Target Users:**
*   **Primary:** Ambitious Street Food Vendors (owner-operated stalls, trucks, daily WhatsApp users, seeking growth without complexity).
*   **Secondary:** Cloud Kitchens (aiming to reduce dependency on high-commission aggregators).

**Key Differentiator:** Radical simplicity, focusing only on metrics that matter.

## MVP Scope (Core Features)

1.  **Vendor Digital Brand Page:** A professional, mobile-first storefront via QR code.
2.  **Instagram-style Dynamic Menu:** Vertical, visual scrolling menu.
3.  **QR Code Generator:** For instant customer access.
4.  **Client-Side Cart & Order Summary:** Customers can add items, review, and send a pre-filled WhatsApp order.
5.  **Cart → WhatsApp Order Flow:** Seamless order placement.
6.  **Vendor Metrics Dashboard:** Numbers-only proof of value.
7.  **Secure Vendor Login:** Magic Link authentication.

## Technical Architecture

**Architecture Principles:**
*   Jamstack
*   Zero infra cost
*   Single Supabase project
*   Multi-tenant via RLS

**Tech Stack:**
*   **Frontend:** Next.js, TypeScript, Tailwind, Shadcn UI, Aceternity UI, Magic UI
*   **State:** Zustand
*   **Backend:** Supabase (Auth, Postgres, APIs)
*   **Hosting:** Vercel (Free Tier)
*   **Media:** Cloudinary
*   **Analytics:** Google Analytics 4 (GA4) with `vendor_id` as a Custom Dimension.

## Building and Running

Given the Next.js/TypeScript stack, the general commands for development would typically involve:

*   **Installation:** `npm install` or `yarn install`
*   **Development Server:** `npm run dev` or `yarn dev` (to start the local development server)
*   **Building for Production:** `npm run build` or `yarn build`
*   **Starting Production Server:** `npm run start` or `yarn start`

**TODO:** More specific build, run, and test commands should be extracted from `package.json` or other configuration files once the project structure is more defined.

## Development Conventions

**Metrics Philosophy (Non-Negotiable):**
YumYum tracks **outcomes**, not curiosity. Every metric exists to answer: "Is YumYum creating measurable demand for vendors?" If unclear, the metric is removed.

**Event-Based Tracking Model:**
All analytics are powered by a **single append-only event table**: `menu_events`. Every meaningful user action emits exactly one event. Events are written at interaction time, never inferred later, and aggregation happens in SQL.

**Canonical Events:**
*   `menu_view`
*   `dish_view`
*   `add_to_cart`
*   `order_click` (North-Star Event)
*   `update_view`
*   `update_click`
*   `update_interest`
*   `feedback_submit`

**Explicitly NOT Tracked:** `remove_from_cart`, scroll depth, time on page, raw like counts (as they do not change product decisions at this stage).

**Security Model:**
*   Supabase Magic Link Auth
*   Row Level Security (`vendor_id = auth.uid()`)
*   No cross-vendor access possible

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
  interest_count int default 0,
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
  instock text default 'yes',
  image_url text,
  created_at timestamptz default now()
);
```

### `menu_events` (Analytics – Single Event Stream)
The core behavioral backbone of YumYum. All metrics and dashboards derive from this table.

**Table Definition:**
```sql
create table menu_events (
  id bigint generated always as identity primary key,
  vendor_id uuid not null,
  dish_id bigint null,
  update_id bigint null,
  event text not null,
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
