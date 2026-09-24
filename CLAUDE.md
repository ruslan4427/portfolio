@AGENTS.md

# Portfolio — Claude working instructions

**Read this file, then `DEVLOG.md`, then `STABLE_LOGIC.md` before any change.**

---

## ShipLoop Protocol (applied to every session)

This project runs under ShipLoop v2.0. Every incoming message is silently
classified before responding:

| Class | Trigger | Action | Model |
|-------|---------|--------|-------|
| **Q** Quick question | "what", "explain", "how does", "why" | Answer directly | haiku |
| **B** Bug | "error", "crash", "doesn't work", "fix" | Diagnose → fix → verify → DEVLOG | sonnet |
| **S** Small feature | < 3 files, < 1h | Verify spec exists → implement → DEVLOG | sonnet |
| **L** Large feature | new screen/service, > 3 files | Suggest Opus → full speckit cycle | **opus** |
| **R** Refactor | "refactor", "clean", "extract" | Analyze → propose → implement | sonnet |
| **T** Testing/QA | "test", "QA", "UX", "analyze" | /shiploop-tester | sonnet |
| **D** Discovery | "brainstorm", "design", "ideas", "how should we" | Suggest Opus → /shiploop-brainstorm | **opus** |
| **M** Memory | "what did we", "status", "where are we" | Read `memory/` → answer | haiku |
| **O** Observer | "optimize agents", "improve workflow" | /shiploop-observer | sonnet |

**Rule for L and D:** state the plan + suggest `/fast` (Opus) before starting.

### Lifecycle

```
Discovery → Spec → Plan → Tasks → Build → QA → Ship → Retro → (loop)
```

Nothing gets built without passing through `/shiploop-start` or an explicit
`spec.md + plan.md + tasks.md` triple in `specs/<feature>/`.

### Team protocol

- Feature request → **spec first, never code immediately**
- Bug → diagnose root cause → fix → verify → append to `DEVLOG.md`
- Question → direct answer
- After every implementation → update `DEVLOG.md`
- After every QA run → create `memory/qa-iteration-N.md`
- After every release → run `/shiploop-brainstorm stage=retrospective`

### Memory checkpoints

Save `memory/` file at each phase boundary:
- Phase 0 complete → `memory/project-discovery.md`
- Build iteration → `memory/iteration-N.md`
- QA cycle → `memory/qa-iteration-N.md`
- Release → `memory/release-N.md`

### Skills available in `.claude/skills/`

- `/shiploop-start` — single entry point, routes to phase
- `/shiploop-router` — classify any request
- `/shiploop-brainstorm stage=<discovery|post-spec|post-qa|retrospective>` — structured brainstorm
- `/shiploop-tester` — full QA pipeline
- `/shiploop-observer` — check chain health, propose optimizations

**Speckit is NOT installed** — spec/plan/tasks documents are authored manually
in `specs/<N>-<slug>/` following the format described in the shiploop-start
skill.

---

## Portfolio-specific rules

## What this is

Ruslan Grekov's personal portfolio. Single-page scroll experience showcasing
five AI-collaboration case studies. **Minimalist editorial** direction (as of
Sprint 7, 2026-09-23): warm off-white paper, charcoal ink, monochrome + a
single green availability dot, oversized italic Fraunces headings, generous
whitespace, rounded cards. A mouse-reactive dot-grid `<canvas>` is the only
ambient motion.

Reference: Nizar Ali "Personal Website & Portfolio" (Dribbble shot 24766210).

## Stack (locked)

- Next.js 16 (App Router, Turbopack, TypeScript)
- React 19, Tailwind CSS v4 (no config file — `@theme inline` in `globals.css`)
- `next/font/google` — Fraunces (variable, `opsz`+`SOFT` axes) + Inter
- `framer-motion` (`whileInView` fades, `MotionConfig reducedMotion="user"`)
- `lenis` for smooth scroll (auto-disabled under `prefers-reduced-motion`)
- `@vercel/analytics` + `@vercel/speed-insights`

Removed in Sprint 7 (do not reintroduce without a fresh spec):
`three`, `@react-three/fiber`, `@react-three/drei`, `gsap`.

## Design tokens

Single source of truth: `app/globals.css` `:root { ... }` block and the
`@theme inline` mapping to Tailwind utilities.

- Page: `#F5F4EF` (warm paper) · Elevated: `#FFFFFF`
- Ink: `#111` primary · `#2A2A28` body · `#6B6B66` muted · `#A8A8A2` faint (decorative only)
- CTA: `#0A0A0A` on `#FAFAF7` ink
- Status: `#22C55E` (available dot — the only chromatic accent, functional not decorative)
- Hairline: `rgba(17,17,17,0.08)` · Outline: `rgba(17,17,17,0.14)`
- Serif (display, italic): Fraunces via `--font-serif`
- Sans (body, nav, chrome): Inter via `--font-sans`
- Radii: `--radius-card 16px` · `--radius-tile 12px` · `--radius-pill 999px`
- Section vertical padding: `clamp(96px, 14vh, 176px)`
- Content max: `1200px` · Gutter: `clamp(24px, 5vw, 80px)`

## Motion contract

- Ambient: `<DotGrid />` canvas — cursor scales/brightens dots within ~130px
  with 600ms decay. Gated by `matchMedia("(hover: hover)")` and
  `prefers-reduced-motion`; fallback is a static CSS radial-gradient.
- Reveals: `FadeUp` (Framer `whileInView`, ~400ms).
- Cards/buttons: subtle `-translate-y-0.5` on hover/focus-visible.
- `prefers-reduced-motion`:
  - `SmoothScroll` early-returns (native scroll)
  - Framer respects `MotionConfig reducedMotion="user"` (opacity only)
  - `DotGrid` renders the static fallback

## File layout

```
app/                    Next.js App Router
  layout.tsx            Fonts (Fraunces + Inter), providers, metadata
  page.tsx              Single-page composition (Nav + DotGrid + sections + Footer)
  globals.css           Tokens (:root) + @theme inline mapping
  opengraph-image.tsx   Home OG (light monochrome)
  (marketing)/work/[slug]/
    page.tsx            Case study page (light chrome, centered header)
    opengraph-image.tsx Case study OG (light monochrome)
components/
  canvas/DotGrid.tsx    Mouse-reactive canvas ambient background
  layout/               Nav, Footer, SmoothScroll, SkipToMain, BackToWork
  sections/             Hero, ProjectsGrid, ProjectCard, AboutStack
  ui/                   SectionBadge, StatusPill, CTAButton, FadeUp
  mdx/                  CaseStudyBody, MdxComponents
content/
  projects.ts           5 project metadata (source of truth for grid)
  case-studies/         MDX bodies + frontmatter loader
lib/motion.ts           reduce-motion hook, easing presets
```

## Contribution rules

1. Never invent new color values. Extend `globals.css` `:root`. **Monochrome
   is the rule**; green `#22C55E` is functional (availability), not decorative.
2. Two font families only: `--font-serif` (Fraunces, italic for display) and
   `--font-sans` (Inter, everything else). Do not add a third.
3. Radii come from tokens (`--radius-card | --radius-tile | --radius-pill`) —
   no arbitrary `rounded-[Npx]`.
4. Any new motion respects `prefers-reduced-motion` and the hover-capability
   gate (`matchMedia("(hover: hover)")` for cursor-reactive effects).
5. Contrast check every new fg/bg pair with
   `python3 /Users/ruslan/.claude/skills/ui-ux-pro/scripts/check_contrast.py`.
6. When you finish a work block, append a `Problem/Decision/Result/Lesson`
   entry to `DEVLOG.md`. When a rule crystallizes, promote it to
   `STABLE_LOGIC.md`.

## Case studies + podcasts

Case study drafts live at
`/Users/ruslan/.claude/projects/-Users-ruslan-portfolio/case_studies/`.
Podcast scripts at
`/Users/ruslan/.claude/projects/-Users-ruslan-portfolio/podcast_scripts/`.
Audio rendering blocked on ElevenLabs Professional Voice Clone — training set
spec at `.claude/projects/-Users-ruslan-portfolio/voice_training/training_script.md`.
