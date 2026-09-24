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
        <div className="relative aspect-[16/10] overflow-hidden bg-[color:var(--bg-page)]">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(17,17,17,0.08) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-serif text-[clamp(48px,7vw,88px)] italic text-[color:var(--ink-primary)]/40">
              {project.name}
            </span>
          </div>
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-2.5 py-1 font-sans text-[11px] text-[color:var(--ink-muted)]">
            <span className="font-mono text-[color:var(--ink-primary)]">
              {project.index}
            </span>
            <span>·</span>
            <span>{statusLabel[project.status]}</span>
          </span>
        </div>

        <div className="flex items-baseline justify-between p-6">
          <div className="min-w-0">
            <h3 className="font-sans text-lg font-semibold text-[color:var(--ink-primary)]">
              {project.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-[color:var(--ink-muted)]">
              {project.tagline}
            </p>
          </div>
          <span className="ml-4 shrink-0 font-sans text-sm text-[color:var(--ink-muted)]">
            {project.year}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 px-6 pb-6">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[color:var(--hairline)] px-3 py-1 text-xs text-[color:var(--ink-body)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
