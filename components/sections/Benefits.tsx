import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";

type Benefit = {
  title: string;
  description: string;
};

const benefits: Benefit[] = [
  {
    title: "Spec-first, always",
    description:
      "Every feature lands in specs/<slug>/ as spec + plan + tasks before any production code. Disagreements happen on paper, where they're cheaper.",
  },
  {
    title: "Honest metrics, not vibes",
    description:
      "Case studies come with commit hashes, DEVLOG entries, and named bugs. If a number isn't verifiable, it doesn't go in the copy.",
  },
  {
    title: "Lock what works, keep the taste",
    description:
      "Claude does the typing. The pivots, the calls on what to lock down, and the moment to stop and think — those stay mine. That's where the taste shows up in the diff.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" aria-labelledby="benefits-heading" className="relative px-[var(--gutter)] py-[var(--section-py)]">
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHeader
          id="benefits-heading"
          eyebrow={`Benefits · ${benefits.length}`}
          title="Send a one-paragraph problem — here’s what you get back."
        />
        <Stagger as="ul" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {benefits.map((b) => (
            <StaggerItem as="li" key={b.title} className="h-full">
              <article className="flex h-full flex-col gap-3 rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 shadow-[var(--shadow-card)] md:p-7">
                <h3 className="font-serif text-[length:var(--type-display-s)] leading-[1.1] text-[color:var(--ink-primary)]">{b.title}</h3>
                <p className="text-[length:var(--type-small)] leading-[1.6] text-[color:var(--ink-body)]">{b.description}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
