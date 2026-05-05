# YumYum: The Street Food Discovery Portal (V1)

## 1. Product Vision
YumYum is the "Zomato for Street Food" in Bangalore. It bridges the gap between high-quality street food vendors (who are mobile and unorganized) and modern, Instagram-savvy consumers.

## 2. Target Users
- **Consumers:** Looking for authentic local food near them, verified by visuals (Reels).
- **Vendors:** Mobile food carts and stalls looking for visibility and "pro" branding without the high commissions of Swiggy/Zomato.

## 3. Core Features

### For Consumers (The Discovery Portal)
- **Hyperlocal Search:** Finds active vendors within walking distance using real-time GPS.
- **Visual-First Discovery:** High-engagement "Reels" section showcasing dishes before you visit.
- **Popularity Tiers:** Highlights the most visited stalls in the city.
- **Seamless Navigation:** One-tap integration with Google Maps to reach the stall.
- **Direct Contact:** Quick links to WhatsApp/Call for inquiries.

### For Vendors (The Hub)
- **Zero-Friction Signup:** Passwordless login via Magic Link; instant account creation.
- **60-Second Onboarding:** Simple stall profile setup (Name, Cuisine, Logo).
- **Live Vending Toggle:** One-button "Start Vending" that pings the vendor's GPS location to the portal.
- **Content Manager:** Simple UI to upload menu items, photos, and video Reels.
- **Growth Analytics:** See "Menu Views" to understand customer demand.

## 4. Technical Architecture
- **Backend:** FastAPI (Python) + PostgreSQL + SQLModel.
- **Frontend:** React (Vite) + TanStack (Router/Query).
- **Styling:** Vanilla CSS + Tailwind + Framer Motion (Vibrant & Block-based design system).
- **Location:** Native Browser Geolocation + Haversine distance calculations.

## 5. Sellability Strategy
- **Low Cost:** No heavy POS hardware needed. Just a smartphone.
- **Direct Revenue:** Drives footfall through discovery, not just a static menu.
- **Brand Power:** Gives a small stall a "premium" digital identity that matches their Instagram presence.
