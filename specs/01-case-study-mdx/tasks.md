# Feature 01 · Tasks

**Companion to:** `spec.md`, `plan.md` · **ShipLoop phase:** Tasks

Ordered top-to-bottom; each task is one small commit unless marked `[bundle]`.

## Setup

- [ ] **T-01.** `npm install next-mdx-remote remark-gfm reading-time`
- [ ] **T-02.** Add `mdx-components.tsx` at project root (Next 16 pattern) OR
      skip — we use `MDXRemote` per-page, not the root file. Confirm before
      touching.

## Content

- [ ] **T-03.** [bundle] Port all 5 case study drafts:
      `cp ~/.claude/projects/-Users-ruslan-portfolio/case_studies/{01_smm_factory,02_angel,03_fieldmark,04_lexora,05_noble_saas}.md portfolio/content/case-studies/`
      then rename to slug-matching filenames.
- [ ] **T-04.** For each MDX file:
      - Normalize frontmatter to the schema in `spec.md`.
      - Downgrade `#` → `##` in body.
      - `sed` pass for smart quotes → straight.
      - Add `readingTime` computed via a tiny build script.

## Loader

- [ ] **T-05.** Create `content/case-studies.ts` exporting
      `getAllCaseStudies()` and `getCaseStudy(slug)`. Uses `fs/promises` +
      `gray-matter` OR `next-mdx-remote`'s built-in frontmatter parse.
- [ ] **T-06.** Type the frontmatter as `CaseStudyFrontmatter` in
      `content/case-studies.ts` and re-export.

## Components

- [ ] **T-07.** Create `components/mdx/MdxComponents.tsx` (token-mapped
      element overrides — full skeleton in `plan.md`).
- [ ] **T-08.** Create `components/mdx/CaseStudyBody.tsx` — RSC wrapper
      calling `<MDXRemote>` with `remark-gfm` and `mdxComponents`.
- [ ] **T-09.** Extract `components/sections/ProjectCard.tsx` from
      `ProjectsGrid.tsx`. Wrap the card body in `<Link href={/work/${slug}}>`.
      Add a top-right `→` arrow that reveals on hover.
- [ ] **T-10.** Refactor `components/sections/ProjectsGrid.tsx` to map
      `projects` into `<ProjectCard>` — no visual change on this file.

## Route

- [ ] **T-11.** Create `app/(marketing)/work/[slug]/page.tsx` with:
      - `generateStaticParams` from `projects.ts`.
      - `generateMetadata` reading frontmatter.
      - Layout skeleton from `plan.md`.
      - `notFound()` for unknown slugs.
- [ ] **T-12.** Add a `BackToWork` link component (mono, top-left,
      returns to `/#work`).

## Verify

- [ ] **T-13.** `npx tsc --noEmit` — zero errors.
- [ ] **T-14.** `npm run build` — succeeds, 6 pages in the build output.
- [ ] **T-15.** Manual check (curl or browser):
      - `/work/noble-saas` → 200, renders body.
      - `/work/angel` → 200.
      - `/work/fieldmark` → 200.
      - `/work/lexora` → 200.
      - `/work/smm-factory` → 200.
      - `/work/nope` → 404.
- [ ] **T-16.** Contrast recheck for MDX body vs canvas —
      `python3 ~/.claude/skills/ui-ux-pro/scripts/check_contrast.py "#F5F5F5" "#0B0D12"` — must remain ≥ 4.5:1 (already 17.83:1).
- [ ] **T-17.** DEVLOG entry: `Problem/Decision/Result/Lesson` for the
      case-study MDX pipeline.
- [ ] **T-18.** Save `memory/iteration-1.md` — what shipped in Sprint 1,
      what's next.

## Definition of Done

- All 5 case study routes render with correct typography.
- Home page projects grid links to each case study.
- Type-check green. Build green. No console warnings.
- DEVLOG + memory checkpoint written.
