# UX Design Specification: YumYum

## 1. Design Philosophy: "Instagram for Hyperlocal Food"

The core UX goal is to mimic the familiar, addictive, and visual nature of Instagram. Users should feel like they are browsing reels or stories, not a static menu.

### 1.1 Core Principles
*   **Visual First:** High-quality images and short videos (reels) are the primary focus.
*   **Blazing Fast:** Instant load times and smooth transitions are non-negotiable.
*   **Mobile-First:** Designed primarily for one-handed thumb navigation on mobile devices.
*   **Radical Simplicity:** Minimal cognitive load; ordering should feel effortless.

## 2. Visual Identity & UI Components

### 2.1 Aesthetic
*   **Modern & Polished:** Use a clean, vibrant color palette (brand-specific).
*   **Dynamic Components:** Utilize libraries like Magic UI, Aceternity UI, and Reactbits for animations and interactive elements.
*   **Shadcn UI:** Base components for reliability and accessibility.

### 2.2 Branding (Vendor Page)
*   **Brand Logo:** Circular, with a "status" ring if an active update exists.
*   **Brand Name & Bio:** Concise, social-style header.
*   **Social Links:** Subtle, animated icons for WhatsApp, Instagram, Google My Business, etc.

## 3. User Journeys & Screens

### 3.1 Home Screen (Brand Page)
*   **Category Highlights:** Story-style circular buttons for quick filtering (e.g., "Must Try", "Pizza", "Burgers").
*   **Dish Grid:** 3-column Instagram-style grid.
*   **Pulsing Dot Overlay:** Indicates special tags (e.g., "Best Seller", "Chef's Special").

### 3.2 Menu Experience (The "Reels" View)
*   **Vertical Scrolling:** Smooth vertical transition between dishes within a category.
*   **Horizontal Category Switching:** Swipe horizontally to jump between categories (e.g., from Pizza to Drinks).
*   **Full-Screen Media:** Large dish image/video with bottom-aligned info (Name, Price, Tags).
*   **Interactive Overlays:**
    *   **Cart Button:** Add to cart (plus double-tap gesture).
    *   **Share Button:** Native sharing.
    *   **Description Drawer:** Bottom drawer for detailed info, preparation time, and ingredients.
*   **Long Press:** Play video preview (if available).

### 3.3 Cart & Ordering
*   **Floating Cart Icon:** Shows current quantity.
*   **Cart Drawer/Page:** Lists selected items, quantities, and potential total cost.
*   **Upsell Section:** "Best Sellers" or "Pairs well with..." suggestions.
*   **CTA: "Place Order on WhatsApp":** Triggers the WhatsApp deep link with a formatted message.

### 3.4 Feedback System
*   **Incentivized Flow:** Simple star rating (1-5).
*   **Conditional Branching:**
    *   **< 4 Stars:** Apology message + text box for direct vendor feedback.
    *   **>= 4 Stars:** Celebration + prompt to review on Google/Instagram.

## 4. X-Factors (Engagement)

*   **Daily Status/Updates:** Vertical stories for today's specials or announcements.
*   **Bounded Multi-Tap Interest:** Customers can tap a "special" up to 5 times to express excitement.
*   **Contextual Local Discovery:** De-emphasized "nearby specials" rings to encourage local exploration without distracting from the current vendor.

## 5. Technical Accessibility
*   **Offline Fallback:** QR codes should ideally handle cases with poor internet by storing basic menu data.
*   **Zero App Install:** Must remain a web-based experience.
