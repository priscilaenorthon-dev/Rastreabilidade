# Supabase Integration and Sales-Ready Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Connect the app to Supabase with production-like data flow and strengthen UX so the product demo feels robust and sellable.

**Architecture:** Add a centralized Supabase REST data layer with typed domain models and fallback demo fixtures for resilience. Move page-level static arrays into shared service functions and wire pages to async loading, error handling, and user actions. Provide SQL schema and seed scripts to bootstrap the provided Supabase project quickly.

**Tech Stack:** Next.js App Router, React client components, Supabase REST API (anon key), TypeScript, Node test runner (`node:test`).

---

### Task 1: Add failing readiness tests for Supabase integration

**Files:**
- Create: `tests/smoke/supabase-readiness.test.mjs`

**Step 1: Write failing tests**
- Assert Supabase env vars exist in `.env.example`.
- Assert `supabase/schema.sql` and `supabase/seed.sql` exist and define core tables.
- Assert centralized service files exist.
- Assert core pages use service functions instead of local fixture arrays.

**Step 2: Run test to verify it fails**
Run: `node --test tests/smoke/supabase-readiness.test.mjs`
Expected: FAIL on missing env vars/files/service wiring.

### Task 2: Build Supabase bootstrap artifacts and configuration

**Files:**
- Modify: `.env.example`
- Create: `.env.local` (workspace only)
- Create: `supabase/schema.sql`
- Create: `supabase/seed.sql`

**Step 1: Add env contract and provided project values**
- Include `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

**Step 2: Add SQL schema and seed**
- Define tables: companies, equipments, opportunities, inspections, maintenances.
- Add FKs, indexes, RLS and demo policies.
- Add realistic seed data mapped to UI flows.

### Task 3: Implement centralized data layer

**Files:**
- Create: `lib/types.ts`
- Create: `lib/demo-data.ts`
- Create: `lib/supabase-rest.ts`
- Create: `lib/data-service.ts`

**Step 1: Create typed models and fallbacks**
- Keep fixtures in one place, not page files.

**Step 2: Implement Supabase REST helpers**
- Select/insert wrappers with auth headers, timeout, and graceful fallback.

**Step 3: Add business-facing aggregates**
- KPI calculators and helper metrics for dashboard/reporting value.

### Task 4: Wire pages to service layer and improve product UX

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/empresas/page.tsx`
- Modify: `app/oportunidades/page.tsx`
- Modify: `app/inspecoes/page.tsx`
- Modify: `app/manutencoes/page.tsx`
- Modify: `app/equipamentos/[id]/page.tsx`
- Modify: `app/relatorios/page.tsx`

**Step 1: Replace page-level arrays with async service loading**
- Add loading, empty, and error states.

**Step 2: Add valuable demo improvements**
- Search and filter in listings.
- Highlight overdue/urgent workload.
- Action buttons with useful behavior (navigation/export placeholders with feedback).

### Task 5: Verify and document runbook

**Files:**
- Modify: `README.md`

**Step 1: Run smoke tests**
- `node --test tests/smoke/navigation-smoke.test.mjs tests/smoke/supabase-readiness.test.mjs`

**Step 2: Capture environment constraints**
- Attempt `npm run build` and `npm run lint`; report blockers if package install policy still blocks.

**Step 3: Document Supabase setup and demo checklist**
- Include exact SQL execution order and expected outcomes.
