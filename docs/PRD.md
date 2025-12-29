# Product Requirements Document: YumYum (v4 – Metrics-Driven MVP)

## 1. Introduction

### 1.1 Executive Summary

YumYum is envisioned as a mobile-first digital storefront for hyperlocal food vendors in India. It aims to revolutionize how street food vendors operate by replacing static paper menus with an Instagram-style, vertical, visual menu that actively drives and measures demand. The core thesis is that YumYum is not just a menu app, but a demand-generation and measurement engine.

### 1.2 Problem Statement

Street food vendors currently operate in an "analog trap" characterized by four key profit leaks:

1.  **Recurring Printing Costs:** Continuous expenditure on reprinting menus for updates.
2.  **Zero Upselling:** Inability to highlight popular or high-margin items effectively.
3.  **No Demand Visibility:** Lack of data on customer engagement with their menus.
4.  **No Customer Loop:** Absence of mechanisms to re-engage satisfied customers.

Vendors need clarity and leverage, not just technology.

### 1.3 Solution Overview

YumYum offers a blazing-fast digital storefront with a metrics dashboard. For vendors, it provides a digital brand page, an Instagram-style menu, WhatsApp ordering integration, and a dashboard showing orders sent, menu engagement, and cost savings. For customers, it offers instant QR-based access, a visual menu, accurate pricing, and simple WhatsApp ordering.

### 1.4 Key Differentiator

Radical simplicity: "If it doesn’t create a number that matters, it doesn’t exist." The focus is on measurable outcomes that directly impact vendor growth.

## 2. Target Users

### 2.1 Primary Segment: Ambitious Street Food Vendors

*   Owner-operated stalls, trucks, and takeaway joints.
*   Daily WhatsApp users seeking growth without complexity.

### 2.2 Secondary Segment: Cloud Kitchens

*   Aiming to reduce dependency on high-commission aggregators and gain direct customer visibility.

## 3. Goals and Success Metrics

### 3.1 North-Star Metric

*   **Menus scanned per Vendor per Day:**
    *   > 10/day → Strong signal
    *   1–5/day → Needs optimization
    *   < 1/day → Value proposition broken
    (Must be configurable in the app)

### 3.2 MVP Success Criteria (30-Day Sprint)

*   5 paying vendors.
*   Avg ≥3 orders/day/vendor.
*   ≥30% 15-day retention.
*   At least one unsolicited vendor testimonial.

## 4. MVP Scope (Core Features)

1.  **Vendor Digital Brand Page:** Professional, mobile-first storefront via QR code.
2.  **Instagram-style Dynamic Menu:** Vertical, visual scrolling menu.
3.  **QR Code Generator:** For instant customer access.
4.  **Client-Side Cart & Order Summary:** Customers can add items, review, and send a pre-filled WhatsApp order.
5.  **Cart → WhatsApp Order Flow:** Seamless order placement.
6.  **Vendor Metrics Dashboard (Numbers Only):** Clear proof of value.
7.  **Secure Vendor Login:** Magic Link authentication.

## 5. Metrics Architecture (Single Source of Truth)

### 5.1 Event-Based Tracking Model

All analytics are powered by a **single append-only event table**: `menu_events`. This prevents premature aggregation mistakes, allows for new metrics derivation without schema changes, and keeps infrastructure simple and cheap. Every meaningful user action emits exactly one event.

### 5.2 Canonical Events

1.  **`menu_view`:** When a customer opens a vendor’s menu. Measures raw demand.
    *   Recorded as: `vendor_id, event='menu_view'`
2.  **`dish_view`:** When a dish card enters the viewport or is tapped. Measures attention distribution.
    *   Recorded as: `vendor_id, dish_id, event='dish_view'`
3.  **`add_to_cart`:** When a customer adds a dish to the cart. Measures intent creation.
    *   Recorded as: `vendor_id, dish_id, event='add_to_cart'`
4.  **`order_click` (⭐ North-Star Event):** When a customer clicks “Send Order on WhatsApp.” Closest proxy to revenue.
    *   Recorded as: `vendor_id, event='order_click'`
5.  **`update_view`:** When a vendor update is shown. Measures visibility of updates.
    *   Recorded as: `vendor_id, update_id, event='update_view'`
6.  **`update_click`:** When a customer taps a vendor update. Measures engagement beyond exposure.
    *   Recorded as: `vendor_id, update_id, event='update_click'`
7.  **`update_interest`:** Each bounded multi-tap interaction (max 5 per session). Captures intensity of intent.
    *   Recorded as: `vendor_id, update_id, event='update_interest'`
8.  **`feedback_submit`:** When a customer successfully submits feedback. Measures trust and emotional engagement.
    *   Recorded as: `vendor_id, event='feedback_submit'`

### 5.3 What We Explicitly Do NOT Track

`remove_from_cart`, scroll depth, time on page, raw like counts. These metrics do not change product decisions at this stage.

### 5.4 How Metrics Power Each Dashboard

*   **Vendor Dashboard:** Justify payment and drive behavior change. (Orders Sent, Menu Views, Conversion Rate, Top Dishes, Update Performance, ₹ Saved on Printing).
*   **Founder Dashboard:** Truth, not motivation. (Active Vendors, Avg Orders / Vendor / Day, Retention Proxy, Vendor Segmentation).
*   **Investor Metrics:** Narrative clarity. (Total Orders Sent, Orders per Vendor per Day, Active Vendor Ratio, MRR vs Demand Growth, Infra Cost per Vendor).

## 6. Technical Architecture (MVP-Safe)

### 6.1 Architecture Principles

*   Jamstack
*   Zero infra cost
*   Single Supabase project
*   Multi-tenant via RLS

### 6.2 Tech Stack

*   **Frontend:** Next.js, TypeScript, Tailwind, Shadcn UI, Aceternity UI, Magic UI
*   **State:** Zustand
*   **Backend:** Supabase (Auth, Postgres, APIs)
*   **Hosting:** Vercel (Free Tier)
*   **Media:** Cloudinary

## 7. Database Schema

(Refer to `GEMINI.md` for detailed SQL schema definitions for `vendors`, `vendor_social_accounts`, `vendor_updates`, `update_interactions`, `dishes`, and `menu_events`.)

## 8. Security Model

*   Supabase Magic Link Auth
*   Row Level Security (`vendor_id = auth.uid()`)
*   No cross-vendor access possible

## 9. Operating Constraints

*   Zero paid infrastructure
*   Manual vendor onboarding
*   Manual subscription collection
*   Manual migrations

## 10. X-Factors & Growth Levers

1.  **Proof of Growth (In-App):** Auto-generated, positive performance statements in the vendor dashboard based on `order_click` events.
2.  **Founder-Controlled WhatsApp Performance Reports:** Manual generation of WhatsApp-ready performance messages by the founder.
3.  **Vendor Updates (Daily Attention Slots):** Short-lived, high-visibility updates (max 3 active per vendor) for daily specials, offers, etc.
4.  **Bounded Multi-Tap Interest:** Lightweight intent signal (up to 5 taps per session) for updates, capturing intensity of demand.
5.  **Contextual Local Discovery (Non-Distracting):** Selection and ranking of other vendor updates based on proximity, category affinity, and popularity, without compromising the primary vendor's menu.
6.  **Campaigns Without Owning Customer Data:** Enabling marketing through menu-based campaigns and suggested WhatsApp message templates for vendors.

## 11. Customer Data & Feedback

YumYum never sells or exposes raw customer contact data. A feedback system allows customers to submit feedback, with paid tiers offering full text and response tools.

## 12. Final Positioning

YumYum does not own customers. YumYum owns **the moment of intent**. By capturing intent intensity, shaping attention, and proving value with numbers, YumYum becomes indispensable to hyperlocal food vendors.
