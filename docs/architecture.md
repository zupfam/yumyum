---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]
workflowType: 'architecture'
lastStep: 9
status: 'active'
completedAt: '2026-04-25'
---

# YumYum Modern Stack Architecture (FastAPI + TanStack)

### Section 1 of 18: Introduction

This document outlines the modern fullstack architecture for YumYum. The project has transitioned from a BaaS (Supabase) model to a custom, high-performance architecture using a Python FastAPI backend and a static React frontend.

#### Section 1.1 of 18: Project Overview

YumYum uses a decoupled architecture to maximize deployment flexibility:
*   **Backend:** FastAPI (Python) with PostgreSQL.
*   **Frontend:** React (Vite) with TanStack Router and TanStack Query.
*   **Storage:** Cloudinary for professional media management.

#### Section 1.2 of 18: Change Log

| Date       | Version | Description                                | Author              |
| :--------- | :------ | :----------------------------------------- | :------------------ |
| 2026-04-25 | 3.0     | Migration to FastAPI + TanStack + Cloudinary | Winston (Architect) |

---

# Architecture Decision Document

## 1. System Overview

YumYum is a multi-tenant SaaS platform. It leverages a high-performance Python backend and a type-safe, static frontend.

## 2. Technical Stack

- **Backend:**
  - **Framework:** FastAPI
  - **Database:** PostgreSQL
  - **ORM:** SQLModel (SQLAlchemy + Pydantic)
  - **Auth:** Custom Magic Link with JWTs (via Resend)
- **Frontend:**
  - **Framework:** React + Vite
  - **Routing:** TanStack Router (Type-safe)
  - **State/Fetching:** TanStack Query
  - **UI:** Tailwind CSS + Shadcn UI
- **Services:**
  - **Media:** Cloudinary (Images/Videos)
  - **Email:** Resend (Magic Links)
  - **Analytics:** Google Analytics 4 (GA4)

## 3. High-Level Architecture

- **Structure:** Monorepo (loosely coupled)
- **Deployment:** 
  - **Frontend:** GitHub Pages (Static SPA)
  - **Backend:** Paid Server (Dockerized FastAPI)

### 3.1 Overall System Architecture
*   **Frontend (Static):** Built using Vite, served as static assets. It communicates with the FastAPI backend via a REST API.
*   **Backend (API):** Python application responsible for business logic, auth, and database orchestration.
*   **Database:** Persistent PostgreSQL store for all vendor and menu data.

### 3.2 Multi-Tenancy
Multi-tenancy is handled at the application level in FastAPI. All tables are scoped by `vendor_id`.
*   **Vendor Access:** Authenticated via JWT, scoped to their own `vendor_id`.
*   **Public Access:** Scoped by `vendor_slug` for menu viewing.

### 3.3 Data Flow
1.  **Auth:** User requests Magic Link -> FastAPI sends email via Resend -> User clicks link -> Frontend verifies token -> FastAPI returns JWT.
2.  **Management:** Authenticated vendor manages Brand/Dishes -> FastAPI updates PostgreSQL -> Media uploaded to Cloudinary.
3.  **Consumption:** Customer views menu -> Frontend fetches data from FastAPI -> Events tracked in PostgreSQL.

## 4. Database Schema

The system uses a relational PostgreSQL schema managed via SQLModel.

### 4.1 Core Entities
*   **`Vendor`:** Identity and auth.
*   **`Brand`:** Public profile, scoped to Vendor.
*   **`Dish`:** Menu items, scoped to Brand.
*   **`StatusItem`:** Temporary updates, scoped to Brand.
*   **`MenuEvent`:** Behavioral analytics stream.

## 5. Security Strategy

*   **Authentication:** Custom Magic Link system (15-min token expiration).
*   **Authorization:** JWT-based access control in FastAPI routers.
*   **Data Isolation:** Strict filtering by `vendor_id` in all protected endpoints.

## 6. Infrastructure & Deployment

*   **Frontend:** Automated CI/CD via GitHub Actions to GitHub Pages.
*   **Backend:** Dockerized for consistent deployment to any VPS or Cloud provider.
*   **Storage:** Cloudinary SDK for secure, optimized media handling.

---

**Architecture Status:** MIGRATION IN PROGRESS 🛠️
