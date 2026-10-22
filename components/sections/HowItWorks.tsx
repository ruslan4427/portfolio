import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";

type Step = {
  n: string;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    n: "1",
    title: "Discovery",
    description:
      "One paragraph in. Constraints, users, stakes. If we can’t name what should stay locked, we’re not ready to spec.",
  },
  {
    n: "2",
    title: "Spec",
    description:
      "specs/<slug>/spec.md lands first. What we’re building, what we’re not, and the shape of “done”.",
  },
  {
    n: "3",
    title: "Plan",
    description:
      "plan.md sequences the risky bits early. Every task numbered, blocked-by set, DEVLOG format decided.",
  },
  {
    n: "4",
    title: "Build",
    description:
      "Opus for architecture, Sonnet for features, Haiku for volume. DEVLOG goes in after every work block — not at the end, when memory lies.",
  },
  {
    n: "5",
    title: "Ship",
    description:
      "QA loop, memory/qa-iteration-N.md, retrospective, tag a release. The next feature restarts at Discovery.",
  },
];

export function HowItWorks() {
  return (
    <section id="process" aria-labelledby="process-heading" className="relative px-[var(--gutter)] py-[var(--section-py)]">
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHeader
          id="process-heading"
          eyebrow={`Process · ${steps.length} stages`}
          title="A five-stage loop for zero-rewrite shipping."
        />
        <Stagger as="ol" className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s) => (
            <StaggerItem as="li" key={s.n} className="flex flex-col gap-2 border-t-2 border-[color:var(--ink-primary)] pt-4 pb-8 lg:pb-0">
              <span className="font-sans text-[length:var(--type-caption)] text-[color:var(--accent)] tabular-nums">
                {s.n.padStart(2, "0")}
              </span>
              <h3 className="font-serif text-[length:var(--type-display-s)] leading-[1.1] text-[color:var(--ink-primary)]">{s.title}</h3>
              <p className="text-[length:var(--type-small)] leading-[1.6] text-[color:var(--ink-body)]">{s.description}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
