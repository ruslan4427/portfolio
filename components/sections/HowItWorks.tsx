import { SectionBadge } from "@/components/ui/SectionBadge";
import { Reveal } from "@/components/ui/Reveal";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";

type Step = {
  n: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const steps: Step[] = [
  {
    n: "1",
    title: "Discovery",
    description:
      "One paragraph in. Constraints, users, stakes. If we can’t name the frozen-logic call, we’re not ready to spec.",
    icon: <IconClipboard />,
  },
  {
    n: "2",
    title: "Spec",
    description:
      "specs/<slug>/spec.md lands first. What we’re building, what we’re not, and the shape of “done”.",
    icon: <IconDocSearch />,
  },
  {
    n: "3",
    title: "Plan",
    description:
      "plan.md sequences the risky bits early. Every task numbered, blocked-by set, DEVLOG format decided.",
    icon: <IconChat />,
  },
  {
    n: "4",
    title: "Build",
    description:
      "Opus for architecture, Sonnet for features, Haiku for volume. DEVLOG appended after every work block.",
    icon: <IconDots />,
  },
  {
    n: "5",
    title: "Ship",
    description:
      "QA loop, memory/qa-iteration-N.md, retrospective, tag a release. The next feature restarts at Discovery.",
    icon: <IconRocket />,
  },
];

function StepCard({ s, wide = false }: { s: Step; wide?: boolean }) {
  return (
    <article
      className={`relative overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 shadow-[var(--shadow-card)] ${
        wide ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-page)] font-sans text-sm font-semibold text-[color:var(--ink-primary)] tabular-nums">
          {s.n}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-page)] text-[color:var(--ink-primary)]">
          {s.icon}
        </div>
      </div>
      <h3 className="mt-8 font-sans text-lg font-semibold text-[color:var(--ink-primary)]">
        {s.title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[color:var(--ink-muted)]">
        {s.description}
      </p>
    </article>
  );
}

export function HowItWorks() {
  return (
    <section
      id="process"
      className="relative px-[var(--gutter)] py-[var(--section-py)]"
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-14 flex flex-col items-center gap-6 text-center">
          <Reveal>
            <SectionBadge label="How it works" />
          </Reveal>
          <h2 className="font-serif text-[clamp(36px,4.5vw,64px)] text-[color:var(--ink-primary)]">
            <MaskReveal delay={0.15}>A five-stage loop</MaskReveal>
            <br />
            <MaskReveal delay={0.32}>for zero-rewrite shipping.</MaskReveal>
          </h2>
        </header>

        <Stagger className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          <StaggerItem>
            <StepCard s={steps[0]} />
          </StaggerItem>
          <StaggerItem>
            <StepCard s={steps[1]} />
          </StaggerItem>
          <StaggerItem>
            <StepCard s={steps[2]} />
          </StaggerItem>
          <StaggerItem>
            <StepCard s={steps[3]} />
          </StaggerItem>
          <StaggerItem className="md:col-span-2">
            <StepCard s={steps[4]} wide />
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

function IconClipboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4h6v2H9zM9 11h6M9 15h4" strokeLinecap="round" />
    </svg>
  );
}

function IconDocSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M6 3h9l4 4v9M6 3v18h13" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="15" r="2.5" />
      <path d="M16 17l2 2" strokeLinecap="round" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2h-6l-4 4v-4H6a2 2 0 01-2-2z" strokeLinejoin="round" />
    </svg>
  );
}

function IconDots() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="7" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="17" cy="12" r="1.5" />
    </svg>
  );
}

function IconRocket() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 3c3 2 5 5 5 9v6h-4v-4h-2v4H7v-6c0-4 2-7 5-9z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="1.5" />
    </svg>
  );
}
