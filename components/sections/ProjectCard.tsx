import Image from "next/image";
import Link from "next/link";
import type { LensView } from "@/content/case-lenses";
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
 * Case card for /work. `view` is the current reading lens for this case;
 * without one the card falls back to the project pitch and metric.
 */
export function ProjectCard({
  project,
  view,
  statusLabel,
  href,
  feature = false,
  startHereWhy,
}: {
  project: Project;
  view?: LensView;
  statusLabel?: string;
  href?: string;
  feature?: boolean;
  startHereWhy?: string;
}) {
  const stats = view ? view.stats.slice(0, feature ? 4 : 2) : [{ label: "Result", value: project.metric.split(" · ")[0] }];
  const headline = view?.headline ?? project.pitch;

  return (
    <Link
      href={href ?? `/work/${project.slug}`}
      className="group block h-full rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
    >
      <article
        className={`flex h-full overflow-hidden rounded-[var(--radius-card)] border bg-[color:var(--bg-elevated)] transition-transform duration-[var(--dur-fast)] group-hover:-translate-y-1 group-focus-visible:-translate-y-1 motion-reduce:transform-none ${
          feature
            ? "flex-col border-[color:var(--accent)] md:flex-row"
            : "flex-col border-[color:var(--hairline)]"
        }`}
      >
        <div
          className={`relative overflow-hidden bg-[color:var(--bg-inverse)] ${
            feature ? "aspect-[16/10] md:aspect-auto md:w-[56%] md:shrink-0" : "aspect-[16/10]"
          }`}
        >
          <Cover project={project} />
          <span className={`absolute left-4 top-4 ${chipOnDark}`}>{statusLabel ?? fallbackStatus[project.status]}</span>
          <span className={`absolute right-4 top-4 tabular-nums ${chipOnDark}`}>{project.year}</span>
        </div>

        <div className={`flex min-w-0 flex-1 flex-col gap-4 ${feature ? "p-7 md:p-9" : "p-6"}`}>
          {feature && (
            <span className="w-fit rounded-[var(--radius-pill)] bg-[color:var(--accent)] px-2.5 py-0.5 font-sans text-[length:var(--type-caption)] text-[color:var(--accent-ink)]">
              Start here
            </span>
          )}
          <div className="flex flex-col gap-1">
            <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)] tabular-nums">
              Case {project.index} · {project.role}
            </p>
            <h3
              className={`font-serif leading-[1.02] text-[color:var(--ink-primary)] ${
                feature ? "text-[length:var(--type-display-m)]" : "text-[32px]"
              }`}
            >
              {project.name}
            </h3>
          </div>
          <p
            className={`text-[color:var(--ink-body)] ${
              feature ? "text-[length:var(--type-body-l)] leading-[1.5]" : "line-clamp-3 text-[length:var(--type-small)] leading-[1.55]"
            }`}
          >
            {headline}
          </p>
          {feature && startHereWhy && (
            <p className="text-[length:var(--type-small)] leading-[1.55] text-[color:var(--ink-muted)]">{startHereWhy}</p>
          )}
          <dl className={`mt-auto grid gap-x-5 gap-y-3 ${feature ? "grid-cols-2" : "grid-cols-2"}`}>
            {stats.map((s) => (
              <div key={s.label} className="border-t-2 border-[color:var(--accent)] pt-2">
                <dt className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">{s.label}</dt>
                <dd className="mt-0.5 font-serif text-[24px] leading-[1.1] text-[color:var(--ink-primary)] tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <ul className="flex flex-wrap gap-1.5">
              {project.stack.slice(0, feature ? 6 : 3).map((t) => (
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
