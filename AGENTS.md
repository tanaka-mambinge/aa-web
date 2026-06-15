<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design

Before building or restyling any UI, read **`DESIGN.md`** — it is the single source of design
truth for this app (the vibe, hard rules, colour/typography system, component recipes, and
anti-patterns). Colour/radius/shadow values live as semantic tokens in `src/app/globals.css`;
reference those, never hardcode hex. The live dashboard implementation is in `src/app/dashboard/page.tsx`.

# Project layout

- `src/app/` — Next.js App Router routes/pages (e.g. `dashboard/page.tsx` is the canonical
  design reference).
- `src/components/` — feature components (panels, dialogs, nav). Subfolders group a
  feature's pieces, e.g. `components/settings/` (profile/password/notifications sections
  used by `settings-dialog.tsx`), `components/auth/`.
- `src/components/ui/` — generic, reusable primitives shared across features: `button.tsx`,
  `card.tsx`, `badge.tsx`, `input.tsx`, `tooltip.tsx`, `confirm-dialog.tsx`. **Check here
  first** before building a new primitive (e.g. a confirmation modal, a button variant) —
  reuse or extend rather than duplicating one-off versions in feature components.
- `src/hooks/` — SWR-based data hooks (`use-approvals.ts`, `use-cli-tokens.ts`,
  `use-current-user.ts`, `use-push-notifications.ts`). Mutating actions should use SWR's
  `mutate` with `optimisticData`/`populateCache`/`revalidate: false` so action buttons
  don't flash a loading/refetch state — see `tokens-panel.tsx` and
  `approval-detail-dialog.tsx` for the pattern.
- `src/lib/` — shared utilities: `http.ts` (`apiRequest`), `format.ts`
  (`formatRelativeTime` — prefer this over raw numeric dates anywhere in the UI),
  `types.ts`, `cn.ts`.
- `src/stores/` — small Zustand UI stores (dialog open state, selected items, filters).

# Forms must use react-hook-form

Every form must use `react-hook-form` (`useForm`) with `@hookform/resolvers/zod` and a Zod schema
for validation. Render field-level errors below the relevant input via `Input`'s `error` prop
(`errors.<field>?.message`), not as a single top-of-form banner. Reserve the top banner
(`AuthFormCard`'s `error`/`success` props, etc.) for non-field errors like failed API calls. Use
`handleSubmit(onSubmit)` on the `<form>` element so pressing Enter submits. See
`components/login-form.tsx` for the reference implementation.

# Modals must be hash routes

Every modal/dialog/full-screen sheet must bind its open state to a URL hash route via
`src/hooks/use-hash-modal.ts` (`useHashModal("some-name")` → `{ open, openModal, close }`),
so the browser/device back button closes it instead of leaving the page. See
`components/approval-filter-sheet.tsx` for the reference implementation. Do not introduce
new modals with local-only `useState` open state.

The companion FastAPI backend lives at `../backend` (routes in
`src/backend/routes/`, services in `src/backend/services/`, repositories in
`src/backend/repositories/`). If a UI feature needs a new endpoint, add the route +
service + repository method there, and add/extend tests in `../backend/tests/`. The
backend runs via `fastapi run` (no autoreload) — restart it after backend code changes
for them to take effect.
