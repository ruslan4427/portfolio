import { SectionBadge } from "@/components/ui/SectionBadge";
import { Reveal } from "@/components/ui/Reveal";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";

type Benefit = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const benefits: Benefit[] = [
  {
    title: "Spec-first, always",
    description:
      "Every feature lands in specs/<slug>/ as spec + plan + tasks before a single production line. No guessing, no rewrites — the disagreement happens on paper.",
    icon: <Sparkle />,
  },
  {
    title: "Honest metrics, not vibes",
    description:
      "Case studies come with commit hashes, DEVLOG entries, and named bugs. If a number is not verifiable, it doesn't get shipped in the copy.",
    icon: <Handshake />,
  },
  {
    title: "Frozen logic, held-line taste",
    description:
      "Claude does the typing. The pivots, the frozen-logic calls, and the moment we stop and think — those stay mine. That's why the code feels considered.",
    icon: <Clap />,
  },
];

function BenefitCard({ b }: { b: Benefit }) {
  return (
    <div className="dot-texture dot-texture-fade relative overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] shadow-[var(--shadow-card)]">
      <div className="relative flex items-start gap-5 p-6 md:gap-6 md:p-7">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-page)] text-[color:var(--ink-primary)]">
          {b.icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-sans text-lg font-semibold text-[color:var(--ink-primary)]">
            {b.title}
          </h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[color:var(--ink-muted)]">
            {b.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Benefits() {
  return (
    <section
      id="benefits"
      className="relative px-[var(--gutter)] py-[var(--section-py)]"
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-14 flex flex-col items-center gap-6 text-center">
          <Reveal>
            <SectionBadge label="Benefits" />
          </Reveal>
          <h2 className="font-serif text-[clamp(36px,4.5vw,64px)] text-[color:var(--ink-primary)]">
            <MaskReveal delay={0.15}>Send a one-paragraph problem —</MaskReveal>
            <br />
            <MaskReveal delay={0.32}>here&rsquo;s what you get back.</MaskReveal>
          </h2>
        </header>

        <Stagger className="mx-auto flex max-w-3xl flex-col gap-4">
          {benefits.map((b) => (
            <StaggerItem key={b.title}>
              <BenefitCard b={b} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Sparkle() {
  return (
    <svg width="18" height="18" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z" />
    </svg>
  );
}

function Handshake() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M2 12l4-4 3 3 3-3 4 4-3 3-4-4-3 3z" strokeLinejoin="round" />
      <path d="M13 15l3 3 4-4-3-3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function Clap() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M8 14l-2-6a1.5 1.5 0 013-1l2 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 13l-2-8a1.5 1.5 0 013-.5l2 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 13l-1-7a1.5 1.5 0 013-.5l2 8a5 5 0 01-9 3l-3-6a1.5 1.5 0 013-1z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
