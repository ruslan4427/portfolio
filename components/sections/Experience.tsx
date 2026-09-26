import { SectionBadge } from "@/components/ui/SectionBadge";
import { Reveal } from "@/components/ui/Reveal";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { experience, type ExperienceEntry } from "@/content/experience";

type ExperienceProps = {
  entries?: ExperienceEntry[];
  showBadge?: boolean;
  title?: React.ReactNode;
};

const DEFAULT_TITLE = (
  <>
    <MaskReveal delay={0.15}>My journey shipping software</MaskReveal>
    <br />
    <MaskReveal delay={0.32}>with a model in the room.</MaskReveal>
  </>
);

export function Experience({
  entries = experience,
  showBadge = true,
  title = DEFAULT_TITLE,
}: ExperienceProps = {}) {
  return (
    <section
      id="experience"
      className="relative px-[var(--gutter)] py-[var(--section-py)]"
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-14 flex flex-col items-center gap-6 text-center">
          {showBadge ? (
            <Reveal>
              <SectionBadge label="Experience" />
            </Reveal>
          ) : null}
          <h2 className="font-serif text-[clamp(36px,4.5vw,64px)] text-[color:var(--ink-primary)]">
            {title}
          </h2>
        </header>

        <Reveal delay={0.1} className="mx-auto max-w-4xl">
          <div className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-8 shadow-[var(--shadow-card)] md:p-10">
            <Stagger as="ol" className="relative">
              <div
                aria-hidden
                className="absolute left-[80px] top-2 bottom-2 hidden w-px bg-[color:var(--hairline)] md:block"
              />
              {entries.map((e, i) => (
                <StaggerItem
                  as="li"
                  key={e.years}
                  className={`relative grid grid-cols-1 gap-4 md:grid-cols-[160px_1fr] md:gap-10 ${
                    i > 0 ? "pt-8 md:pt-10" : ""
                  } ${i < entries.length - 1 ? "pb-8 md:pb-10" : ""}`}
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
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
