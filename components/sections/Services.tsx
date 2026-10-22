import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { services } from "@/content/services";

const featured = services.slice(0, 3);

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="relative px-[var(--gutter)] py-[var(--section-py)]">
      <div className="relative mx-auto max-w-[var(--content-max)]">
        <SectionHeader
          id="services-heading"
          eyebrow={`Engagements · ${featured.length} of ${services.length}`}
          title="Three formats, one bar for shipped."
          link={{ href: "/services", label: `All ${services.length} formats` }}
        />
        <Stagger as="ul" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {featured.map((s) => (
            <StaggerItem as="li" key={s.id} className="h-full">
              <article className="flex h-full flex-col gap-3 rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 shadow-[var(--shadow-card)] md:p-7">
                <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)] tabular-nums">{s.format}</p>
                <h3 className="font-serif text-[length:var(--type-display-s)] leading-[1.1] text-[color:var(--ink-primary)]">{s.name}</h3>
                <p className="text-[length:var(--type-small)] leading-[1.6] text-[color:var(--ink-body)]">{s.outcome}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
