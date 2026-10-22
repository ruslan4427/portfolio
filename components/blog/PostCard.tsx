import Image from "next/image";
import Link from "next/link";
import type { BlogFrontmatter } from "@/content/blog";
import { formatDate, formatLabel } from "./format";

/** Text-only tile for the Journal grid: format and date, title, tagline, tags. */
function PostTile({ post }: { post: BlogFrontmatter }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block h-full rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
    >
      <article className="flex h-full flex-col gap-4 rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-7 shadow-[var(--shadow-card)] transition-transform duration-[var(--dur-fast)] group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5 motion-reduce:transform-none md:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-[var(--radius-pill)] border border-[color:var(--outline)] px-3 py-1 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-body)]">
            {formatLabel[post.format]}
          </span>
          <time dateTime={post.publishedAt} className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)] tabular-nums">
            {formatDate(post.publishedAt)}
          </time>
        </div>
        <h2 className="mt-2 font-serif text-[length:var(--type-display-s)] leading-[1.1] text-[color:var(--ink-primary)]">
          {post.title}
        </h2>
        <p className="line-clamp-3 text-[length:var(--type-small)] leading-[1.6] text-[color:var(--ink-body)]">{post.tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <ul aria-label="Tags" className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((tag) => (
              <li
                key={tag}
                className="rounded-[var(--radius-pill)] border border-[color:var(--hairline)] px-2.5 py-0.5 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-body)]"
              >
                {tag}
              </li>
            ))}
          </ul>
          <span className="shrink-0 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)] tabular-nums">
            {post.readingTime} min
          </span>
        </div>
      </article>
    </Link>
  );
}

/**
 * Journal card. The newest entry (`lead`) is the only one with a picture:
 * photo left, text right on md+. Every other entry is a text tile.
 */
export function PostCard({ post, lead = false }: { post: BlogFrontmatter; lead?: boolean }) {
  if (!lead) return <PostTile post={post} />;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block h-full rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
    >
      <article className={`flex h-full flex-col gap-5 ${lead ? "md:flex-row md:items-center md:gap-12" : ""}`}>
        <div
          className={`relative aspect-[3/2] overflow-hidden rounded-[var(--radius-card)] bg-[color:var(--bg-elevated)] ${
            lead ? "md:w-[58%] md:shrink-0" : ""
          }`}
        >
          {post.heroImage && (
            <Image
              src={post.heroImage.src}
              alt=""
              fill
              sizes={lead ? "(min-width: 1200px) 680px, (min-width: 768px) 56vw, 92vw" : "(min-width: 1200px) 580px, (min-width: 768px) 46vw, 92vw"}
              className="object-cover transition-transform duration-[var(--dur-reveal)] group-hover:scale-[1.02] motion-reduce:transition-none"
            />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)] tabular-nums">
            {formatLabel[post.format]} · <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> ·{" "}
            {post.readingTime} min
          </p>
          <h2
            className={`font-serif leading-[1.05] text-[color:var(--ink-primary)] ${
              lead ? "text-[length:var(--type-display-m)]" : "text-[length:var(--type-display-s)]"
            }`}
          >
            {post.title}
          </h2>
          <p
            className={`text-[color:var(--ink-body)] ${
              lead ? "text-[length:var(--type-body-l)] leading-[1.55]" : "line-clamp-3 text-[length:var(--type-small)] leading-[1.6]"
            }`}
          >
            {post.tagline}
          </p>
          <span className="mt-1 w-fit font-sans text-sm text-[color:var(--ink-primary)] underline decoration-[color:var(--outline)] underline-offset-4 group-hover:decoration-[color:var(--accent)]">
            Read <span aria-hidden>→</span>
          </span>
        </div>
      </article>
    </Link>
  );
}
