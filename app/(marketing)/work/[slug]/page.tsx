import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackToWork } from "@/components/layout/BackToWork";
import { CaseStudyBody } from "@/components/mdx/CaseStudyBody";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { getCaseStudy } from "@/content/case-studies";
import { projects } from "@/content/projects";

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

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();
  const { frontmatter, source } = study;

  return (
    <article
      id="main"
      className="relative min-h-screen bg-[color:var(--bg-page)]"
    >
      <BackToWork />
      <header className="px-[var(--gutter)] pt-40 pb-16">
        <div className="mx-auto max-w-[65ch]">
          <div className="mb-8 flex justify-center">
            <SectionBadge label={frontmatter.status} />
          </div>
          <h1 className="text-center font-serif text-[clamp(56px,9vw,120px)] leading-[0.95] text-[color:var(--ink-primary)]">
            {frontmatter.title}
          </h1>
          <p className="mt-8 text-center text-xl leading-[1.55] text-[color:var(--ink-body)]">
            {frontmatter.tagline}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 font-sans text-xs text-[color:var(--ink-muted)]">
            <span>{frontmatter.role}</span>
            <span aria-hidden>·</span>
            <span>{frontmatter.year}</span>
            <span aria-hidden>·</span>
            <span>{frontmatter.readingTime} min read</span>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {frontmatter.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[color:var(--hairline)] px-3 py-1 font-sans text-xs text-[color:var(--ink-body)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </header>
      <div className="px-[var(--gutter)] pb-32">
        <div className="mx-auto max-w-[65ch]">
          <CaseStudyBody source={source} />
        </div>
      </div>
    </article>
  );
}
