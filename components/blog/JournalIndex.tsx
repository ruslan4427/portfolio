"use client";

import { useMemo, useState } from "react";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import type { BlogFormat, BlogFrontmatter } from "@/content/blog";
import { formatLabel } from "./format";
import { PostCard } from "./PostCard";

const chipBase =
  "inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-pill)] border px-4 font-sans text-sm transition-colors duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]";

function Chip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`${chipBase} ${
        active
          ? "border-transparent bg-[color:var(--bg-inverse)] text-[color:var(--ink-on-dark)]"
          : "border-[color:var(--outline-strong)] bg-[color:var(--bg-elevated)] text-[color:var(--ink-primary)]"
      }`}
    >
      {label}
      <span className={active ? "text-[color:var(--ink-on-dark-muted)]" : "text-[color:var(--ink-muted)]"}>{count}</span>
    </button>
  );
}

/** Newest entry wide with its picture, the rest as text tiles; optional format filter. */
export function JournalIndex({ posts }: { posts: BlogFrontmatter[] }) {
  const [format, setFormat] = useState<BlogFormat | null>(null);
  const formats = useMemo(
    () =>
      (Object.keys(formatLabel) as BlogFormat[])
        .map((f) => ({ f, n: posts.filter((p) => p.format === f).length }))
        .filter((o) => o.n > 0),
    [posts],
  );
  const shown = format ? posts.filter((p) => p.format === format) : posts;
  // Only the newest entry overall gets the picture; a filtered view is all tiles.
  const lead = format === null ? shown[0] : undefined;
  const rest = lead ? shown.slice(1) : shown;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--hairline)] pt-8">
        <div role="group" aria-label="Filter by format" className="flex flex-wrap gap-2">
          <Chip label="All" count={posts.length} active={format === null} onClick={() => setFormat(null)} />
          {formats.map((o) => (
            <Chip
              key={o.f}
              label={formatLabel[o.f]}
              count={o.n}
              active={format === o.f}
              onClick={() => setFormat(format === o.f ? null : o.f)}
            />
          ))}
        </div>
        <p aria-live="polite" className="font-sans text-sm text-[color:var(--ink-muted)] tabular-nums">
          Showing {shown.length} of {posts.length} entries
        </p>
      </div>

      {lead && <PostCard key={lead.slug} post={lead} lead />}

      {rest.length > 0 && (
        <Stagger as="ul" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {rest.map((post) => (
            <StaggerItem as="li" key={post.slug} className="h-full">
              <PostCard post={post} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
