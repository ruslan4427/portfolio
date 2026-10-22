import Image from "next/image";
import Link from "next/link";
import type { CaseLensData } from "@/content/case-lenses";
import type { Project } from "@/content/projects";
import { AnimatedCover } from "./AnimatedCover";
import { FieldmarkCover } from "./FieldmarkCover";
import { HrekovDevCover } from "./HrekovDevCover";
import { NobleCover } from "./NobleCover";
import { SmmFactoryCover } from "./SmmFactoryCover";

const fallbackStatus: Record<Project["status"], string> = {
  shipped: "Shipped",
  "in-review": "In review",
  "in-progress": "In progress",
  "sprint-4": "In progress",
};

const COVER_SIZES = "(min-width: 1200px) 580px, (min-width: 768px) 48vw, 92vw";

function Cover({ project }: { project: Project }) {
  const preview = project.preview;
  if (!preview) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span aria-hidden className="font-serif text-[length:var(--type-display-l)] leading-none text-[color:var(--ink-on-dark-muted)] tabular-nums">
          {project.index}
        </span>
      </div>
    );
  }
  if (preview.orientation === "portrait") {
    return (
      <>
        <div
          aria-hidden
          className="absolute inset-0 scale-110 opacity-40 blur-2xl"
          style={{ backgroundImage: `url(${preview.src})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="relative flex h-full w-full items-center justify-center p-4">
          <div className="relative aspect-[9/19.5] h-full overflow-hidden rounded-[var(--radius-panel)] ring-1 ring-[color:var(--hairline-on-dark)] shadow-[var(--shadow-float)]">
            <Image src={preview.src} alt={preview.alt} fill sizes="(min-width: 768px) 220px, 180px" className="object-cover" />
          </div>
        </div>
      </>
    );
  }
  const props = { src: preview.src, alt: preview.alt, sizes: COVER_SIZES };
  switch (project.slug) {
    case "lexora":
      return <AnimatedCover {...props} />;
    case "fieldmark":
      return <FieldmarkCover {...props} />;
    case "smm-factory":
      return <SmmFactoryCover {...props} />;
    case "noble-saas":
      return <NobleCover {...props} />;
    case "hrekov-dev":
      return <HrekovDevCover {...props} />;
    default:
      return (
        <Image
          src={preview.src}
          alt={preview.alt}
          sizes={COVER_SIZES}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
        />
      );
  }
}

const chipOnDark =
  "inline-flex items-center rounded-[var(--radius-pill)] border border-[color:var(--hairline-on-dark)] bg-[color:var(--bg-inverse)]/70 px-2.5 py-1 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-on-dark)] backdrop-blur-md";

/**
 * Case card for /work. Every case gets the same card: number, what it is,
 * what came out of it, how long it took and the headline result.
 */
export function ProjectCard({ project, total, lens }: { project: Project; total: number; lens?: CaseLensData }) {
  const facts = [
    lens ? { label: "Built in", value: lens.glance.time } : null,
    { label: "Result", value: project.metric.split(" · ")[0] },
  ].filter((f): f is { label: string; value: string } => f !== null);

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block h-full rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] transition-transform duration-[var(--dur-fast)] group-hover:-translate-y-1 group-focus-visible:-translate-y-1 motion-reduce:transform-none">
        <div className="relative aspect-[16/10] overflow-hidden bg-[color:var(--bg-inverse)]">
          <Cover project={project} />
          <span className={`absolute left-4 top-4 ${chipOnDark}`}>{lens?.statusLabel ?? fallbackStatus[project.status]}</span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-6 md:p-7">
          <div className="flex flex-col gap-1.5">
            <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)] tabular-nums">
              <span className="text-[color:var(--accent)]">{project.index}</span> / {String(total).padStart(2, "0")} · {project.role} · {project.year}
            </p>
            <h3 className="font-serif text-[32px] leading-[1.02] text-[color:var(--ink-primary)]">{project.name}</h3>
            <p className="text-[length:var(--type-body-l)] leading-[1.45] text-[color:var(--ink-body)]">{project.tagline}</p>
          </div>
          {lens && (
            <p className="text-[length:var(--type-small)] leading-[1.55] text-[color:var(--ink-muted)]">
              <span className="text-[color:var(--ink-primary)]">Outcome: </span>
              {lens.glance.outcome}
            </p>
          )}
          <dl className="mt-auto grid grid-cols-2 gap-x-5 gap-y-3">
            {facts.map((s) => (
              <div key={s.label} className="border-t border-[color:var(--hairline)] pt-2">
                <dt className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">{s.label}</dt>
                <dd className="mt-0.5 font-sans text-[length:var(--type-small)] font-semibold leading-[1.35] text-[color:var(--ink-primary)]">{s.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <ul className="flex flex-wrap gap-1.5">
              {project.stack.slice(0, 3).map((t) => (
                <li
                  key={t}
                  className="rounded-[var(--radius-pill)] border border-[color:var(--outline)] px-2.5 py-0.5 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-body)]"
                >
                  {t}
                </li>
              ))}
            </ul>
            <span className="font-sans text-sm text-[color:var(--ink-primary)] underline decoration-[color:var(--outline)] underline-offset-4 group-hover:decoration-[color:var(--accent)]">
              Read case <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
