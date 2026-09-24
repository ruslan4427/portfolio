# DEVLOG

One block per meaningful work session. Format:
`Problem · Decision · Result · Lesson`. Newest at the top.

---

## 2026-09-23 · Sprint 7 · redesign to minimalist editorial portfolio

**Problem.** Sprint 6 shipped a dark, WebGL-heavy "Lusion-immersive" first
draft. User reaction: *"нема відступів все змішане якісь дивні шрифти
незрозуміли розділи"* — no clear spacing, mixed fonts, indistinct sections.
The dark canvas + oversized italic + neon accent + shader background read
as busy and dated to the user, not editorial. I had defended the direction
on my own taste — should have led with references.

**Decision.** Full visual reset under a fresh spec triple
(`specs/07-redesign/{spec,plan,tasks}.md`). Grounded in an actual reference
the user picked (Nizar Ali Dribbble 24766210) rather than my brief. New
direction:

- Warm-paper page `#F5F4EF`, charcoal ink ramp, **monochrome** — the only
  chromatic accent is a single functional green `#22C55E` dot on the
  "available for work" status pill. I initially proposed a blue accent; the
  reference showed monochrome and I reversed.
- Fraunces italic display + Inter body. Dropped Instrument Serif, Geist
  Sans, JetBrains Mono. (Playfair was on the shortlist; letterform closeup
  from the reference pointed to Fraunces.)
- Rounded 16/12/pill radii replacing the previous hard-edge=0 rule.
- Cursor-reactive dot-grid `<canvas>` replacing three.js particle field.
  Gates: `matchMedia("(hover: hover)")` + `prefers-reduced-motion`.
- Copy stayed intact — sign-off proposal drafted for a light softening pass
  separately.

**Files.**
- `app/globals.css` — full `:root` rewrite + `@theme inline` remap.
- `app/layout.tsx` — Fraunces (`axes: ["opsz","SOFT"]`, no `weight` — the
  two are mutually exclusive for variable fonts) + Inter.
- `app/opengraph-image.tsx` + `app/(marketing)/work/[slug]/opengraph-image.tsx`
  — light monochrome redesign. `ImageResponse` requires explicit `display:
  flex` on any div with >1 child and rejects `display: inline-block`.
- `app/(marketing)/work/[slug]/page.tsx` — centered header, SectionBadge
  status, italic display H1, tag pills row.
- `components/canvas/DotGrid.tsx` (new) — 28px step, INFLUENCE=130,
  DECAY_MS=600. Fallback: static radial-gradient div.
- `components/ui/{SectionBadge,StatusPill,CTAButton,FadeUp}.tsx` (new).
- `components/layout/{Nav,Footer,BackToWork}.tsx` — light chrome, rounded
  pills, Nav goes transparent above 80px scroll.
- `components/sections/{Hero,ProjectCard,ProjectsGrid,AboutStack}.tsx` —
  full re-comp to new tokens.
- `components/mdx/MdxComponents.tsx` — re-tokened to serif H2/H3, ink body,
  rounded pre/code, hairline table.
- Deleted: `CanvasScene`, `ParticleField`, `SceneRoot`, `StaticGradient`,
  `CanvasErrorBoundary`, `shaders.ts`, `SplitReveal`, `lib/gsap.ts`.
- `package.json` — removed `three`, `@react-three/fiber`,
  `@react-three/drei`, `@types/three`, `gsap` (56 packages gone).
- `next.config.ts` — dropped `transpilePackages: ["three"]`.
- `CLAUDE.md` design section + `STABLE_LOGIC.md` rewritten to lock the new
  direction.

**Result.** `tsc` clean; `next build` prerenders 17 static pages including
both OG variants. Contrast: `#111/#F5F4EF` 17.15:1, `#2A2A28/#F5F4EF`
13.06:1, `#6B6B66/#F5F4EF` 4.86:1 (AA pass, AAA-large pass), CTA inverted
18.93:1. `#A8A8A2` fails AA — decorative-only (unavailable status dot),
never used for text. Dev server smoke: `/` and `/work/noble-saas` both 200.

**Lesson.** *Reference-first, never brief-first for visual work.* When the
user described a taste direction in words I mapped it to my own mental
library and defended the result on taste. Pulling a screenshot from the
user *before* proposing tokens would have skipped the entire wrong first
draft. Recorded to memory (`feedback_visual_direction.md`). Second lesson:
`ImageResponse` (satori) is a strict subset of CSS — plan to design OG
images as vertical flex columns of single-line spans, and never rely on
`display: inline-block` or `<br />`.

---

## 2026-09-24 · Sprint 6 · a11y sweep + OG images + sitemap

**Problem.** Site was visually deploy-ready after Sprint 5 but had three
gaps blocking a clean ship: (1) framer-motion animations in Nav, Hero,
SplitReveal each gated `prefers-reduced-motion` per-component and it was
about to become a manual habit for every new motion; (2) no OG images, so
share cards would look like a directory listing; (3) no `sitemap.xml`, no
`robots.txt`, no skip-link, no focus trap on the mobile menu — a11y and
crawler basics missing.

**Decision.** Six small files, no spec triple. All framer motion
centralised through `<MotionConfig reducedMotion="user">` in `SmoothScroll`
so future motion components inherit the contract for free. OG images use
`next/og` — one home, one per-slug dynamic, both prerendered via
`generateStaticParams` on the OG file itself.

- **`app/globals.css`** — removed `border-radius: 2px` from
  `:focus-visible` (STABLE_LOGIC radii=0 was being bent by a stray 2px).
- **`components/layout/SmoothScroll.tsx`** — wrapped children in
  `<MotionConfig reducedMotion="user">` so every framer component (Nav
  underline, mobile menu, Hero SplitReveal, future ones) respects the
  media query without per-component branching.
- **`components/layout/SkipToMain.tsx`** (new) — sr-only link, becomes
  visible + focus-ringed on Tab. First focusable in `<body>`. Wired in
  `app/layout.tsx` above `SmoothScroll`.
- **`app/page.tsx` + `app/(marketing)/work/[slug]/page.tsx`** — `id="main"`
  on `<main>` / `<article>` so skip-link lands correctly on both routes.
- **`components/layout/Nav.tsx`** — mobile menu got `role="dialog"`,
  `aria-modal`, `aria-controls`, focus moves to first link on open,
  Escape closes, Tab cycles inside menu, close restores focus to the
  hamburger button.
- **`app/opengraph-image.tsx`** (new) + **`app/(marketing)/work/[slug]/opengraph-image.tsx`**
  (new) — 1200×630 PNG with canvas `#0B0D12` + accent `#00FF88` chrome +
  display-italic title. Per-slug variant renders study title, tagline,
  role, year, status. Both statically generated via `generateStaticParams`
  on the OG file (Next 16 quirk — the parent page's `generateStaticParams`
  doesn't propagate to sibling metadata routes).
- **`app/sitemap.ts`** + **`app/robots.ts`** (new) — sitemap lists `/`
  plus 5 case study slugs; robots allows all + points at
  `https://ruslan.dev/sitemap.xml`.

**Result.**
- `npx tsc --noEmit` — clean.
- `npm run build` — 17 static pages (5 study pages + 5 OG images + 1 home
  OG + `/`, `_not-found`, `robots.txt`, `sitemap.xml`). No dynamic routes.
- `curl /robots.txt` → allow-all + sitemap link. `curl /sitemap.xml` →
  6 URLs. `curl /work/noble-saas/opengraph-image-XXX` → HTTP 200 image/png
  from x-nextjs-cache HIT.
- `curl /` and `curl /work/lexora` both contain `Skip to main` +
  `id="main"` markers.

**Lesson.** Next 16 metadata routes (`opengraph-image.tsx`, `icon.tsx`)
are compiled as *sibling* route handlers to the page they colocate with;
`generateStaticParams` on the page does not carry over. If you want a
per-slug OG to prerender at build time (not on demand), you have to
re-declare `generateStaticParams` inside the OG file. Without it, the
route stays dynamic and every share lookup pays a cold-image cost. Also:
centralising motion respect via `<MotionConfig>` beats per-component
`usePrefersReducedMotion` branches — the latter drifts silently the
moment someone forgets it.

**Bundle impact.** Zero — OG images are separate route bundles rendered
by the edge, not shipped to the client. `MotionConfig` is a context
provider, ~200 bytes. Skip-link is HTML.

**Non-goals still deferred.**
- Vercel deploy — external action, user-owned.
- `ruslan.dev` DNS/availability check — still blocking OG absolute URLs
  from becoming real (metadataBase is aspirational until then).
- Sprint 3 (hover video previews) — user recording gate.
- Sprint 4 (parallel/intercept modal + AudioPlayer) — ElevenLabs PVC gate.

---

## 2026-09-23 · Sprint 5 · Nav / About / Footer polish (S-class)

**Problem.** Nav was a static server component with dead `#anchor` links,
no scroll-based state, no mobile menu. `AboutStack` jumped straight into
"One human. Three model tiers." with no self-introduction. `Footer`
already looked decent but read as a stub — no contact preamble, no
availability specificity, no colophon detail. Sprint 3 (hover video) is
blocked on Ruslan recording preview clips, so this is the deploy-ready
polish that lets the site ship without waiting on that gate.

**Decision.** Three files, no new spec triple (S-class per the ShipLoop
classifier — < 3 files, < 1h, existing spec-in-CLAUDE covers the intent).

- **`components/layout/Nav.tsx`** promoted to a client component.
  - Scroll-linked backdrop: transparent + hairline above 80px scroll,
    `bg-[color:var(--bg-canvas)]/70 backdrop-blur-md` + hairline below.
    Transitions on `background-color, backdrop-filter, border-color`
    over 500ms.
  - Active-section detection via `IntersectionObserver` with
    `rootMargin: "-40% 0px -55% 0px"` (so a section counts as active
    when its band crosses the viewport centerline). Active link swaps
    color to `--accent` and gains a shared `layoutId="nav-active"`
    underline that animates between siblings via framer's shared-layout.
  - Mobile menu: hamburger toggle (two rotating lines forming an ×),
    full-screen `AnimatePresence` overlay with display-font links
    stacked, per-line stagger 60ms with `easeOutExpo`. Locks
    `document.body.style.overflow` while open.
  - Dropped `mix-blend-difference` — it stopped reading cleanly once the
    accent green appeared behind the nav. Solid backdrop-blur wins on
    the scrolled state.
- **`components/sections/AboutStack.tsx`** — added a bio block on the
  left rail before the stratification: display headline ("A studio of
  *one*, running *with* the model, not around it."), a plain-English
  self-intro paragraph, and a three-cell `<dl>` of Base / Practice /
  Cadence facts in mono. Right rail keeps the model stratification but
  is now introduced by a smaller "Model stratification" divider label so
  the visual hierarchy reads: identity → philosophy → matrix. Section
  header re-labelled `03 · Practice` (was `03 · Model stratification`)
  since the section now covers both.
- **`components/layout/Footer.tsx`** — added `04 · Contact` numeric header
  matching the other section rhythm; preamble paragraph before the "Let's
  build." display headline; contact-cell labels swapped to `--accent`
  (was `--fg-primary`) for consistency with the row labels above them;
  status swapped from "Booking new work — 2026" to specific "Booking Q4
  2026 · 1 slot"; colophon now shows "Kyiv → Ohio" + "ShipLoop discipline"
  as the second half of the byline; year computed with
  `new Date().getFullYear()` so we don't ship a stale copyright next year.

**Result.**
- `npx tsc --noEmit` — clean.
- `npm run build` — 9 pages, unchanged from Sprint 2.
- Curl: home + `/work/noble-saas` 200. Nav renders 4 anchor hrefs
  (`#top, #work, #stack, #contact`). Footer status renders
  "Booking Q4 2026 · 1 slot". AboutStack bio renders "A studio of one,
  running with the model, not around it."
- STABLE_LOGIC held: no new colors, no `rounded-*`, no third font, all
  motion respects reduce-motion (framer-motion honors the media query
  natively for `motion.*` components with default settings).

**Lesson.** `mix-blend-difference` on a nav sounds premium but breaks the
moment you have a saturated accent behind it — the difference blend of
`#00FF88` against `#F5F5F5` renders as `#0500A0` (dark purple), which
reads as broken, not intentional. Solid backdrop-blur after a scroll
threshold is boring but works against every possible background. If you
want the mix-blend effect to survive, you need a monochrome scene under
it; the moment you introduce a second hue, backdrop-blur wins.

---

## 2026-09-22 · Sprint 2 · WebGL Canvas + Hero SplitText reveal

**Problem.** Home page background was a static radial gradient (Sprint 0
stub) and the Hero headline rendered as inert static text. Portfolio's
whole thesis is Lusion-immersive — this was the gap between the pitch and
the artifact.

**Decision.**
- `components/canvas/` grew a real subsystem:
  - `shaders.ts` — inline vertex + fragment tagged template strings
    (perspective-correct point size, additive glow, depth-based alpha).
  - `ParticleField.tsx` — 1800 particles in a `20³` cube, `ShaderMaterial`
    with `AdditiveBlending` + `depthWrite: false`, `useFrame` gates on
    `document.visibilityState === "visible"` and clamps `dt` to 50ms so a
    long-frozen tab doesn't teleport time on resume.
  - `CanvasScene.tsx` — `<Canvas dpr={[1,2]} camera={{fov:55}}
    gl={{antialias:false, powerPreference:"low-power"}}>`.
  - `StaticGradient.tsx` + `CanvasErrorBoundary.tsx` — both fall back to
    the Sprint 0 gradient markup.
- `SceneRoot.tsx` rewritten: `usePathname()` → `null` off `/`,
  reduced-motion → `<StaticGradient />`, otherwise dynamic-import
  `CanvasScene` with `{ ssr: false, loading: <StaticGradient/> }` inside
  `<CanvasErrorBoundary>`. Route-gates itself so `/work/*` never mounts
  three.
- `components/ui/SplitReveal.tsx` — framer-motion word splitter (no GSAP
  license needed for this). `container` variant with `staggerChildren:
  0.06` + `delayChildren: 0.15`; per-word `<span
  overflow-hidden><motion.span y:100%→0>` with duration 0.75s + ease
  `[0.22, 1, 0.36, 1]`. Reduced-motion path renders a 250ms opacity fade
  instead of the mask.
- `Hero.tsx` split into three `<SplitReveal>` fragments — "Ship what"
  (white) + "Claude writes." (accent), each on its own line. Meta counter
  fades in at 0.05s, tagline + footer bar at 0.9s (tail delay matches
  reveal duration). Under reduce-motion tail delays collapse to 0.15s.
- `lib/motion.ts` — `easeOutExpo` retyped as `[number, number, number,
  number]` tuple (framer-motion v11 rejects `readonly` arrays and generic
  `number[]` for the `ease` prop); added `staggerPresets = { word: 0.06,
  line: 0.12 }`.

**Result.**
- `npx tsc --noEmit` — clean after retyping `easeOutExpo` as a fixed-length
  tuple.
- `npm run build` — 9 pages generated, same as Sprint 1. All 5 case
  studies + home + `_not-found` HTTP 200 via curl.
- Route-gating verified: home HTML contains two `pointer-events-none fixed
  inset-0 -z-10` wrappers (StaticGradient SSR + Canvas mount slot), case
  study HTML contains zero. Home HTML shows 3+ `inline-block
  overflow-hidden` spans — SplitReveal masks are SSR'd (framer applies
  transforms on hydrate).
- Contrast unchanged: body 17.83:1, accent 14.49:1 (AAA).
- **Bundle:** three + R3F chunk = **230KB gzipped, dynamic-imported**.
  This exceeds the spec's 120KB target — three.js core alone is ~150KB
  gz, R3F adds ~80KB. Target was unrealistic for stock three; the
  dynamic-import + reduced-motion bypass keeps this off LCP and off the
  bundle for accessibility-first visitors.

**Lesson.** Framer-motion v11 tightened its `ease` prop type: it wants a
fixed-length `[number, number, number, number]` tuple (or a string, or an
`Easing[]`), not `readonly [0.22, 1, 0.36, 1] as const` and not a
generic `number[]`. When you register a shared easing constant, type it
as the tuple from the start — otherwise every consumer needs an
`as unknown as` cast that fights review. Also: **bundle budgets in the
spec should be sanity-checked against the raw library cost before they
become acceptance criteria.** The 120KB target for a page hosting three
was optimism, not measurement.

---

## 2026-09-20 · Sprint 1 · Case study MDX + linked project cards

**Problem.** Portfolio scaffold shipped without its proof-point: five case
study bodies existed as plain markdown in
`~/.claude/projects/-Users-ruslan-portfolio/case_studies/`, but the site had
nowhere to render them and the project cards were static `<li>` elements
with no navigation. Reader couldn't open a case study by URL.

**Decision.**
- Installed `next-mdx-remote@5 remark-gfm reading-time gray-matter`.
- Ported all 5 drafts to `content/case-studies/*.mdx` with a normalized
  frontmatter schema (`slug`, `title`, `tagline`, `role`, `stack[]`, `year`,
  `status`, `featured?`, `publishedAt`, `readingTime`). Fixed the
  `angel-trucking` → `angel` slug mismatch. Dropped the leading H1 in each
  body — the page hero owns the H1.
- `content/case-studies.ts` — thin loader using `gray-matter` for
  frontmatter + `fs/promises` for the raw MDX body. `getCaseStudy(slug)`
  returns `null` on miss so the route can call `notFound()`.
- `components/mdx/MdxComponents.tsx` — token-adherent element map for
  `h2/h3/p/ul/ol/li/a/blockquote/code/pre/hr/strong/em/table/th/td`. Every
  color pulls from CSS custom properties; no ad-hoc hex.
- `components/mdx/CaseStudyBody.tsx` — RSC wrapper around `<MDXRemote>`
  with `remarkGfm` for tables.
- Extracted `components/sections/ProjectCard.tsx` from `ProjectsGrid.tsx`.
  Card body is now a `<Link href="/work/${slug}">` with a top-right `→`
  arrow that fades in on hover/focus. Grid file shrank to a plain map.
- `app/(marketing)/work/[slug]/page.tsx` — `generateStaticParams` from
  `projects.ts`, `generateMetadata` from frontmatter, hero with title +
  tagline + meta row (status/role/year/reading time) + stack tags,
  centered `max-w-[65ch]` body column. `notFound()` for unknown slugs.
- `components/layout/BackToWork.tsx` — fixed mono link top-left returning
  to `/#work`.

**Result.**
- `npx tsc --noEmit` — clean.
- `npm run build` — 9 pages generated: `/`, `/_not-found`,
  `/work/{noble-saas, angel, fieldmark, lexora, smm-factory}`.
- Curl sweep: all 5 case studies HTTP 200, `/work/nope` HTTP 404, home links
  present with correct `href="/work/<slug>"`.
- Body typography confirmed via HTML inspection — hero renders one H1, MDX
  body renders `##` sections. Contrast 17.83:1 (AAA) preserved.

**Lesson.** MDX v3 is stricter about bare `<` than legacy MDX — `<100ms` in
Lexora's body threw `Unexpected character '1' before name, expected a
character that can start a name`. Fix is trivial (backtick-wrap or escape),
but the failure surfaces only at prerender, not at type-check. Add a lint
step that scans MDX for `<[0-9]` before the next content port.

---

## 2026-09-20 · ShipLoop retrofit + Phase-0 discovery

**Problem.** Sprint 0 shipped without passing through ShipLoop (Ruslan's
SSD discipline at `~/shiploop/`). I had misread the "wait for shiploop"
memory as a calendar signal instead of a mandatory design methodology, and
went straight to scaffolding + `ui-ux-pro` defaults. Ruslan flagged the gap.

**Decision.**
- Installed the ShipLoop skill pack (`shiploop-router`, `-brainstorm`,
  `-tester`, `-observer`, `-start`) into `.claude/skills/`.
- Created `memory/` and `specs/` directories.
- Merged the ShipLoop Protocol block into `CLAUDE.md` — request classifier
  table (Q/B/S/L/R/T/D/M/O) + lifecycle diagram + memory checkpoints.
- Ran `/shiploop-brainstorm stage=discovery` as a retro session against
  the existing scaffold. Six decisions captured in
  `memory/brainstorm-discovery-2026-09-20.md`.
- Pivoted Sprint plan (DECISION-1): Sprint 1 becomes "case study MDX +
  basic project cards" (content-first). WebGL moves to Sprint 2. Sprints
  3–6 unchanged.
- Saved `memory/project-discovery.md` — Phase 0 checkpoint.
- Authored the Feature #01 spec triple: `specs/01-case-study-mdx/{spec,
  plan,tasks}.md` — 18 tasks, MDX loader via `next-mdx-remote/rsc`, token-
  adherent MDX component map.

**Result.** ShipLoop is now the operating discipline for this project.
Every future session that opens `/Users/ruslan/portfolio/` will:
1. Read `CLAUDE.md` → auto-apply the classifier
2. Read `DEVLOG.md` → know what shipped
3. Read `STABLE_LOGIC.md` → know what can't change
4. Route the incoming request through the class table before doing anything

Sprint 1 is unblocked once user reviews `specs/01-case-study-mdx/spec.md`.

**Lesson.** `ui-ux-pro` is a *visual sub-skill* that runs inside a Build
phase — it's not a substitute for Discovery/Spec/Plan. When a project has
ShipLoop wired up, `/shiploop-start` is always the first command; UI/UX
decisions come *after* the spec exists, not before.

---

## 2026-09-20 · Sprint 0 · Bootstrap

**Problem.** Empty repo (`/Users/ruslan/portfolio` had only `.git` + prior
`.claude/settings.local.json`). Need a Next.js scaffold with the Lusion-style
token layer wired up before any section work can start.

**Decision.**
- `create-next-app@latest` in-place, App Router, TypeScript, Tailwind v4,
  Turbopack, no `src/`, `@/*` import alias.
- Installed runtime deps: three + R3F + drei, gsap, lenis, framer-motion,
  @vercel/analytics + speed-insights.
- Design tokens live in `app/globals.css` `:root { ... }` and are exposed to
  Tailwind via `@theme inline`. One accent only: `#00FF88` neon green
  (14.49:1 on canvas — AAA).
- Fonts: Instrument Serif (display italic) + Geist Sans (body) + JetBrains
  Mono (chrome). Loaded via `next/font/google`.
- `SmoothScroll` (Lenis) provider early-returns under `prefers-reduced-motion`.
- `SceneRoot` is a static radial-gradient stub — will be replaced by R3F
  Canvas in Sprint 1.
- Dropped a webpack raw-loader rule for `.glsl` — Turbopack ignores it and
  the loader isn't installed yet. Re-add in Sprint 1 with proper Turbopack
  config.

**Result.** `npm run dev` boots, tokens flow, all five section stubs render
without runtime errors. No content yet — verifies structure only.

**Lesson.** Turbopack is now the default in Next 16 `create-next-app`. Any
`next.config.ts` `webpack` block silently no-ops. When shaders arrive, wire
them through Turbopack's `experimental.turbo.rules` instead.

---
