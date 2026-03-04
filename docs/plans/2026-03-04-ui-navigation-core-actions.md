# UI Navigation and Core Actions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure all visible navigation paths and high-priority buttons/forms work for client demo flows.

**Architecture:** Keep UI-first client-side implementation with minimal structural changes. Add missing route pages for sidebar destinations, wire critical CTAs to real navigation/handlers, and verify with smoke tests that detect regressions in route/action wiring.

**Tech Stack:** Next.js App Router, React client components, Node.js built-in test runner (`node:test`).

---

### Task 1: Add failing smoke coverage for navigation and critical actions

**Files:**
- Create: `tests/smoke/navigation-smoke.test.mjs`

**Step 1: Write failing test**
- Add checks for sidebar route/page parity.
- Add checks for logout navigation, login submit flow wiring, and dashboard "Ver todos" action routing.

**Step 2: Run test to verify it fails**
Run: `node --test tests/smoke/navigation-smoke.test.mjs`
Expected: FAIL on missing pages and missing action wiring.

### Task 2: Fix broken routes and primary nav actions

**Files:**
- Modify: `components/Sidebar.tsx`
- Create: `app/inspecoes/page.tsx`
- Create: `app/manutencoes/page.tsx`
- Create: `app/relatorios/page.tsx`

**Step 1: Implement minimal route fixes**
- Keep existing nav entries and create corresponding pages.
- Convert logout control into navigation to `/login`.

**Step 2: Verify route test scope**
Run: `node --test tests/smoke/navigation-smoke.test.mjs`
Expected: route-related failures resolved.

### Task 3: Fix login submit behavior and dashboard alerts CTA

**Files:**
- Modify: `app/login/page.tsx`
- Modify: `app/page.tsx`

**Step 1: Implement minimal behavior fixes**
- Remove submit button wrapped by `Link`.
- Use explicit submit handler to navigate after basic validation.
- Make dashboard "Ver todos" route to `/oportunidades`.

**Step 2: Verify tests pass**
Run: `node --test tests/smoke/navigation-smoke.test.mjs`
Expected: PASS.

### Task 4: Validate and report constraints

**Files:**
- Modify: `README.md` (if required to document env limitation)

**Step 1: Run feasible project verification commands**
- `node --test tests/smoke/navigation-smoke.test.mjs`
- Attempt project build/lint commands and capture blockers.

**Step 2: Summarize with evidence**
- List corrected flows.
- List commands run and outcomes.
- Explicitly state environment constraints (if dependency install is blocked).
