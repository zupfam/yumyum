# Project Brief: YumYum (v4 – Metrics-Driven MVP)

---

## Executive Summary

* **Concept:** YumYum is a mobile-first digital storefront for hyperlocal food vendors in India. It replaces static paper menus with an Instagram-style, vertical, visual menu that drives *measurable demand*.
* **Core Thesis:** YumYum is not a menu app. It is a **demand-generation and measurement engine** for street food vendors.
* **Problem:** Vendors operate blind. Printed menus are static, expensive, and generate zero data. Vendors don’t know how many people view their menu, what items attract attention, or whether digital tools actually increase sales.
* **Solution:** YumYum provides a blazing-fast digital storefront + a numbers dashboard that shows vendors **orders sent to WhatsApp**, menu engagement, and money saved.
* **Value Proposition:** For a small monthly fee, vendors get proof that YumYum drives customers, not just clicks.

---

## The Analog Trap: Why Paper Menus Hinder Growth

Street food vendors are stuck in an analog loop that leaks money daily.

### The Four Profit Leaks

1. **Recurring Printing Costs**

   * Reprinting menus for price changes, availability, or new items.
   * ₹300–₹1000/month silently burned.

2. **Zero Upselling**

   * No way to highlight best sellers, combos, or high-margin items.

3. **No Demand Visibility**

   * Vendors have no idea how many people looked at their menu vs ordered.

4. **No Customer Loop**

   * Happy customers leave with no way to re-engage them.

**Insight:** Vendors don’t need “tech”. They need **clarity and leverage**.

---

## Proposed Solution: YumYum Digital Storefront

### For Vendors (Primary Value)

* **Digital Brand Page:** A professional, mobile-first storefront accessed via QR code.
* **Instagram-Style Menu:** Vertical, visual scrolling that maximizes attention.
* **WhatsApp Ordering:** Zero workflow change. Orders land where vendors already operate.
* **Vendor Metrics Dashboard:** Clear proof of value via demand numbers.

**Outcomes:**

* More orders
* No printing costs
* Visibility into what actually sells

---

### For Customers

* Instant QR-based access (no app install)
* Visual, engaging menu experience
* Accurate pricing & availability
* Simple WhatsApp ordering

---

## Key Differentiator: Radical Simplicity

YumYum follows one principle:

> **If it doesn’t create a number that matters, it doesn’t exist.**

No complex POS. No payments (yet). No bloated dashboards.

---

## Target Users

### Primary Segment: Ambitious Street Food Vendors

* Owner-operated stalls, trucks, and takeaway joints
* Daily WhatsApp users
* Want growth, not complexity

### Secondary Segment: Cloud Kitchens

* Want to reduce dependency on high-commission aggregators
* Want direct customer demand visibility

---

## Success Metrics (North-Star Driven)

### The One Metric That Decides Everything

> **Menus scanned per Vendor per Day**

_must be configurable in the app_

* > 10/day → Strong signal
* 1–5/day → Needs optimization
* < 1/day → Value proposition broken

---

## MVP Scope (What We Build First)

### Core Features

1. Vendor Digital Brand Page
2. Instagram-style Dynamic Menu
3. QR Code Generator
4. **Client-Side Cart & Order Summary**

   * Customers can add multiple items to a cart
   * Review quantities and total price
   * One-tap **Send Order on WhatsApp** with a pre-filled, vendor-friendly message
5. Cart → WhatsApp Order Flow
6. Vendor Metrics Dashboard (Numbers Only)
7. Secure Vendor Login (Magic Link)

---

## Metrics Architecture (Single Source of Truth)

This section explains **exactly what is tracked, why it is tracked, how it is recorded, and how each metric is used** across Vendor, Founder, and Investor dashboards.

YumYum follows one strict rule:

> **If a metric does not help us decide “ship, fix, or stop”, it is not tracked.**

---

### Event-Based Tracking Model (Core Principle)

All analytics are powered by a **single append-only event table**: `menu_events`.

Why event-based?

* Prevents premature aggregation mistakes
* Allows new metrics to be derived later without schema changes
* Keeps infra simple and cheap

Every meaningful user action emits **exactly one event**.

---

### Canonical Events (Authoritative)

Below is the final, locked list of events. No additional events should be added without a clear business question.

---

#### 1. `menu_view`

**When it fires:**

* When a customer opens a vendor’s menu via QR scan or direct link

**Why it exists:**

* Measures raw demand / footfall
* Answers: *Are people even looking at this vendor?*

**Recorded as:**

```text
vendor_id, event='menu_view'
```

**Used in:**

* Vendor Dashboard → “Menu Views”
* Founder Dashboard → Activation & traffic baselines
* Investor Story → Demand volume

---

#### 2. `dish_view`

**When it fires:**

* When a dish card enters the viewport or is tapped for details

**Why it exists:**

* Measures attention distribution inside the menu
* Answers: *Which items attract curiosity?*

**Recorded as:**

```text
vendor_id, dish_id, event='dish_view'
```

**Used in:**

* Vendor Dashboard → Top viewed dishes
* Menu optimization decisions (pricing, photos, positioning)

---

#### 3. `add_to_cart`

**When it fires:**

* When a customer adds a dish to the cart

**Why it exists:**

* Measures intent creation
* Answers: *Did attention convert into desire?*

**Recorded as:**

```text
vendor_id, dish_id, event='add_to_cart'
```

**Used in:**

* Menu conversion rate
* Funnel drop-off analysis
* Vendor coaching (“people like it but don’t order”)

---

#### 4. `order_click` (⭐ North-Star Event)

**When it fires:**

* When a customer clicks “Send Order on WhatsApp”

**Why it exists:**

* Closest measurable proxy to revenue
* Answers: *Did YumYum create an order opportunity?*

**Recorded as:**

```text
vendor_id, event='order_click'
```

**Used in:**

* Vendor Dashboard → “Orders Sent to WhatsApp”
* Founder Dashboard → Product–market fit signal
* Investor Metrics → Demand engine narrative

**Important:**
This is the **single most important metric in the entire system**.

---

#### 5. `update_view`

**When it fires:**

* When a vendor update (Today’s Special / status) is shown

**Why it exists:**

* Measures visibility of vendor updates
* Answers: *Are customers noticing daily updates?*

**Recorded as:**

```text
vendor_id, update_id, event='update_view'
```

**Used in:**

* Update effectiveness tracking
* Ranking signals for discovery rings

---

#### 6. `update_click`

**When it fires:**

* When a customer taps a vendor update

**Why it exists:**

* Measures engagement beyond passive exposure
* Answers: *Did the update pull attention?*

**Recorded as:**

```text
vendor_id, update_id, event='update_click'
```

**Used in:**

* Update performance scoring
* Vendor messaging (“this update worked well”)

---

#### 7. `update_interest`

**When it fires:**

* Each bounded multi-tap interaction (max 5 per session)

**Why it exists:**

* Captures **intensity of intent**, not just binary interest
* Answers: *How badly do people want this?*

**Recorded as:**

```text
vendor_id, update_id, event='update_interest'
```

**Used in:**

* Update ranking
* “Popular today” signals
* Internal demand scoring (never raw counts shown)

---

#### 8. `feedback_submit`

**When it fires:**

* When a customer successfully submits feedback

**Why it exists:**

* Measures trust and emotional engagement
* Answers: *Do customers care enough to respond?*

**Recorded as:**

```text
vendor_id, event='feedback_submit'
```

**Used in:**

* Vendor trust indicators
* Paid Insights tier value

---

### What We Explicitly Do NOT Track

The following are intentionally excluded to avoid noise:

* `remove_from_cart`
* Scroll depth
* Time on page
* Raw like counts

**Reason:** These metrics do not change product decisions at this stage.

---

### How Metrics Power Each Dashboard

#### Vendor Dashboard

Purpose: **Payment justification and behavior change**.

Derived Metrics:

* Orders Sent = `count(order_click)`
* Menu Views = `count(menu_view)`
* Conversion Rate = orders / views
* Top Dishes = `dish_view` + `add_to_cart`
* Update Performance = `update_view` → `update_click`

---

#### Founder Dashboard

Purpose: **Truth, not motivation**.

Derived Metrics:

* Active Vendors (7-day metric aggregated dashboard)
* Avg Orders / Vendor / Day
* Retention Proxy (vendors with activity after 15 days)
* Vendor Segmentation:
_easily customizable in the app_
  * Power: ≥10 orders/day
  * Weak: 1–5 orders/day
  * Bad: <1 order/day

---

#### Investor Metrics

Purpose: **Narrative clarity**.

Derived Metrics:

* Total Orders Sent (monthly)
* Orders per Vendor per Day
* Active Vendor Ratio
* MRR vs Demand Growth
* Infra Cost per Vendor (~₹0)

---

### Final Metric Philosophy (Non-Negotiable)

> YumYum tracks **outcomes**, not curiosity.

Every metric exists to answer one question:

**Is YumYum creating measurable demand for vendors?**

If the answer is unclear, the metric is removed.

---

## Dashboards by Audience

> All dashboards are powered by the same event-based data. The difference is **presentation, not data**.

### 1. Vendor Dashboard (Sales Tool)

Displayed Metrics:

1. Orders Sent to WhatsApp
2. Menu Views
3. Menu Conversion Rate
4. Top 3 Viewed / Added Dishes
5. ₹ Saved on Printing

**Purpose:** Justify monthly payment.

---

### 2. Founder Dashboard (Truth Machine)

Core Metrics:

* Active Vendors (7-day)
* Avg Orders / Vendor / Day
* Vendor Retention (15-day)
* MRR
* Vendor Segmentation (Power / Poor / Poop)

**Purpose:** Decide ship, fix, or stop.

---

### 3. Investor Metrics (Story Layer)

* Total Orders Sent (Monthly)
* Active Vendor Ratio
* MRR Growth (MoM)
* Revenue per Vendor
* Infra Cost per Vendor (~₹0)

**Narrative:** YumYum is a demand engine, not a menu SaaS.

---

## Technical Architecture (MVP-Safe)

### Architecture Principles

* Jamstack
* Zero infra cost
* Single Supabase project
* Multi-tenant via RLS

---

### Tech Stack

* **Frontend:** Next.js, TypeScript, Tailwind, Shadcn UI
* **State:** Zustand
* **Backend:** Supabase (Auth, Postgres, APIs)
* **Hosting:** Vercel (Free Tier)
* **Media:** Cloudinary

---

## Database Schema (Canonical – Single Source of Truth)

The following schema definitions are authoritative. Any earlier references are superseded by this section.

### Vendors

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

### Vendor Social Accounts

```sql
create type social_platform as enum (
  'instagram',
  'facebook',
  'whatsapp',
  'youtube',
  'twitter',
  'website'
);

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

### Vendor Updates (Daily Attention Slots)

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

Rules:

* Maximum **3 active updates** per vendor
* Active = `now() between starts_at and expires_at`

### Update Interactions (Bounded Multi-Tap Interest)

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

### Dishes

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

### Menu Events (Analytics – Single Event Stream)

This table is the **behavioral backbone of YumYum**. Every metric, dashboard, and decision derives from this single event stream.

The design is intentional, strict, and must not be altered casually.

---

## Core Design Principle

`menu_events` models **user actions**, not entities.

A user action always happens in the context of **exactly one surface**:

* the menu as a whole
* a specific dish
* a specific vendor update

Instead of separate tables per surface, YumYum uses a **polymorphic event stream**.

This keeps analytics unified, extensible, and cheap to operate.

---

## Table Definition (Authoritative)

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

---

## Context Invariant (Non-Negotiable)

For every row in `menu_events`:

* At most **one** of `dish_id` or `update_id` may be non-null
* They must **never** be set together

This ensures each event has one and only one context.

### Enforced Constraint

```sql
alter table menu_events
add constraint one_context_only
check (
  (dish_id is null and update_id is not null)
  or (dish_id is not null and update_id is null)
  or (dish_id is null and update_id is null)
);
```

---

## Event Context Matrix

| Event           | dish_id | update_id | Meaning                  |
| --------------- | ------- | --------- | ------------------------ |
| menu_view       | null    | null      | Menu opened              |
| dish_view       | set     | null      | Dish viewed              |
| add_to_cart     | set     | null      | Dish added to cart       |
| order_click     | null    | null      | WhatsApp order initiated |
| update_view     | null    | set       | Vendor update shown      |
| update_click    | null    | set       | Vendor update opened     |
| update_interest | null    | set       | Interest tap             |
| feedback_submit | null    | null      | Feedback submitted       |

Any deviation from this table is a bug.

---

## Why Dish and Update Are Separate Dimensions

Dish events represent **transactional intent** (what a customer may buy).

Update events represent **promotional intent** (what shapes choice today).

Separating these allows YumYum to answer questions like:

* Do updates increase dish views?
* Which updates lead to orders?
* Which dishes perform better when highlighted?

---

## Implementation Guidelines (Mandatory)

1. **Emit exactly one event per user action**. No batching.
2. **Events are written at interaction time**, never inferred later.
3. **Send raw events only**. Aggregation happens in SQL.
4. Duplicate events are acceptable; correctness is statistical.

---

## Dashboard Usage

### Vendor Dashboard

* Orders Sent = count(order_click)
* Menu Views = count(menu_view)
* Conversion = orders / views
* Top Dishes = dish_view + add_to_cart
* Update Performance = update_view → update_click → update_interest

### Founder Dashboard

* Activation = first order_click
* Retention proxy = activity after 15 days
* Segmentation by order volume

### Investor Metrics

* Total demand generated
* Demand per vendor
* Growth over time

---

This structure matches industry-standard event modeling and should be treated as final. All dashboards and analytics derive exclusively from `menu_events`.

---

## Security Model

* Supabase Magic Link Auth
* Row Level Security (vendor_id = auth.uid())
* No cross-vendor access possible

---

## Operating Constraints

* Zero paid infrastructure
* Manual vendor onboarding
* Manual subscription collection
* Manual migrations

---

## Validation Plan (30-Day Sprint)

**Success Criteria:**

* 5 paying vendors
* Avg ≥3 orders/day/vendor
* ≥30% 15-day retention
* At least one unsolicited vendor testimonial

**Failure = Pivot or Stop**

---

## Final Positioning

> YumYum helps street food vendors **see demand, capture it, and grow it** — using the tools they already trust.

---

**Status:** Ready to build, test, and validate.

---

## X-Factors & Growth Levers (Final)

YumYum’s advantage comes from **behavioral signals**, not social gimmicks. All growth levers are designed to:

* Increase vendor retention
* Improve customer choice
* Avoid spam, gaming, and trust erosion

---

### X-Factor 1: Proof of Growth (In-App)

**What it is:**
Auto-generated, positive performance statements shown prominently in the vendor dashboard.

**Examples:**

* “YumYum sent **43 customers** to your WhatsApp this week 📈”
* “Your menu is trending better than last week 💪”

**Logic:**

* Based on `order_click` events
* Compared week-over-week or over a selected date range
* Messaging is always neutral or positive (no negative deltas shown)

**Purpose:**

* Creates pride and habit
* Makes ROI obvious
* Reinforces payment justification

---

### X-Factor 2: Founder-Controlled WhatsApp Performance Reports

**What it is:**
A manual, founder-operated reporting console that generates WhatsApp-ready performance messages.

**Workflow:**

1. Founder selects start date, end date, and vendors (all or multi-select)
2. Clicks **Generate Reports**
3. System aggregates metrics per vendor
4. Each report is sent to a Lark webhook, one vendor at a time
5. Founder manually copy-pastes reports into vendor WhatsApp chats

**Why manual first:**

* Zero WhatsApp policy risk
* Full control over cadence and tone
* High qualitative feedback loop

**Sample Message:**

```
📊 YumYum Performance Report
Period: {{start}} → {{end}}

• Menu views: {{menu_views}}
• Orders sent: {{orders}}
• Top item: {{top_item}}

YumYum is working for you 💪
```

---

### X-Factor 3: Vendor Updates (Daily Attention Slots)

**What it is:**
Short-lived, high-visibility updates that shape customer choice in real time.

**Rules:**

* Maximum **3 active updates per vendor**
* Automatically expire (default 24 hours)
* Always displayed at the top of the menu

**Use Cases:**

* Today’s special
* Limited offers
* Sold-out notices
* Closing early

**Tracking:**

* `update_view`
* `update_click`

---

### X-Factor 4: Bounded Multi-Tap Interest (Medium-style, Controlled)

**What it is:**
A lightweight intent signal inspired by Medium claps, redesigned for high-trust, no-login environments.

**Customer Behavior:**

* Customers can tap an update up to **5 times** to express interest
* Visual feedback on each tap
* No visible counters shown to customers

**System Rules:**

* Interest is tracked per anonymous session
* One session can contribute a maximum of 5 taps per update
* Raw counts are never exposed publicly

**Purpose:**

* Captures intensity of demand
* Improves update ranking
* Resists spam and gaming

---

### X-Factor 5: Contextual Local Discovery (Non-Distracting)

This section explains **exactly how YumYum selects and ranks “other vendor updates”** shown to a customer, with the goal of **delight without distraction**.

The core constraint is non-negotiable:

> When a customer scans a vendor’s QR, their primary intent is to order from *that vendor*.
> Secondary discovery must add context, not steal attention.

---

## Conceptual Model

YumYum does **not** have a global feed.

Instead, it generates a **contextual discovery slice** at request time, scoped to:

* Current vendor
* Physical proximity
* Time (what’s active *right now*)

This ensures relevance, fairness, and vendor trust.

---

## Visual Hierarchy

1. **Primary Ring (Emphasized)**

   * Always the current vendor’s active updates (up to 3)
   * Largest size, branded

2. **Secondary Rings (De-emphasized)**

   * Updates from other vendors
   * Smaller, muted styling
   * No prices, menus, or comparisons shown

This hierarchy ensures conversion is never compromised.

---

## Selection Logic (Step-by-Step)

### Step 1: Anchor on the Current Vendor

Input context:

* `current_vendor_id`
* `current_vendor.latitude`
* `current_vendor.longitude`
* `current_vendor.category`

Primary updates are fetched **only** for this vendor.

---

### Step 2: Proximity Filter (Hard Constraint)

Only vendors within a walkable radius are considered.

Default radius:

* **500 meters** (configurable)

Logic:

* Distance calculated using stored latitude/longitude (Haversine)
* Vendors outside radius are excluded

This guarantees hyperlocal relevance.

---

### Step 3: Category Affinity (Soft Constraint)

YumYum prefers **complementary categories**, not direct competitors.

Examples:

* Ice cream → café, bakery, dessert
* Café → bakery, dessert
* Bakery → café, dessert

Rules:

* Complementary vendors are ranked higher
* If insufficient matches exist, category filtering is relaxed

This preserves vendor trust while still avoiding empty states.

---

### Step 4: Update Eligibility Filter

Only vendors with **active updates** are eligible.

Active update criteria:

* `now() between starts_at and expires_at`
* Maximum 3 updates per vendor

Stale or inactive vendors are never shown.

---

### Step 5: Popularity & Freshness Scoring

Eligible updates are ranked using a simple, explainable formula:

```
score =
  (interest_count * 2)
+ (update_clicks_last_24h * 1)
+ (recency_boost)
```

Where:

* `interest_count` = bounded multi-tap intent
* `update_clicks_last_24h` = engagement signal
* `recency_boost` = +3 if created within last 6–12 hours

No machine learning. No black boxes.

---

### Step 6: Final Selection

* Top **3 scoring updates** are selected
* Only one update per vendor is shown
* The same vendor never appears twice in secondary rings

This ensures diversity and fairness.

---

## What Customers See vs What the System Uses

### Customers See:

* Visual rings
* Subtle labels like “Popular nearby” or “Happening today”
* No numbers, no rankings, no leaderboards

### System Uses:

* Exact counts and scores
* Historical engagement data
* Time decay

This separation avoids gaming and comparison anxiety.

---

## Guardrails (Intentional Limits)

The following are explicitly disallowed:

* Global feeds
* Infinite scrolling
* Price-based ranking
* Ratings or reviews in discovery
* Showing competitor menus directly

These guardrails preserve YumYum’s vendor-first positioning.

---

## Why This Works (Design Rationale)

* Customers feel local vibrancy without being overwhelmed
* Vendors gain exposure without losing their own customers
* Discovery emerges organically from real behavior

This turns YumYum from a static menu into a **living local surface**.

---

**Summary:**

Other vendor updates are selected using **proximity, relevance, activity, and real intent signals**, applied conservatively to maximize delight while protecting conversion.

---

### X-Factor 6: Campaigns Without Owning Customer Data

YumYum does **not** send messages to customers.

Instead, YumYum enables marketing through:

* Menu-based campaigns (specials, banners)
* Suggested WhatsApp message templates for vendors
* In-menu prompts and highlights

This preserves trust while still enabling repeat engagement.

---

## Customer Data & Feedback (Ethical + Monetizable)

**Principle:** YumYum never sells or exposes raw customer contact data.

### Feedback System

* Customers can submit feedback inside YumYum
* Free tier: feedback count + sentiment summary
* Paid Insights tier: full feedback text + response tools

---

## Final Founder Positioning

> YumYum does not own customers.
> YumYum owns **the moment of intent**.

By capturing intent intensity, shaping attention, and proving value with numbers, YumYum becomes indispensable to hyperlocal food vendors.

---

**Status:** Finalized. Ready for execution, validation, and revenue.
