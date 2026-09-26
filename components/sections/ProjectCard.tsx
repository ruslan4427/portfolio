import Link from "next/link";
import type { Project } from "@/content/projects";

const statusLabel: Record<Project["status"], string> = {
  shipped: "Shipped",
  "in-review": "In review",
  "in-progress": "In progress",
  "sprint-4": "Active",
};

export function ProjectCard({ project }: { project: Project }) {
  const tags = [project.role.split(" · ")[0], project.stack[0]];

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block focus-visible:outline-none"
    >
      <article className="overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] shadow-[var(--shadow-card)] transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
        <div className="relative aspect-[16/8] overflow-hidden bg-[color:var(--bg-page)]">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(17,17,17,0.09) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-8">
            <span
              aria-hidden
              className="font-serif text-[clamp(72px,10vw,128px)] italic leading-none text-[color:var(--ink-primary)]/25 tabular-nums"
            >
              {project.index}
            </span>
            <span className="max-w-[60%] text-right font-sans text-xs text-[color:var(--ink-body)] tabular-nums">
              {project.metric}
            </span>
          </div>
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-2.5 py-1 font-sans text-[11px] text-[color:var(--ink-muted)]">
            <span>{statusLabel[project.status]}</span>
          </span>
          <span className="absolute right-4 top-4 font-sans text-[11px] text-[color:var(--ink-muted)] tabular-nums">
            {project.year}
          </span>
        </div>

        <div className="p-6">
          <h3 className="font-sans text-lg font-semibold text-[color:var(--ink-primary)]">
            {project.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-[color:var(--ink-muted)]">
            {project.tagline}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[color:var(--hairline)] px-3 py-1 text-xs text-[color:var(--ink-body)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
