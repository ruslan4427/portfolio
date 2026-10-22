import { SectionHeader } from "@/components/ui/SectionHeader";
import { experience } from "@/content/experience";

const latest = experience.slice(0, 3);

export function ExperienceMini() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="relative px-[var(--gutter)] py-[var(--section-py)]">
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHeader
          id="experience-heading"
          eyebrow={`Experience · ${latest.length} of ${experience.length}`}
          title="The three most recent chapters."
          link={{ href: "/about#experience", label: "Full timeline" }}
        />
        <ol className="flex flex-col">
          {latest.map((e) => (
            <li
              key={e.years}
              className="grid grid-cols-1 gap-2 border-b border-[color:var(--hairline)] py-6 first:pt-0 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10"
            >
              <span className="font-sans text-[length:var(--type-small)] text-[color:var(--ink-muted)] tabular-nums">{e.years}</span>
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-[length:var(--type-display-s)] leading-[1.1] text-[color:var(--ink-primary)]">{e.role}</h3>
                <p
                  className="max-w-[68ch] text-[length:var(--type-small)] leading-[1.6] text-[color:var(--ink-body)]"
                  dangerouslySetInnerHTML={{ __html: e.description }}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
