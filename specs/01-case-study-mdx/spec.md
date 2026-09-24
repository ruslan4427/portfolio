# Feature 01 · Case Study MDX + basic project cards

**Status:** Draft · **Owner:** Claude (impl), Ruslan (content review) · **Created:** 2026-09-20 · **ShipLoop phase:** Spec

## Problem

The portfolio scaffold ships without its actual proof-point: case study
bodies. Five drafts exist in
`~/.claude/projects/-Users-ruslan-portfolio/case_studies/` as plain markdown.
The site needs to render them, link to them from the projects grid, and let
a reader open one directly by URL.

Additionally, `ProjectCard` currently renders as a static `<li>` — it should
be a link to the case study route.

## Non-goals

- **Not** the WebGL Canvas (Sprint 2).
- **Not** the modal-as-route intercept (Sprint 4 will layer that on top of
  what this feature ships).
- **Not** hover video previews (Sprint 3).
- **Not** the AudioPlayer component (Sprint 4).
- **Not** OG image generation (Sprint 6).

## User-facing behavior

### As a visitor on the projects grid section
- I see 5 project cards.
- Each card is clickable and navigates to `/work/<slug>`.
- Cards keep their existing visual (border, name, tagline, stack, metric,
  status) — only their `<li>` becomes an `<a>` wrapper.
- Hover state: card border changes from `--outline` to `--accent`
  (already implemented) and a subtle arrow indicator appears in the top
  right, using `→` in mono.

### As a visitor on `/work/<slug>`
- I see the full case study body.
- Page layout: full-width hero band with project name (Instrument Serif,
  120–200px), taglines (Geist Sans body, muted), metadata row
  (mono, uppercase, tracked) — then the 9-section case study body as
  MDX-rendered content in a single centered column (max ~65ch line
  length).
- A back link ("← Work") in the top-left, in mono.
- All 5 case study MDX bodies from the source folder render correctly,
  including headings, lists, code, and inline emphasis.
- Direct URL access works (typing `/work/noble-saas` in the address bar
  loads the page cold).

### As a search engine / social share
- Each `/work/<slug>` has correct `<title>`, meta description, and
  Open Graph metadata (title, description, static OG image for now — the
  dynamic OG route is Sprint 6).

## Acceptance criteria

1. `content/case-studies/*.mdx` exists for all 5 slugs matching
   `content/projects.ts` (noble-saas, angel, fieldmark, lexora,
   smm-factory).
2. `/work/<slug>` renders for each of the 5 slugs and returns HTTP 200.
3. `/work/unknown-slug` returns HTTP 404 via `notFound()`.
4. Clicking a card in `ProjectsGrid` navigates to `/work/<slug>` (verified
   by inspecting the rendered anchor `href`).
5. Case study body typography honors design tokens:
   - Body text uses `--fg-primary` on `--bg-canvas` (17.83:1, AAA).
   - Headings use `font-display` (Instrument Serif) at appropriate scale
     (h2 ~48px, h3 ~32px).
   - Code inline uses `font-mono` with `--bg-elevated` background and
     `--accent` for language-agnostic keyword-ish tokens (light touch).
6. Page-level metadata resolves per slug (title template `{name} · Ruslan Grekov`).
7. TypeScript passes with `tsc --noEmit`.
8. `next build` succeeds locally (production sanity check).
9. STABLE_LOGIC rules hold: no new colors, no rounded corners, no third
   font family, no motion added without reduce-motion fallback.

## Data model

### `content/case-studies/<slug>.mdx`

Frontmatter (parsed at build time):

```yaml
---
slug: string              # matches Project.slug
title: string             # short project name for <title>
tagline: string           # one-sentence hook (already in projects.ts, mirrored here for the page hero)
role: string              # e.g., "Full build · solo"
stack: string[]           # matches Project.stack
year: string
status: string            # matches Project.status
featured?: boolean
publishedAt: string       # ISO date (approximate)
readingTime: number       # minutes, rounded
---
```

Body: 9 sections following the existing case-study template
(Context, Problem, Division of Labor, Prompt Architecture, Iteration
Moment, Trade-Offs, Results, Reflection, Meta). The Meta section stays
short — commit hashes, dates, links.

### Route

`app/(marketing)/work/[slug]/page.tsx` — dynamic per-slug page. Uses
`generateStaticParams()` reading from `content/projects.ts` so all 5
slugs are statically generated at build.

### MDX toolchain choice

**`next-mdx-remote/rsc`** — chosen over `@next/mdx` because:
- We want MDX as *content* (data), not as *pages*, so having it live in
  `content/` outside `app/` is cleaner.
- RSC variant runs at request/build time on the server, zero client
  bundle for the parsing.
- Custom components (`h2`, `code`, `blockquote`) are passed as a
  `components` prop, giving us design-token adherence without a plugin.

Alternative rejected: `@next/mdx` — good for docs, but wants MDX files
inside `app/` and doesn't isolate content from routing.

## Dependencies

- `next-mdx-remote` — new dep.
- `remark-gfm` — GFM support (tables, task lists, autolinks).
- `reading-time` — small util, used at build time to compute reading time
  for frontmatter.

## Risks & mitigations

- **Risk:** MDX headings collide with the design system (H1 shows twice —
  once from the page hero, once from the MDX body).
  **Mitigation:** page hero uses a plain `<h1>` in the layout; MDX bodies
  start at `##` (h2) by convention. Enforce in a lint check.
- **Risk:** case study drafts contain markdown quirks (e.g., mixed
  quote styles) that break MDX parse.
  **Mitigation:** the port includes a normalization pass; any file that
  fails to render fails the build (`next build` will surface it).
- **Risk:** static generation of 5 pages plus the home page slows local
  dev.
  **Mitigation:** Turbopack — negligible impact on 6 total pages.

## Success signal

`npm run build && npm start` — six pages listed in `.next/build-manifest`,
`/`, `/work/noble-saas`, `/work/angel`, `/work/fieldmark`, `/work/lexora`,
`/work/smm-factory`. Each renders its case study body with correct
typography and no console warnings.
