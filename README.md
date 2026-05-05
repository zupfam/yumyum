# YumYum

> yumyum.zupfam.com/{vendor-slug}

YumYum is a mobile-first digital storefront for hyperlocal food vendors in India. It replaces static paper menus with an Instagram-style, vertical, visual menu that drives **measurable demand**.

## Core Vision

- **The Problem:** Vendors operate blind. Printed menus are static, expensive, and generate zero data.
- **The Solution:** YumYum provides a blazing-fast digital storefront + a numbers dashboard that shows vendors **orders sent to WhatsApp**, menu engagement, and money saved.
- **Value Proposition:** For a monthly fee, vendors get proof that YumYum drives customers, not just clicks.

## Key Features

1.  **Dynamic Menu and Pricing:** Save printing costs by updating items instantly.
2.  **Instagram-style Experience:** High-engagement, vertical scrolling reels for dishes.
3.  **WhatsApp Ordering:** One-tap ordering that lands directly on the vendor's phone.
4.  **Vendor Dashboard:** Secure in-app management for menu, brand, and daily statuses.
5.  **Metrics-Driven:** Proof of value via tracked "Order Clicks" and "Menu Views".

## Technical Stack

- **Frontend:** React (Vite), TanStack Router, TanStack Query, Tailwind CSS.
- **Backend:** FastAPI (Python), PostgreSQL, SQLModel.
- **Auth:** Magic Link with JWT (Custom implementation).
- **Storage:** Cloudinary for professional media management.
- **Hosting:** Frontend on GitHub Pages (static), Backend on a persistent server.

## Project Structure

- `backend/`: FastAPI application, models, and migrations.
- `frontend/`: React/Vite application with TanStack ecosystem.
- `docs/`: Product Requirements (PRD) and Architecture.
- `docker-compose.yml`: Local database setup.

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 20+
- pnpm 10+
- Docker (for PostgreSQL)

### 1. Database Setup
Ensure you have a PostgreSQL database named `yumyum` running on `localhost:5432` with user `hammaad`.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
fastapi dev --port 6787
```

### 3. Frontend Setup
```bash
cd frontend
pnpm install
pnpm dev # Runs on port 6786
```

### 4. Running Tests
```bash
cd frontend
npx playwright test
```

---

Built with ❤️ for the street food heroes of India.
