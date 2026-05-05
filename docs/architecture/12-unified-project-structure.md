# Section 12 of 18: Unified Project Structure

This is the target project structure for our monorepo.

```plaintext
/
├── docs/
│   ├── prd/                  # Product Requirement Documents
│   ├── architecture/         # Architectural designs and ADRs
│   ├── wiki/                 # Training materials and team onboarding docs
│   ├── journal/              # Visual assets and research
│   └── stories/              # Implementation history
├── frontend/                 # React (Vite) + TanStack
│   ├── src/
│   ├── tests/
│   └── ...
├── backend/                  # FastAPI + PostgreSQL
│   ├── app/
│   ├── requirements.txt
│   └── ...
├── docker-compose.yml
├── package.json
├── pnpm-lock.yaml
└── AGENTS.md
```

---
