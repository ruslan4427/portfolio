# STABLE_LOGIC

Rules that survive future refactors. If a Claude session wants to change
anything below, it must open a discussion, not a diff.

Promoted from `DEVLOG.md` when a decision has proven itself across at least
two sessions or one full sprint.

---

## Design tokens

- **Page** is `#F5F4EF` (warm paper). Not `#FFF`. Not any cool gray. This
  exact hex. Reason: warm paper reads as editorial and reduces the clinical
  SaaS feel of pure white.
- **Ink** is a monochrome ramp: `#111` primary → `#2A2A28` body → `#6B6B66`
  muted → `#A8A8A2` faint (decorative only, never text).
- **Green `#22C55E` is the only chromatic accent** and is functional — it
  signals "available for work" on the status dot. Never used decoratively.
  If a second signal is needed, it comes from ink weight/opacity, not a hue.
- **Radii** come from tokens: `--radius-card` (16px), `--radius-tile` (12px),
  `--radius-pill` (999px). No arbitrary `rounded-[Npx]`. If a shape wants
  something else, add a token or reshape the composition.
- **Font families cap at 2**: Fraunces (serif, italic display) + Inter (sans,
  body/nav/chrome). No third family. No mono.

## Motion

- `prefers-reduced-motion` fallback is a **hard requirement** on every
  animated component. Not a stretch goal.
- `SmoothScroll` early-returns under reduce-motion. `DotGrid` renders the
  static radial-gradient fallback. Framer respects
  `MotionConfig reducedMotion="user"` (opacity only).
- **Cursor-reactive effects also gate on `matchMedia("(hover: hover)")`** —
  no pointer-following animation on touch devices, regardless of
  reduce-motion. Reason: mobile users don't have a cursor to react to.

## Structure

- One source of truth for project metadata: `content/projects.ts`. The
  `ProjectsGrid`, case-study routes, OG images, and sitemap all read from
  this file. Never duplicate.
- Design tokens live in one place: `app/globals.css` `:root` block. Never
  inline hex values in components.

## Sprint history — locked directions

- **Sprint 7 (2026-09-23)** established the current minimalist editorial
  direction, replacing a dark WebGL "Lusion-immersive" first draft. A future
  session that wants to reintroduce the dark canvas, three.js, or gsap needs
  a fresh spec + user sign-off. Reference lock: Nizar Ali Dribbble 24766210.
