import { SectionBadge } from "@/components/ui/SectionBadge";
import { Reveal } from "@/components/ui/Reveal";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { values } from "@/content/about";

type ValuesProps = {
  showBadge?: boolean;
};

export function Values({ showBadge = true }: ValuesProps = {}) {
  return (
    <section
      id="values"
      className="relative px-[var(--gutter)] py-[var(--section-py)]"
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-12 flex flex-col items-center gap-6 text-center">
          {showBadge ? (
            <Reveal>
              <SectionBadge label="How I work" />
            </Reveal>
          ) : null}
          <h2 className="font-serif text-[clamp(32px,3.5vw,48px)] text-[color:var(--ink-primary)]">
            <MaskReveal delay={0.15}>Four rules that keep</MaskReveal>
            <br />
            <MaskReveal delay={0.32}>solo work honest.</MaskReveal>
          </h2>
        </header>

        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {values.map((v) => (
            <StaggerItem key={v.title}>
              <article className="h-full rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 shadow-[var(--shadow-card)] md:p-8">
                <h3 className="font-sans text-lg font-semibold text-[color:var(--ink-primary)]">
                  {v.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--ink-body)]">
                  {v.body}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
