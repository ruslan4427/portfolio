# Plan — Sprint 20 · Case-study lens

1. Merge v2 tokens (`specs/19-design-system-v2/tokens-v2.css`) into globals.css.
2. `content/case-lenses.ts` with data for 6 cases (from the canvas CaseView).
3. `lib/rehype-case-sections.ts`: wrap each h2 + following nodes in
   `<section data-case-section id>`; h2 gets a slug id.
4. Client components in `components/case-study/`: `CaseReader` (context:
   lens, depth, ?for=, localStorage; sets data-lens/data-depth),
   `LensControls`, `LensHero`, `ChapterRail`, `CaseSection`, `LensCTA`.
   Server: `GlanceBento`, `CaseNav`.
5. Rewrite `app/(marketing)/work/[slug]/page.tsx` around them; keep JSON-LD,
   BackToWork, artifacts, devlog refs.
6. Restyle MDX components (MdxComponents, CaseStudyVisuals, CaseStudySchemas
   hotspots from the audit).
7. Verify: tsc, eslint, 6 cases × 2 viewports screenshots, axe.
8. DEVLOG, CLAUDE.md, commit, push.
