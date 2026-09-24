# Feature 02 · Tasks

**Companion to:** `spec.md`, `plan.md` · **ShipLoop phase:** Tasks

Ordered top-to-bottom; each task is one small commit unless marked `[bundle]`.

## Setup

- [ ] **T-01.** `lib/motion.ts` — export `easeOutExpo = [0.22, 1, 0.36, 1]`
      (already present; verify) and add `staggerPresets = { word: 0.06,
      line: 0.12 }`. No new file.

## Canvas subsystem

- [ ] **T-02.** Create `components/canvas/shaders.ts` with `vertexShader`
      and `fragmentShader` tagged template strings from `plan.md`.
- [ ] **T-03.** Create `components/canvas/ParticleField.tsx` per
      `plan.md`. `useMemo` positions + seeds; `useFrame` with
      `visibilityState` gate; `AdditiveBlending`, `depthWrite: false`.
- [ ] **T-04.** Create `components/canvas/StaticGradient.tsx` — extract
      the current radial-gradient markup from the existing `SceneRoot` stub
      into its own component so both the reduced-motion path and the error
      boundary can render it.
- [ ] **T-05.** Create `components/canvas/CanvasErrorBoundary.tsx` — tiny
      class component, `componentDidCatch` renders `<StaticGradient />`
      and `console.warn`s the error message once.
- [ ] **T-06.** Create `components/canvas/CanvasScene.tsx` — client
      component wrapping `<Canvas dpr={[1, 2]} camera={{ position: [0,0,8],
      fov: 55 }} gl={{ antialias: false, powerPreference: "low-power" }}>`
      + `<ParticleField />` inside.

## Route gating

- [ ] **T-07.** Rewrite `components/canvas/SceneRoot.tsx` per `plan.md`
      routing rules: `usePathname()` → `null` off `/`; reduced-motion →
      `<StaticGradient />`; otherwise dynamic-import `CanvasScene` with
      `{ ssr: false }` inside a `<CanvasErrorBoundary>`.

## SplitText

- [ ] **T-08.** Create `components/ui/SplitReveal.tsx` per `plan.md`.
      Whitespace split; per-word `overflow-hidden` mask; framer-motion
      stagger + ease `[0.22, 1, 0.36, 1]`; reduced-motion → opacity fade.
- [ ] **T-09.** Edit `components/sections/Hero.tsx` — wrap the headline
      in `<SplitReveal as="h1" className="…">`. Preserve all existing
      Tailwind classes. Fade in the mono counter + tagline after the last
      word lands (framer `motion.div` with `delay: 0.9`).

## Verify

- [ ] **T-10.** `npx tsc --noEmit` — zero errors.
- [ ] **T-11.** `npm run build` — succeeds; page count unchanged (9);
      home page client JS ≤ 250KB gzipped (record actual number in DEVLOG).
- [ ] **T-12.** Manual: load `/` in Chrome, confirm drifting particles +
      Hero reveal. Load `/work/noble-saas` — confirm no `<canvas>` element
      via DevTools *Elements* inspector.
- [ ] **T-13.** DevTools *Rendering* → *emulate CSS media feature
      prefers-reduced-motion → reduce*, reload `/`. Confirm: no `<canvas>`,
      static gradient visible, headline fades in ≤ 250ms.
- [ ] **T-14.** DevTools *Performance* record 5s scroll on `/` at
      *CPU 4× slowdown*. Confirm ≥ 45 fps steady-state.
- [ ] **T-15.** Contrast recheck `#F5F5F5` on `#0B0D12` — must remain
      17.83:1. Same for `#00FF88` on `#0B0D12` — must remain 14.49:1.
- [ ] **T-16.** DEVLOG entry: `Problem/Decision/Result/Lesson` for the
      WebGL Canvas + SplitText delivery. Include actual bundle number.
- [ ] **T-17.** Save `memory/iteration-2.md` — what shipped in Sprint 2,
      what's next.

## Definition of Done

- Home page shows a drifting particle field behind content.
- Hero headline reveals per-word on first paint, ≤ 900ms total.
- `prefers-reduced-motion` fully bypasses Canvas + shows opacity fade.
- `/work/[slug]` pages have no Canvas mounted.
- Type-check green. Build green. Bundle budget met.
- DEVLOG + memory checkpoint written.
