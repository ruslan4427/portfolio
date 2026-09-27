import type { Metadata } from "next";
import { getBlogPosts, getFeaturedBlogPosts, type BlogPost } from "@/content/blog";
import { PostCard } from "@/components/blog/PostCard";
import { PostRow } from "@/components/blog/PostRow";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBadge } from "@/components/ui/SectionBadge";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Case studies, build logs, and field notes on shipping software with AI as a collaborator — for people who read commit histories.",
};

export default async function BlogIndexPage() {
  const [featured, all] = await Promise.all([
    getFeaturedBlogPosts(),
    getBlogPosts(),
  ]);
  const featuredSlugs = new Set(featured.map((p) => p.frontmatter.slug));
  const chronological = all.filter((p) => !featuredSlugs.has(p.frontmatter.slug));
  const grouped = groupByYear(chronological);
  const isEmpty = all.length === 0;

  return (
    <main id="main" className="relative min-h-screen">
      <section className="px-[var(--gutter)] pt-40 pb-16">
        <div className="mx-auto flex max-w-[var(--content-max)] flex-col items-center text-center">
          <Reveal>
            <SectionBadge label="Journal" />
          </Reveal>
          <h1 className="mt-8 max-w-[14ch] font-serif text-[clamp(48px,7vw,88px)] leading-[0.98] text-[color:var(--ink-primary)]">
            <MaskReveal mode="mount" delay={0.15}>
              Working notes.
            </MaskReveal>
          </h1>
          <Reveal delay={0.25}>
            <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-[color:var(--ink-body)]">
              Case studies, build logs, and field notes on shipping software
              with AI as a collaborator — for people who read commit histories.
            </p>
          </Reveal>
        </div>
      </section>

      {isEmpty ? (
        <section className="px-[var(--gutter)] pb-40">
          <div className="mx-auto max-w-[var(--content-max)] py-16 text-center">
            <p className="text-[15px] text-[color:var(--ink-muted)]">
              First post lands soon. Subscribe via{" "}
              <a
                href="/rss.xml"
                className="underline decoration-[color:var(--hairline)] underline-offset-4 transition-colors hover:text-[color:var(--ink-primary)]"
              >
                RSS
              </a>
              .
            </p>
          </div>
        </section>
      ) : (
        <>
          {featured.length > 0 && (
            <section className="px-[var(--gutter)] pb-16">
              <div className="mx-auto max-w-[var(--content-max)]">
                <h2 className="mb-8 font-sans text-xs uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                  Start here
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {featured.map((post) => (
                    <PostCard key={post.frontmatter.slug} post={post} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {chronological.length > 0 && (
            <section className="px-[var(--gutter)] pb-40">
              <div className="mx-auto max-w-[var(--content-max)]">
                <h2 className="mb-8 font-sans text-xs uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                  All entries
                </h2>
                {grouped.map(([year, posts]) => (
                  <div key={year} className="mb-12 last:mb-0">
                    {grouped.length > 1 && (
                      <h3 className="mb-4 font-serif text-2xl text-[color:var(--ink-primary)] tabular-nums">
                        {year}
                      </h3>
                    )}
                    <ul>
                      {posts.map((post) => (
                        <PostRow key={post.frontmatter.slug} post={post} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

function groupByYear(posts: BlogPost[]): Array<[string, BlogPost[]]> {
  const groups = new Map<string, BlogPost[]>();
  for (const post of posts) {
    const year = post.frontmatter.publishedAt.slice(0, 4);
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(post);
  }
  return Array.from(groups.entries());
}
