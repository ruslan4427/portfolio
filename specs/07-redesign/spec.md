# Spec — Sprint 7 · Redesign to minimalist editorial portfolio

**Class.** L (new visual system, > 3 files, breaks Sprints 2/5/6 visuals)
**Date.** 2026-09-24
**Owner.** Ruslan (design direction), Claude Opus (implementation)

---

## 1. Why this exists

The portfolio shipped Sprints 0–6 under a "Lusion-immersive dark WebGL"
direction that was authored on Sprint 0 without Ruslan seeing any pixels.
When he saw the final build after Sprint 6, he rejected it: "нема
відступів, все змішане, дивні шрифти, незрозумілі розділи". The
direction is dropped.

New direction comes from a concrete reference (Nizar Ali's Dribbble shot
24766210) plus a testimonials-section screenshot: a **quiet, warm,
editorial minimalist portfolio** — the register a senior product person
uses on their personal site, not a WebGL showcase reel.

## 2. What the site must feel like

Reading the reference in one sentence: *"a designer at their desk
handed you a piece of nice paper, and on it is what they've built."*

Concrete cues:
- **Warm off-white** page, not stark white. Paper, not screen.
- **Charcoal type**, no color noise. One strong serif for headlines, one
  clean sans for everything else.
- **Asymmetric hero** — avatar + big serif claim on the left, socials +
  bio paragraph on the right. No centered vanity poster.
- **Centered section badges** — "* Featured Projects" style. This is the
  signature. Small sparkle-marked pill that opens every section.
- **Rounded cards** (12–16px) with subtle border and near-invisible
  shadow. Cards, not slabs.
- **Availability pill** in the corner — small green dot + text. The only
  color on the page besides ink.
- **Black CTA pill** with mini-avatar inside — the "reach out" button.
- **Mouse-reactive dot-grid background** — subtle, unmistakably alive,
  reacts to cursor with soft falloff. Static under reduce-motion.

## 3. What breaks (and what doesn't)

**Breaks (rewritten or deleted):**
- Every visual component (Nav, Hero, ProjectsGrid, ProjectCard,
  AboutStack, Footer, MdxComponents)
- All design tokens in `globals.css`
- All fonts (Instrument Serif + Geist + JetBrains Mono → Fraunces + Inter)
- WebGL scene stack (`components/canvas/*`) — deleted, replaced by
  `DotGrid` canvas component
- SplitReveal — deleted, replaced with simple fade-up primitive
- OG images — regenerated for new tokens
- `CLAUDE.md` design section — rewritten
- `STABLE_LOGIC.md` — reviewed, rules tied to old direction removed

**Does not break:**
- MDX content (`content/case-studies/*.mdx`) — copy inside stays as-is
- Case study loader (`content/case-studies.ts`)
- Project metadata (`content/projects.ts`) — structure preserved
- Sitemap, robots, metadata infrastructure
- SmoothScroll (Lenis) + MotionConfig
- Skip-to-main, Nav focus trap, a11y wiring
- Route structure (`/`, `/work/<slug>`)

## 4. Design tokens (new, locked)

```css
/* Surface */
--bg-page:      #F5F4EF   /* warm off-white — paper */
--bg-elevated:  #FFFFFF   /* cards + pills sit on this */

/* Ink */
--ink-primary: #111111
--ink-body:    #2A2A28
--ink-muted:   #6B6B66
--ink-faint:   #A8A8A2

/* Structural */
--hairline:    rgba(17, 17, 17, 0.08)
--outline:     rgba(17, 17, 17, 0.14)
--shadow-card: 0 1px 2px rgba(17, 17, 17, 0.04), 0 8px 24px rgba(17, 17, 17, 0.04)

/* CTA + status (only chromatic elements) */
--cta:         #0A0A0A     /* pure black */
--cta-ink:     #FAFAF7     /* text on --cta */
--status-live: #22C55E     /* green availability dot */

/* Type */
--font-serif: "Fraunces", ui-serif, Georgia, serif
--font-sans:  "Inter", ui-sans-serif, system-ui, sans-serif

/* Radii */
--radius-card: 16px
--radius-tile: 12px
--radius-pill: 999px

/* Rhythm */
--section-py: clamp(96px, 14vh, 176px)
--content-max: 1200px
--gutter: clamp(24px, 5vw, 80px)
```

**Contrast (all AAA on `#F5F4EF`):**
- `#111` on `#F5F4EF` — 16.8 : 1 ✅
- `#2A2A28` on `#F5F4EF` — 12.9 : 1 ✅
- `#6B6B66` on `#F5F4EF` — 4.9 : 1 ✅ (AA large / AA normal)
- `#A8A8A2` on `#F5F4EF` — 2.3 : 1 ❌ (decorative only, never for body)

## 5. Acceptance criteria

A **shipped** Sprint 7 must satisfy all of:

1. **Palette** — no blue anywhere. Only chromatic pixels on page are the
   green availability dot and the black CTA. Everything else = warm
   off-white + shades of ink.
2. **Fonts** — Fraunces loads for H1/H2 only. Inter loads for body/nav/
   chrome. Instrument Serif, Geist, JetBrains Mono are removed from
   `next/font` imports and unused.
3. **Hero** — asymmetric two-column: left = avatar (rounded 12px, ~64px)
   + Fraunces headline (~72px display size, 2 lines, `italic` optional).
   Right = 4 socials (dribbble/behance/x/instagram/linkedin — replace as
   applicable with github/x/linkedin) + short bio paragraph + "Discover
   ↓" link. Above the hero: date-only mono label top-left + availability
   pill top-right.
4. **Section badges** — every section (Featured Projects, Practice,
   Contact, About) starts with a centered "* Section Name" pill. Sparkle
   icon (asterisk) is left of the text, pill is rounded-full, white on
   off-white with hairline border.
5. **Project cards** — bento of 5 cards, rounded 16px, subtle border +
   card shadow, screenshot preview area on top (16:10 aspect, placeholder
   background for now), name (Inter bold) + year (Inter mono-ish) row
   below, two tag pills for role/stack summary.
6. **Contact section** — big Fraunces headline centered, black rounded-
   full CTA below with 24px avatar inset + email text + arrow icon.
7. **DotGrid background** — mouse-reactive `<canvas>` fixed behind
   content. Grid step 28px, base dot 1.5px radius, `#111` at 0.10 alpha.
   Cursor influence radius 130px, near dots scale to 3.5px + 0.55 alpha,
   smooth quadratic falloff, decay to base over ~600ms after cursor
   leaves. Runs in a single `rAF` loop, gated by `document.visibilityState
   === "visible"` and `IntersectionObserver` on the canvas.
8. **Reduce-motion** — dot grid renders as a **static CSS
   radial-gradient dot pattern** (no canvas mounted). All fade-up
   entrance animations replaced by opacity-only 200ms fade. No
   scroll-linked reveals.
9. **Radii** — cards 16px, tiles 12px, pills 999px. No `rounded-0`
   remaining anywhere. STABLE_LOGIC rule "radii = 0 everywhere" is
   revoked in this sprint.
10. **A11y preserved** — skip-link still lands on `#main`, Nav focus
    trap on mobile menu still works, `:focus-visible` outline still
    2px `--ink-primary` (or new accent-equivalent). Contrast AAA for
    every text/background pair on the page.
11. **Bundle** — removing three.js + drei + framer's shared-layout Nav
    underline (nav becomes simpler) reduces `/`'s initial JS by
    **≥ 150KB gzipped** vs current build. Verify via `.next/analyze` or
    build output.
12. **Copy softened** — user-facing text pass to soften ~20%. Facts
    stay. Examples: "Ship what Claude writes." → "Software, shipped
    honestly." (or similar); "Booking Q4 2026 · 1 slot" → "Available
    for one project, Q4 2026"; "Let's build." → "Let's talk." Concrete
    strings finalized during implementation, reviewed with Ruslan
    before commit.
13. **Build clean** — `npx tsc --noEmit` passes, `npm run build`
    produces same number of static pages as current (17), all `/work/
    <slug>` routes still 200, sitemap unchanged, both OG images
    regenerated with new tokens.
14. **No regressions on case study pages** — `/work/noble-saas` still
    renders MDX correctly, hero + meta row + body all use new tokens,
    typography still reads at max-w-[65ch].

## 6. Explicit non-goals

- **No hover video previews on cards** — that stays Sprint 3, blocks on
  Ruslan recording clips.
- **No case-study parallel/intercept modal** — that stays Sprint 4,
  blocks on ElevenLabs PVC.
- **No AudioPlayer** — same, Sprint 4.
- **No Vercel deploy** — Ruslan's action.
- **No `ruslan.dev` DNS work** — Ruslan's action.
- **No new content** — copy softening only, no new sections invented.

## 7. Reference material

- `dribbble.com/shots/24766210-Personal-Website-Portfolio` (Nizar Ali)
- Testimonials-section screenshot pasted 2026-09-24
- Dot-grid animation screenshot pasted 2026-09-24
- `memory/portfolio_design_pivot.md` — direction lock rationale
- `memory/feedback_visual_direction.md` — why reference-first from now on
