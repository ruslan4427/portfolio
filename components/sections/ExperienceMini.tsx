import Link from "next/link";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { experience } from "@/content/experience";

const latest = experience.slice(0, 3);

export function ExperienceMini() {
  return (
    <section
      id="experience"
      className="relative px-[var(--gutter)] py-[var(--section-py)]"
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-14 flex flex-col items-center gap-6 text-center">
          <SectionBadge label="Experience" />
          <h2 className="font-serif text-[clamp(36px,4.5vw,64px)] leading-[1.02] text-[color:var(--ink-primary)]">
            The three most recent
            <br />
            chapters.
          </h2>
        </header>

        <div className="mx-auto max-w-4xl rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-8 shadow-[var(--shadow-card)] md:p-10">
          <ol className="relative">
            <div
              aria-hidden
              className="absolute left-[80px] top-2 bottom-2 hidden w-px bg-[color:var(--hairline)] md:block"
            />
            {latest.map((e, i) => (
              <li
                key={e.years}
                className={`relative grid grid-cols-1 gap-4 md:grid-cols-[160px_1fr] md:gap-10 ${
                  i > 0 ? "pt-8 md:pt-10" : ""
                } ${i < latest.length - 1 ? "pb-8 md:pb-10" : ""}`}
              >
                <div>
                  <span className="inline-flex rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-page)] px-3 py-1 font-sans text-xs text-[color:var(--ink-muted)] tabular-nums">
                    {e.years}
                  </span>
                </div>
                <div>
                  <h3 className="font-sans text-base font-semibold text-[color:var(--ink-primary)]">
                    {e.role}
                  </h3>
                  <p
                    className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[color:var(--ink-muted)]"
                    dangerouslySetInnerHTML={{ __html: e.description }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/about#experience"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--outline)] bg-[color:var(--bg-elevated)] px-5 py-2.5 font-sans text-sm text-[color:var(--ink-primary)] shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)]/40"
          >
            Full timeline
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
