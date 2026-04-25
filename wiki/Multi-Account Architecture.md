# Multi-Account Architecture

This document outlines the multi-account architecture implemented in the YumYum project.

## Overview

The YumYum platform is designed to support multiple vendor accounts, each potentially backed by different data sources (e.g., Supabase, Google Sheets). This multi-account architecture allows for scalability and flexibility in onboarding diverse vendors.

## Key Components

### 1. Vendor Mapping Service

*   **Purpose:** To map a `vendor_slug` (used in the application's URLs) to a specific backend data source (e.g., a Supabase project ID or a Google Sheet ID).
*   **Implementation:** Handled by the `vendor_mappings` table in the primary Supabase project. This table now includes fields for `membership_fee`, `membership_validity`, `is_member`, and crucially, `user_id` (referencing `auth.users(id)`), which is central to the enhanced authentication and authorization flow.

### 2. Supabase Accounts

*   **Purpose:** To host data for vendors who use Supabase as their backend.
*   **Configuration:** Each Supabase account has its own `NEXT_PUBLIC_SUPABASE_ACCT_X_URL` and `NEXT_PUBLIC_SUPABASE_ACCT_X_ANON_KEY` environment variables.

### 3. Google Sheets Integration

*   **Purpose:** To support vendors who manage their menu data in Google Sheets.
*   **Configuration:** Relies on `ADMIN_SHEET_ID` to locate the master vendor mapping sheet and individual Google Sheet IDs for each vendor's menu data.

## Data Flow for a Vendor Page Request

1.  A user navigates to `/[vendor_slug]` (e.g., `/pizzapalace`).
2.  The application first queries the `vendor_mappings` table in the **Primary Database** to find the entry where `vendor_slug` matches `pizzapalace`.
3.  This record provides the `datastore_type` (e.g., 'supabase') and the `datastore_id` (e.g., the Project ID for the Pizza Palace Supabase project).
4.  The application then uses the credentials for the specific vendor database (identified by `datastore_id`) to make subsequent queries.
5.  It fetches the brand, dish, and status_item data from the tables within that dedicated vendor database.
6.  Finally, the application assembles the data from both the primary and vendor databases to render the complete page.

## Scalability Considerations

*   **Adding New Supabase Vendors:** Involves creating a new Supabase project and updating the `vendor_mappings` table with the new vendor's slug and Supabase project details.
*   **Adding New Google Sheets Vendors:** Involves creating a new Google Sheet for their menu and updating the master vendor mapping sheet with the new vendor's slug and Google Sheet ID.

## Security Considerations

*   Environment variables for Supabase API keys and Google Sheet IDs are kept secure and not exposed client-side unless explicitly prefixed with `NEXT_PUBLIC_`.
*   Access control to vendor data is managed at the backend level (Supabase Row Level Security or Google Sheets sharing permissions).
