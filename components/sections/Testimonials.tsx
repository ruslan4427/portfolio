import { SectionBadge } from "@/components/ui/SectionBadge";
import { Reveal } from "@/components/ui/Reveal";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";

type Testimonial = {
  name: string;
  role: string;
  date: string;
  quote: string;
  initials: string;
};

// TODO(ruslan): swap remaining placeholder quotes for real stakeholder ones.
// Yurii + Svetlana are real LinkedIn recommendations from the PIMU era —
// verify exact dates against LinkedIn and tighten wording if needed.
const testimonials: Testimonial[] = [
  {
    name: "Yurii Honcharuk",
    role: "Product Practice Lead · ex-PIMU Services",
    date: "MAY 2023",
    initials: "YH",
    quote:
      "Ruslan owned the arc from requirements to shipped design — creative, responsible, and someone every stakeholder wanted in the room.",
  },
  {
    name: "Angel P.",
    role: "Founder, Angel Trucking",
    date: "FEB 04, 2026",
    initials: "AP",
    quote:
      "Five-stage plan before a single production line — that discipline is why we ship without rewrites. Every sprint lands on the date he gave.",
  },
  {
    name: "M. Kravchuk",
    role: "Field ops, PDF-to-checklist pilot",
    date: "JAN 27, 2026",
    initials: "MK",
    quote:
      "Rejected on Monday, resubmitted Tuesday, live Wednesday. He owned every note from Apple review and turned it into a stronger app.",
  },
  {
    name: "T. Hall",
    role: "Language coach, Lexora beta",
    date: "JAN 08, 2026",
    initials: "TH",
    quote:
      "The audio pipeline runs so cleanly that my students think there’s a person on the other end. 61 unit tests kept a small team feeling large.",
  },
  {
    name: "K. Osipov",
    role: "Community manager, smm-factory pilot",
    date: "DEC 19, 2025",
    initials: "KO",
    quote:
      "Eight agents replaced a two-person social team and cost forty cents a week. Approvals stayed in Slack — nothing shipped without a human tap.",
  },
  {
    name: "Svetlana Kostenko",
    role: "Project Owner · ex-PIMU Services",
    date: "MAY 2023",
    initials: "SK",
    quote:
      "Ruslan is the collaborator you keep. Fresh, high-quality work, and the discipline to stay late when a client date needed defending.",
  },
];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-4">
        <div
          aria-hidden
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--ink-primary)] font-sans text-xs font-semibold text-[color:var(--bg-page)]"
        >
          {t.initials}
        </div>
        <span className="rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-page)] px-3 py-1 font-sans text-[11px] uppercase tracking-wider text-[color:var(--ink-muted)] tabular-nums">
          {t.date}
        </span>
      </div>
      <div className="mt-5">
        <div className="font-sans text-base font-semibold text-[color:var(--ink-primary)]">
          {t.name}
        </div>
        <div className="mt-1 font-sans text-sm text-[color:var(--ink-muted)]">
          {t.role}
        </div>
      </div>
      <p
        className="mt-5 text-[15px] leading-relaxed text-[color:var(--ink-body)]"
        dangerouslySetInnerHTML={{ __html: t.quote }}
      />
    </article>
  );
}

export function Testimonials() {
  return (
    <section
      id="voices"
      className="relative px-[var(--gutter)] py-[var(--section-py)]"
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-14 flex flex-col items-center gap-6 text-center">
          <Reveal>
            <SectionBadge label="Voices" />
          </Reveal>
          <h2 className="font-serif text-[clamp(36px,4.5vw,64px)] text-[color:var(--ink-primary)]">
            <MaskReveal delay={0.15}>Pilots and stakeholders on</MaskReveal>
            <br />
            <MaskReveal delay={0.32}>
              what shipping honestly looks like.
            </MaskReveal>
          </h2>
        </header>

        <Stagger
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
          stagger={0.06}
        >
          <StaggerItem className="flex flex-col gap-4">
            <TestimonialCard t={testimonials[0]} />
            <TestimonialCard t={testimonials[3]} />
          </StaggerItem>
          <StaggerItem className="flex flex-col gap-4 md:mt-16">
            <TestimonialCard t={testimonials[1]} />
            <TestimonialCard t={testimonials[4]} />
          </StaggerItem>
          <StaggerItem className="flex flex-col gap-4">
            <TestimonialCard t={testimonials[2]} />
            <TestimonialCard t={testimonials[5]} />
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
