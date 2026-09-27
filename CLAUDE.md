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

Ruslan Hrekov's personal portfolio. Single-page scroll experience showcasing
five AI-collaboration case studies. **Minimalist editorial** direction (as of
Sprint 7, 2026-09-23; font pivot 2026-09-24): warm off-white paper, charcoal
ink, monochrome + a single green availability dot, oversized upright Playfair
Display display headings, generous whitespace, rounded cards. A dot-grid
`<canvas>` provides ambient motion — dots always breathe on a slow travelling
sine wave, and cursor movement lights them up locally.

Reference: Nizar Ali "Personal Website & Portfolio" (Dribbble shot 24766210).

## Stack (locked)

- Next.js 16 (App Router, Turbopack, TypeScript)
- React 19, Tailwind CSS v4 (no config file — `@theme inline` in `globals.css`)
- `next/font/google` — Playfair Display (weights 400–900, upright) + Inter
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
- Serif (display, upright): Playfair Display via `--font-serif` (backed by `--font-display`)
- Sans (body, nav, chrome): Inter via `--font-sans`
- Radii: `--radius-card 16px` · `--radius-tile 12px` · `--radius-pill 999px`
- Section vertical padding: `clamp(96px, 14vh, 176px)`
- Content max: `1200px` · Gutter: `clamp(24px, 5vw, 80px)`

## Motion contract

- Ambient: `<DotGrid />` canvas — **strictly monochrome, cursor-only**.
  Idle base is a very faint ink dot grid (`rgba(17,17,17,0.05)`, ~30px
  pitch, ~1.6px dots) and is fully static when the cursor is still — no
  breathing wave, no idle animation of any kind. Within ~170px of the
  cursor each dot lights up (grows to ~4px, alpha up to 0.35) with a
  squared falloff multiplied by a per-dot temporal wobble (`CHAOS_MIX`,
  `CHAOS_TIME_HZ`) so activation reads as an organic aura rather than a
  clean radial disc; per-dot intensity decays over ~0.9s so the cursor
  path stays briefly visible. No colour — pure ink over the paper
  background. All tunables live in the `CONFIG` object at the top of
  `DotGrid.tsx`. Gated by `matchMedia("(hover: hover)")` and
  `prefers-reduced-motion`; fallback is a static CSS radial-gradient
  dot grid.
- Reveals: `FadeUp` (Framer `whileInView`, ~400ms).
- Cards/buttons: subtle `-translate-y-0.5` on hover/focus-visible.
- `prefers-reduced-motion`:
  - `SmoothScroll` early-returns (native scroll)
  - Framer respects `MotionConfig reducedMotion="user"` (opacity only)
  - `DotGrid` renders the static fallback

## File layout

```
proxy.ts                Edge proxy (Next.js 16 convention, was middleware.ts)
                        — sets `geo-eu=1|0` cookie from x-vercel-ip-country
app/                    Next.js App Router
  layout.tsx            Fonts + ConsentProvider + GLOBAL chrome (DotGrid, Nav,
                        Footer) + GA4/PageViews/ConsentBanner/ExternalLinkTracker
                        — children wrapped in `<div class="relative z-10">`
  page.tsx              Home: Hero → SelectedWork → Services (teaser) → HowItWorks
                        → Benefits → ExperienceMini → Testimonials (Footer card
                        in layout.tsx is the sole closer — no per-page CTA)
  globals.css           Tokens (:root) + @theme inline mapping + case-study
                        view toggle rules ([data-view] show/hide)
  not-found.tsx         Root 404 (SectionBadge + Playfair h1 + Home/Selected work CTAs)
  opengraph-image.tsx   Home OG (Playfair embedded via lib/og-fonts)
  sitemap.ts            Async — pulls per-study + per-blog-post lastmod
  rss.xml/route.ts      RSS 2.0 feed (CDATA descriptions, RFC-822 dates,
                        atom:link self-reference) — force-static, revalidate=3600
  (marketing)/
    about/page.tsx      Long-form bio, values, principles, full experience
    services/page.tsx   Full 5-format engagement grid (ServicesFull) + full-time card
    work/page.tsx       Work index with WorkIndex (Role/Stack/Year filters)
    work/[slug]/
      page.tsx          Case study (BackToWork pill → /work, Article JSON-LD,
                        ViewToggle mounted only if hasEnhanced fields present)
      loading.tsx       MDX-bundle skeleton (badge/title/tagline/body pulse)
      not-found.tsx     Case study 404 (SectionBadge + Playfair h1 + Back to work CTA)
      opengraph-image.tsx  Per-slug OG (Playfair embedded)
    blog/page.tsx       Journal index (featured grid + chronological list;
                        empty state ships too)
    blog/[slug]/
      page.tsx          Blog post (BlogPosting JSON-LD, BackToJournal pill,
                        per-format container width, Receipts aside,
                        BlogReadTracker sentinel at end)
      loading.tsx       MDX-bundle skeleton
      not-found.tsx     Blog 404 (Back to journal CTA)
      opengraph-image.tsx  Per-slug OG with format label in eyebrow
    blog/opengraph-image.tsx  Journal index OG
    contact/
      page.tsx          Contact form (ContactForm)
      actions.ts        Resend server action
      types.ts          Form types
components/
  analytics/            ConsentProvider (context), ConsentBanner (EU-gated),
                        ConsentResetLink (footer), GA4 (script gate),
                        PageViews (route-change gtag config),
                        ExternalLinkTracker (delegated document click),
                        BlogReadTracker (IO sentinel per slug)
  blog/                 PostCard (featured grid), PostRow (chronological)
  canvas/DotGrid.tsx    Cursor-reactive canvas (mounted once in root layout)
  case-study/           ArtifactList, DevlogRefs, ViewToggle
                        (fixed pos, data-view flip, localStorage-persisted)
  layout/               Nav (route-based, prefix match; Journal between Work +
                        About), Footer, SmoothScroll, SkipToMain, BackToWork,
                        BackToJournal
  sections/             Hero, SelectedWork, ProjectCard, Services (teaser),
                        ServicesFull, WorkIndex, HowItWorks, Benefits,
                        Experience, ExperienceMini, Testimonials,
                        ContactForm, AboutStack, AiStack, Values
  ui/                   SectionBadge, StatusPill, CTAButton (CTALink + CTAButton
                        primitives — variant primary|outline, size sm|md), FadeUp
  mdx/                  CaseStudyBody, BlogPostBody, MdxComponents,
                        BlogComponents (Artifact, Cost, PromptLog, Diff,
                        TechnicalDetail — TechnicalDetail is CSS-hidden in
                        case-study executive view)
lib/
  analytics.ts          track(event, params) — wraps window.gtag
  consent.ts            Cookie helpers (consent + geo readers/writers)
  consent-geo.ts        EU_COUNTRIES set (27 EU + GB + NO/IS/LI + CH) +
                        isEuCountry() helper
  og-fonts.ts           Playfair TTF loader for satori (legacy-UA Google trick)
  og-template.tsx       Shared OG layout (about/services/work/contact)
  motion.ts             reduce-motion hook, easing presets
content/
  projects.ts           5 project metadata + roleTags/stackTags (WorkIndex source)
  services.ts           5 engagement formats (investment ranges = TODO)
  experience.ts         Timeline entries (ExperienceMini + Experience source)
  about.ts              Bio paragraphs + principles (about page source)
  case-studies.ts       Types + loader; CaseStudyFrontmatter extended with
                        optional recruiterSummary / supportingArtifacts / devlogRefs
                        (Artifact type imported from content/blog.ts)
  case-studies/         MDX bodies (filename must match slug — no date prefix)
  blog.ts               Types + loader (mirror of case-studies.ts convention);
                        BlogFormat, Artifact, BlogFrontmatter, BlogPost;
                        validators throw on invalid format/date/duplicate slug/
                        filename mismatch/featured-without-tagline
  blog/                 MDX bodies at content/blog/<slug>.mdx
```

## Contribution rules

1. Never invent new color values. Extend `globals.css` `:root`. **Monochrome
   is the rule**; green `#22C55E` is functional (availability), not decorative.
2. Two font families only: `--font-serif` (Playfair Display, upright for
   display) and `--font-sans` (Inter, everything else). Do not add a third,
   and don't reintroduce italic display without a fresh design spec.
3. Radii come from tokens (`--radius-card | --radius-tile | --radius-pill`) —
   no arbitrary `rounded-[Npx]`.
4. Any new motion respects `prefers-reduced-motion`. Cursor-reactive effects
   additionally gate on `matchMedia("(hover: hover)")`.
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
