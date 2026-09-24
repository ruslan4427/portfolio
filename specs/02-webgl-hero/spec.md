# Feature 02 · WebGL Canvas + Hero SplitText reveal

**Status:** Draft · **Owner:** Claude (impl), Ruslan (visual sign-off) · **Created:** 2026-09-22 · **ShipLoop phase:** Spec · **Class:** L (large — new subsystem, > 3 files)

## Problem

The scaffold currently renders a static radial gradient (`SceneRoot` stub)
behind every section. That's the sane placeholder — it holds the layout and
respects `prefers-reduced-motion` — but the site's *thesis* is
Lusion-immersive: a continuous, generative background that makes the page
feel alive without stealing focus from typography.

Second thread: the Hero headline currently renders as static text. The
motion contract in CLAUDE.md commits to a per-word SplitText reveal (translate
`100% → 0`, stagger 60ms, ease `[0.22, 1, 0.36, 1]`) — that promise is
undelivered.

Sprint 2 delivers both: a real R3F Canvas with a generative particle field,
and the SplitText reveal on Hero copy. Both must fail gracefully under
`prefers-reduced-motion`.

## Non-goals

- **Not** post-processing / bloom / DoF — STABLE_LOGIC bans it.
- **Not** physics — no Rapier.
- **Not** cursor-reactive shader distortion (Sprint 3 candidate).
- **Not** scroll-linked camera paths across sections (Sprint 3+).
- **Not** hover video previews on project cards (Sprint 3).
- **Not** replacing `SmoothScroll` — Lenis stays as-is.
- **Not** a hero background image or video.
- **Not** editing case-study pages — `/work/[slug]` keeps its plain canvas
  background (no WebGL layer, for reading focus).

## User-facing behavior

### As a visitor on the home page

- Behind the content I see a slowly drifting field of small luminous
  points against the near-black canvas — sense of depth (particles at
  different Z), additive blending gives a soft glow around each.
- Motion is continuous and *slow* — no snap, no beat, no camera swing.
  Feels like starfield-through-fog, not a screensaver.
- On page load, the Hero headline reveals word-by-word: each word slides
  up from below its own mask (100% → 0 translate), staggered ~60ms,
  eased `[0.22, 1, 0.36, 1]`. Total sequence ≤ 900ms. Mono meta line
  (`01 / 05 — HERO`) and CTA fade in after the last word lands.
- No WebGL layer on `/work/[slug]` — reading pages stay quiet.

### Under `prefers-reduced-motion: reduce`

- Particle field is replaced by the current static radial gradient (no
  Canvas mounted, no shader compiled).
- Hero headline renders as a plain opacity `0 → 1` fade (250ms), meta +
  CTA fade at the same time.
- No parallax, no drift, no delay chains beyond that single fade.

### Performance envelope

- Home page LCP ≤ 2.0s on cable/desktop, ≤ 3.0s on 4G/mobile (Vercel
  Speed Insights baseline).
- Steady-state frame budget: ≥ 55 fps on M-series MacBook, ≥ 45 fps on
  a 2020 iPhone SE in Safari. No dropped frames during idle scroll.
- Canvas is pause-on-blur — `useFrame` halts when the tab is not visible
  (via `document.visibilityState`).
- Particle count budget: ≤ 2500. Attribute buffer ≤ 60KB total.

## Acceptance criteria

1. Visiting `/` mounts a `<Canvas>` inside `SceneRoot`, containing exactly
   one `<Points>` primitive with a custom `ShaderMaterial`.
2. Visiting `/work/<slug>` does **not** mount `<Canvas>` (route-gated).
3. Hero headline reveals word-by-word on first paint; sequence total
   ≤ 900ms; final state matches the current static rendering pixel-for-pixel
   in Chromium DevTools.
4. `prefers-reduced-motion: reduce` (verified via DevTools emulation):
   - No `<Canvas>` element in DOM.
   - Static radial gradient visible.
   - Hero opacity fade completes ≤ 250ms; no per-word transform.
5. Contrast unchanged: body text `#F5F5F5` on `#0B0D12` still 17.83:1.
6. No new colors added to `globals.css`. Particle color is `--accent`
   with per-particle alpha derived from Z and shader-side noise.
7. Bundle size: `SceneRoot` client chunk ≤ 120KB gzipped (three + drei
   tree-shaken to essentials). Total home page JS ≤ 250KB gzipped.
8. `npx tsc --noEmit` clean.
9. `npm run build` succeeds; static generation of 9 pages unchanged.
10. STABLE_LOGIC rules hold: no `rounded-*`, no third font, no post-
    processing, radii = 0.

## Data model / API surface

No new persistent data. Only in-memory geometry.

### Particle geometry

- Count: `N ≤ 2500` (default 1800).
- Positions: uniform random inside a `20 × 20 × 20` cube centered on origin.
- Per-particle attribute: `aSeed` (float) — used for phase-offset in the
  vertex shader so particles drift independently.

### Shader inputs

```glsl
uniform float uTime;      // seconds since mount
uniform float uOpacity;   // 0..1 (allows a mount fade-in)
uniform vec3  uAccent;    // #00FF88 -> vec3
```

Vertex: displace position by `sin(uTime * 0.1 + aSeed)` on Y, tiny amount.
Fragment: circular gradient point (soft edge via `smoothstep`), color =
`uAccent`, alpha = f(distance-to-center × depth × noise).

Shaders live inline in the R3F component as tagged template strings — no
`.glsl` files this sprint. (Turbopack rule config is deferred until we
actually need a second shader.)

## Dependencies

- Already installed: `three`, `@react-three/fiber`, `@react-three/drei`,
  `gsap`, `lenis`, `framer-motion`.
- No new packages. SplitText is implemented in-house (`SplitReveal.tsx`)
  using framer-motion's `stagger` API — no GSAP SplitText license needed.

## Risks & mitigations

- **Risk:** R3F Canvas hydration cost hurts LCP.
  **Mitigation:** `<Canvas>` is a client component loaded via
  `next/dynamic` with `{ ssr: false }`. First paint shows the static
  gradient fallback; Canvas mounts on client. Reduced-motion users skip
  Canvas entirely.
- **Risk:** WebGL crash on iOS Safari (context loss, memory pressure).
  **Mitigation:** wrap `<Canvas>` in an error boundary that falls back to
  the static gradient. Log to Vercel Speed Insights on catch.
- **Risk:** SplitText reveal double-fires on route re-entry (back button).
  **Mitigation:** `SplitReveal` uses `useReducedMotion()` + a `useEffect`
  that runs once per mount. Route entry from `/work/*` back to `/` will
  replay the reveal — acceptable, matches Lusion pattern.
- **Risk:** Additive blend + green accent oversaturates on light-DPR
  screens.
  **Mitigation:** cap `alpha ≤ 0.55` in the fragment shader; verify
  visually at 1x and 2x DPR.
- **Risk:** Turbopack + `three`'s CJS exports conflict.
  **Mitigation:** `transpilePackages: ["three"]` is already set in
  `next.config.ts`.

## Success signal

- `npm run build && npm start`. Home page shows drifting particle field
  + Hero SplitText reveal on first load. `/work/noble-saas` shows plain
  canvas background (no Canvas mounted). Chrome DevTools *emulate CPU 4×
  slowdown* + *reduced motion* toggle: reduced-motion path holds ≥ 60fps
  (nothing running), non-reduced holds ≥ 45fps.
- Manual visual pass at mobile (375px) and desktop (1440px) widths.
