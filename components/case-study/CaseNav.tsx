import Link from "next/link";
import { projects } from "@/content/projects";

const card =
  "flex flex-col gap-1.5 rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 text-[color:var(--ink-primary)] transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] motion-reduce:transform-none";

/** Previous / next case in content/projects.ts order (wraps around). */
export function CaseNav({ slug }: { slug: string }) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1 || projects.length < 2) return null;
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  return (
    <nav aria-label="More cases" className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Link href={`/work/${prev.slug}`} className={card}>
        <span className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
          ← Previous case
        </span>
        <span className="font-serif text-[32px] leading-[1.05]">{prev.name}</span>
        <span className="font-sans text-[length:var(--type-small)] text-[color:var(--ink-body)]">
          {prev.tagline}
        </span>
      </Link>
      <Link href={`/work/${next.slug}`} className={`${card} md:text-right`}>
        <span className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
          Next case →
        </span>
        <span className="font-serif text-[32px] leading-[1.05]">{next.name}</span>
        <span className="font-sans text-[length:var(--type-small)] text-[color:var(--ink-body)]">
          {next.tagline}
        </span>
      </Link>
    </nav>
  );
}
