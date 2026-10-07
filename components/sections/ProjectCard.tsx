import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

const statusLabel: Record<Project["status"], string> = {
  shipped: "Shipped",
  "in-review": "In review",
  "in-progress": "In progress",
  "sprint-4": "Active",
};

export function ProjectCard({ project }: { project: Project }) {
  const preview = project.preview;
  const isPortrait = preview?.orientation === "portrait";

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block focus-visible:outline-none"
    >
      <article className="overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] shadow-[var(--shadow-card)] transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden bg-[color:var(--ink-primary)]">
          {preview ? (
            <>
              {isPortrait ? (
                <>
                  <div
                    aria-hidden
                    className="absolute inset-0 scale-110 opacity-40 blur-2xl"
                    style={{
                      backgroundImage: `url(${preview.src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="relative flex h-full w-full items-center justify-center p-4">
                    <div className="relative h-full aspect-[9/19.5] overflow-hidden rounded-[20px] ring-1 ring-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
                      <Image
                        src={preview.src}
                        alt={preview.alt}
                        fill
                        sizes="(min-width: 768px) 220px, 180px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <Image
                  src={preview.src}
                  alt={preview.alt}
                  fill
                  sizes="(min-width: 1200px) 580px, (min-width: 768px) 48vw, 92vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              )}
            </>
          ) : (
            <>
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(245,244,239,0.09) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  aria-hidden
                  className="font-serif text-[clamp(72px,10vw,128px)] italic leading-none text-white/25 tabular-nums"
                >
                  {project.index}
                </span>
              </div>
            </>
          )}

          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 font-sans text-[11px] text-white backdrop-blur-md">
            <span>{statusLabel[project.status]}</span>
          </span>
          <span className="absolute right-4 top-4 inline-flex items-center rounded-full border border-white/20 bg-black/40 px-2.5 py-1 font-sans text-[11px] text-white tabular-nums backdrop-blur-md">
            {project.year}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 p-5">
          <div className="min-w-0">
            <h3 className="font-sans text-base font-semibold text-[color:var(--ink-primary)]">
              {project.name}
            </h3>
            <p className="mt-1 line-clamp-1 font-sans text-xs text-[color:var(--ink-muted)]">
              {project.role}
            </p>
          </div>
          <span className="shrink-0 pt-0.5 text-right font-sans text-[11px] text-[color:var(--ink-body)] tabular-nums">
            {project.metric.split(" · ")[0]}
          </span>
        </div>
      </article>
    </Link>
  );
}
