---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - docs/PRD.md
  - docs/architecture.md
  - docs/ux-design-specification.md
---

# yumyum - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for yumyum, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Vendor Digital Brand Page - Professional, mobile-first storefront accessible via QR code.
FR2: Instagram-style Dynamic Menu - Vertical, visual scrolling menu for dishes.
FR3: QR Code Generator - Generate QR codes for instant customer access.
FR4: Client-Side Cart - Allow customers to add multiple items, review quantities, and view total price.
FR5: WhatsApp Ordering - One-tap "Send Order on WhatsApp" with pre-filled message.
FR6: Vendor Metrics Dashboard - Display "Orders Sent", "Menu Views", "Conversion Rate", "Top Dishes", "Update Performance", "₹ Saved".
FR7: Secure Vendor Login - Authentication via Supabase Magic Link.
FR8: Vendor Updates - Vendors can post max 3 active updates (specials, offers) with expiration.
FR9: Update Interactions - Track "bounded multi-tap interest" (max 5 taps) on updates.
FR10: Contextual Local Discovery - Display other vendor updates based on proximity and category affinity (non-distracting).
FR11: Feedback System - Allow customers to submit feedback.
FR12: Dish Management - Vendors can manage dishes (image, price, description, availability).
FR13: Profile Management - Vendors can update profile details (name, location, social links).

### NonFunctional Requirements

NFR1: Performance - "Blazing-fast" load times for QR scan and menu interaction.
NFR2: Mobile-First - Optimized for low-end devices and slow internet.
NFR3: Simplicity - "Radical simplicity" in UI/UX for both vendors and customers.
NFR4: Analytics - Event-based tracking (single `menu_events` table) for all metrics.
NFR5: Security - Row Level Security (RLS) ensuring vendor data isolation.
NFR6: Privacy - No raw customer contact data exposed or sold.
NFR7: Reliability - Offline capabilities where feasible; graceful degradation.
NFR8: Scalability - Multi-tenant SaaS architecture on Supabase.
NFR9: Cost - Zero infrastructure cost architecture (Vercel Free Tier, Cloudinary Free Tier).

### Additional Requirements

**Architecture:**
- AR1: Use Next.js (App Router), TypeScript, Tailwind, Shadcn UI, Zustand for Frontend.
- AR2: Use Python FastAPI (Dockerized on Render) for Backend API.
- AR3: Use Supabase for Auth (Magic Link) and Database (Postgres).
- AR4: Use Cloudinary (2 accounts) for media management.
- AR5: Implement Hybrid Component Architecture (Atomic + FSD) on Frontend.
- AR6: Implement Layered Caching (In-memory, Supabase, CDN).
- AR7: Implement "menu_events" table with polymorphic association (dish_id or update_id).
- AR8: Implement Supabase RLS policies for data security.
- AR9: Implement FastAPI-Limiter for rate limiting.
- AR10: Use Sentry for monitoring/logging.
- AR11: Initialize project using `npx create-next-app` (Frontend) and Docker/FastAPI setup (Backend).

**UX Design:**
- UX1: "YumYum Standard" theme (Cream #fffbeb Background, Orange #e67e22 Primary) present in `/docs/yumyum_theme.css`.
- UX2: Vertical feed for dish discovery (Instagram-style).
- UX3: Horizontal story rings for Vendor Updates.
- UX4: Floating Action Button (FAB) for Cart with "bounce" animation.
- UX5: Double-tap on dish to add to cart (with heart animation).
- UX6: "Spring" drawer transition for cart summary.
- UX7: "Building Your Order" micro-animation before WhatsApp hand-off.
- UX8: "Proof of Growth" celebratory animations in Vendor Dashboard.
- UX9: Mobile-first responsive design (Thumb zones).

### FR Coverage Map

FR1: Epic 1 - Vendor Digital Brand Page (Profile foundation)
FR2: Epic 2 - Instagram-style Dynamic Menu
FR3: Epic 1 - QR Code Generator
FR4: Epic 2 - Client-Side Cart
FR5: Epic 2 - WhatsApp Ordering
FR6: Epic 4 - Vendor Metrics Dashboard
FR7: Epic 1 - Secure Vendor Login
FR8: Epic 3 - Vendor Updates
FR9: Epic 4 - Update Interactions (Analytics aspect)
FR10: Epic 5 - Contextual Local Discovery
FR11: Epic 4 - Feedback System
FR12: Epic 3 - Dish Management
FR13: Epic 1 - Profile Management

## Epic List

### Epic 1: Vendor Onboarding & Core Profile
**Goal:** Enable vendors to register, securely log in, set up their digital identity, and generate access points for customers, establishing the foundational "Digital Storefront".
**FRs covered:** FR1, FR3, FR7, FR13

### Epic 2: Vendor Menu & Updates Management
**Goal:** Empower vendors to maintain an attractive, up-to-date menu and leverage short-lived "updates" to drive daily engagement.
**FRs covered:** FR8, FR12

### Epic 3: Customer Menu Experience & Ordering
**Goal:** Provide customers with a blazing-fast, visually engaging menu browsing experience and a seamless, friction-free way to place orders via WhatsApp.
**FRs covered:** FR2, FR4, FR5

### Epic 4: Contextual Discovery & Customer Engagement
**Goal:** Increase ecosystem value by enabling non-intrusive discovery of other local vendors and their updates, fostering a hyperlocal network effect.
**FRs covered:** FR10

### Epic 5: Metrics Dashboard & Insights
**Goal:** Prove the platform's value to vendors by displaying actionable data on demand generation, menu engagement, and cost savings.
**FRs covered:** FR6, FR9, FR11

## Epic 1: Vendor Onboarding & Core Profile

**Goal:** Enable vendors to register, securely log in, set up their digital identity, and generate access points for customers, establishing the foundational "Digital Storefront".

### Story 1.1: Project Initialization & Vendor Auth

As a Vendor,
I want to securely log in to the YumYum platform using a Magic Link,
So that I can access my dashboard without remembering a password.

**Acceptance Criteria:**

**Given** the project repositories (Frontend & Backend) are initialized with the correct tech stack (Next.js, FastAPI, Docker)
**When** I enter my email address on the login page
**Then** I receive a magic link email from Supabase Auth
**And** clicking the link authenticates me and redirects me to the vendor dashboard
**And** the login page uses the "YumYum Standard" theme (Background: `#fffbeb`, Primary: `#e67e22`)
**And** the backend is running as a Dockerized FastAPI service

### Story 1.2: Vendor Profile Management

As a Vendor,
I want to set up my business profile details (Name, Category, WhatsApp Number, Location) from my dashboard,
So that my digital storefront accurately represents my business.

**Acceptance Criteria:**

**Given** I am a logged-in vendor
**When** I access the "Edit Profile" section from my dashboard
**Then** I can update my Name, Category (from a predefined list), WhatsApp Number, and Location (Lat/Long)
**And** the system generates a unique, URL-friendly `slug` based on my business name
**And** the data is saved to the `vendors` table in Supabase
**And** Row Level Security (RLS) ensures I can only edit my own profile

### Story 1.3: Public Vendor Page (Storefront Skeleton)

As a Customer,
I want to view a vendor's public profile page by visiting their unique URL,
So that I can see their name and details before browsing the menu.

**Acceptance Criteria:**

**Given** a vendor exists with a valid profile and slug
**When** I visit `yumyum.app/[vendor_slug]`
**Then** I see the vendor's Name, Category, and basic details displayed
**And** the page loads "blazing-fast" (SSG/ISR optimization)
**And** the page styling follows the "YumYum Standard" theme
**And** if the slug does not exist, I see a friendly 404 page

### Story 1.4: QR Code Generator

As a Vendor,
I want to view and download a QR code for my digital storefront from my dashboard and public page,
So that I can print it and display it for customers to scan.

**Acceptance Criteria:**

**Given** I am a logged-in vendor with a valid profile slug
**When** I view the "Share" or "QR Code" section of my dashboard or on my public page
**Then** I see a dynamically generated QR code pointing to my public URL (`yumyum.app/[vendor_slug]`)
**And** I can download the QR code image
**And** the QR code generation happens client-side or via a lightweight API to ensure zero cost

## Epic 2: Vendor Updates and Menu Management

**Goal:** Empower vendors to maintain an attractive, up-to-date menu and leverage short-lived "updates" to drive daily engagement.

### Story 2.1: Vendor Updates Creation

As a Vendor,
I want to post short-lived daily updates (like "Today's Special"),
So that I can drive immediate attention to specific items or announcements.

**Acceptance Criteria:**

**Given** I am a logged-in vendor
**When** I create a new "Update" from my dashboard
**Then** I can add a Title, optional Description, and optional Image
**And** I can set an expiration time (default 24 hours)
**And** the system prevents me from having more than 3 active updates at once (FR8)
**And** active updates are saved to the `vendor_updates` table

### Story 2.2: Displaying Updates (Story Rings)

As a Customer,
I want to see the vendor's active updates at the top of the menu,
So that I don't miss out on daily specials or important news.

**Acceptance Criteria:**

**Given** I am on a vendor's public page
**And** the vendor has active updates
**When** the page loads
**Then** I see horizontal "Story Rings" (UX3) at the top of the feed
**And** tapping a ring opens the update in a focused view
**And** viewing an update triggers an `update_view` event
**And** the rings use the "YumYum Standard" brand colors to indicate active status

### Story 2.3: Dish Management (CRUD)

As a Vendor,
I want to add, edit, and remove dishes from my menu from my dashboard,
So that my customers always see accurate offerings, prices, and availability.

**Acceptance Criteria:**

**Given** I am a logged-in vendor
**When** I choose to "Add Dish" from my dashboard
**Then** I can upload a photo (via Cloudinary widget), set a Name, Price, Description, Category, and Availability status
**And** the photo upload is optimized for web delivery
**And** upon saving, the dish appears immediately in my dashboard list and on my public page
**And** I can edit or delete existing dishes
**And** the UI uses "YumYum Standard" theme components.

### Story 2.4: Dynamic Menu Feed (Display Only)

As a Customer,
I want to browse the vendor's menu as a vertical, visually rich feed,
So that I can discover dishes in an engaging way similar to social media apps.

**Acceptance Criteria:**

**Given** I am on a vendor's public page
**When** the page loads
**Then** I see the vendor info, updates and grid of dishes sorted inorder with their category fetched from the `dishes` API in accordance to the priority set.
**Then** on clicking any dish a vertical feed of each dish scrollable.
**And** each dish card displays a high-quality image, name, price, and description
**And** images are lazy-loaded and optimized via Cloudinary for "blazing-fast" performance
**And** scrolling feels smooth and native-like on mobile devices
**And** a `menu_view` event is logged to the `menu_events` table in the backend

## Epic 3: Customer Menu Experience & Ordering

**Goal:** Provide customers with a blazing-fast, visually engaging menu browsing experience and a seamless, friction-free way to place orders via WhatsApp.

### Story 3.1: Add to Cart Interactions

As a Customer,
I want to easily add dishes to my cart using familiar gestures like double-tapping,
So that I can select items without interrupting my browsing flow.

**Acceptance Criteria:**

**Given** I am browsing the menu feed
**When** I double-tap a dish image
**Then** the item is added to my cart (state managed by Zustand)
**And** a "Heart" animation plays over the image (UX5)
**And** the Floating Action Button (FAB) "bounces" to indicate the addition (UX4)
**And** the FAB badge count updates immediately
**And** an `add_to_cart` event is logged to the backend
**And** I can also add items via a discrete "Add" button

### Story 3.2: Cart Drawer & Management

As a Customer,
I want to review my selected items and adjust quantities,
So that I can finalize my order before sending it.

**Acceptance Criteria:**

**Given** I have items in my cart
**When** I tap the Floating Action Button (FAB)
**Then** the Cart Summary opens as a bottom drawer with a "Spring" animation (UX6)
**And** I see a list of items with thumbnails, names, prices, and quantity controls (+/-)
**And** the total price is calculated and displayed in real-time
**And** if I decrease a quantity to zero, the item is removed from the cart

### Story 3.3: WhatsApp Order Hand-off

As a Customer,
I want to send my order to the vendor via WhatsApp with a single tap,
So that I can complete my purchase without installing any new apps.

**Acceptance Criteria:**

**Given** I am reviewing my cart in the drawer
**When** I tap the "Send Order on WhatsApp" button
**Then** a "Building Your Order" micro-animation plays (UX7)
**And** an `order_click` event is logged to the backend (North Star Metric)
**And** I am redirected to the WhatsApp app (deep link) with a pre-filled message
**And** the message contains my order details, total price, and vendor name in a clear, readable format

## Epic 4: Contextual Discovery & Customer Engagement

**Goal:** Increase ecosystem value by enabling non-intrusive discovery of other local vendors and their updates, fostering a hyperlocal network effect.

### Story 4.1: Discovery API & Logic

As a System,
I want to identify relevant "nearby" vendors for a given customer,
So that we can surface interesting local content without spamming.

**Acceptance Criteria:**

**Given** a customer is viewing Vendor A's menu (with known Lat/Long)
**When** the menu loads
**Then** a background request is made to `/api/v1/discovery`
**And** the API returns a list of other active vendors within 500m (configurable)
**And** vendors with "Category Affinity" (e.g., Coffee near a Bakery) are prioritized
**And** the current vendor (Vendor A) is excluded from the list
**And** extensive logging captures the search parameters and execution time to monitor performance
**And** this API is deployed and accessible

### Story 4.2: Discovery UI Integration

As a Customer,
I want to discover other interesting food options nearby,
So that I can explore my local food scene without leaving the app.

**Acceptance Criteria:**

**Given** the Discovery API is returning results
**When** I view the "Vendor Updates" ring (from Epic 3)
**Then** I see "Secondary Rings" for nearby vendors *after* the current vendor's updates
**And** these rings are visually distinct (smaller/muted) to not distract from the main vendor
**And** tapping a secondary ring shows a preview of that vendor's special
**And** this feature is deployed to production, enabling the "Network Effect"

## Epic 5: Metrics Dashboard & Insights

**Goal:** Prove the platform's value to vendors by displaying actionable data on demand generation, menu engagement, and cost savings.

### Story 5.1: Logging Infrastructure & Event Ingestion

As a Product Owner,
I want a robust, deployable event logging system (`menu_events` table and API),
So that we can immediately start capturing user behavior data for analysis and debugging, ensuring we don't fly blind.

**Acceptance Criteria:**

**Given** the Supabase database is active
**When** a user performs an action (view menu, add to cart)
**Then** the frontend sends a structured JSON payload to the `/api/v1/events` endpoint
**And** the backend validates the payload and writes it to the `menu_events` table
**And** Sentry logging is integrated to capture any ingestion errors immediately
**And** this infrastructure is deployed to production (Render/Supabase) and verified with a test event
**And** RLS policies allow authenticated insertion but restrict reading

### Story 5.2: Dashboard Skeleton & "Proof of Growth" Header

As a Vendor,
I want to see a personalized "Proof of Growth" statement on my dashboard,
So that I feel immediate validation that the platform is working for me.

**Acceptance Criteria:**

**Given** I have received some orders or views (captured via Story 4.1)
**When** I log into my dashboard
**Then** I see a "Proof of Growth" header (e.g., "🚀 5 new potential customers today!")
**And** the statement is generated dynamically based on real data from `menu_events`
**And** if data is sparse, a friendly "Getting Started" message is shown
**And** the UI uses "YumYum Standard" animations (e.g., a subtle rocket launch or pulse)
**And** this page is deployable and accessible to vendors immediately

### Story 5.3: Core Metrics Visualization

As a Vendor,
I want to see exactly how many orders and views I've received,
So that I can justify the value of using YumYum.

**Acceptance Criteria:**

**Given** the "Proof of Growth" header is live
**When** I view the dashboard
**Then** I see numeric cards for: "Orders Sent", "Menu Views", "Conversion Rate", and "Est. ₹ Saved"
**And** these numbers are calculated via performant aggregation queries on `menu_events`
**And** the "Orders Sent" card is visually emphasized (North Star Metric)
**And** clicking a card logs an interaction event (for our own product analytics)
**And** the data is cached appropriately to ensure the dashboard loads instantly

### Story 5.4: Top Dishes & Feedback System

As a Vendor,
I want to know which dishes are most popular and read customer feedback,
So that I can optimize my menu and improve my service.

**Acceptance Criteria:**

**Given** I have the core metrics dashboard
**When** I scroll down
**Then** I see a list of "Top 3 Viewed Dishes" and "Top 3 Added to Cart"
**And** I see a section for "Recent Customer Feedback" (collected via a simple form after the WhatsApp redirect)
**And** the feedback form is available to customers after they click "Send Order"
**And** this update is deployed, enriching the existing dashboard
