import type { Metadata } from "next";
import { JournalIndex } from "@/components/blog/JournalIndex";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { getBlogPosts } from "@/content/blog";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Case studies, build logs, and field notes on shipping software with AI as a collaborator — for people who read commit histories.",
};

const COUNT_WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export default async function BlogIndexPage() {
  const posts = (await getBlogPosts()).map((p) => p.frontmatter);
  const count = COUNT_WORDS[posts.length] ?? String(posts.length);

  return (
    <main id="main" className="relative min-h-screen px-[var(--gutter)]">
      <div className="mx-auto flex max-w-[var(--content-max)] flex-col">
        <header className="flex flex-col gap-5 pt-36 pb-12">
          <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
            Journal ·{" "}
            <a
              href="/rss.xml"
              className="underline decoration-[color:var(--outline)] underline-offset-4 hover:text-[color:var(--ink-primary)] hover:decoration-[color:var(--accent)]"
            >
              RSS
            </a>
          </p>
          <h1 className="font-serif text-[length:var(--type-display-l)] leading-[0.98] text-[color:var(--ink-primary)]">
            <MaskReveal mode="mount" delay={0.1}>
              {posts.length === 1 ? "One working note." : `${count} working notes.`}
            </MaskReveal>
          </h1>
          <Reveal delay={0.2}>
            <p className="max-w-[56ch] text-[length:var(--type-body-l)] leading-[1.55] text-[color:var(--ink-body)]">
              Case studies, build logs and field notes on shipping software with AI as a collaborator —
              for people who read commit histories.
            </p>
          </Reveal>
        </header>

        <div className="pb-[var(--section-py)]">
          {posts.length === 0 ? (
            <p className="border-t border-[color:var(--hairline)] pt-8 text-[length:var(--type-small)] text-[color:var(--ink-muted)]">
              First post lands soon. Subscribe via{" "}
              <a href="/rss.xml" className="underline decoration-[color:var(--outline)] underline-offset-4">
                RSS
              </a>
              .
            </p>
          ) : (
            <JournalIndex posts={posts} />
          )}
        </div>
      </div>
    </main>
  );
}
