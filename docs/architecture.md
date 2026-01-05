---
stepsCompleted: [1, 2, 3]
inputDocuments:
  - docs/PRD.md
  - docs/ux-design-specification.md
workflowType: 'architecture'
lastStep: 0
project_name: 'yumyum'
user_name: 'Alhamdulillah'
date: '2026-01-06'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## 1. System Overview

YumYum is a multi-tenant SaaS platform built on a decoupled architecture, prioritizing zero infrastructure cost, high performance, and rapid scalability. It leverages Next.js for a fast client-side static frontend, Python FastAPI for a robust API backend, Supabase as its primary BaaS, and two Cloudinary accounts for resilient media asset management.

## 2. Technical Stack

*   **Frontend:** Next.js (TypeScript, client-side static generation)
*   **Backend (API):** Python FastAPI
*   **Styling:** Tailwind CSS, Shadcn UI
*   **UI Components:** Magic UI, Aceternity UI, Reactbits
*   **State Management:** Zustand
*   **Backend as a Service (BaaS):** Supabase (PostgreSQL, Auth, RLS)
*   **Media Hosting & CDN:** Cloudinary (2 accounts for redundancy and capacity)
*   **Hosting (Frontend):** Vercel
*   **Hosting (Backend API):** Render (for containerized FastAPI deployment)
*   **Analytics:** Google Analytics 4 (GA4)

## 3. High-Level Architecture

### 3.1 Overall System Architecture
The system employs a decoupled, multi-tier architecture to ensure high performance, scalability, and maintainability.
*   **Frontend (Next.js):** Served as client-side static assets by Vercel, ensuring blazing-fast load times. It consumes data and services from the FastAPI backend and directly interacts with Supabase for authentication and real-time data where appropriate.
*   **Backend (FastAPI):** A Python-based API layer hosted on Render, responsible for complex business logic, data processing, and orchestrating interactions between various services. It communicates with Supabase for data persistence and Cloudinary for media management.
*   **BaaS (Supabase):** Provides robust PostgreSQL database capabilities, authentication, and Row Level Security (RLS) for multi-tenancy.
*   **Media Management (Cloudinary):** Two separate Cloudinary accounts are used to manage video and media assets, providing redundancy, high availability, and efficient CDN delivery.

### 3.2 Multi-Tenancy
Multi-tenancy is handled primarily via Supabase Row Level Security (RLS) on the database level. Every table includes a `vendor_id` column linked to `auth.users.id`. The FastAPI backend will enforce additional business logic for multi-tenancy and data isolation.
*   **Vendor Access:** Vendors can only read/write their own data via the frontend, with both FastAPI and Supabase RLS enforcing permissions.
*   **Public Access:** Customers can read public menu data for any vendor via the `vendor_slug` through the Next.js frontend, consuming data from FastAPI.

### 3.3 Data Flow
1.  **Vendor Management:** Vendors log in via Supabase Magic Link through the Next.js frontend. The frontend interacts with FastAPI for managing menu data, which in turn updates Supabase and potentially Cloudinary for media assets.
2.  **Customer Interaction:** Customers scan a QR code leading to `yumyum.zupfam.com/{vendor-slug}`. The Next.js frontend fetches menu data from FastAPI.
3.  **Event Emission:** Client-side actions (views, clicks, adds) are sent as raw events to the FastAPI backend, which then writes to the `menu_events` table in Supabase.
4.  **Analytics Pipeline:** Dashboards (internal or vendor-facing) query the `menu_events` table via FastAPI to aggregate data on-the-fly for real-time reporting.

## 4. Database Schema (Canonical)

The system uses a relational PostgreSQL schema (managed by Supabase) designed for event-based analytics and multi-tenant isolation. The FastAPI application will interact with this schema.

### 4.1 Core Entities
*   **`vendors`:** Primary vendor profile and settings.
*   **`dishes`:** Menu items categorized and priced.
*   **`vendor_updates`:** Promotional "stories" or daily specials.
*   **`vendor_social_accounts`:** External links (Instagram, WhatsApp, etc.).

### 4.2 Behavioral Data
*   **`menu_events`:** The polymorphic event stream for all analytics.
*   **`update_interactions`:** High-frequency interaction tracking for vendor updates.

(Detailed SQL schema is available in `GEMINI.md`)

## 5. Security Strategy

*   **Authentication:** Supabase Magic Link for passwordless, secure vendor entry (managed by Next.js frontend and integrated with FastAPI).
*   **Authorization:** Strict RLS policies on all Supabase tables, augmented by FastAPI's role-based access control (RBAC) and data validation.
*   **API Security:** FastAPI will implement rate limiting, input validation, and proper error handling. API keys/tokens will be managed securely.
*   **Public Data:** Publicly accessible views/tables are limited to read-only for non-authenticated users via both RLS and FastAPI endpoint controls.

## 6. Infrastructure & Deployment

*   **Frontend (Next.js):** Deployed on **Vercel** with automatic CI/CD integration from GitHub. Leveraging Vercel's CDN for global distribution of static assets.
*   **Backend (FastAPI):** Deployed as a containerized application on **Render**. Render provides managed infrastructure, auto-scaling, and CI/CD integration with GitHub, aligning with the "zero infra cost" philosophy (initially). FastAPI will run with Uvicorn and Gunicorn workers for production-grade performance.
*   **Media Hosting & CDN (Cloudinary):** Two distinct Cloudinary accounts will be used. This provides redundancy, enhanced rate limits, and potentially allows for functional separation (e.g., one for public media, one for private/vendor-uploaded). Cloudinary handles automatic resizing, formatting, optimization, and global CDN delivery of images and videos.
*   **Database (Supabase):** Managed cloud service by Supabase, handling database scaling, backups, and security patches.
*   **Environment Variables:** Securely managed via Vercel, Render, and Supabase platforms.
*   **CI/CD:** Automated deployments for both frontend (Vercel) and backend (Render) via GitHub.

## 7. Operational Roadmap

1.  **Phase 1:** Core menu rendering (Next.js), event tracking (FastAPI -> Supabase), and basic vendor authentication (Next.js -> Supabase). Cloudinary integration for media.
2.  **Phase 2:** Vendor dashboard for menu and media management (Next.js -> FastAPI -> Supabase/Cloudinary).
3.  **Phase 3:** Advanced analytics and reporting via WhatsApp (FastAPI).

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The core functional requirements revolve around establishing a robust digital storefront for hyperlocal food vendors. These include creating a vendor-specific digital brand page accessible via QR code, an interactive Instagram-style dynamic menu, and a seamless client-side cart with integrated WhatsApp ordering. Additionally, the system must provide a secure vendor login (Magic Link authentication) and a vendor metrics dashboard to track key performance indicators.

**Non-Functional Requirements:**
Key non-functional requirements are critical for the project's success. **Performance** is paramount, demanding a "blazing-fast" experience from QR scan to order completion, with instantaneous menu loads and interactions. **Scalability** is essential for the multi-tenant SaaS platform. **Cost Efficiency** dictates leveraging solutions like Supabase to minimize infrastructure overhead. **Security** is a foundational aspect, relying on Supabase Magic Link authentication and robust Row Level Security (RLS) to ensure data isolation. **Maintainability** is emphasized through radical simplicity and a focused feature set. **Usability** and **User Experience** are central, driving mobile-first, highly visual, and intuitive interactions. **Data Integrity** is ensured via an event-based tracking model.

**Standout Features (User Emphasized):**
1.  **Rich Frontend Designs:** The application will deliver a visually appealing and highly interactive user interface, leveraging modern UI libraries and animation frameworks to create a delightful experience.
2.  **Fast Performance:** The entire application, from initial load to complex interactions, must be exceptionally fast, providing an instantaneous and fluid user journey.
3.  **User-Friendly Experience:** Design and functionality will prioritize ease of use for both vendors and customers, ensuring intuitive navigation and minimal friction in all core workflows.

**Scale & Complexity:**
The project exhibits a **High** level of complexity. This is driven by the rich interactive UX, the need for real-time updates in the cart and potential dashboards, inherent multi-tenancy requirements, and the orchestration of multiple integrated services.

- Primary domain: Full-stack (Web with API backend)
- Complexity level: High
- Estimated architectural components: The architecture will involve distinct frontend (Next.js), backend (FastAPI), BaaS (Supabase), and media management (Cloudinary) components, each with internal modularity.

### Technical Constraints & Dependencies

The primary technical constraints and dependencies include a reliance on WhatsApp for the core ordering flow, Supabase as the central Backend-as-a-Service for database and authentication, and Cloudinary for all media asset management. Frontend deployment is constrained to Vercel, and the newly defined FastAPI backend will be deployed on Render. Initial manual processes for vendor onboarding and subscription collection are acceptable MVP constraints.

### Cross-Cutting Concerns Identified

Several cross-cutting concerns will significantly influence architectural decisions across the entire system:
*   **Security:** Encompassing authentication, authorization (RLS and FastAPI RBAC), API security (rate limiting, validation), and secure environment variable management.
*   **Performance:** Optimizing latency, ensuring efficient asset delivery via CDN, and maintaining fast server response times across all services.
*   **Scalability:** Designing for multi-tenancy at both the database and application levels, and ensuring that event processing can handle anticipated volumes.
*   **Data Consistency:** Maintaining integrity across the event-based tracking model and transactional data in Supabase.
*   **User Experience:** Ensuring a consistent, fluid, and responsive experience across all devices, particularly on mobile, given the rich design requirements.
*   **Observability:** Implementing comprehensive logging, monitoring, and analytics to track application health and business metrics.

## Starter Template Evaluation

### Primary Technology Domain

Full-stack (Web with API backend) based on project requirements analysis

### Starter Options Considered

**Frontend (Next.js with TypeScript, Tailwind CSS, Shadcn UI):**
This approach leverages the official `create-next-app` to set up a Next.js project with TypeScript and Tailwind CSS. Shadcn UI, Zustand for state management, and other rich UI libraries like Magic UI and Aceternity UI will be integrated manually. This method prioritizes flexibility and fine-grained control, allowing the project to evolve without being constrained by an overly opinionated boilerplate, which is crucial for achieving the "rich frontend designs" and "fast" performance goals.

**Backend (FastAPI with Docker, Gunicorn, Uvicorn, Render Deployment):**
For the backend, the strategy involves building a production-ready FastAPI application from first principles, incorporating best practices for Dockerization and deployment to Render. This setup includes a `main.py` for the FastAPI application, a `requirements.txt` for Python dependencies, a multi-stage `Dockerfile` to create efficient, self-contained images, and a `render.yaml` for seamless CI/CD and hosting on Render. This combination is chosen for its robustness, scalability, and performance in a production environment.

### Selected Starter: Combined Best-Practice Approach

**Rationale for Selection:**
The selected approach is a combined best-practice strategy rather than a single, all-encompassing boilerplate. This provides the optimal balance of utilizing modern, performant, and maintainable technologies while offering the flexibility required for YumYum's unique "rich frontend designs" and "money minting machine" aspirations. It allows for deep customization and fine-tuning to meet specific performance and UX requirements, rather than being constrained by a generic template. This approach directly supports the project goals of being fast, scalable, maintainable, and modular.

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript for the Next.js frontend, ensuring type safety and robust development. Python 3.11+ for the FastAPI backend, leveraging its asynchronous capabilities and extensive ecosystem.

**Styling Solution:**
Tailwind CSS provides a utility-first framework for highly customizable and efficient styling across the frontend. This is complemented by Shadcn UI for accessible, unstyled base components, and specialized libraries like Magic UI and Aceternity UI for rich visual effects and animations.

**Build Tooling:**
The Next.js frontend benefits from its built-in optimizations, including Webpack/Turbopack, automatic image optimization, and intelligent code splitting for fast load times. The FastAPI backend utilizes Docker's multi-stage build process to create lean and efficient production images.

**Testing Framework:**
A robust testing strategy will be integrated, adopting standard community practices such as Jest and React Testing Library for the frontend to cover UI components and logic, and Pytest for the backend to ensure API functionality and data integrity.

**Code Organization:**
The frontend will follow Next.js's established conventions, utilizing either the `pages` or `app` router for clear routing, and a modular structure for `components`, `lib`, and utility functions. The backend will adopt a layered architecture with distinct responsibilities for routers, services, and models, promoting modularity and maintainability.

**Development Experience:**
Both frontend and backend development environments will offer a highly productive experience. The Next.js development server provides hot module replacement and live reloading. FastAPI includes automatic API documentation via OpenAPI/Swagger UI, and local development will be enhanced with Uvicorn's auto-reload capabilities. Integrated debugging with tools like VS Code will be supported across the stack.

**Insights from Advanced Elicitation:**

**Performance Profiler Panel Insights:**
*   **Frontend Optimization:** Achieving "blazing-fast" performance for "rich frontend designs" requires aggressive client-side optimization. This includes efficient component rendering, virtualized lists for extensive feeds, lazy loading of images and components, and minimizing unnecessary re-renders. Cloudinary's optimized asset delivery is crucial for images and videos, necessitating correct responsive image implementation. Fast and efficient responses from the FastAPI backend are a prerequisite for frontend responsiveness.
*   **Backend Optimization:** FastAPI's performance can be maximized through optimized Supabase queries, ensuring all I/O operations are truly asynchronous, and judicious use of background tasks for long-running processes. The `menu_events` table's growth necessitates careful indexing and pre-aggregation strategies (e.g., materialized views) for dashboard analytics. Effective connection pooling within FastAPI is vital.
*   **DevOps & Infrastructure:** Lean Docker images, proper Gunicorn worker configuration on Render, and continuous monitoring of resource utilization (CPU, memory, network) are key for scalable backend deployment. Cloudinary's CDN requires correct cache-control headers and asset versioning, and managing potential rate limits across two accounts.
*   **Overall:** While the chosen technologies offer strong performance foundations, realizing the "fast" requirement for YumYum demands continuous and diligent optimization efforts across the entire stack, supported by proactive profiling and monitoring from the outset.

**Pre-mortem Analysis Insights:**
*   **Performance Failure Risks:** A year from now, performance could degrade due to unoptimized rich frontend animations, an unindexed and rapidly growing `menu_events` table, or unoptimized FastAPI database interactions. Prevention strategies include rigorous performance budgeting, robust indexing, query optimization, and proper database connection management.
*   **Scalability Failure Risks:** Rapid growth could lead to multi-tenancy security breaches (if RLS is not complemented by strong FastAPI validation), API crashes under load, or Cloudinary rate limit exhaustion. Prevention requires comprehensive multi-tenant testing, layered FastAPI validation, API rate limiting, and auto-scaling on Render.
*   **Maintenance Hell Risks:** Despite using modern tools, development could slow down significantly due to a tangled codebase, frequent regressions, and debugging difficulties. This highlights the critical need for strict architectural adherence, a robust testing strategy (unit, integration, E2E), consistent component patterns, clear code review processes, and diligent documentation of all architectural decisions.
*   **Overall:** The success of YumYum as a "tech marvel money minting machine" hinges not just on the choice of powerful technologies but, more critically, on their disciplined implementation and continuous management. Proactive optimization, thorough testing, and strict architectural governance will be paramount to mitigate these potential failure modes.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
*   **Data Modeling Approach:** SQLModel for FastAPI backend.
*   **Migration Approach:** To be decided.
*   **Caching Strategy:** To be decided.
*   **Authorization Patterns:** To be decided.
*   **Security Middleware:** To be decided.
*   **API Error Handling:** To be decided.
*   **Rate Limiting Strategy:** To be decided.
*   **Monitoring and Logging:** To be decided.
*   **Scaling Strategy (fine-tuning):** To be decided.

**Important Decisions (Shape Architecture):**
*   Component architecture (more specific patterns for frontend).
*   Performance optimization (specific patterns/tools).

**Deferred Decisions (Post-MVP):**
(No specific decisions deferred at this point)

### Data Architecture

*   **Decision:** Data Modeling Approach
    *   **Choice:** SQLModel
    *   **Version:** `0.0.31`
    *   **Rationale:** SQLModel combines type safety (via Pydantic), FastAPI integration, and robust ORM capabilities, aligning well with Python's strengths and supporting maintainable, modular code. It provides a structured way to define data models that can be used for both database schema and API request/response validation.
    *   **Affects:** FastAPI backend, Supabase PostgreSQL database, data validation, future migration strategy.
    *   **Provided by Starter:** No (manual integration).

*   **Decision:** Migration Approach
    *   **Choice:** Supabase Migrations (direct SQL)
    *   **Version:** N/A
    *   **Rationale:** This approach leverages Supabase's integrated tools for managing database schema changes via direct SQL. It provides explicit control over migrations and avoids introducing an additional Python-based migration tool into the stack, simplifying the overall development and deployment process for the MVP.
    *   **Affects:** Supabase database schema, development workflow for schema changes.
    *   **Provided by Starter:** No (manual setup).

*   **Decision:** Caching Strategy
    *   **Choice:** Layered Caching Strategy (In-memory, Supabase features, CDN)
    *   **Version:** N/A
    *   **Rationale:** This strategy combines in-memory caching within FastAPI for frequently accessed, short-lived data, leverages Supabase (PostgreSQL) features like materialized views for aggregated or slowly changing data, and utilizes CDN caching (Vercel/Cloudinary) for static frontend assets and public API responses. This multi-layered approach optimizes for different data access patterns, reduces database load, and efficiently leverages existing infrastructure, contributing significantly to a "fast" and "scalable" application. Redis can be considered for future complex distributed caching needs.
    *   **Affects:** FastAPI backend performance, frontend performance, Supabase database load, overall user experience.
    *   **Provided by Starter:** No (manual implementation).

### Authentication & Security

*   **Decision:** Authorization Patterns
    *   **Choice:** Hybrid Authorization
    *   **Version:** N/A
    *   **Rationale:** Combines Supabase RLS for basic, row-level data access control with FastAPI-level authorization (using dependencies, Pydantic models, and custom logic) for more granular, business-logic-driven permission checks. This approach provides defense-in-depth, balancing the security benefits of database-level enforcement with the flexibility and testability of application-level logic.
    *   **Affects:** FastAPI backend, Supabase database, security, API endpoints.
    *   **Provided by Starter:** No (manual implementation).

*   **Decision:** Security Middleware
    *   **Choice:** Built-in FastAPI Middleware
    *   **Version:** N/A (part of FastAPI core)
    *   **Rationale:** Leverages FastAPI's built-in `CORSMiddleware` and `HTTPSRedirectMiddleware` for foundational web security. This covers essential aspects like Cross-Origin Resource Sharing (CORS) and ensures secure communication via HTTPS redirection, simplifying setup and adhering to standard security practices for web applications. Custom FastAPI dependencies will handle Supabase token processing and user context for authorization.
    *   **Affects:** FastAPI backend, API security, network communication.
    *   **Provided by Starter:** No (manual configuration).

*   **Decision:** Data Encryption Approach
    *   **Choice:** Application-level Encryption
    *   **Version:** N/A (depends on Python cryptography libraries)
    *   **Rationale:** Implement additional encryption/decryption within the FastAPI application for sensitive data fields before storing them in Supabase. This provides granular control over data encryption and a "zero-knowledge" approach for Supabase on specific data, addressing the user's explicit need for maximum control over sensitive information. Key management strategies will need to be carefully designed and implemented.
    *   **Affects:** FastAPI backend, data storage, security, performance (due to encryption/decryption overhead).
    *   **Provided by Starter:** No (manual implementation).

### API & Communication

*   **Decision:** Error Handling Standards
    *   **Choice:** Custom Exception Handlers for `HTTPException`
    *   **Version:** N/A (part of FastAPI implementation)
    *   **Rationale:** Implement custom exception handlers in FastAPI to provide a consistent, well-defined JSON error response format across the API. This ensures clarity for API consumers, allows for detailed error information, and supports a user-friendly experience, balancing control with ease of implementation for a maintainable API.
    *   **Affects:** FastAPI backend, API consumers, error logging, user experience.
    *   **Provided by Starter:** No (manual implementation).

*   **Decision:** Rate Limiting Strategy
    *   **Choice:** FastAPI-Limiter
    *   **Version:** `0.1.6`
    *   **Rationale:** Provides application-level rate limiting with fine-grained control, allowing for strategies based on IP, user, or custom keys. It's easily integrated into the FastAPI application and can be scaled with a Redis backend if distributed rate limiting is required in the future, effectively protecting the API from abuse and ensuring fair usage.
    *   **Affects:** FastAPI backend, API security, performance, user experience.
    *   **Provided by Starter:** No (manual integration).







