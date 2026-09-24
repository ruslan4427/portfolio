# Feature 01 · Plan

**Companion to:** `spec.md` · **ShipLoop phase:** Plan

## Architecture

```
content/
├── case-studies/
│   ├── noble-saas.mdx
│   ├── angel.mdx
│   ├── fieldmark.mdx
│   ├── lexora.mdx
│   └── smm-factory.mdx
├── projects.ts             (unchanged; source of truth for card metadata)
└── case-studies.ts         (new; loader for MDX bodies + frontmatter cache)

app/
├── (marketing)/
│   └── work/
│       └── [slug]/
│           └── page.tsx    (new; dynamic case-study page)
└── page.tsx                (unchanged; home)

components/
├── mdx/
│   ├── MdxComponents.tsx   (new; token-aware component map)
│   └── CaseStudyBody.tsx   (new; RSC wrapper for MDXRemote)
└── sections/
    ├── ProjectCard.tsx     (new; extracted from ProjectsGrid)
    └── ProjectsGrid.tsx    (refactored; renders <ProjectCard> list)
```

Rationale:
- Route group `(marketing)` isolates the marketing pages from any future
  admin/API routes.
- `content/case-studies.ts` is a thin loader — reads the MDX file, parses
  frontmatter with `next-mdx-remote/rsc`, returns `{ frontmatter, source }`.
  Called from `page.tsx` inside RSC.
- Splitting `ProjectCard` out of `ProjectsGrid` is one commit's work and
  makes Sprint 3's hover-video overlay a one-file change.

## Data model resolution

`generateStaticParams()` in `page.tsx`:

```tsx
export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
```

`generateMetadata()` in `page.tsx`:

```tsx
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.frontmatter.title,
    description: study.frontmatter.tagline,
    openGraph: { title: study.frontmatter.title, description: study.frontmatter.tagline },
  };
}
```

## MDX component map (token-adherent)

```tsx
// MdxComponents.tsx (excerpt)
export const mdxComponents = {
  h2: (props) => <h2 className="font-display text-[clamp(40px,5vw,64px)] leading-[1.05] mt-16 mb-6" {...props} />,
  h3: (props) => <h3 className="font-display text-[clamp(28px,3.5vw,40px)] leading-[1.1] mt-12 mb-4" {...props} />,
  p:  (props) => <p className="my-5 leading-[1.7] text-[color:var(--fg-primary)]" {...props} />,
  ul: (props) => <ul className="my-5 pl-6 space-y-2 list-disc marker:text-[color:var(--accent)]" {...props} />,
  ol: (props) => <ol className="my-5 pl-6 space-y-2 list-decimal marker:text-[color:var(--accent)]" {...props} />,
  li: (props) => <li className="leading-[1.7]" {...props} />,
  a:  (props) => <a className="text-[color:var(--accent)] underline underline-offset-4 decoration-[color:var(--accent)]/40 hover:decoration-[color:var(--accent)]" {...props} />,
  blockquote: (props) => <blockquote className="my-8 border-l-2 border-[color:var(--accent)] pl-6 italic text-[color:var(--fg-muted)]" {...props} />,
  code: (props) => <code className="font-mono text-[0.9em] bg-[color:var(--bg-elevated)] px-1.5 py-0.5" {...props} />,
  pre:  (props) => <pre className="my-6 overflow-x-auto bg-[color:var(--bg-elevated)] p-4 font-mono text-sm" {...props} />,
  hr: () => <hr className="my-16 border-0 h-px bg-[color:var(--hairline)]" />,
  strong: (props) => <strong className="text-[color:var(--fg-primary)] font-semibold" {...props} />,
  em: (props) => <em className="italic" {...props} />,
};
```

Every value pulls from tokens; no ad-hoc hex or rounding.

## Page layout skeleton

```tsx
export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();
  const { frontmatter, source } = study;

  return (
    <article className="relative">
      <BackToWork />
      <header className="px-[var(--gutter)] pt-40 pb-16">
        <div className="mx-auto max-w-[65ch]">
          <MetaRow frontmatter={frontmatter} />
          <h1 className="font-display text-[clamp(72px,12vw,200px)] leading-[0.9] tracking-[-0.03em]">
            {frontmatter.title}
          </h1>
          <p className="mt-8 text-xl text-[color:var(--fg-muted)]">{frontmatter.tagline}</p>
        </div>
      </header>
      <div className="px-[var(--gutter)] pb-32">
        <div className="mx-auto max-w-[65ch]">
          <MDXRemote source={source} components={mdxComponents} />
        </div>
      </div>
    </article>
  );
}
```

## Content porting steps

Source files are in `~/.claude/projects/-Users-ruslan-portfolio/case_studies/`
as pure markdown with a light frontmatter (`title`, `slug`, etc.). Porting
per file:

1. Copy the file to `portfolio/content/case-studies/<slug>.mdx`.
2. Ensure frontmatter matches the data-model schema (`spec.md`).
3. Compute `readingTime` (using the `reading-time` package at build).
4. Downgrade any `#` H1 in the body to `##` — the page hero already
   provides the H1.
5. Normalize smart quotes → straight quotes (`sed` pass).

We're not editing prose for content — only formatting. Any real rewrite is
a separate feature.

## Non-obvious decisions

- **`next-mdx-remote/rsc`, not `@next/mdx`.** Rationale in spec §Data model.
- **No syntax highlighter this sprint.** The case studies contain minimal
  code — inline `code` and a handful of block quotes for commit hashes.
  Shiki adds ~200KB and a build step we don't need for MVP.
- **Line length capped at `65ch`.** Editorial readability > full-bleed
  aesthetic on long-form pages. The home stays full-bleed.
- **Route group `(marketing)`** even though we only have one marketing
  section right now. Cheap to add now, expensive to add later.

## Rollback plan

- Feature is entirely additive. Reverting means: delete
  `content/case-studies/`, `app/(marketing)/`, `components/mdx/`,
  `components/sections/ProjectCard.tsx`; restore `ProjectsGrid.tsx`;
  `npm uninstall next-mdx-remote remark-gfm reading-time`.
- No schema changes, no external services touched.
