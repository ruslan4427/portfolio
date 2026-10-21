"use client";

import { useMemo, useState } from "react";
import { useCaseReader } from "@/components/case-study/CaseReader";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { caseLenses, workStartHere } from "@/content/case-lenses";
import { projects, type ProjectRoleTag, type ProjectStackTag } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";

const ROLE_LABEL: Record<ProjectRoleTag, string> = {
  frontend: "Frontend",
  "full-stack": "Full-stack",
  cto: "CTO / lead",
  consulting: "Consulting",
};

const STACK_LABEL: Record<ProjectStackTag, string> = {
  react: "React",
  next: "Next.js",
  flutter: "Flutter",
  node: "Node",
  ai: "AI / LLM",
};

type Filter = { kind: "role"; value: ProjectRoleTag } | { kind: "stack"; value: ProjectStackTag } | null;

function matches(p: (typeof projects)[number], f: Filter) {
  if (!f) return true;
  return f.kind === "role" ? (p.roleTags?.includes(f.value) ?? false) : (p.stackTags?.includes(f.value) ?? false);
}

// Only options that match at least one case, so no chip leads to an empty grid.
const stackOptions = (Object.keys(STACK_LABEL) as ProjectStackTag[])
  .map((v) => ({ v, n: projects.filter((p) => p.stackTags?.includes(v)).length }))
  .filter((o) => o.n > 0);
const roleOptions = (Object.keys(ROLE_LABEL) as ProjectRoleTag[])
  .map((v) => ({ v, n: projects.filter((p) => p.roleTags?.includes(v)).length }))
  .filter((o) => o.n > 0 && o.n < projects.length);

const chipBase =
  "inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-pill)] border px-4 font-sans text-sm transition-colors duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]";

function Chip({ label, count, active, onClick }: { label: string; count?: number; active: boolean; onClick: () => void }) {
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
      {count !== undefined && (
        <span className={active ? "text-[color:var(--ink-on-dark-muted)]" : "text-[color:var(--ink-muted)]"}>{count}</span>
      )}
    </button>
  );
}

export function WorkIndex() {
  const { lens } = useCaseReader();
  const [filter, setFilter] = useState<Filter>(null);
  const pick = workStartHere[lens];
  const featured = projects.find((p) => p.slug === pick.slug);

  const rest = useMemo(
    () => projects.filter((p) => matches(p, filter) && (filter !== null || p.slug !== pick.slug)),
    [filter, pick.slug],
  );

  const href = (slug: string) => `/work/${slug}?for=${lens}`;
  const isActive = (f: Filter) => JSON.stringify(f) === JSON.stringify(filter);

  return (
    <div className="flex flex-col gap-14">
      {featured && filter === null && (
        <section aria-labelledby="start-here-heading">
          <h2 id="start-here-heading" className="sr-only">
            Start here
          </h2>
          <ProjectCard
            project={featured}
            view={caseLenses[featured.slug]?.lenses[lens]}
            statusLabel={caseLenses[featured.slug]?.statusLabel}
            href={href(featured.slug)}
            startHereWhy={pick.why}
            feature
          />
        </section>
      )}

      <section aria-labelledby="all-cases-heading" className="flex flex-col gap-8">
        <div className="flex flex-col gap-5 border-t border-[color:var(--hairline)] pt-10">
          <h2 id="all-cases-heading" className="font-serif text-[length:var(--type-display-m)] leading-[1.02] text-[color:var(--ink-primary)]">
            {filter === null ? "The other cases" : "Matching cases"}
          </h2>
          <div role="group" aria-label="Filter cases" className="flex flex-wrap gap-2">
            <Chip label="All" count={projects.length} active={filter === null} onClick={() => setFilter(null)} />
            {roleOptions.map((o) => (
              <Chip
                key={o.v}
                label={ROLE_LABEL[o.v]}
                count={o.n}
                active={isActive({ kind: "role", value: o.v })}
                onClick={() => setFilter(isActive({ kind: "role", value: o.v }) ? null : { kind: "role", value: o.v })}
              />
            ))}
            {stackOptions.map((o) => (
              <Chip
                key={o.v}
                label={STACK_LABEL[o.v]}
                count={o.n}
                active={isActive({ kind: "stack", value: o.v })}
                onClick={() => setFilter(isActive({ kind: "stack", value: o.v }) ? null : { kind: "stack", value: o.v })}
              />
            ))}
          </div>
        </div>

        <Stagger as="ul" className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-live="polite">
          {rest.map((project) => (
            <StaggerItem as="li" key={project.slug} className="h-full">
              <ProjectCard
                project={project}
                view={caseLenses[project.slug]?.lenses[lens]}
                statusLabel={caseLenses[project.slug]?.statusLabel}
                href={href(project.slug)}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}
