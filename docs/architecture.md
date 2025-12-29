# Architecture Specification: YumYum

## 1. System Overview

YumYum is a multi-tenant SaaS platform built on a Jamstack architecture. It prioritizes zero infrastructure cost, high performance, and rapid scalability.

## 2. Technical Stack

*   **Frontend:** Next.js (TypeScript)
*   **Styling:** Tailwind CSS, Shadcn UI
*   **UI Components:** Magic UI, Aceternity UI, Reactbits
*   **State Management:** Zustand
*   **Backend as a Service (BaaS):** Supabase (PostgreSQL, Auth, RLS)
*   **Hosting:** Vercel
*   **Media Hosting:** Cloudinary
*   **Analytics:** Google Analytics 4 (GA4)

## 3. High-Level Architecture

### 3.1 Multi-Tenancy
Multi-tenancy is handled via Supabase Row Level Security (RLS). Every table includes a `vendor_id` column linked to `auth.users.id`.
*   **Vendor Access:** Vendors can only read/write their own data.
*   **Public Access:** Customers can read public menu data for any vendor via the `vendor_slug`.

### 3.2 Data Flow
1.  **Vendor Management:** Vendors log in via Supabase Magic Link and manage their menu through a yet-to-be-built dashboard (or initially via direct DB/manual onboarding).
2.  **Customer Interaction:** Customers scan a QR code leading to `yumyum.zupfam.com/{vendor-slug}`.
3.  **Event Emission:** Client-side actions (views, clicks, adds) are sent as raw events to the `menu_events` table in Supabase.
4.  **Analytics Pipeline:** Dashboards query the `menu_events` table to aggregate data on-the-fly for real-time reporting.

## 4. Database Schema (Canonical)

The system uses a relational PostgreSQL schema designed for event-based analytics and multi-tenant isolation.

### 4.1 Core Entities
*   **`vendors`:** Primary vendor profile and settings.
*   **`dishes`:** Menu items categorized and priced.
*   **`vendor_updates`:** Promotional "stories" or daily specials.
*   **`vendor_social_accounts`:** External links (Instagram, WhatsApp, etc.).

### 4.2 Behavioral Data
*   **`menu_events`:** The polymorphic event stream for all analytics.
*   **`update_interactions`:** High-frequency interaction tracking for vendor updates.

(Detailed SQL schema is available in `GEMINI.md`)

## 5. Security Strategy

*   **Authentication:** Supabase Magic Link for passwordless, secure vendor entry.
*   **Authorization:** Strict RLS policies on all tables.
*   **Public Data:** Publicly accessible views/tables are limited to read-only for non-authenticated users.

## 6. Infrastructure & Deployment

*   **CI/CD:** Automatic deployment via Vercel integration with GitHub.
*   **Environment Variables:** Managed via Vercel and local `.env` files (Supabase URL/Key, Cloudinary credentials).
*   **Media Optimization:** Cloudinary handles automatic resizing, formatting, and delivery via CDN.

## 7. Operational Roadmap

1.  **Phase 1:** Core menu rendering and event tracking.
2.  **Phase 2:** Vendor dashboard for menu management.
3.  **Phase 3:** Automated performance reporting via WhatsApp.
