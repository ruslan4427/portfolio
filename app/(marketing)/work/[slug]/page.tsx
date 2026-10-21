import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtifactList } from "@/components/case-study/ArtifactList";
import { BuildTimeline } from "@/components/case-study/BuildTimeline";
import { CaseNav } from "@/components/case-study/CaseNav";
import { CaseReader, LensControls } from "@/components/case-study/CaseReader";
import { ChapterRail } from "@/components/case-study/ChapterRail";
import { DevlogRefs } from "@/components/case-study/DevlogRefs";
import { GlanceBento } from "@/components/case-study/GlanceBento";
import { LensCTA } from "@/components/case-study/LensCTA";
import { LensHeadline, LensStats } from "@/components/case-study/LensHero";
import { TokenScorecardHero } from "@/components/case-study/TokenScorecardHero";
import { CaseStudyBody } from "@/components/mdx/CaseStudyBody";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { caseLenses } from "@/content/case-lenses";
import { getCaseStudy } from "@/content/case-studies";
import { projects } from "@/content/projects";
import { extractChapters } from "@/lib/rehype-case-sections";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return {};
  const { title, tagline } = study.frontmatter;
  return {
    title,
    description: tagline,
    openGraph: {
      title,
      description: tagline,
      type: "article",
    },
  };
}

const BODY_ID = "case-body";

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  const lensData = caseLenses[slug];
  if (!study || !lensData) notFound();
  const { frontmatter, source } = study;
  const project = projects.find((p) => p.slug === slug);
  const chapters = extractChapters(source);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.tagline,
    datePublished: frontmatter.publishedAt,
    author: {
      "@type": "Person",
      name: "Ruslan Hrekov",
      url: "https://hrekov.dev",
    },
    keywords: frontmatter.stack,
    url: `https://hrekov.dev/work/${frontmatter.slug}`,
    mainEntityOfPage: `https://hrekov.dev/work/${frontmatter.slug}`,
  };

  const longTitle = frontmatter.title.length > 18;
  const hasMakingOf =
    frontmatter.tokenScorecard ||
    frontmatter.supportingArtifacts?.length ||
    frontmatter.devlogRefs?.length;

  return (
    <main id="main" className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <CaseReader slug={slug} className="px-[var(--gutter)]">
        <article data-slug={frontmatter.slug} className="mx-auto flex max-w-[var(--content-max)] flex-col">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-28">
            <nav aria-label="Breadcrumb">
              <Link
                href="/work"
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-4 font-sans text-sm text-[color:var(--ink-primary)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
              >
                <span aria-hidden>←</span> All cases
              </Link>
            </nav>
            <LensControls />
          </div>

          <header className="flex flex-wrap items-end gap-x-14 gap-y-10 pt-16 pb-12">
            <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
                {project && (
                  <>
                    <span>
                      Case {project.index} of {String(projects.length).padStart(2, "0")}
                    </span>
                    <span aria-hidden>·</span>
                  </>
                )}
                <span>{frontmatter.role}</span>
                <span aria-hidden>·</span>
                <span>{frontmatter.year}</span>
                <span aria-hidden>·</span>
                <span>{frontmatter.readingTime} min full read</span>
                <span className="rounded-[var(--radius-pill)] border border-[color:var(--outline)] px-2.5 py-0.5 text-[color:var(--ink-primary)]">
                  {lensData.statusLabel}
                </span>
              </div>
              <h1
                className={`font-serif leading-[0.95] text-[color:var(--ink-primary)] ${
                  longTitle
                    ? "max-w-[16ch] text-[length:var(--type-display-l)]"
                    : "text-[length:var(--type-display-xl)]"
                }`}
              >
                <MaskReveal mode="mount" delay={0.1}>
                  {frontmatter.title}
                </MaskReveal>
              </h1>
              <LensHeadline data={lensData} />
            </div>
            <div className="min-w-0 flex-[1_1_340px]">
              <LensStats data={lensData} />
            </div>
          </header>

          {frontmatter.heroImage && (
            <Reveal delay={0.1} className="pb-12">
              <figure className="relative aspect-[16/7] overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]">
                <Image
                  src={frontmatter.heroImage.src}
                  alt={frontmatter.heroImage.alt}
                  fill
                  sizes="(min-width: 1200px) 1200px, 92vw"
                  priority
                  className="object-cover"
                />
              </figure>
            </Reveal>
          )}

          <div className="pb-16">
            <GlanceBento
              glance={lensData.glance}
              stack={frontmatter.stack}
              scorecard={frontmatter.tokenScorecard}
            />
          </div>

          <div className="grid grid-cols-1 gap-x-14 gap-y-8 border-t border-[color:var(--hairline)] pt-16 lg:grid-cols-[var(--rail-w)_minmax(0,1fr)]">
            <ChapterRail chapters={chapters} />
            <div id={BODY_ID} className="min-w-0 max-w-[720px]">
              {frontmatter.recruiterSummary && (
                <div className="mb-10 rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-7">
                  <h2 className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
                    In short
                  </h2>
                  <div className="mt-3 space-y-4 text-[length:var(--type-small)] leading-[1.7] text-[color:var(--ink-body)]">
                    {frontmatter.recruiterSummary
                      .trim()
                      .split(/\n{2,}/)
                      .map((para, i) => (
                        <p key={`summary-${i}`}>{para.trim()}</p>
                      ))}
                  </div>
                </div>
              )}
              <CaseStudyBody source={source} />
            </div>
          </div>

          {hasMakingOf && (
            <section
              id="how-it-was-made"
              aria-labelledby="how-it-was-made-heading"
              className="mt-16 scroll-mt-24 border-t border-[color:var(--hairline)] pt-16 lg:pl-[calc(var(--rail-w)+56px)]"
            >
              <div className="flex max-w-[720px] flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
                    Receipts
                  </p>
                  <h2
                    id="how-it-was-made-heading"
                    className="font-serif text-[length:var(--type-display-m)] leading-[1.02] text-[color:var(--ink-primary)]"
                  >
                    How it was made
                  </h2>
                </div>
                {frontmatter.tokenScorecard && (
                  <TokenScorecardHero scorecard={frontmatter.tokenScorecard} />
                )}
                {frontmatter.tokenScorecard?.phases && (
                  <BuildTimeline slug={frontmatter.slug} phases={frontmatter.tokenScorecard.phases} />
                )}
                {frontmatter.supportingArtifacts && frontmatter.supportingArtifacts.length > 0 && (
                  <ArtifactList artifacts={frontmatter.supportingArtifacts} />
                )}
                {frontmatter.devlogRefs && frontmatter.devlogRefs.length > 0 && (
                  <DevlogRefs refs={frontmatter.devlogRefs} />
                )}
              </div>
            </section>
          )}

          <div className="flex flex-col gap-4 pt-20 pb-32">
            <LensCTA data={lensData} title={project?.name ?? frontmatter.title} />
            <CaseNav slug={slug} />
          </div>
        </article>
      </CaseReader>
    </main>
  );
}
