---
name: Iteration 1 — Case study MDX + linked project cards — 2026-09-20
type: project
phase: 1-build
sprint: 1
feature: 01-case-study-mdx
---

# Sprint 1 checkpoint

## What shipped

- `content/case-studies/*.mdx` — 5 case studies, normalized frontmatter
  (`slug`, `title`, `tagline`, `role`, `stack[]`, `year`, `status`,
  `featured?`, `publishedAt`, `readingTime`).
- `content/case-studies.ts` — loader (`getCaseStudy`, `getAllCaseStudies`,
  `CaseStudyFrontmatter`).
- `components/mdx/{MdxComponents,CaseStudyBody}.tsx` — token-adherent
  element map + RSC MDXRemote wrapper with `remark-gfm`.
- `components/sections/ProjectCard.tsx` — extracted from ProjectsGrid,
  wraps card in `<Link href="/work/${slug}">`, hover-reveal `→` arrow.
- `components/sections/ProjectsGrid.tsx` — refactored to map projects to
  `<ProjectCard>` (no visual change).
- `components/layout/BackToWork.tsx` — fixed mono link top-left, returns
  to `/#work`.
- `app/(marketing)/work/[slug]/page.tsx` — dynamic per-slug page with
  `generateStaticParams`, `generateMetadata`, hero + meta row + centered
  `max-w-[65ch]` MDX body, `notFound()` for unknown slugs.

## Verification passed

- `npx tsc --noEmit` — 0 errors.
- `npm run build` — 9 pages generated (home + 5 case studies + `_not-found`).
- Curl: `/work/{noble-saas,angel,fieldmark,lexora,smm-factory}` all 200,
  `/work/nope` returns 404, home page contains 5 correct `/work/<slug>`
  hrefs.
- Contrast 17.83:1 (`#F5F5F5` on `#0B0D12`, AAA) preserved for body copy.

## Slug normalization

`02_angel.md` source had `slug: angel-trucking` but `projects.ts` had
`slug: angel`. Normalized to `angel` in the MDX frontmatter so the loader
resolves the route correctly.

## Gotcha caught

MDX v3 chokes on bare `<` before digits — Lexora had `latency <100ms` in
prose, which parses as an opening tag with an invalid name. Fixed by
backtick-wrapping. **Add a lint check for `/<[0-9]/` in MDX bodies before
future content ports.**

## Non-goals still deferred

- WebGL Canvas + Hero SplitText → Sprint 2
- Hover video previews on cards → Sprint 3
- Modal-as-route via parallel/intercept → Sprint 4
- AudioPlayer for podcast episodes → Sprint 4 (gated on ElevenLabs PVC)
- About + Footer polish → Sprint 5
- a11y audit + Vercel deploy + OG images → Sprint 6

## Blocking human actions unchanged

1. `ruslan.dev` availability check.
2. 5 project preview video recordings (10–15s each) — Sprint 3 gate.
3. ElevenLabs PVC voice recording session (~30 min) — Sprint 4 gate.

## Next up

Sprint 2 — **WebGL Canvas + Hero SplitText reveal.** Replace the static
radial-gradient `SceneRoot` stub with an R3F Canvas hosting the
generative-particles / shader-distortion background. Layer GSAP SplitText
reveal onto the Hero headline. Motion contract holds: everything must
early-return under `prefers-reduced-motion`.
