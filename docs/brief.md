# Project Brief: YumYum (v5 – FastAPI & TanStack)

### Section 1 of 10: Executive Summary

YumYum is a mobile-first digital storefront for hyperlocal food vendors in India. This project transitions the platform to a custom high-performance stack using **FastAPI (Python)** for the backend and a **Vite/TanStack** static frontend. This architecture provides maximum flexibility, professional-grade media management via **Cloudinary**, and a seamless upgrade path for vendors.

## Executive Summary (Core Vision)

* **Concept:** Instagram-style, vertical, visual menu for street food vendors.
* **Core Thesis:** A demand-generation and measurement engine, not just a menu app.
* **Solution:** Blazing-fast digital storefront + numbers dashboard showing WhatsApp orders and engagement.
* **Value Proposition:** Proof of value through customers, not just clicks.

---

### Section 2 of 10: Problem Statement

Vendors currently operate with expensive, static paper menus that offer zero visibility into customer intent or engagement. Previous BaaS-based iterations lacked the granular control and cost-efficiency required for a truly scalable, multi-tenant "Premium Tier." By moving to a custom Python backend, we unlock full control over authentication, analytics, and vendor management.

---

### Section 3 of 10: Proposed Solution

We are implementing a robust fullstack application:
*   **Backend:** FastAPI with PostgreSQL for secure, scoped data management.
*   **Frontend:** A static React SPA (Vite) deployable to GitHub Pages for zero-cost hosting.
*   **Auth:** Custom Magic Link system with JWT-based session handling.
*   **Media:** Integrated Cloudinary for professional image and video optimization.

---

### Section 4 of 10: Target Users

*   **Primary:** Efficiency-focused street food vendors.
*   **Needs:** Secure in-app dashboard to update items, prices, and availability instantly.

---

### Section 5 of 10: Goals & Success Metrics

*   **North-Star Metric:** Menus scanned per Vendor per Day.
*   **Conversion:** WhatsApp "Place Order" button clicks.
*   **Performance:** < 2s load time on mobile devices.

---

### Section 8 of 10: Technical Considerations

*   **Architecture:** Decoupled FastAPI backend and Static Frontend.
*   **Multi-Tenancy:** Scoped by `vendor_id` and `brand_id` at the application layer.
*   **Data Isolation:** Strict PostgreSQL query filtering.

---

**Status:** Architecture Migrated. Ready for Feature Porting.
