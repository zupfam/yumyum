# Vendor Allocation Process

This document outlines the manual process for allocating a new vendor to one of the subsidiary Supabase projects and updating the `vendor_mappings` table.

## Process

1.  **Select a subsidiary Supabase project:** From the pool of available subsidiary projects, choose one that has not yet been allocated to a vendor.
2.  **Record the project ID:** Note the Supabase project ID for the selected project.
3.  **Update the `vendor_mappings` table:** In the primary Supabase project, add a new row to the `vendor_mappings` table with the following information:
    - `vendor_slug`: The vendor's unique slug.
    - `email`: The vendor's email address (used for Magic Link authentication).
    - `backend_type`: Set to `'supabase'` or `'gsheets'` as appropriate.
    - `supabase_project_id`: The project ID of the selected Supabase project (if `backend_type` is `'supabase'`).
    - `gsheet_id`: The Google Sheet ID for this vendor (if `backend_type` is `'gsheets'`).
    - `imagekit_account_id`: The vendor's ImageKit account ID.
    - `membership_fee`: The membership fee (e.g., `99.99`).
    - `membership_validity`: The membership expiration date (e.g., `2026-10-30`).
    - `is_member`: Set to `true` or `false`.
    - `user_id`: The UUID of the vendor from the `auth.users` table. This is crucial for linking the vendor mapping to the Supabase authentication system.
