import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogReadTracker } from "@/components/analytics/BlogReadTracker";
import { BackToJournal } from "@/components/layout/BackToJournal";
import { BlogPostBody } from "@/components/mdx/BlogPostBody";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { formatDate, formatLabel } from "@/components/blog/format";
import { getBlogPost, getBlogPosts } from "@/content/blog";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  const { title, tagline, canonical } = post.frontmatter;
  return {
    title,
    description: tagline,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description: tagline,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();
  const { frontmatter, source } = post;

  const url = `https://hrekov.dev/blog/${frontmatter.slug}`;
  const wordCount = source.trim().split(/\s+/).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.tagline,
    datePublished: frontmatter.publishedAt,
    dateModified: frontmatter.updatedAt ?? frontmatter.publishedAt,
    author: {
      "@type": "Person",
      name: "Ruslan Hrekov",
      url: "https://hrekov.dev",
    },
    keywords: frontmatter.tags,
    url,
    mainEntityOfPage: url,
    wordCount,
  };

  const related = frontmatter.related
    ? await Promise.all(frontmatter.related.map((s) => getBlogPost(s))).then((rs) =>
        rs.filter((r): r is NonNullable<typeof r> => r !== null),
      )
    : [];

  return (
    <main id="main" className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <BackToJournal />
        <header className="px-[var(--gutter)] pt-36 pb-12">
          <div className="mx-auto flex max-w-[65ch] flex-col gap-6">
            <Reveal>
              <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)] tabular-nums">
                {formatLabel[frontmatter.format]} · <time dateTime={frontmatter.publishedAt}>{formatDate(frontmatter.publishedAt)}</time> ·{" "}
                {frontmatter.readingTime} min read
              </p>
            </Reveal>
            <h1 className="font-serif text-[length:var(--type-display-l)] leading-[0.98] text-[color:var(--ink-primary)]">
              <MaskReveal mode="mount" delay={0.1}>
                {frontmatter.title}
              </MaskReveal>
            </h1>
            <Reveal delay={0.2}>
              <p className="text-[length:var(--type-title)] leading-[1.55] text-[color:var(--ink-body)]">
                {frontmatter.tagline}
              </p>
            </Reveal>
            {frontmatter.tags.length > 0 && (
              <Stagger as="ul" aria-label="Tags" className="flex flex-wrap gap-2" delayChildren={0.3} stagger={0.05}>
                {frontmatter.tags.map((tag) => (
                  <StaggerItem as="li" key={tag} y={8} duration={0.5}>
                    <span className="inline-flex rounded-[var(--radius-pill)] border border-[color:var(--outline)] px-3 py-1 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-body)]">
                      {tag}
                    </span>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
        </header>

        {frontmatter.heroImage && (
          <Reveal delay={0.1} className="px-[var(--gutter)] pb-16">
            <figure className="mx-auto max-w-[1100px]">
              <div className="relative aspect-[3/2] overflow-hidden rounded-[var(--radius-card)] bg-[color:var(--bg-elevated)]">
                <Image
                  src={frontmatter.heroImage.src}
                  alt={frontmatter.heroImage.alt}
                  fill
                  sizes="(min-width: 1200px) 1100px, 92vw"
                  priority
                  className="object-cover"
                />
              </div>
            </figure>
          </Reveal>
        )}

        <div className="px-[var(--gutter)] pb-16">
          <BlogPostBody source={source} format={frontmatter.format} />
          <BlogReadTracker slug={frontmatter.slug} />
        </div>

        {(frontmatter.distribution?.linkedin?.publishedUrl ||
          frontmatter.distribution?.devto?.publishedUrl) && (
          <section className="px-[var(--gutter)] pb-10">
            <div className="mx-auto flex max-w-[65ch] flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
              <span>Also on</span>
              {frontmatter.distribution?.linkedin?.publishedUrl && (
                <a
                  href={frontmatter.distribution.linkedin.publishedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[color:var(--ink-primary)] underline underline-offset-4 decoration-[color:var(--outline)] hover:decoration-[color:var(--ink-primary)]"
                >
                  LinkedIn
                  <span aria-hidden>↗</span>
                </a>
              )}
              {frontmatter.distribution?.devto?.publishedUrl && (
                <a
                  href={frontmatter.distribution.devto.publishedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[color:var(--ink-primary)] underline underline-offset-4 decoration-[color:var(--outline)] hover:decoration-[color:var(--ink-primary)]"
                >
                  Dev.to
                  <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          </section>
        )}

        {frontmatter.artifacts && frontmatter.artifacts.length > 0 && (
          <section className="px-[var(--gutter)] pb-16">
            <div className="mx-auto max-w-[65ch] border-t border-[color:var(--hairline)] pt-6">
              <h2 className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
                Artifacts
              </h2>
              <ul className="mt-4 space-y-2">
                {frontmatter.artifacts.map((a, i) => (
                  <li key={`${a.type}-${i}`} className="font-sans text-sm">
                    <span className="text-[color:var(--ink-muted)]">
                      {a.type}
                    </span>{" "}
                    <span aria-hidden className="text-[color:var(--ink-muted)]">
                      ·
                    </span>{" "}
                    {a.href ? (
                      <a
                        href={a.href}
                        target={a.href.startsWith("http") ? "_blank" : undefined}
                        rel={a.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-[color:var(--ink-primary)] underline underline-offset-4 decoration-[color:var(--outline)] hover:decoration-[color:var(--ink-primary)]"
                      >
                        {a.label}
                      </a>
                    ) : (
                      <span className="text-[color:var(--ink-primary)]">{a.label}</span>
                    )}
                    {a.detail && (
                      <span className="ml-2 text-[color:var(--ink-muted)]">
                        {a.detail}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="px-[var(--gutter)] pb-32">
            <div className="mx-auto max-w-[65ch]">
              <h2 className="font-serif text-[length:var(--type-display-s)] text-[color:var(--ink-primary)]">
                Related notes
              </h2>
              <ul className="mt-4 space-y-3">
                {related.map((r) => (
                  <li key={r.frontmatter.slug}>
                    <Link
                      href={`/blog/${r.frontmatter.slug}`}
                      className="group inline-flex flex-col gap-1"
                    >
                      <span className="font-serif text-lg text-[color:var(--ink-primary)] transition-colors group-hover:underline group-hover:decoration-[color:var(--accent)] group-hover:underline-offset-4">
                        {r.frontmatter.title}
                      </span>
                      <span className="text-sm text-[color:var(--ink-muted)]">
                        {r.frontmatter.tagline}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
