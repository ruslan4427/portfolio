"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { easeSmooth } from "@/lib/motion";
import {
  projects,
  type ProjectRoleTag,
  type ProjectStackTag,
} from "@/content/projects";

const ROLE_CHIPS: { value: ProjectRoleTag; label: string }[] = [
  { value: "frontend", label: "Frontend" },
  { value: "full-stack", label: "Full-stack" },
  { value: "cto", label: "CTO" },
  { value: "consulting", label: "Consulting" },
];

const STACK_CHIPS: { value: ProjectStackTag; label: string }[] = [
  { value: "react", label: "React" },
  { value: "next", label: "Next.js" },
  { value: "flutter", label: "Flutter" },
  { value: "node", label: "Node" },
  { value: "ai", label: "AI / LLM" },
];

const YEAR_CHIPS = Array.from(
  new Set(projects.map((p) => Number(p.year)).filter(Number.isFinite)),
).sort((a, b) => b - a);

export function WorkIndex() {
  const [roles, setRoles] = useState<Set<ProjectRoleTag>>(new Set());
  const [stacks, setStacks] = useState<Set<ProjectStackTag>>(new Set());
  const [years, setYears] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const roleOK =
        roles.size === 0 ||
        (p.roleTags?.some((t) => roles.has(t)) ?? false);
      const stackOK =
        stacks.size === 0 ||
        (p.stackTags?.some((t) => stacks.has(t)) ?? false);
      const yearOK =
        years.size === 0 || (p.year ? years.has(Number(p.year)) : false);
      return roleOK && stackOK && yearOK;
    });
  }, [roles, stacks, years]);

  const anyActive = roles.size + stacks.size + years.size > 0;

  const clearAll = () => {
    setRoles(new Set());
    setStacks(new Set());
    setYears(new Set());
  };

  return (
    <section className="relative px-[var(--gutter)] pb-[var(--section-py)]">
      <div className="mx-auto max-w-[var(--content-max)]">
        <div className="mb-10 flex flex-col gap-4">
          <ChipRow
            label="Role"
            options={ROLE_CHIPS}
            active={roles}
            setActive={setRoles}
          />
          <ChipRow
            label="Stack"
            options={STACK_CHIPS}
            active={stacks}
            setActive={setStacks}
          />
          <ChipRow
            label="Year"
            options={YEAR_CHIPS.map((y) => ({ value: y, label: String(y) }))}
            active={years}
            setActive={setYears}
          />
        </div>

        {filtered.length > 0 ? (
          <Stagger as="ul" className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filtered.map((project) => (
              <StaggerItem as="li" key={project.slug}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <EmptyState onClear={clearAll} />
        )}

        {anyActive && filtered.length > 0 ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={clearAll}
              className="font-sans text-xs text-[color:var(--ink-muted)] underline underline-offset-4 hover:text-[color:var(--ink-primary)] focus-visible:outline-none focus-visible:text-[color:var(--ink-primary)]"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

type ChipRowProps<T extends string | number> = {
  label: string;
  options: { value: T; label: string }[];
  active: Set<T>;
  setActive: (next: Set<T>) => void;
};

function ChipRow<T extends string | number>({
  label,
  options,
  active,
  setActive,
}: ChipRowProps<T>) {
  const toggle = (value: T) => {
    const next = new Set(active);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    setActive(next);
  };

  const clearRow = () => setActive(new Set<T>());
  const rowIsAll = active.size === 0;

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
      <span className="font-sans text-xs uppercase tracking-wider text-[color:var(--ink-muted)] md:w-16">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        <Chip label="All" active={rowIsAll} onClick={clearRow} />
        {options.map((opt) => (
          <Chip
            key={String(opt.value)}
            label={opt.label}
            active={active.has(opt.value)}
            onClick={() => toggle(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      whileHover={{ y: -3, transition: { duration: 0.35, ease: easeSmooth } }}
      whileFocus={{ y: -3, transition: { duration: 0.35, ease: easeSmooth } }}
      transition={{ duration: 0.18, ease: easeSmooth }}
      className={
        "rounded-full border px-3.5 py-1.5 font-sans text-xs focus-visible:outline-none " +
        (active
          ? "border-transparent bg-[color:var(--cta)] text-[color:var(--cta-ink)] shadow-[var(--shadow-card)]"
          : "border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] text-[color:var(--ink-primary)]")
      }
    >
      {label}
    </motion.button>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="max-w-md text-[color:var(--ink-muted)]">
        Nothing matches that combination. Try loosening a chip, or clear the
        filters to see everything.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--outline)] bg-[color:var(--bg-elevated)] px-5 py-2.5 font-sans text-sm text-[color:var(--ink-primary)] shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none"
      >
        Clear filters
      </button>
    </div>
  );
}
