---
project_name: 'yumyum'
user_name: 'Alhamdulillah'
date: '2026-01-06'
sections_completed: ['technology_stack', 'language_specific_rules']
existing_patterns_found: 20
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

**Core Technologies and Exact Versions/Constraints:**

*   **Frontend:**
    *   Next.js: `latest stable version` (with `App Router` recommended)
    *   React: `latest stable version`
    *   TypeScript: `latest stable version`
    *   Tailwind CSS: `latest stable version`
    *   Shadcn UI: `latest stable version` (via CLI, components copied into project)
    *   Zustand: `latest stable version`
    *   Magic UI, Aceternity UI: `latest stable versions` (for rich animations)
    *   Data Fetching: `React Query` or `SWR` (final choice during implementation setup)
*   **Backend:**
    *   Python: `3.11+`
    *   FastAPI: `latest stable version`
    *   SQLModel: `0.0.31`
    *   Pydantic: `latest stable version` (integrated with FastAPI and SQLModel)
    *   Gunicorn: `latest stable version` (for process management)
    *   Uvicorn: `latest stable version` (ASGI server)
    *   FastAPI-Limiter: `0.1.6`
*   **Backend as a Service (BaaS):** Supabase (Managed PostgreSQL, Auth, RLS)
*   **Media Management:** Cloudinary (2 accounts, `latest stable SDKs`)
*   **Deployment Platforms:** Vercel (Frontend), Render (Backend)
*   **Observability:** Sentry (`latest stable SDKs`)


## Critical Implementation Rules

### Language-Specific Rules

**TypeScript/JavaScript Rules (Frontend):**

*   **Configuration Requirements:**
    *   Strict mode (`"strict": true`) enabled in `tsconfig.json`.
    *   Path aliases (`@/`) for absolute imports, defined in `tsconfig.json`.
    *   Explicit typing for all variables, function arguments, and return values; no implicit `any`.

*   **Import/Export Patterns:**
    *   All application-specific imports must use absolute paths starting with `@/`.
    *   Named exports (`export const ...`) are preferred over default exports for modules.
    *   Use `import type { ... } from '...'` for type-only imports to prevent bundling unnecessary code.

*   **Error Handling Patterns:**
    *   Mandatory use of `try...catch` blocks for all asynchronous operations (API calls, data mutations).
    *   Throw custom error classes for domain-specific errors to provide clearer context.
    *   Strict type checking and validation on all API responses received from the backend.

**Python Rules (Backend - FastAPI):**

*   **Configuration Requirements:**
    *   Use `pyproject.toml` for managing project configuration, including formatters (Black), linters (Ruff), and Pydantic settings.
    *   All environment variables must be loaded and validated using Pydantic `BaseSettings` (`backend/app/core/config.py`).

*   **Import/Export Patterns:**
    *   Absolute imports from the project root (`from app.api.v1.endpoints import ...`) are preferred for better clarity and maintainability.
    *   Relative imports (`from . import ...`) may be used only for internal module usage.

*   **Error Handling Patterns:**
    *   Raise FastAPI's `HTTPException` (from `fastapi`) for all HTTP-related errors, using appropriate status codes.
    *   Implement custom exception handlers (`backend/app/core/exceptions.py`) for application-specific error types to return a consistent error response format.
    *   Utilize Python's standard logging module for all application logging (`backend/app/core/logging.py`). Ensure structured logging (JSON format) for all production logs.

### Framework-Specific Rules

**React/Next.js Rules (Frontend):**

*   **Hooks Usage:**
    *   Prioritize custom hooks (`use...`) for reusable, encapsulated logic.
    *   Strictly adhere to the Rules of Hooks (call only from React functions, call only at the top level).
    *   Use `useEffect` sparingly; always specify correct dependency arrays to prevent infinite loops or stale closures.
*   **Component Structure:**
    *   Follow Hybrid Component Architecture (Atomic Design for UI elements, Feature-Sliced for higher-level features).
    *   Components should be pure functions where possible to improve predictability and testability.
    *   Use `React.memo` for performance optimization on presentational components that receive stable props.
*   **State Management (Zustand):**
    *   All state updates must be immutable. Never directly modify state objects.
    *   Organize Zustand stores by feature or domain within `frontend/src/lib/stores/`.
    *   Use selectors (`useStore(state => state.value)`) to optimize re-renders and subscribe only to necessary parts of the state.
*   **Performance Rules:**
    *   Leverage `next/image` component for all image optimization.
    *   Implement component virtualization for displaying long lists or grids (e.g., `react-virtualized`, `react-window`).
    *   Use `React.lazy` and `Suspense` for code splitting and lazy loading components.
    *   Utilize client-side data fetching libraries (React Query or SWR) for API calls, leveraging their caching, revalidation, and background fetching capabilities.

**FastAPI Rules (Backend):**

*   **API Route Conventions:**
    *   Organize API endpoints modularly using FastAPI `APIRouter` instances (e.g., `app/api/v1/endpoints/`).
    *   All API endpoints that perform I/O operations must be asynchronous (`async def`).
    *   Use Pydantic models (`app/schemas/`) extensively for request body validation, query/path parameters, and response serialization.
*   **Middleware Usage Patterns:**
    *   Restrict the use of custom FastAPI middleware to cross-cutting concerns (e.g., custom logging, request IDs).
    *   Authentication and Authorization logic should primarily be implemented using FastAPI Dependencies for better testability and reusability.
*   **Dependency Injection:**
    *   Extensively use FastAPI's Dependency Injection system for managing shared resources (e.g., database sessions, Cloudinary clients) and applying common logic (e.g., authentication, authorization).
*   **Services/CRUD Separation:**
    *   Maintain a clear separation of concerns: API endpoints (`app/api/v1/endpoints/`) should primarily orchestrate calls to business logic (in `app/services/`) and data access operations (in `app/crud/`).
    *   Direct database interaction (SQLModel queries) should reside in `app/crud/`.


