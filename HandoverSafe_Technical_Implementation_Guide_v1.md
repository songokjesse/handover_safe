# HandoverSafe Technical Implementation Guide

**Version:** 1.0\
**Author:** Jesse Songok\
**Date:** July 2026

------------------------------------------------------------------------

# 1. Purpose

This guide provides implementation standards for building HandoverSafe.
It complements the PRD, SRS, SAD and DDD by defining the recommended
technology stack, project structure, coding standards, state management,
CI/CD pipeline, deployment process and engineering practices.

------------------------------------------------------------------------

# 2. Recommended Technology Stack

## Frontend

-   Next.js (App Router)
-   React
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   Progressive Web App (PWA)
-   React Hook Form
-   Zod
-   TanStack Query

## Backend

-   Supabase
-   PostgreSQL
-   Supabase Auth
-   Supabase Storage
-   Supabase Edge Functions (where needed)

## Tooling

-   ESLint
-   Prettier
-   Husky
-   lint-staged
-   Playwright
-   Vitest
-   GitHub Actions

------------------------------------------------------------------------

# 3. Repository Structure

``` text
handoversafe/
├── apps/
│   └── web/
├── packages/
│   ├── ui/
│   ├── types/
│   ├── utils/
│   └── config/
├── supabase/
│   ├── migrations/
│   ├── seeds/
│   └── functions/
├── docs/
├── .github/workflows/
└── package.json
```

------------------------------------------------------------------------

# 4. Next.js App Structure

``` text
app/
├── (auth)/
├── dashboard/
├── houses/
├── shifts/
├── checklist/
├── tasks/
├── reports/
├── settings/
├── api/
└── layout.tsx
```

------------------------------------------------------------------------

# 5. Coding Standards

-   TypeScript only (`strict` mode)
-   Functional React components
-   Server Components by default
-   Client Components only when interaction is required
-   No `any` type unless justified
-   One responsibility per component
-   Prefer composition over inheritance

Naming:

-   Components: PascalCase
-   Hooks: useXxx
-   Files: kebab-case
-   Variables/functions: camelCase
-   Constants: UPPER_SNAKE_CASE

------------------------------------------------------------------------

# 6. State Management

## Local UI State

-   React state

## Forms

-   React Hook Form
-   Zod validation

## Server State

-   TanStack Query

## Authentication

-   Supabase Auth

Avoid global state unless required.

------------------------------------------------------------------------

# 7. Data Fetching

-   Server Components for read-heavy pages
-   Route Handlers / Server Actions where appropriate
-   Optimistic updates for checklist items
-   Query invalidation after mutations

------------------------------------------------------------------------

# 8. API Design Principles

-   RESTful endpoints
-   JSON only
-   Predictable error responses
-   Validation before persistence
-   Audit logging on mutations

------------------------------------------------------------------------

# 9. Security Implementation

-   Row-Level Security enabled
-   Parameterised queries
-   Input validation
-   Output encoding
-   Secure cookies
-   Environment variables for secrets
-   No secrets committed to Git

------------------------------------------------------------------------

# 10. Component Guidelines

Reusable components:

-   Button
-   Card
-   Dialog
-   Sheet
-   Badge
-   Progress
-   Toast
-   Form controls

Business components:

-   HouseCard
-   ShiftSelector
-   ChecklistSection
-   ChecklistItem
-   OutstandingTaskCard
-   HandoverSummary

------------------------------------------------------------------------

# 11. Folder Organisation

``` text
features/
├── auth/
├── houses/
├── shifts/
├── checklist/
├── handover/
├── notifications/
└── reports/
```

Each feature contains:

-   components
-   hooks
-   services
-   schemas
-   types

------------------------------------------------------------------------

# 12. Coding Practices

-   Small pull requests
-   Feature branches
-   Code reviews required
-   Unit tests for business logic
-   Reusable utility functions
-   Avoid duplicated logic

------------------------------------------------------------------------

# 13. Git Strategy

Main branches:

-   main
-   develop

Feature branches:

feature/`<name>`{=html}

Bug fixes:

fix/`<name>`{=html}

Hotfixes:

hotfix/`<name>`{=html}

------------------------------------------------------------------------

# 14. Commit Convention

Examples:

-   feat: add shift selector
-   fix: prevent duplicate shift
-   refactor: simplify checklist hook
-   docs: update SRS
-   test: add checklist validation tests

------------------------------------------------------------------------

# 15. CI Pipeline

On every pull request:

-   Install dependencies
-   Lint
-   Type check
-   Unit tests
-   Build application

On merge to main:

-   Run Playwright tests
-   Deploy to staging (or production after approval)

------------------------------------------------------------------------

# 16. CD Pipeline

Deployment flow:

Developer ↓ GitHub PR ↓ Automated Checks ↓ Review ↓ Merge ↓ Build ↓
Deploy ↓ Smoke Tests

------------------------------------------------------------------------

# 17. Environment Configuration

Separate environments:

-   Development
-   Staging
-   Production

Each uses separate:

-   Supabase project
-   Database
-   Storage
-   Auth configuration
-   Environment variables

------------------------------------------------------------------------

# 18. Error Handling

-   User-friendly messages
-   Retry transient failures
-   Log unexpected errors
-   Never expose stack traces to users

------------------------------------------------------------------------

# 19. Logging

Application logs:

-   Authentication
-   Shift events
-   API failures
-   Synchronisation
-   Performance metrics

Audit logs remain separate.

------------------------------------------------------------------------

# 20. Performance

Targets:

-   Initial load \<2s
-   Checklist save \<1s
-   Lighthouse score \>90
-   Lazy load non-critical pages
-   Optimise images and fonts

------------------------------------------------------------------------

# 21. Offline Strategy

-   Service Worker
-   Cache shell assets
-   Queue mutations
-   Sync when online
-   Resolve conflicts through server rules

------------------------------------------------------------------------

# 22. Deployment

Frontend:

-   Vercel

Backend:

-   Supabase Cloud

Custom Domain:

-   HTTPS
-   Automatic certificates

------------------------------------------------------------------------

# 23. Monitoring

Recommended:

-   Sentry
-   Vercel Analytics
-   Supabase Logs
-   GitHub Dependabot

------------------------------------------------------------------------

# 24. Documentation Requirements

Every feature should include:

-   User story reference
-   Acceptance criteria
-   API updates
-   Database migration (if required)
-   Tests
-   Changelog entry

------------------------------------------------------------------------

# 25. Definition of Ready

Before development:

-   User story approved
-   Acceptance criteria written
-   UX approved
-   API identified
-   Database impact assessed

------------------------------------------------------------------------

# 26. Definition of Done

A feature is complete when:

-   Code reviewed
-   Tests pass
-   Accessibility checked
-   Documentation updated
-   Security considered
-   Audit logging implemented
-   Product Owner accepts feature

------------------------------------------------------------------------

# 27. Architecture Decisions

-   PWA over native apps for faster rollout and easier maintenance.
-   Supabase selected for rapid development and integrated
    authentication.
-   PostgreSQL selected for reliability and reporting.
-   Row-Level Security enforced for house-level data isolation.
-   Medication handled as verification only, avoiding replacement of
    clinical medication systems.

------------------------------------------------------------------------

# 28. Future Improvements

-   Native mobile apps if justified
-   Background sync improvements
-   AI-assisted handover validation
-   Public API
-   Multi-region deployments

------------------------------------------------------------------------

# 29. Conclusion

This guide establishes a consistent engineering approach for
HandoverSafe, ensuring maintainable code, secure development practices,
reliable deployments, and a scalable architecture aligned with the
project's long-term vision.
