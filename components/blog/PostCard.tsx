import Link from "next/link";
import type { BlogPost, BlogFormat } from "@/content/blog";

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

export function PostCard({ post }: { post: BlogPost }) {
  const { frontmatter } = post;
  const displayTags = frontmatter.tags.slice(0, 2);

  return (
    <Link
      href={`/blog/${frontmatter.slug}`}
      className="group block focus-visible:outline-none"
    >
      <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-8 shadow-[var(--shadow-card)] transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full border border-[color:var(--hairline)] px-3 py-1 font-sans text-[11px] text-[color:var(--ink-body)]">
            {formatLabel[frontmatter.format]}
          </span>
          <time
            dateTime={frontmatter.publishedAt}
            className="font-sans text-[11px] text-[color:var(--ink-muted)] tabular-nums"
          >
            {formatDate(frontmatter.publishedAt)}
          </time>
        </div>

        <h3 className="mt-6 font-serif text-[clamp(24px,2.4vw,32px)] leading-[1.15] text-[color:var(--ink-primary)]">
          {frontmatter.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-[color:var(--ink-muted)]">
          {frontmatter.tagline}
        </p>

        <div className="mt-auto flex items-center justify-between pt-6">
          <div className="flex flex-wrap gap-2">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[color:var(--hairline)] px-3 py-1 font-sans text-xs text-[color:var(--ink-body)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="font-sans text-[11px] text-[color:var(--ink-muted)] tabular-nums">
            {frontmatter.readingTime} min
          </span>
        </div>
      </article>
    </Link>
  );
}
