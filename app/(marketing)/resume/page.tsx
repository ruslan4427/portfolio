import type { Metadata } from "next";
import { bio, credentials } from "@/content/about";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Ruslan Hrekov — software engineer and product designer. Experience, selected work, certifications.",
};

const SITE = "https://hrekov.dev";
const CONTACT = [
  { label: "Ohio, US · remote" },
  { label: "rusgrekovua@gmail.com", href: "mailto:rusgrekovua@gmail.com" },
  { label: "hrekov.dev", href: SITE },
  { label: "linkedin.com/in/ruslan-hrekov-b21996315", href: "https://www.linkedin.com/in/ruslan-hrekov-b21996315/" },
  { label: "github.com/ruslan4427", href: "https://github.com/ruslan4427" },
];

// Stack = every technology named across the case studies, versions dropped,
// duplicates merged ("Claude Opus" folds into "Claude Opus/Sonnet/Haiku"),
// most used first.
const ALIASES: Record<string, string> = { "GH Actions": "GitHub Actions" };
const counts = projects
  .flatMap((p) => p.stack)
  .map((t) => ALIASES[t] ?? t.replace(/\s+v?\d[\d.]*$/, ""))
  .reduce<Record<string, number>>((acc, t) => ({ ...acc, [t]: (acc[t] ?? 0) + 1 }), {});
const stack = Object.entries(counts)
  .filter(([t]) => !Object.keys(counts).some((o) => o !== t && o.startsWith(`${t}/`)))
  .sort((a, b) => b[1] - a[1])
  .map(([t]) => t);

const label = "font-sans text-[10pt] font-semibold text-[color:var(--ink-primary)]";
const muted = "text-[color:var(--ink-muted)]";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-1 gap-x-6 gap-y-2 border-t border-[color:var(--outline)] pt-4 sm:grid-cols-[34mm_minmax(0,1fr)] print:grid-cols-[34mm_minmax(0,1fr)]">
      <h2 className="font-serif text-[13pt] leading-tight text-[color:var(--ink-primary)]">{title}</h2>
      <div className="flex min-w-0 flex-col gap-3">{children}</div>
    </section>
  );
}

/**
 * One source for the web résumé and public/resume.pdf
 * (scripts/build-resume-pdf.mjs). Everything comes from content/*.
 */
export default function ResumePage() {
  return (
    <main id="main" className="px-[var(--gutter)] pt-28 pb-[var(--section-py)] print:p-0">
      <div className="mx-auto mb-6 flex max-w-[210mm] flex-wrap items-center justify-between gap-4 print:hidden">
        <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">Résumé · A4</p>
        <a
          href="/resume.pdf"
          download="Ruslan-Hrekov-Resume.pdf"
          className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-pill)] bg-[color:var(--bg-inverse)] px-5 font-sans text-sm text-[color:var(--ink-on-dark)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
        >
          Download PDF <span aria-hidden>↓</span>
        </a>
      </div>

      <article className="resume-sheet mx-auto flex max-w-[210mm] flex-col gap-5 bg-[color:var(--bg-elevated)] p-6 font-sans sm:p-[14mm] text-[10pt] leading-[1.5] text-[color:var(--ink-body)] shadow-[var(--shadow-card)] print:max-w-none print:p-0 print:shadow-none">
        <header className="flex flex-col gap-2">
          <h1 className="font-serif text-[28pt] leading-none text-[color:var(--ink-primary)]">Ruslan Hrekov</h1>
          <p className="text-[11pt] text-[color:var(--ink-primary)]">
            Software engineer · product designer — shipping production software with Claude
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-0.5 text-[9pt] [overflow-wrap:anywhere]">
            {CONTACT.map((c) => (
              <li key={c.label} className={muted}>
                {c.href ? (
                  <a href={c.href} className="text-[color:var(--ink-primary)] underline decoration-[color:var(--outline)] underline-offset-2">
                    {c.label}
                  </a>
                ) : (
                  c.label
                )}
              </li>
            ))}
          </ul>
        </header>

        <Section title="Summary">
          <p>{bio[0]}</p>
          <p>{bio[3]}</p>
        </Section>

        <Section title="Experience">
          {experience.map((e) => (
            <div key={e.role} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className={label}>{e.role}</h3>
                <span className={`tabular-nums ${muted}`}>{e.years}</span>
              </div>
              <p dangerouslySetInnerHTML={{ __html: e.description }} />
            </div>
          ))}
        </Section>

        <Section title={`Selected work · ${projects.length} case studies`}>
          {projects.map((p) => (
            <div key={p.slug} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className={label}>
                  {p.name} <span className={`font-normal ${muted}`}>· {p.role} · {p.year}</span>
                </h3>
                <a href={`${SITE}/work/${p.slug}`} className={`[overflow-wrap:anywhere] underline decoration-[color:var(--outline)] underline-offset-2 ${muted}`}>
                  hrekov.dev/work/{p.slug}
                </a>
              </div>
              <p>{p.tagline}</p>
              <p className={muted}>
                {p.metric} · {p.stack.slice(0, 5).join(", ")}
              </p>
            </div>
          ))}
        </Section>

        <Section title="Certifications">
          <p>
            <span className={label}>{credentials.featured.title}</span>{" "}
            <span className={muted}>
              · {credentials.featured.issuer} · {credentials.featured.kind} · {credentials.featured.date}
            </span>
          </p>
          <p>
            <span className={label}>Anthropic Academy</span>{" "}
            <span className={muted}>· {credentials.anthropic.date}</span>
            <br />
            {credentials.anthropic.items.map((c) => c.title).join(" · ")}
          </p>
        </Section>

        <Section title="Stack">
          <p>{stack.join(" · ")}</p>
        </Section>
      </article>
    </main>
  );
}
