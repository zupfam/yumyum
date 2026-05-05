# AGENTS.md

## Project Overview

**YumYum** is a mobile-first digital storefront for hyperlocal food vendors in India. It replaces static paper menus with an Instagram-style, vertical, visual menu that drives measurable demand.

### Tech Stack
- **Frontend:** React (Vite), TanStack Router, TanStack Query, Tailwind CSS, Shadcn UI.
- **Backend:** FastAPI (Python), PostgreSQL, SQLModel.
- **Auth:** Custom Magic Link with JWT (via Resend).
- **Storage:** Cloudinary (Media).
- **Analytics:** Event-based tracking in PostgreSQL + GA4.

---

## Documentation Maintenance Role (CRITICAL)

The `docs/` directory is the **canonical source of truth** for all documentation, architectural decisions, and user guides.

### Mandates:
1. **Source of Truth:** Never rely on implementation details or code comments alone; the `docs/` must reflect the reality of the system.
2. **Post-Implementation Sync:** Every significant implementation or architectural change **MUST** be followed by a documentation sync turn.
3. **Sync Requirements:**
   - Update `docs/prd.md` if feature scope changes.
   - Update `docs/architecture.md` if technical design changes.
   - Record non-obvious, hard-to-reverse decisions in `docs/architecture/adr/`.
   - Update user guides and technical setups in `docs/wiki/`.

---

## Setup Commands

You can use the `Makefile` at the root for common tasks:
- **Setup everything:** `make setup`
- **Start both servers:** `make dev`
- **Run all tests:** `make test`
- **Clean artifacts:** `make clean`

### Backend Setup (Manual)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Run on port 6787
fastapi dev app/main.py --port 6787
```

### Frontend Setup (Manual)
```bash
cd frontend
pnpm install
# Runs on port 6786 (configured in vite.config.ts)
pnpm dev
```

### Database Setup
Use the local PostgreSQL database:
- **Host:** `localhost:5432`
- **Username:** `hammaad`
- **Database:** `yumyum`
- **Password:** `local_database`

---

## Development Workflow

- **Frontend Development:** Run `pnpm dev` in the `frontend/` directory. Use TanStack Router for type-safe routing.
- **Backend Development:** Run `fastapi dev` in the `backend/` directory.
- **API Communication:** Use the Axios instance in `frontend/src/lib/api.ts`.
- **Media Management:** All images/videos must be uploaded via the Cloudinary service.

---

## Testing Instructions

- **Frontend Tests:** Run `npx playwright test` in the `frontend/` directory.
- **Type Checking:** Run `pnpm build` or `npx tsc --noEmit` to verify TypeScript integrity.
- **Backend Tests:** Run `pytest` in the `backend/` directory.

---

## Code Style & Conventions

- **Incremental Value:** Every story must result in a deployable, shippable unit of value.
- **Type Safety:** Maintain strict TypeScript safety in the frontend. Fix all `tsc` errors.
- **Metrics Philosophy:** Track **outcomes** (Order Clicks, Menu Views), not just curiosity.
- **Event-Based Tracking:** Emit events to the `menu_events` table for every meaningful user action.

---

## Project Structure (Unified)

```text
/
├── docs/                     # Source of Truth for everything
│   ├── prd/                  # Product Requirement Documents
│   ├── architecture/         # Architectural designs and ADRs
│   ├── wiki/                 # Technical guides and onboarding
│   ├── journal/              # Visual assets and research
│   └── stories/              # Implementation history
├── frontend/                 # React + Vite application
├── backend/                  # FastAPI + SQLModel application
├── docker-compose.yml        # Infrastructure
└── AGENTS.md                 # This file
```
