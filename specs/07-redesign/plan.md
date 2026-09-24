# Plan — Sprint 7 · Redesign implementation

Reads with `spec.md`. WHAT is here; WHY is in spec.

---

## 1. Order of operations

Front-loaded: tokens + fonts + primitives before any section, so once
those land every section rebuild is fast and consistent.

```
1. Tokens + globals.css        (1 file)   — foundation
2. Fonts in layout.tsx          (1 file)   — Fraunces + Inter
3. Delete WebGL stack           (6 files)  — reduce bundle upfront
4. DotGrid canvas component     (1 file)   — background primitive
5. Reusable UI primitives       (3 files)  — SectionBadge, StatusPill, CTAButton
6. Nav rewrite                  (1 file)   — light chrome, no backdrop-blur
7. Hero rewrite                 (1 file)   — asymmetric two-column
8. ProjectsGrid + ProjectCard   (2 files)  — bento with new card shell
9. AboutStack rewrite           (1 file)   — cards instead of columns
10. Footer / Contact rewrite    (1 file)   — big serif + black CTA pill
11. Case study page chrome      (1 file)   — /work/[slug]/page.tsx tokens
12. MdxComponents rewrite       (1 file)   — Inter body + serif h2/h3
13. OG images regenerate        (2 files)  — new light + monochrome
14. CLAUDE.md rewrite           (1 file)   — new design system section
15. STABLE_LOGIC.md review      (1 file)   — revoke old radii-0 rule etc.
16. DEVLOG + memory/iteration-7 (2 files)  — checkpoint
```

Total: ~26 files touched (delete 6, create ~5, modify ~15). Estimate
4-5h focused work.

## 2. File-by-file plan

### 2.1 `app/globals.css` — REWRITE

Full replacement. New `:root` block with tokens from spec §4. New
`@theme inline` mapping. Reset stays similar (box-sizing, no default
margins). Body font switches to Inter. `body { background:
var(--bg-page); color: var(--ink-body); }`. Selection style updates to
`background: var(--ink-primary); color: var(--bg-page);`. Lenis CSS
retained. `:focus-visible` outline becomes `2px solid var(--ink-primary)`
with `outline-offset: 3px`. Reduce-motion contract retained. Add a new
`.font-serif` utility mapping to Fraunces italic (`font-family: var
(--font-serif); font-style: italic; font-optical-sizing: auto;`).

### 2.2 `app/layout.tsx` — REWRITE font imports

Drop `Instrument_Serif`, `Geist`, `JetBrains_Mono`. Add:

```ts
import { Fraunces, Inter } from "next/font/google";

const fraunces = Fraunces({
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});
```

`html.className` becomes `${fraunces.variable} ${inter.variable}`.
Metadata description softened. SkipToMain unchanged.

### 2.3 Delete WebGL stack

```
components/canvas/CanvasScene.tsx
components/canvas/ParticleField.tsx
components/canvas/SceneRoot.tsx
components/canvas/StaticGradient.tsx
components/canvas/CanvasErrorBoundary.tsx
components/canvas/shaders.ts
```

Remove imports from `app/page.tsx`. Remove `@react-three/fiber`,
`@react-three/drei`, `three` from `package.json` dependencies after
verifying no other consumer. Run `npm install` to sync.

Also delete: `components/ui/SplitReveal.tsx` — replaced by `FadeUp`
(see §2.5).

### 2.4 `components/canvas/DotGrid.tsx` — NEW

Renamed folder role: `canvas/` now hosts the dot-grid, not three.js.

Client component. Structure:

```tsx
"use client";

export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const cursorRef = useRef({ x: -9999, y: -9999, tLast: 0 });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0, height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
      cursorRef.current.tLast = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const STEP = 28;
    const BASE_R = 1.5;
    const MAX_R = 3.5;
    const BASE_A = 0.10;
    const MAX_A = 0.55;
    const INFLUENCE = 130;
    const DECAY_MS = 600;

    const draw = () => {
      const { x: cx, y: cy, tLast } = cursorRef.current;
      const now = performance.now();
      const decay = Math.max(0, 1 - (now - tLast) / DECAY_MS);
      ctx.clearRect(0, 0, width, height);

      for (let y = STEP / 2; y < height; y += STEP) {
        for (let x = STEP / 2; x < width; x += STEP) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const t = decay * Math.max(0, 1 - dist / INFLUENCE);
          const easedT = t * t;
          const r = BASE_R + (MAX_R - BASE_R) * easedT;
          const a = BASE_A + (MAX_A - BASE_A) * easedT;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(17, 17, 17, ${a})`;
          ctx.fill();
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    if (document.visibilityState === "visible") {
      rafRef.current = requestAnimationFrame(draw);
    }
    const onVis = () => {
      if (document.visibilityState === "visible") {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(rafRef.current);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(17,17,17,0.10) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
```

Mount in `app/page.tsx` as `<DotGrid />` behind main content (also on
case study pages — see §2.11).

### 2.5 UI primitives — NEW

Create three small components:

**`components/ui/SectionBadge.tsx`** — the "* Section Name" centered
pill. Props: `label: string`. Renders sparkle-asterisk (SVG) + label
inside a `rounded-full` pill with hairline border, white background,
Inter medium 12px uppercase-ish (actually mixed-case per reference).

**`components/ui/StatusPill.tsx`** — the availability pill top-right of
hero. Props: `status: "available" | "booking" | "unavailable"`,
`label: string`. Renders a 6px green dot + label inside `rounded-full`
pill. Green only for `"available"`, otherwise muted dot.

**`components/ui/CTAButton.tsx`** — the black rounded-full CTA. Props:
`href: string`, `label: string`, `avatarSrc?: string`. Renders 24px
avatar (rounded-full) if provided + label + `↗` icon. Black background,
off-white text, hover state = slight lift (translateY -1px + shadow).

**`components/ui/FadeUp.tsx`** — replacement for SplitReveal. Simple
framer motion `<motion.div>` with `initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}` on viewport enter via
`whileInView`. Duration 400ms. Under `MotionConfig reducedMotion="user"`
it collapses to instant.

### 2.6 `components/layout/Nav.tsx` — REWRITE

Simpler. Light background (transparent above scroll, `bg-[color:var
(--bg-page)]/90` + hairline below scroll). Same 4 items (Top/Work/
Practice/Contact). Active-section IntersectionObserver retained. Mobile
menu: same overlay pattern, but now white background with black text,
sparkle badges on each link. Focus trap + Escape + restore focus stay
as in Sprint 6.

Drop `mix-blend-*` (already dropped). Drop framer shared-layout
underline — replace with simple text-color change on active + small
`rounded-full` background chip for the active item. Cheaper motion,
matches editorial register.

### 2.7 `components/sections/Hero.tsx` — REWRITE

Structure:

```
<section id="top" class="relative px-gutter pt-40">
  <div class="mx-auto max-w-content grid grid-cols-1 md:grid-cols-2 gap-16">
    <div>
      <div class="flex items-center gap-4 mb-8">
        <time class="font-sans text-xs text-ink-muted uppercase tracking-wider">
          Sep 24, 2026
        </time>
      </div>
      <img src=".../avatar.jpg" class="w-16 h-16 rounded-[12px] mb-6" />
      <h1 class="font-serif italic text-[clamp(56px,7vw,88px)] leading-[1.02] text-ink-primary">
        Software, shipped<br/>honestly.
      </h1>
    </div>

    <div class="flex flex-col gap-8 md:pt-24">
      <div class="flex gap-3">
        <SocialIcon href="github" />
        <SocialIcon href="x" />
        <SocialIcon href="linkedin" />
        <SocialIcon href="email" />
      </div>
      <p class="text-ink-body text-lg leading-relaxed max-w-md">
        I'm Ruslan. I ship production software with Claude at the
        keyboard and taste at the helm. Five case studies. Commit
        hashes attached.
      </p>
      <a href="#work" class="inline-flex items-center gap-2 font-sans text-sm text-ink-primary">
        Discover <span aria-hidden>↓</span>
      </a>
    </div>
  </div>

  <div class="absolute top-6 right-gutter">
    <StatusPill status="available" label="Available for Q4 2026" />
  </div>
</section>
```

Avatar image: reuse existing `public/avatar.jpg` if present, else use a
placeholder 64×64 rounded rect with initials "RG" (SVG-based).

### 2.8 `components/sections/ProjectsGrid.tsx` + `ProjectCard.tsx` — REWRITE

Grid:

```
<section id="work">
  <SectionBadge label="Featured Projects" />
  <h2 class="font-serif italic text-[clamp(40px,5vw,64px)] text-center max-w-[18ch] mx-auto">
    Explore a curated selection of my recent work
  </h2>
  <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
    {projects.map(p => <ProjectCard project={p} />)}
  </div>
</section>
```

ProjectCard:

```
<Link href={`/work/${slug}`} class="group block">
  <article class="rounded-[16px] border border-hairline bg-elevated shadow-card overflow-hidden transition-transform duration-300 hover:-translate-y-1">
    <div class="aspect-[16/10] bg-neutral-100 relative">
      {/* placeholder — Sprint 3 will fill with video */}
      <div class="absolute inset-0 grid place-items-center text-ink-faint font-mono text-xs">
        preview · {slug}
      </div>
    </div>
    <div class="p-6 flex items-center justify-between">
      <div>
        <h3 class="font-sans font-semibold text-lg text-ink-primary">{name}</h3>
        <p class="text-ink-muted text-sm mt-1">{tagline-truncated}</p>
      </div>
      <span class="font-sans text-sm text-ink-muted">{year}</span>
    </div>
    <div class="px-6 pb-6 flex gap-2">
      {tags.map(t => <span class="rounded-full border border-hairline px-3 py-1 text-xs">{t}</span>)}
    </div>
  </article>
</Link>
```

Two-column grid on desktop (5 cards → last row has one full-width or
one card + spacer). Drop the `wide/tall/square` span system — bento no
longer needed for editorial rhythm.

### 2.9 `components/sections/AboutStack.tsx` — REWRITE

Structure follows reference's "Practice" pattern:

```
<section id="stack">
  <SectionBadge label="Practice" />
  <h2 class="font-serif italic text-[centered]">
    A studio of one, running with the model, not around it.
  </h2>
  <p class="text-ink-body text-lg text-center max-w-2xl mx-auto mt-6">
    {softened bio}
  </p>

  {/* Base / Practice / Cadence facts as 3 rounded cards */}
  <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
    {facts.map(f => <FactCard {...f} />)}
  </div>

  {/* Opus/Sonnet/Haiku stack as 3 rounded cards, second row */}
  <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
    {stack.map(row => <StackCard {...row} />)}
  </div>
</section>
```

Cards use same shell as ProjectCard: rounded-16, hairline border, subtle
shadow. Content stays honest — Ruslan bio + model stratification
matrix, but each row/fact gets its own card instead of columns.

### 2.10 `components/layout/Footer.tsx` — REWRITE as Contact

Structure:

```
<footer id="contact">
  <SectionBadge label="Contact" />
  <h2 class="font-serif italic text-[clamp(64px,10vw,144px)] text-center">
    Let's talk.
  </h2>
  <p class="text-ink-body text-center max-w-lg mx-auto mt-6">
    {softened preamble}
  </p>

  <div class="mt-12 flex justify-center">
    <CTAButton
      href="mailto:rusgrekovua@gmail.com"
      label="Reach out via email"
      avatarSrc="/avatar.jpg"
    />
  </div>

  <div class="mt-24 flex flex-col md:flex-row justify-between max-w-content mx-auto text-xs text-ink-muted">
    <span>© {year} Ruslan Grekov · Kyiv → Ohio</span>
    <span>Built with Claude Opus · ShipLoop discipline</span>
  </div>
</footer>
```

Colophon toned down (drop version number).

### 2.11 `app/(marketing)/work/[slug]/page.tsx` — RE-TOKEN

Chrome updates only. Structure preserved:

- `bg-canvas` → `bg-page`
- `text-fg-primary` → `text-ink-primary`
- `text-fg-muted` → `text-ink-muted`
- `border-hairline` → same token (renamed under the hood, same var name)
- Add `<DotGrid />` mounted at top of page inside `<article>` (behind
  content, `-z-10`)
- Meta row (status/role/year/reading-time) becomes: SectionBadge with
  status + small mono chunks below
- Hero H1: Fraunces italic, same clamp size but on off-white with
  `--ink-primary` fill
- Tagline typography: `--ink-body`

### 2.12 `components/mdx/MdxComponents.tsx` — RE-TOKEN

- `h2` → Fraunces italic + `--ink-primary`, larger tracking
- `h3` → Inter semibold + `--ink-primary`
- `p` → Inter + `--ink-body`, leading `1.7`
- `a` → underlined + `--ink-primary`, hover swaps to `--ink-muted`
  (link color stays black — no blue links, per palette)
- `blockquote` → left border in `--ink-primary` (2px), padded, italic
- `code` inline → `bg-neutral-100 rounded-md px-1.5 py-0.5 text-sm
  font-sans-numeric` (Inter mono variant since JetBrains dropped)
- `pre code` block → `bg-neutral-100 rounded-lg p-4 overflow-x-auto`
- `ul/ol` list markers → `--ink-muted`
- `hr` → `border-hairline`

### 2.13 OG images — REGENERATE

**`app/opengraph-image.tsx`** — light background `#F5F4EF`, Fraunces
italic title in `#111`, dot-grid pattern in top-right corner (drawn via
JSX rects), small StatusPill mock top-right, avatar rounded rect
top-left, mono timestamp label. No green background — full palette
match with new site.

**`app/(marketing)/work/[slug]/opengraph-image.tsx`** — same shell,
per-slug title/tagline/role. `generateStaticParams` retained.

### 2.14 `CLAUDE.md` — REWRITE design section

Delete section "Design tokens" and "Motion contract". Replace with new
tokens from spec §4, new motion contract (200-300ms fades, DotGrid
mouse-reactive with reduce-motion path), new contribution rules:
- Two font families max (Fraunces + Inter). Mono is *not* used.
- Rounded corners are allowed and encouraged: cards 16, tiles 12,
  pills 999.
- One accent zone only: green status dot + black CTA. No colored links.
- Any new motion respects `MotionConfig reducedMotion="user"` (already
  wired in SmoothScroll).
- Contrast every new pair against `#F5F4EF`.

Update the "What this is" paragraph to reflect editorial minimalist
direction instead of Lusion.

### 2.15 `STABLE_LOGIC.md` — REVIEW

Any rule tied to old direction gets revoked with a dated note. Likely
candidates: "radii = 0 everywhere", "dark canvas never `#000`", "mix-
blend-difference for nav chrome", "SplitText contract". Rules that
survive: reduce-motion contract, contrast checking, DEVLOG discipline,
route-gating of expensive components.

### 2.16 `DEVLOG.md` + `memory/iteration-7.md`

Standard Problem/Decision/Result/Lesson entry for Sprint 7. Memory
checkpoint records the pivot, what shipped, remaining Sprints (3, 4)
still ahead.

## 3. Verification steps

Run in order:
1. `npx tsc --noEmit` — zero errors
2. `npm run build` — 17 pages, `/` LCP not degraded (should improve —
   no three.js)
3. `curl http://localhost:3000/` — verify no `#00FF88`, no Instrument
   Serif, presence of `Fraunces`, `#111`, `#F5F4EF`
4. `curl http://localhost:3000/work/noble-saas` — verify MDX renders,
   new tokens applied
5. `curl http://localhost:3000/robots.txt`, `/sitemap.xml` — unchanged
6. Open `/` in browser: verify dot grid reacts to cursor, hero is
   asymmetric, section badges present, cards rounded and hoverable
7. Toggle system reduce-motion: verify canvas swaps to static
   radial-gradient, no rAF running
8. Tab through page from top: skip-link → nav → hero content → cards →
   contact → footer. Focus rings visible everywhere.
9. Contrast: run `python3 scripts/check_contrast.py` on `#111`/`#F5F4EF`,
   `#2A2A28`/`#F5F4EF`, `#6B6B66`/`#F5F4EF`. All AA+.
10. Bundle: compare `.next/analyze` or `du -sh .next/static/chunks` — must
    be smaller than pre-Sprint-7 build.

## 4. Risk register

- **Font loading FOUT** — Fraunces italic is a chunky download. Mitigate
  with `display: "swap"` (already in template) and preload critical
  weights only (400 + 500 italic for headings).
- **DotGrid cursor perf on low-end** — 2500 dots × 60fps = 150k draws/s.
  Ok on modern desktop; on mobile we drop to `pointerdown` only or
  disable via `matchMedia("(hover: none)")`. Add that gate in
  implementation.
- **Copy softening drift** — if softening makes text vague, the "honest
  numbers" positioning erodes. Rule: keep every specific number, only
  swap adjectives/verbs. Show Ruslan diffs before commit.
- **STABLE_LOGIC review scope creep** — resist rewriting rules that
  aren't tied to Sprint 7. Only revoke what visibly contradicts the new
  direction.
