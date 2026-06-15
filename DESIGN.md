---
name: AAP Control Surface
description: Cool-neutral compliance-tooling console — white cards on a crisp slate-tinted canvas, clearly-drawn hairline borders, squared dark-ink buttons, tight radii, and punchy semantic status colors. Reads as a precise internal control register, not a cream SaaS app.
canonical_reference: src/app/dashboard/page.tsx
tokens_source_of_truth: src/app/globals.css         # never hardcode hex in components; use semantic tokens
colors:
  canvas: "#eceff3"
  surface: "#ffffff"
  surface-raised: "#e1e6ec"
  border: "#c8d0da"
  border-strong: "#b3bcc8"
  ink: "#16191d"
  ink-muted: "#6b7480"
  ink-faint: "#9aa2ae"
  accent: "#16191d"
  accent-ink: "#f7f8f9"
  success: "#059669"
  danger: "#dc2626"
  warning: "#d97706"
  info: "#2563eb"
  attention: "#ea580c"
typography:
  font: Geist Sans
  mono: Geist Mono
  scale: "text-xs (12) → text-sm (14) → text-base (16) → text-2xl (24) → text-4xl (36)"
  numerics: "tabular-nums for IDs, timestamps, counts and money"
rounded:
  sm: 6px
  md: 8px
  lg: 12px
spacing:
  unit: 4px
  rhythm: "gap-1 (4) · gap-3 (12) · gap-5 (20) · gap-8 (32) · py-20 (80) for section rhythm"
components:
  button: "h-10 rounded-md px-4, primary = dark-ink fill + light text, no shadow (border-defined)"
  card: "rounded-lg border border-border bg-surface, shadows kept subtle"
  badge: "rounded-sm px-2 py-0.5 text-xs font-semibold, punchy tonal fg on pale tint"
  input: "h-11 rounded-md border border-border, focus ring on accent/10"
---

# AAP Control Surface — Design System

> **For future agents:** this is the single source of design truth for `sample-web-ui`.
> Read it before touching any UI. The colour/radius/shadow **values** live as semantic
> tokens in `src/app/globals.css` — reference those, never hardcode hex. The agreed look is
> already built in `src/app/dashboard/page.tsx` — when in doubt, open it.

## North star / the vibe

**Precise internal compliance tooling — an auditable control register, not a marketing
SaaS app.** The people using this are making consequential calls (approving an agent's
production deploy, a $4k refund, a bucket delete) repeatedly, at speed, in good faith. The
interface should feel **calm, legible, and accountable**: quiet neutral chrome, generous
structure, and colour that *always means something*. The one expressive move is **punchy
semantic status colour** (risk tier, decision state) popping against a deliberately calm
slate background. Nothing decorative competes with that signal.

Three words: **calm, precise, accountable.** Not: warm, playful, luxurious, flashy.

## Principles (the hard rules)

1. **Cool neutral, never warm.** Every surface/border/text tone is on one slate ramp
   (hue ≈255). Never drop a cream/beige/warm-grey into the scene. (We migrated *off* a warm
   cream theme on purpose.)
2. **Borders define edges; shadows stay quiet.** This is a flat, tool-like surface. The
   hairline `border` is how a card separates from the canvas — not a drop shadow.
3. **Contrast is non-negotiable.** `canvas` (`#eceff3`) is intentionally a slate grey so
   white cards stand off it, and `border` (`#c8d0da`) is a *clear* step darker so edges and
   row dividers never wash out. **If you change neutrals, eyeball card-vs-canvas and
   border-vs-both — washed-out borders have bitten us twice.**
4. **Punch lives only in semantics.** Risk and status colours are saturated and legible;
   the chrome stays calm. Punch comes from *contrast against quiet*, not from colouring
   buttons, headers, or backgrounds.
5. **Squared, not pill.** Buttons, badges, filter chips use `rounded-md`/`rounded-sm`.
   `rounded-full` is reserved for avatars and status dots only.
6. **Tabular figures for aligned numbers.** IDs, timestamps, counts, money use
   `tabular-nums` (+ `font-mono` for IDs/refs/timestamps) so columns line up.
7. **Semantic tokens only.** Components reference `bg-surface`, `text-ink-muted`,
   `border-border`, `text-warning`, etc. — defined in `globals.css`. No raw hex in
   component files (the `/dashboard/N` mockups are the only exception, by design).

## Domain vocabulary → colour mapping

The product has two coloured axes. Keep these mappings consistent everywhere.

| Risk tier  | Token / Badge tone | Reads as |
| ---------- | ------------------ | -------- |
| `critical` | `danger` (red)     | stop and think |
| `high`     | `warning` (amber)  | elevated, review carefully |
| `low`      | `success` (green)  | routine |

| Decision status | Token       | Dot + label colour |
| --------------- | ----------- | ------------------ |
| `pending`       | `warning`   | amber |
| `approved`      | `success`   | green |
| `rejected`      | `danger`    | red |
| `cancelled`     | `ink-faint` | neutral grey |
| `timed_out`     | `attention` | orange |

- **Risk** is shown as a filled tonal **chip** (`<Badge tone={risk}>`), always present.
- **Status** is shown as a **coloured dot + bold coloured label** (lighter than a chip), see
  `STATUS_STYLE` in `src/components/approvals-panel.tsx`.
- **Pending rows** get a subtle warm highlight
  (`color-mix(in oklab, var(--color-warning-muted) 50%, white)`) — the one sanctioned spot
  of warmth, signalling "needs you".

## Colour system

One cool slate ramp (`--neutral-0…950`, hue ≈255) drives all neutrals; light end is a
crisp near-white surface, dark end is the cool near-black `ink`/`accent`. Status hues
(`green/red/amber/blue/orange`) are punchy: a saturated, legible **foreground** paired with
a **pale tint background** — never a bare unpaired saturated fill. Everything downstream
references semantic roles only: `canvas`, `surface`/`surface-raised`,
`border`/`border-strong`, `ink`/`ink-muted`/`ink-faint`, `accent`/`accent-ink`, and
`success/danger/warning/info/attention` (+ their `-muted` tints). Use `ink` (`#16191d`),
never pure black; white `surface` is fine against the slate canvas.

## Typography

Geist Sans for UI; Geist Mono for IDs, references, timestamps, tokens, code-like values. A
short deliberate scale: titles `text-2xl`–`text-4xl` semibold with tight tracking; labels
and body at `text-sm`/`text-base`; muted/faint ink tones (real tokens, **not** opacity
tricks) for secondary text. `tabular-nums` on aligned numerics. Uppercase tracked
micro-labels are for table headers / rare eyebrows only — never a general label style.

## Elevation

Borders, not shadows. `--shadow-card` (subtle, cool) for the occasional resting surface and
`--shadow-raised` for dialogs / hover emphasis exist, but stay quiet. Flat and tool-like,
not floaty.

## Component recipes (match these exactly)

- **Button** (`components/ui/button.tsx`): `h-10 rounded-md px-4 text-sm font-medium`.
  `primary` = `bg-accent text-accent-ink border border-accent` (no shadow); `secondary` =
  surface + `border-border-strong`; `ghost` = transparent → `hover:bg-surface-raised`;
  `danger` = transparent text-danger + faint danger border.
- **Card** (`components/ui/card.tsx`): `rounded-lg border border-border bg-surface`.
- **Badge** (`components/ui/badge.tsx`): `rounded-sm px-2 py-0.5 text-xs font-semibold`,
  tonal fg on `-muted` tint. Tones: status + `critical`/`high`/`low` risk.
- **Input** (`components/ui/input.tsx`): `h-11 rounded-md border border-border`, focus =
  `border-ink-faint` + `ring-2 ring-accent/10`.
- **Segmented control** (filter chips, see `approvals-panel.tsx`): one
  `inline-flex rounded-md border border-border-strong` container, items share `border-l`
  dividers, active item = `bg-ink text-canvas`. **Not** spaced individual pills.
- **Loading / auth states**: themed full-screen spinner in `components/loading-screen.tsx`
  (border ring + `border-t-accent` + the `A` mark). Reuse it for verification waits.
- **Avatars / dots**: `rounded-full`, filled `surface-raised`.
- **Modal headers**: `Dialog.Title` + `Dialog.Description` only — a real title and
  one-line subtitle. No uppercase "eyebrow" label (e.g. "SETTINGS", "APPROVAL REVIEW")
  above the title; it's redundant with the title and adds clutter. Status/risk badges,
  if relevant, sit directly above the title instead of in a separate eyebrow row.
- **Confirm dialog** (`components/ui/confirm-dialog.tsx`): reusable destructive/blocking
  confirmation modal — `Dialog.Title` + optional `Dialog.Description`, cancel + confirm
  buttons (confirm uses `variant="danger"` for destructive actions). Use this instead of
  `window.confirm` for any irreversible action (delete, revoke, etc.).

## Anti-patterns

**Generic / "AI-looking" tells to avoid** (we explicitly rejected these):

- Startup-indigo/violet as a primary accent. Our accent is near-black ink; punch is semantic.
- Perfectly even N×N metadata grids, gratuitous keyboard-hint rows, and filler helper text
  ("Your decision is recorded…"). Prefer asymmetric definition rows and domain-specific
  detail (e.g. a `what changes` diff) over template scaffolding.
- Warm cream / paper / serif-masthead "luxury". This is utilitarian tooling.
- Pills everywhere; floaty drop-shadow cards; bare saturated fills.
- Washed-out borders (border too close to canvas) — see principle #3.

## Checklist when adding new UI

- [ ] Uses semantic tokens, no raw hex (outside `/dashboard/N` mockups).
- [ ] Squared radii (`rounded-md`/`sm`/`lg`); `rounded-full` only for avatars/dots.
- [ ] Risk → chip, status → dot+label, per the mapping table.
- [ ] Numbers/IDs/timestamps use `tabular-nums` (+ `font-mono` where appropriate).
- [ ] Edges carried by `border-border`; shadows kept subtle.
- [ ] Card-vs-canvas and border contrast verified by eye.
- [ ] Chrome stays calm; colour is reserved for meaning.
