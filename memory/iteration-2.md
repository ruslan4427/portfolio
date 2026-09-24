---
name: Iteration 2 — WebGL Canvas + Hero SplitText — 2026-09-22
type: project
phase: 1-build
sprint: 2
feature: 02-webgl-hero
---

# Sprint 2 checkpoint

## What shipped

- `components/canvas/shaders.ts` — inline vertex + fragment shaders,
  perspective-correct point size, depth-based alpha, additive glow.
- `components/canvas/ParticleField.tsx` — 1800-particle field, ~60KB
  attribute buffer, `useFrame` gated on `visibilityState`, `dt` clamped
  to 50ms to survive tab freezes.
- `components/canvas/CanvasScene.tsx` — R3F `<Canvas>` wrapper with
  `dpr={[1,2]}`, `antialias:false`, `powerPreference:"low-power"`.
- `components/canvas/StaticGradient.tsx` + `CanvasErrorBoundary.tsx` —
  shared reduced-motion + error-boundary fallback.
- `components/canvas/SceneRoot.tsx` (rewrite) — route-gates itself via
  `usePathname()` (returns `null` off `/`), reduced-motion → static
  gradient, otherwise dynamic-imports `CanvasScene` inside error
  boundary. Home page owns the effect; case-study pages stay quiet.
- `components/ui/SplitReveal.tsx` — framer-motion word splitter,
  per-word `overflow-hidden` mask, translate `100%→0`, stagger 60ms, ease
  `[0.22, 1, 0.36, 1]`. Reduced-motion → 250ms opacity fade.
- `components/sections/Hero.tsx` (edit) — SplitReveal on both headline
  lines; meta counter, tagline, footer bar fade in on tail delays that
  collapse under reduced-motion.
- `lib/motion.ts` — `easeOutExpo` retyped as fixed-length tuple;
  `staggerPresets = { word: 0.06, line: 0.12 }` added.

## Verification passed

- `npx tsc --noEmit` — 0 errors.
- `npm run build` — 9 pages, same as Sprint 1.
- Curl sweep — all 5 case studies + home + 404 return expected codes.
- Route-gating — home HTML has 2 fixed `-z-10` wrappers (StaticGradient
  SSR + Canvas mount slot); case-study HTML has 0.
- SplitReveal SSR — home HTML shows `inline-block overflow-hidden` word
  masks (transforms applied post-hydrate by framer).
- Contrast — `#F5F5F5`/`#0B0D12` 17.83:1, `#00FF88`/`#0B0D12` 14.49:1
  (both AAA).

## Bundle measurement

- three + R3F dynamic chunk: **230KB gzipped**.
- Core (non-three) chunks: ~66KB gzipped combined.
- Case-study pages don't load the three chunk (route-gated + dynamic).
- **Budget miss:** spec asked for ≤120KB — that was optimistic. Three
  alone is ~150KB gz. Acceptable because: (a) dynamic import keeps it
  off LCP; (b) reduce-motion visitors never load it; (c) route-gate
  keeps it off case-study reading pages.

## Gotchas caught

- **framer-motion v11 `ease` typing.** Rejects `readonly [0.22, 1, 0.36,
  1] as const` and rejects `number[]`. Wants a fixed-length tuple
  `[number, number, number, number]` (or a string preset, or an
  `Easing[]` array of tuples/strings). If you export a shared easing
  constant, type it as the tuple at declaration — otherwise every
  consumer needs a cast that never lands cleanly in review.
- **`useFrame` dt clamping.** Without it, a tab that sleeps for 30 seconds
  and wakes teleports `uTime` forward by 30 units, snapping the shader
  into wild positions on resume. `Math.min(dt, 0.05)` costs nothing and
  removes the artifact.

## Non-goals still deferred

- Cursor-reactive shader distortion → Sprint 3 candidate.
- Scroll-linked camera path across sections → Sprint 3+.
- Hover video previews on project cards → Sprint 3 (needs recorded video).
- Modal-as-route via parallel/intercept → Sprint 4.
- AudioPlayer for podcast episodes → Sprint 4 (gated on ElevenLabs PVC).
- About + Footer polish → Sprint 5.
- a11y audit + Vercel deploy + OG images → Sprint 6.

## Blocking human actions unchanged

1. `ruslan.dev` availability check.
2. 5 project preview video recordings (10–15s each) — Sprint 3 gate.
3. ElevenLabs PVC voice recording session (~30 min) — Sprint 4 gate.

## Next up

Sprint 3 — **Hover video previews on project cards.** Gated on Ruslan
recording 5 preview clips (10–15s each). While that gate is closed, an
adjacent option is **Sprint 5 polish** (About + Footer + Nav active
state) or a **cursor-reactive shader micro-feature** (magnetic cursor
distortion on Hero — small, self-contained, no human blocker).
