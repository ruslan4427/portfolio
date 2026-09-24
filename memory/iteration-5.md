---
name: Iteration 5 — Nav / About / Footer polish — 2026-09-23
type: project
phase: 1-build
sprint: 5
feature: (S-class, no spec triple)
---

# Sprint 5 checkpoint (S-class polish)

## Why this shipped before Sprint 3

Sprint 3 (hover video previews on project cards) is blocked on Ruslan
recording 5 preview clips. Sprint 5 polish is self-contained and gets
the site to deploy-ready state without waiting on that gate.

## What shipped

- **`components/layout/Nav.tsx`** — now a client component.
  - Scroll-linked backdrop (transparent → backdrop-blur past 80px scroll).
  - Active-section highlighting via `IntersectionObserver` (rootMargin
    `-40% 0px -55% 0px`), shared `layoutId="nav-active"` underline
    animates between siblings.
  - Mobile hamburger + full-screen `AnimatePresence` menu with staggered
    display-font links. Body scroll locked while open.
  - Dropped `mix-blend-difference` — see Lesson.
- **`components/sections/AboutStack.tsx`** — added bio block on left rail:
  identity headline + self-intro paragraph + Base/Practice/Cadence `<dl>`.
  Section re-labelled `03 · Practice` (was `03 · Model stratification`).
- **`components/layout/Footer.tsx`** — added `04 · Contact` header +
  preamble; specific "Booking Q4 2026 · 1 slot" status; "Kyiv → Ohio" in
  colophon; `getFullYear()` for the copyright.

## Verification

- `npx tsc --noEmit` — clean.
- `npm run build` — 9 pages, unchanged.
- Curl: `/` and `/work/*` all 200; nav anchors + footer status + about
  bio all present in HTML.

## Lesson worth keeping

`mix-blend-difference` on a nav breaks the moment you have a saturated
accent behind it. `#00FF88` ⊖ `#F5F5F5` renders as `#0500A0` (dark
purple) — reads as broken, not premium. Backdrop-blur after a scroll
threshold is boring but works against every possible background. Rule:
if the design has two or more hues, don't rely on blend modes for chrome
legibility.

## Bundle impact

Nav promoted from server → client adds framer-motion to the initial
bundle path for `/`. framer-motion was already loaded on `/` for the
Hero SplitReveal, so net-new bytes ≈ 0.

## Non-goals still deferred

- Cursor-reactive shader micro-feature (Hero magnetic distortion) →
  optional post-deploy.
- Hover video previews on project cards → Sprint 3 (needs videos).
- Modal-as-route via parallel/intercept → Sprint 4.
- AudioPlayer for podcast episodes → Sprint 4 (needs ElevenLabs PVC).
- a11y audit + Vercel deploy + OG images → Sprint 6.

## Blocking human actions unchanged

1. `ruslan.dev` availability check — blocks metadata/OG absolute URLs.
2. 5 project preview video recordings (10–15s each) — Sprint 3 gate.
3. ElevenLabs PVC voice recording session (~30 min) — Sprint 4 gate.

## Next up

- **Sprint 6** (a11y audit + deploy + OG images) is the natural next
  step — the site is otherwise deploy-ready. Sprint 3/4 layer in later
  as their gates open.
- Recommended micro-feature before deploy: verify all keyboard
  navigation, focus rings, and reduce-motion paths in browser (Nav
  IntersectionObserver + mobile menu focus-trap deserve a real check).
