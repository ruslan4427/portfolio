import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogReadTracker } from "@/components/analytics/BlogReadTracker";
import { BackToJournal } from "@/components/layout/BackToJournal";
import { BlogPostBody } from "@/components/mdx/BlogPostBody";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { getBlogPost, getBlogPosts, type BlogFormat } from "@/content/blog";

type Params = { slug: string };

const formatLabel: Record<BlogFormat, string> = {
  "case-study": "Case Study",
  "build-log": "Build Log",
  skeptic: "Field Note",
  pattern: "Pattern",
};

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[Number(month) - 1]} ${Number(day)}, ${year}`;
}

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
        <header className="px-[var(--gutter)] pt-40 pb-16">
          <div className="mx-auto max-w-[65ch]">
            <Reveal className="mb-8 flex justify-center">
              <SectionBadge label={formatLabel[frontmatter.format]} />
            </Reveal>
            <h1 className="text-center font-serif text-[clamp(48px,8vw,96px)] leading-[0.98] text-[color:var(--ink-primary)]">
              <MaskReveal mode="mount" delay={0.15}>
                {frontmatter.title}
              </MaskReveal>
            </h1>
            <Reveal delay={0.25}>
              <p className="mt-8 text-center text-xl leading-[1.55] text-[color:var(--ink-body)]">
                {frontmatter.tagline}
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 font-sans text-xs text-[color:var(--ink-muted)] tabular-nums">
                <time dateTime={frontmatter.publishedAt}>
                  {formatDate(frontmatter.publishedAt)}
                </time>
                <span aria-hidden>·</span>
                <span>{frontmatter.readingTime} min read</span>
                <span aria-hidden>·</span>
                <span>{formatLabel[frontmatter.format]}</span>
              </div>
            </Reveal>
            {frontmatter.tags.length > 0 && (
              <Stagger
                className="mt-6 flex flex-wrap justify-center gap-2"
                delayChildren={0.45}
                stagger={0.06}
              >
                {frontmatter.tags.map((tag) => (
                  <StaggerItem key={tag} y={12} duration={0.6}>
                    <span className="rounded-full border border-[color:var(--hairline)] px-3 py-1 font-sans text-xs text-[color:var(--ink-body)]">
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
              <div className="relative aspect-[16/7] overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]">
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

        {frontmatter.artifacts && frontmatter.artifacts.length > 0 && (
          <aside className="px-[var(--gutter)] pb-16">
            <div className="mx-auto max-w-[65ch] rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-8">
              <h2 className="font-sans text-xs uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                Receipts
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
          </aside>
        )}

        {related.length > 0 && (
          <section className="px-[var(--gutter)] pb-32">
            <div className="mx-auto max-w-[65ch]">
              <h2 className="font-sans text-xs uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                Related notes
              </h2>
              <ul className="mt-4 space-y-3">
                {related.map((r) => (
                  <li key={r.frontmatter.slug}>
                    <Link
                      href={`/blog/${r.frontmatter.slug}`}
                      className="group inline-flex flex-col gap-1"
                    >
                      <span className="font-serif text-lg text-[color:var(--ink-primary)] transition-colors group-hover:text-black">
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
