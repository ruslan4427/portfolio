---
name: Iteration 6 — a11y + OG + sitemap — 2026-09-24
type: project
phase: 1-build
sprint: 6
feature: (S-class, no spec triple)
---

# Sprint 6 checkpoint (a11y + share cards + crawler)

## What shipped

- **`app/globals.css`** — dropped `border-radius: 2px` on `:focus-visible`
  (STABLE_LOGIC radii=0).
- **`components/layout/SmoothScroll.tsx`** — wraps children in
  `<MotionConfig reducedMotion="user">`. All framer components now honor
  `prefers-reduced-motion` without per-component gates.
- **`components/layout/SkipToMain.tsx`** (new) — first focusable in body,
  jumps to `#main` on `/` and `/work/*`.
- **Nav mobile menu** — `role="dialog"`, `aria-modal`, `aria-controls`,
  focus lands on first link, Escape closes, Tab cycles internally, close
  restores focus to hamburger button.
- **`app/opengraph-image.tsx`** + **`app/(marketing)/work/[slug]/opengraph-image.tsx`**
  — 1200×630 PNG via `next/og`. Per-slug variant prerenders study title,
  tagline, role, year, status. Static, cached.
- **`app/sitemap.ts`** + **`app/robots.ts`** — 6 URLs, allow-all + sitemap
  pointer.

## Verification

- `npx tsc --noEmit` — clean.
- `npm run build` — 17 static pages, zero dynamic routes.
- `curl /robots.txt`, `/sitemap.xml` return expected content.
- `curl /` + `/work/lexora` contain skip-link + `id="main"`.
- OG images return `HTTP 200 image/png`.

## Lesson worth keeping

Next 16 quirk: metadata route handlers (`opengraph-image`, `icon`, etc.)
that colocate with a `[slug]` page do NOT inherit the page's
`generateStaticParams`. If you want the per-slug OG to prerender at build
time you have to re-declare `generateStaticParams` inside the OG file
itself, otherwise the route stays dynamic and every share crawl pays a
cold render.

Also: `<MotionConfig reducedMotion="user">` at the app root beats per-
component `usePrefersReducedMotion` — the latter is silent drift bait.

## Non-goals still deferred

- Vercel deploy — external action, user-owned.
- `ruslan.dev` DNS/availability check — blocks metadataBase from being
  more than aspirational.
- Sprint 3 (hover video previews) — user recording gate.
- Sprint 4 (case-study modal + AudioPlayer) — ElevenLabs PVC gate.

## Blocking human actions

1. `ruslan.dev` availability check — blocks canonical URLs, OG absolute
   URLs, deployment domain.
2. 5 project preview video recordings (10–15s each) — Sprint 3 gate.
3. ElevenLabs PVC voice recording session (~30 min) — Sprint 4 gate.
4. Vercel deploy (`vercel --prod` or GitHub connect) — user's terminal,
   user's account.

## Next up

Site is fully deploy-ready. Recommended sequence:

1. User confirms `ruslan.dev` availability, sets DNS.
2. User runs `vercel` (or connects the repo in the dashboard) — first
   deploy.
3. Sprint 3 & 4 layer in as their gates open (video clips + voice PVC).
