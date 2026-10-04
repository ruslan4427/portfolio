import Link from "next/link";
import type { BlogPost, BlogFormat } from "@/content/blog";

const formatLabel: Record<BlogFormat, string> = {
  "case-study": "Case Study",
  "build-log": "Build Log",
  skeptic: "Field Note",
  pattern: "Pattern",
};

export function PostRow({ post }: { post: BlogPost }) {
  const { frontmatter } = post;

  return (
    <li className="border-b border-[color:var(--hairline)] last:border-b-0">
      <Link
        href={`/blog/${frontmatter.slug}`}
        className="group flex flex-col gap-2 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-page)] focus-visible:rounded-md md:flex-row md:items-baseline md:gap-6"
      >
        <div className="flex shrink-0 items-baseline gap-4 md:w-64">
          <time
            dateTime={frontmatter.publishedAt}
            className="font-sans text-xs text-[color:var(--ink-muted)] tabular-nums"
          >
            {frontmatter.publishedAt}
          </time>
          <span className="font-sans text-[11px] uppercase tracking-wide text-[color:var(--ink-muted)]">
            {formatLabel[frontmatter.format]}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-[19px] leading-snug text-[color:var(--ink-primary)] transition-colors group-hover:text-black group-focus-visible:text-black">
            {frontmatter.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-[color:var(--ink-muted)]">
            {frontmatter.tagline}
          </p>
        </div>
      </Link>
    </li>
  );
}
