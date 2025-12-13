# YumYum

> yumyum.zupfam.com/{vendor-slug}

Why
No digital menu for local street food vendors
Stepping stone for going digital: Dream Big

What
Custom Branded Menu
Personalised Digital Store Portfolio
Instore digital experience
Review Collection Focussed

Who
Hyperlocal food vendors
Cloud Kitchens

How
Experience
Scenario : Al Taiba Chicken

Without yummy

1. Customer walks in
2. Asks for menu (- cost of printing the menu)
3. Decides to take wings (- out of wings today; bad experience; need dynamic menu)
4. Chooses to go pizza but sees outdated price (- need dynamic prices)
5. Gives money (- can't upsell; need a salesman)
6. Takes the order (- no customer data)
7. Say's it's good (- no official feedback taken)
8. Can't recall repeat customers (- no marketing scheme)

Selling Points

- Save cost of printing the menu
  - Dynamic Menu
  - Dynamic Pricing
  - Best User Experience
- Increase Sales & Marketing
  - 24x7 upsell machine
  - Get customer WhatsApp contact
  - Real reviews on social platforms

Features 0. Super easy: WhatsApp, Instagram, Google Sheets

1. Dynamic Menu and Pricing: Save unnecessary printing costs
2. Customer Data: Boost marketing with WhatsApp
3. Brand Page: Increase your digital footprint
4. Daily Status, Announcements, Offers, Games: Keep Customers Engaged always
5. Feedback: Boost review, ratings and sales from real customers

---

primary goals

1. UI

- Instagram style. People are adopted to the use of insta and I want to make YUMYUM the instagram of
  hyperlocal street food menu.
- Beautiful applealing branded ui both to the founder and customer
- Blazing fast and delightful UX
- Use magic ui, aceternity, reactbits and other beautiful UI component libraries
- This should be a complete acceptable product, providing real value and earning real money

2. Tech Stack

- Next JS, React, Shadcn UI frontend
- Google Sheets Backend
- Communication on frondend backend with Google APIs/ URL export=csv

3. Entities

- Vendor (owner of the food stall)
- Brand (the company name of the food stall itself)
- Customer (person who buys from the brand)
- YumYum team

4. Accessibility

- This is a mobile first app
- I'll install a QR code on the brand stall so customers can scan ans get the detail.
- While scanning I must make sure, if internet is present. if yes load the site (happy flow).
- If internet isn't avaiable the QR code must have the menu offline data as fallback

5. Requirements
   A. The Vendor must be able to

- Add his brand name
- Add whatsapp, google my business, instagram, facebook, youtube and max 4 custom links
- Add payment link, connecting to his UPI page deep link app.
- Need to have a small bio page for about the brand
- Set daily status for offers, updates or announcements
- Easy to use
- Add Category of Dish and dishes (eg: Pizza: Marghreta Pizza, Chicken Cheese Pizza)
- Add upselling dishes logic (eg: the cart page must have upsell addons like best sellers and stuff)
- Add best seller, chef special

B. Dish

- Each dish must have name, description, price, image, short video, prep time, bestseller/chef special
  tag(optional).
- Each dish can be like an instagram reel vertically scrollable
- On horizontal scroll the user can switch category
- we can display the categories in the top like must try, pizza, burger, juices, et cetera.
- so users can scroll categories horizontally, and view it's each item vertically, scroll
- users can also add a dish to their cart. This is stored on local storage.

C. Cart

- a cart will be built when user select a dish, add to cart.
- the car will have the items selected and also uses can choose the quantity
- the car must display all the items and also the potential total cost
- the CTA for cart would be place the order on WhatsApp
- when user click it, the entire order will be pasted as a WhatsApp text on the vendors, WhatsApp

6. Analytics.

- we need to hook up Google analytics to measure key metrics
- this app will be multitenant where each vendor can be just a part variable
- we need to measure analytics across all our tenants for the various button clicks and also interactions of
  users
- the analytics will help us convince vendors for payment. Need to be gold oriented and focused.

7. Feedback

- uses can also give feedback to the vendor
- incentivise the user for feedback. Craft out a unique way where vendor is also not burden and user is also
  incentivised. And also for the user incentive, if it requires something from the vendor, it should have a
  proof. It need not always be a monetary incentive. Can be a better UX too, but something that makes user
  privileged and appreciated. You can be innovative here.
- 1st collect what's the experience in stars / 5
- if <4 , change state to sorry for the experience, have an optional text box, CTA should be WhatsApp the
  vendor
- if >=4, prompt user to give a review on Google, or post to share on Instagram or any other method that
  vendor chooses. Give happy experience with the user incentivised.

8. Success

- on board three clients with at least 999 rupee MRR
- Bring value to vendor and customer.

---

1.  Executive Summary

Draft:
YumYum is a mobile-first digital menu platform designed to be the "Instagram for hyperlocal street food." It
provides vendors with a beautiful, custom-branded, and blazing-fast digital storefront, managed easily
through a Google Sheets backend. The project solves the key problems of static printed menus, missed
upselling opportunities, and a lack of customer data by offering a dynamic menu, integrated customer
feedback channels, and basic analytics. The primary value proposition is to provide a complete, valuable,
and monetizable product that boosts a vendor's digital presence and increases their sales.

---

- Yeah, we are targeting food trucks, independent Street Food vendors
  - it is Instagram for hyperlocal food menus
  - the vendors are not much tax savvy. This know how to operate WhatsApp, Instagram, and some part of Google
    sheets(let me know if there any other alternatives to Google sheets. The part is, I don't want to invest on
    making backend and deploying it for money plus Google sheets has auth).
  - Instagram focused elements would be reels, statuses, bio, social media links, and cart. Predominantly the
    rich scrolling media viewing behaviour.

# Project Brief: YumYum

## Executive Summary

- **Concept:** YumYum is a mobile-first digital storefront that brings the fast, visual, and interactive experience of apps like Instagram to the world of hyperlocal food. It focuses on a "reels-style" vertical scrolling menu to maximize engagement.
- **Problem:** Street food vendors rely on static, costly printed menus, which prevents dynamic pricing, limits upselling, and offers no channel for customer data collection or feedback.
- **Solution:** We provide vendors with a custom-branded, high-performance web app, easily managed via a familiar Google Sheets interface. Key features include a dynamic menu, WhatsApp order integration, and a feedback system designed to boost positive reviews on social platforms, directly increasing a vendor's visibility and sales.
- **Value Proposition:** For a monthly fee, YumYum gives vendors a powerful tool to increase sales, cut printing costs, and build a digital brand, justifying the investment through clear ROI.

## The Analog Trap: How Printed Menus Cost You Money and Customers

Vendors are caught in an "Analog Trap," using outdated paper menus that actively drain profits and lose customers daily.

- **FOR THE VENDOR: The Four Profit Leaks**
  - **1. Direct Printing Costs:**
    - **Pain:** Wasting money on re-printing menus for every small change.
    - **Value:** Eliminate this recurring expense permanently.
  - **2. Zero Upselling, Lost Revenue:**
    - **Pain:** Missing the chance to increase order value with automated suggestions for add-ons or combos.
    - **Value:** Gain a 24/7 digital salesman to boost every customer's bill.
  - **3. No Customer Data, No Repeat Business:**
    - **Pain:** A happy customer leaves forever because you have no way to contact them again.
    - **Value:** Capture customer WhatsApp numbers to drive repeat sales and loyalty.
  - **4. No Social Proof, No Free Marketing:**
    - **Pain:** Good feedback is not captured and converted into 5-star Google reviews that attract new customers.
    - **Value:** Turn your best customers into your most powerful marketing engine.

## Proposed Solution: Your Digital Storefront

We are building YumYum, a beautiful and blazing-fast digital storefront designed specifically for India's hyperlocal food vendors.

- **FOR THE VENDOR: More Sales, Less Effort**
  - **The Tool:** A custom-branded digital menu that you control from a simple Google Sheet. If you can edit a spreadsheet, you can run your digital store.
  - **The Result:**
    - **Increase Sales:** Use a dynamic menu with photos, videos, and upselling prompts to sell more.
    - **Save Money:** Stop printing menus forever. Update prices and items instantly, anytime.
    - **Build Your Brand:** Get a professional, beautiful webpage that builds trust and attracts customers.
    - **Get Customer Data:** Collect WhatsApp numbers to announce offers and bring customers back.

- **FOR THE CUSTOMER: A Modern Menu Experience**
  - **The Tool:** An instant, app-like experience on their phone, accessed via a simple QR code scan.
  - **The Result:**
    - **Visual & Engaging:** A menu that looks and feels like Instagram, with vertical scrolling through dishes.
    - **Always Accurate:** See today's real menu, real prices, and daily specials.
    - **Simple Ordering:** Add items to a cart and place the order directly on the vendor's WhatsApp.

- **OUR KEY DIFFERENTIATOR: Radical Simplicity**
  - While other solutions are complex and expensive, YumYum is built on a single principle: **powerful results from simple tools.** We are not just another menu; we are a complete, easy-to-use business growth tool for the street food vendor.

## Target Users: Our Core Focus

- ### Primary User Segment: The Ambitious Street Food Vendor
  - **Who they are:** Owner-operators of food stalls, trucks, and small takeaway joints. Not tech-experts, but use WhatsApp and Instagram daily.
  - **Their Goal:** To grow their business, increase their daily income, and build a respected local brand.
  - **Their Pains (Our Opportunity):** Frustrated by printing costs, know they could be making more money, and want a simple way to get a digital presence.

- ### Secondary User Segment: The Savvy Cloud Kitchen
  - **Who they are:** Delivery-only kitchens reliant on high-commission food aggregator apps.
  - **Their Goal:** To increase profit margins by bypassing high aggregator commissions and building a direct customer relationship.
  - **Their Pains (Our Opportunity):** Losing 25-40% of revenue to commissions and having no ownership of their customer data.

## Goals & Success Metrics (v2)

- ### 1. Business Objectives (YumYum's Growth)
  - **Phase 1: Rapid Market Entry (Launch - 1 Month)**
    - Onboard **1+ paying vendor** (@ ₹500+ MRR) within **3 days** of launch.
    - Onboard **5+ paying vendors** (@ ₹1k+ MRR) within **1 month**.
  - **Phase 2: Niche Finalization (By Nov 30th)**
    - Analyze data from initial vendors to identify and lock in our most profitable and scalable customer niche.
  - **Phase 3: Niche Domination (Starting Dec 1st)**
    - Become the #1 digital menu provider within our chosen niche and begin exploring strategic collaborations.

- ### 2. Public Growth Objectives (The "Build in Public" Strategy)
  - **Primary Goal:** Document the entire journey to build a personal brand and attract opportunities.
  - **Content Velocity:** Publish **2+ pieces of content** per week.
  - **Audience Growth:** Achieve **1,000+ engaged followers** on a primary social platform within 3 months.
  - **Networking:** Build valuable, authentic connections with other founders, investors, and potential partners.

## MVP Scope: What We Will Build First (v2)

- ### Core Features (Must-Haves for Launch)
  - **1. Vendor Brand Page:** A beautiful, mobile-first digital storefront.
  - **2. Dynamic Menu:** An "Instagram-style" menu controlled by the vendor.
  - **3. Google Sheets Backend:** Radical simplicity for menu management.
  - **4. QR Code Generator:** The gateway for customers to access the menu.
  - **5. Cart & WhatsApp Ordering:** Closes the order loop using the vendor's existing workflow.
  - **6. Vendor Value Analytics:** A simple, clear report showing the vendor the value they are getting from YumYum. This is the tangible **proof of value**.

- ### MVP KPIs & Core Metrics (The Numbers We Will Track)
  - **`menu_views`**: Total unique visitors to the menu.
  - **`top_5_items`**: The most viewed/clicked-on menu items.
  - **`add_to_cart_clicks`**: How many times items are added to a cart.
  - **`order_placed_clicks`**: The critical conversion metric—how many times the "Place Order on WhatsApp" button is clicked.
  - **`feedback_clicks`**: How many customers engage with the feedback flow.

## Post-MVP Vision: Where We Go Next

- ### Phase 2 Features (The Next 6 Months)
  - Interactive Analytics Dashboard
  - Customer Messaging (WhatsApp Broadcast)
  - Smarter Upselling
  - Simple Loyalty Program
  - Automated Ordering via Telegram/Other

- ### Long-Term Vision (The 1-2 Year Goal)
  - Become the indispensable digital "Operating System" for hyperlocal food vendors, including features like inventory tracking, supply chain connections, and actionable business insights.

## Technical Considerations: The Tech Stack (v3 - Final)

- ### Core Technology Stack
  - **Frontend:** Next.js, Shadcn UI, Aceternity UI, Magic UI.
  - **Backend (Data Source):** A published, read-only Google Sheet.
  - **Hosting:** Vercel for our Next.js frontend.

- ### Analytics & KPI Infrastructure
  - **Primary Tool:** Google Analytics 4 (GA4).
  - **Multi-tenancy Tracking Strategy:** Use a `vendor_id` as a GA4 Custom Dimension to allow for per-vendor reporting.

- ### KPI Formulas & Definitions
  - **`Menu Conversion Rate`**: `(Total 'order_placed_clicks' / Total 'menu_views') * 100%`.
  - **`Top Performing Item`**: The menu item with the highest number of `add_to_cart_clicks`.
  - **`Vendor Churn Rate`**: `(Vendors who cancelled in a period / Total vendors at the start of the period) * 100%`.
  - **`MRR`**: The sum of all active monthly subscription fees.

- ### Real-time Data for Vendors
  - **MVP Plan:** Provide a bi-weekly manual report (PDF) sent directly to the vendor's WhatsApp.

## Operational Playbook & Metrics

- ### Part 1: Pre-Onboarding - Vendor Discovery Questions
  1.  "Can you walk me through your process from when a customer arrives to when they leave?"
  2.  "Tell me about the last time you had to update your menu or prices. What was that like?"
  3.  "What are the biggest day-to-day frustrations you face?"
  4.  "Have you ever tried any other digital tools? How did that go?"

- ### Part 2: Post-Onboarding - Key Performance Metrics (15-Day Review)
  - **Vendor Success:** Activation, Menu Richness, Feature Adoption.
  - **Business Health:** MRR, Active Vendors, Churn Rate, CAC.
  - **"Build in Public" Content:** Follower Count, Engagement Rate, Content Velocity.

- ### Part 3: Vendor Success & Feedback Questionnaire (Quarterly Check-in)
  1.  "What has been the biggest positive impact on your business from YumYum?"
  2.  "Are you seeing more customer feedback or repeat customers?"
  3.  "On a scale of 0-10, how likely are you to recommend YumYum?" (NPS)

- ### Part 4: Maintenance SOPs (v2)
  - **Automated Daily Media Cleanup Script:** A centralized GitHub Actions workflow will run daily to find and delete any media files in Cloudinary that are no longer referenced in any vendor's Google Sheet, using a secure credential lookup process.

## Product & UI Design

- ### Part 1: Data Model (The Google Sheet Structure) (v2)
  - **Admin Sheet (`Admin_Config`):** Contains `vendor_slug`, `vendor_sheet_url`, and a non-sensitive `cloudinary_account_id`.
  - **Vendor Sheet:** Contains `Brand_Info`, `Menu_Items`, and `Categories` tabs.

- ### Part 2: Media Handling Strategy (v2)
  - **Service:** Cloudinary will be used for all image and video hosting.
  - **Process:** Vendors upload media to their assigned Cloudinary account (managed manually by the admin) and paste the URL into the Google Sheet.

---

# 🍽️ Food Menu Wireframe (Instagram Profile Style)

---

## [LOGO / BRAND AREA]

**Brand Logo** : With status bubble if status is available  
**Brand Cuisine Tag** : A tag to specifiy the brand cuisine eg: fried chicken
**Brand Name**

**Social Links multi row** : With subtle microanimations

- 🥘 All the social links present in the brand tab

**Bio Text:**

> "Serving the best fusion meals in town. Fresh ingredients, local flavors."

---

## [CATEGORY HIGHLIGHTS] (Story-style circular buttons)

| 🍔 Specials | 🍕 Pizzas  | 🍣 Burgers | 🥗 Salads  | 🍰 Desserts |
| ----------- | ---------- | ---------- | ---------- | ----------- |
| Circle img  | Circle img | Circle img | Circle img | Circle img  |

Each circle = clickable link to filtered menu section.

---

## [NAVTAB ICONS]

Let's make this functional
! Open Points: I want to sort the menu with price how do I show the functionality in UI?
Search Menu Button: We can have a explore menu button that opens up menu in reel format. Full screen vertical scrolling with horizontal scrolling for categories
Cart Button: We can have the cart state here.
Only Veg Toggle: A toogle switch that will filter out only the veg dishes

---

## [MENU GRID] (Dishes as posts)

| Dish Image | Dish Image | Dish Image with yellow pulsing dot overlay when tag!=normal|

Repeat grid of dishes below.

Dish Grid (Main Menu Section)

- 3-column image grid layout, identical to Instagram posts.
- Each “post” = one dish card containing:
  • Dish Image (square)
  • yellow pulsing dot overlay when tag!=normal
- Clicking a dish opens the full vertical reels page, with clear back arrow
  • We have a horizontal tab on the top for categoies
  • Vertical scrolling gives the next dish, when the category is complete the next begins, continous scrolling
  • Double tap on each dish adds to the cart
  • the image shows up first and on long press the video plays
  • On the reel we have name in the bottom, price, and tag
  • We have a Cart button, Share Button, Description button
  • On clicking the description the bottom drawer opens with Full description and additional details
  • There is a cart symbol on the top right corner to lead to the checkout page.

---

### Notes for Implementation

- Responsive layout → mobile-first.
- Buttons have slight shadows, pill shape.

---
