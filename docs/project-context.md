# YumYum Project Context

## 1. Project Background
YumYum is a digital discovery portal for street food vendors in India, specifically optimized for the Bangalore market. It pivots away from traditional POS/Ordering utilities to focus on **Discovery, Aesthetics (Instagram-style Reels), and Live Location Tracking**. It acts as a "Zomato for Street Food," helping mobile vendors get discovered by hyperlocal customers.

## 2. Technical Context
- **Status:** Architecture pivoted to Discovery Portal. 
- **Backend:** FastAPI (Python 3.11+) + PostgreSQL + SQLModel.
- **Frontend:** React + Vite + TanStack Router/Query + Framer Motion.
- **Media:** Cloudinary (Free Tier) for high-performance image/video optimization.
- **Auth:** Zero-cost Mobile Number + 4-digit PIN authentication (replacing Email/Magic Links).

## 3. Business Context
- **Model:** Monthly subscription for "Live Discovery" and "Reel Hosting."
- **Value Proposition:** Footfall through visibility. Mobile vendors ping their live location, appearing on the consumer map instantly.
- **KPIs:** Portal views, Menu engagement, Vendor "Live" uptime.

## 4. Current Architecture
- **Monorepo Structure:** `/backend` and `/frontend`.
- **Discovery Engine:** Haversine formula based proximity search (5 nearest + 3 most popular).
- **Vendor Hub:** One-tap GPS ping to update live status and location.

## 5. Development Guidelines
- Always use `pnpm` for frontend.
- Maintain "Instagram-like" visual standards (Reels, Story bubbles).
- Keep hosting costs minimal (No expensive spatial DBs, stick to native math/Cloudinary free tier).
