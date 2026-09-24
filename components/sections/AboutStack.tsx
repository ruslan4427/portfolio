import { SectionBadge } from "@/components/ui/SectionBadge";

const facts = [
  { label: "Base", value: "Kyiv → Ohio · remote" },
  { label: "Practice", value: "AI collaboration · solo builds" },
  { label: "Cadence", value: "2–3 months per case study" },
];

const stack = [
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

export function AboutStack() {
  return (
    <section
      id="stack"
      className="relative px-[var(--gutter)] py-[var(--section-py)]"
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-12 flex flex-col items-center gap-6 text-center">
          <SectionBadge label="Practice" />
          <h2 className="font-serif text-[clamp(40px,5vw,64px)] text-[color:var(--ink-primary)]">
            A studio of one, running
            <br />
            <em>with</em> the model.
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--ink-body)]">
            I ship production software the way most teams still write RFCs —
            spec first, one file at a time, a DEVLOG after every session.
            Claude does the typing; the taste, the pivots, and the frozen-logic
            calls stay mine.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {facts.map((f) => (
            <div
              key={f.label}
              className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 shadow-[var(--shadow-card)]"
            >
              <div className="font-sans text-xs uppercase tracking-wider text-[color:var(--ink-muted)]">
                {f.label}
              </div>
              <div className="mt-2 font-sans text-base text-[color:var(--ink-primary)]">
                {f.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <p className="mb-8 text-center font-sans text-sm text-[color:var(--ink-muted)]">
            The interesting question isn&rsquo;t which model is smartest —
            it&rsquo;s which model is right-sized for the decision on the table.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {stack.map((row) => (
              <div
                key={row.tier}
                className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-2xl italic text-[color:var(--ink-primary)]">
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
