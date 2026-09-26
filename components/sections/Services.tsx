import { SectionBadge } from "@/components/ui/SectionBadge";
import { CTALink } from "@/components/ui/CTAButton";
import { Reveal } from "@/components/ui/Reveal";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { services } from "@/content/services";

const featured = services.slice(0, 3);

export function Services() {
  return (
    <section
      id="services"
      className="dot-texture dot-texture-fade relative px-[var(--gutter)] py-[var(--section-py)]"
    >
      <div className="relative mx-auto max-w-[var(--content-max)]">
        <header className="mb-12 flex flex-col items-center gap-6 text-center">
          <Reveal>
            <SectionBadge label="How I engage" />
          </Reveal>
          <h2 className="font-serif text-[clamp(32px,4vw,56px)] leading-[1.02] text-[color:var(--ink-primary)]">
            <MaskReveal delay={0.15}>
              Three formats, one bar for shipped.
            </MaskReveal>
          </h2>
        </header>

        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {featured.map((s) => (
            <StaggerItem key={s.id}>
              <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 shadow-[var(--shadow-card)]">
                <span className="font-sans text-xs uppercase tracking-wider text-[color:var(--ink-muted)]">
                  {s.format}
                </span>
                <h3 className="mt-3 font-serif text-2xl text-[color:var(--ink-primary)]">
                  {s.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink-body)]">
                  {s.outcome}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-10 flex justify-center">
          <CTALink href="/services" variant="outline">
            How I engage
            <span aria-hidden>→</span>
          </CTALink>
        </Reveal>
      </div>
    </section>
  );
}
