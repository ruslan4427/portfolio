import { SectionBadge } from "@/components/ui/SectionBadge";
import { Reveal } from "@/components/ui/Reveal";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";

type StackRow = {
  tier: string;
  use: string;
  ex: string;
};

const stack: StackRow[] = [
  {
    tier: "Opus",
    use: "Strategy, architecture, review",
    ex: "Angel five-stage pipeline · Noble frozen-logic authoring",
  },
  {
    tier: "Sonnet",
    use: "Feature implementation, refactors",
    ex: "Lexora audio pipeline · Fieldmark auth pivot",
  },
  {
    tier: "Haiku",
    use: "High-volume, low-stakes",
    ex: "smm-factory comment replies · analytics summaries",
  },
];

const facts = [
  { label: "Base", value: "Kyiv → Ohio · remote" },
  { label: "Practice", value: "AI collaboration · solo builds" },
  { label: "Cadence", value: "2–3 months per case study" },
] as const;

type AiStackProps = {
  showBadge?: boolean;
};

export function AiStack({ showBadge = true }: AiStackProps = {}) {
  return (
    <section
      id="stack"
      className="relative px-[var(--gutter)] py-[var(--section-py)]"
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-12 flex flex-col items-center gap-6 text-center">
          {showBadge ? (
            <Reveal>
              <SectionBadge label="AI stack" />
            </Reveal>
          ) : null}
          <h2 className="font-serif text-[clamp(32px,3.5vw,48px)] text-[color:var(--ink-primary)]">
            <MaskReveal delay={0.15}>Right-sized model for the</MaskReveal>
            <br />
            <MaskReveal delay={0.32}>decision on the table.</MaskReveal>
          </h2>
          <Reveal delay={0.15}>
            <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--ink-body)]">
              The interesting question isn&rsquo;t which model is smartest —
              it&rsquo;s which model matches the cost, latency, and
              reversibility of what you&rsquo;re about to ship.
            </p>
          </Reveal>
        </header>

        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {facts.map((f) => (
            <StaggerItem key={f.label}>
              <div className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 shadow-[var(--shadow-card)]">
                <div className="font-sans text-xs uppercase tracking-wider text-[color:var(--ink-muted)]">
                  {f.label}
                </div>
                <div className="mt-2 font-sans text-base text-[color:var(--ink-primary)]">
                  {f.value}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Stagger className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {stack.map((row) => (
            <StaggerItem key={row.tier}>
              <div className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 shadow-[var(--shadow-card)]">
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-2xl text-[color:var(--ink-primary)]">
                    {row.tier}
                  </span>
                  <span className="font-sans text-xs uppercase tracking-wider text-[color:var(--ink-muted)]">
                    {row.use}
                  </span>
                </div>
                <p className="mt-4 text-sm text-[color:var(--ink-body)]">
                  {row.ex}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
