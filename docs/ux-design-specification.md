# YumYum UX Design Specification

## 1. Design Philosophy
- **Instagram-Style:** Familiar vertical scrolling (reels) for dishes.
- **Mobile-First:** Optimized for QR code entry and one-handed use.
- **Rich Media:** High-quality images and autoplaying videos to drive appetite.

## 2. Component Design

### Brand Header
- Circular brand logo with a "status" ring if updates are available.
- Minimalist typography for name and cuisine.

### Category Highlights
- Horizontal scrolling "stories" icons for quick navigation between categories (e.g., Pizza, Burgers).

### Dish Cards
- 3-column grid (post-style).
- Visual indicators (pulsing dots) for featured or special items.

### Reel View (Full-Screen)
- Full-screen media (image or video).
- Bottom overlay for dish name, price, and description.
- Prominent "Add to Cart" call-to-action.

## 3. Core Workflows

### Ordering Workflow
1.  **Discovery:** Browse via grid or reels.
2.  **Selection:** Add to cart (doube-tap on reel or click button).
3.  **Review:** Open bottom drawer to view cart and total.
4.  **Checkout:** Click "Place Order on WhatsApp" to initiate deep link.

### Authentication (Vendor)
- Passwordless login via Magic Link sent to email.
- Automatic redirect to dashboard upon verification.

## 4. Visual Styles
- **Primary Color:** `#3b82f6` (Blue-600) for actions.
- **Accent Color:** `#fbbf24` (Yellow-400) for featured items.
- **Backgrounds:** Clean white or subtle blur for overlays.
