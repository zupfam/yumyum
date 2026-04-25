# Manual Vendor Onboarding Workflows

This document details the manual workflows for onboarding new vendors to the YumYum platform, covering both Supabase-backed and Google Sheets-backed vendors.

## 1. Onboarding a Supabase-Backed Vendor

**Prerequisites:**
*   Access to the Supabase dashboard.
*   New vendor's branding information (name, logo, cuisine, etc.).
*   New vendor's menu data.

**Workflow:**

1.  **Create New Supabase Project:**
    *   Log in to the Supabase dashboard.
    *   Create a new project for the vendor.
    *   Configure Row Level Security (RLS) policies for the `brand`, `dishes`, and `status` tables to ensure data isolation.

2.  **Populate Vendor Data:**
    *   Import the vendor's menu data into the `dishes` table.
    *   Add brand information to the `brand` table.
    *   Add initial status information to the `status` table (if applicable).

3.  **Update Primary Vendor Mapping:**
    *   Access the primary Supabase project (the one containing the `vendor_mappings` table).
    *   Add a new entry to the `vendor_mappings` table:
        *   `vendor_slug`: A unique, URL-friendly identifier for the vendor (e.g., `'burger-bliss'`).
        *   `auth_user_id`: The vendor's UUID from the `auth.users` table.
        *   `datastore_type`: Set to `'supabase'` or `'gsheets'`.
        *   `datastore_id`: The Supabase Project ID or Google Sheet ID.

4.  **Configure Environment Variables:**
    *   If this is a new Supabase account (not using an existing pool), add its `NEXT_PUBLIC_SUPABASE_ACCT_X_URL` and `NEXT_PUBLIC_SUPABASE_ACCT_X_ANON_KEY` to the `.env.local` file.

5.  **Verify Onboarding:**
    *   Navigate to `https://your-app-url.com/[vendor_slug]` to ensure the vendor's menu page loads correctly.

## 2. Onboarding a Google Sheets-Backed Vendor

**Prerequisites:**
*   Access to Google Sheets.
*   New vendor's branding information (name, logo, cuisine, etc.).
*   New vendor's menu data.
*   The Google Sheet must be publicly accessible (read-only).

**Workflow:**

1.  **Create Vendor Google Sheet:**
    *   Create a new Google Sheet for the vendor's menu data.
    *   Ensure the sheet has tabs named `Brand`, `Dishes`, and `Status` with the expected column headers.
    *   Populate the `Brand`, `Dishes`, and `Status` tabs with the vendor's data.
    *   **Share the Google Sheet:** Set sharing permissions to "Anyone with the link can view".

2.  **Update Master Vendor Mapping Sheet:**
    *   Access the master Google Sheet that contains the `vendor_mappings`.
    *   Add a new row:
        *   `vendor_slug`: A unique, URL-friendly identifier for the vendor (e.g., `'taco-truck-tuesdays'`).
        *   `sheet_id`: The ID of the newly created vendor Google Sheet (found in the sheet's URL).
        *   `type`: Set to `'gsheets'`.

3.  **Verify Onboarding:**
    *   Navigate to `https://your-app-url.com/[vendor_slug]` to ensure the vendor's menu page loads correctly.

## Troubleshooting

*   **Vendor Not Found (404):**
    *   Check `vendor_slug` in the URL against the `vendor_mappings` table/sheet.
    *   Verify `sheet_id` is correct and accessible.
*   **Data Not Loading:**
    *   Ensure Google Sheet is publicly accessible.
    *   Check tab names (`Brand`, `Dishes`, `Status`) and column headers for correctness.
    *   Verify `ADMIN_SHEET_ID` is correctly configured in `.env.local`.
