# YumYum Frontend Specification (Vite + React + TanStack)

## 1. Overview
The frontend is a high-performance React Single Page Application (SPA) built with Vite and managed by the TanStack ecosystem. It is designed to be fully static, allowing for deployment on GitHub Pages while maintaining complex, type-safe state management and routing.

## 2. Technical Stack
- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** TanStack Router (Fully type-safe)
- **Data Fetching:** TanStack Query (Query/Mutation patterns)
- **State Management:** Zustand
- **Styling:** Tailwind CSS + Shadcn UI
- **Icons:** Lucide React
- **Animations:** Framer Motion

## 3. Architecture

### Directory Structure
- `/src/routes/`: TanStack Router file-based routing.
- `/src/components/`: Reusable UI units.
    - `/ui/`: Shadcn base components.
    - `/features/`: Feature-specific logic (Cart, Dishes, Reels).
    - `/shared/`: Common layouts and utilities.
- `/src/store/`: Zustand stores for UI and Cart state.
- `/src/lib/`: API clients (Axios) and helper functions.
- `/src/types/`: Central TypeScript interfaces.

### Core Patterns
1.  **Type Safety:** All routes and API calls must be typed.
2.  **Stateless Pages:** Routes should be lean, delegating logic to hooks and features.
3.  **Static Compatibility:** No SSR logic; all environment variables prefixed with `VITE_`.

## 4. Key Routes
- `/`: Landing page with search functionality.
- `/login`: Magic Link initiation.
- `/auth/verify`: Magic Link token verification and JWT storage.
- `/$vendorSlug`: The main public-facing vendor Reels menu.
- `/dashboard`: Protected vendor management area.

## 5. UI Features
- **Reels View:** Full-screen vertical scrolling menu for dishes.
- **Cart Summary:** Bottom drawer for reviewing and placing WhatsApp orders.
- **QRCode Modal:** Instant sharing of the vendor's digital brand.
