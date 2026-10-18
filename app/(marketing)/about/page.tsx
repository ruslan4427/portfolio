import type { Metadata } from "next";
import { AiStack } from "@/components/sections/AiStack";
import { Credentials } from "@/components/sections/Credentials";
import { CTALink } from "@/components/ui/CTAButton";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { StatusPill } from "@/components/ui/StatusPill";
import { bio, values } from "@/content/about";
import { experience } from "@/content/experience";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ruslan Hrekov — solo builder shipping AI-collaborative software from Kyiv → Ohio. Bio, timeline, AI stack, and the four rules that keep solo work honest.",
};

// Facts restated from content/about.ts bio + metadata — no new claims.
const facts = [
  { label: "Based", value: "Kyiv → Ohio" },
  { label: "Product design", value: "Since 2015" },
  { label: "Shipping with Claude", value: "Since March 2026" },
  { label: "Case studies", value: "Five, spec → DEVLOG" },
];

const [lead, ...rest] = bio;

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <p className="font-sans text-sm text-[color:var(--ink-muted)] tabular-nums">
      {index} — {label}
    </p>
  );
}

export default function AboutPage() {
  return (
    <main id="main" className="relative min-h-screen">
      <div className="mx-auto max-w-[var(--content-max)] px-[var(--gutter)] box-content">
        {/* Hero: headline left, at-a-glance ledger card right */}
        <section className="grid grid-cols-1 items-end gap-12 pt-40 pb-[var(--section-py)] md:grid-cols-12">
          <div className="flex flex-col items-start gap-8 md:col-span-7">
            <Reveal>
              <SectionBadge label="About" />
            </Reveal>
            <h1 className="max-w-[14ch] font-serif text-[clamp(48px,7vw,96px)] leading-[0.98] text-[color:var(--ink-primary)]">
              <MaskReveal mode="mount" delay={0.15}>
                A studio of one, running with the model.
              </MaskReveal>
            </h1>
            <Reveal delay={0.3}>
              <p className="max-w-[46ch] text-lg text-[color:var(--ink-muted)]">
                Solo builder shipping AI-collaborative software — Claude at the
                keyboard, taste at the helm.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.4} className="md:col-span-5">
            <aside
              aria-label="At a glance"
              className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-7 shadow-[var(--shadow-card)]"
            >
              <StatusPill status="available" label="Available for new projects" />
              <dl className="mt-6">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-baseline justify-between gap-4 border-t border-[color:var(--hairline)] py-3.5"
                  >
                    <dt className="text-sm text-[color:var(--ink-muted)]">
                      {f.label}
                    </dt>
                    <dd className="text-right text-[15px] text-[color:var(--ink-primary)]">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </Reveal>
        </section>

        {/* 01 — Bio: serif lead, Inter body, label rail on the left */}
        <section className="grid grid-cols-1 gap-8 border-t border-[color:var(--hairline)] py-[var(--section-py)] md:grid-cols-12 md:gap-12">
          <div className="md:col-span-3">
            <div className="md:sticky md:top-28">
              <SectionLabel index="01" label="Bio" />
            </div>
          </div>
          <div className="flex max-w-[720px] flex-col gap-6 md:col-span-9">
            <Reveal>
              <p className="font-serif text-[clamp(24px,2.4vw,32px)] font-normal leading-[1.3] tracking-[-0.01em] text-[color:var(--ink-primary)]">
                {lead}
              </p>
            </Reveal>
            <Stagger className="flex flex-col gap-6 text-[17px] leading-[1.7] text-[color:var(--ink-body)]">
              {rest.map((para, i) => (
                <StaggerItem key={i}>
                  <p>{para}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* 02 — The path: hairline ledger instead of a card timeline */}
        <section className="grid grid-cols-1 gap-8 border-t border-[color:var(--hairline)] py-[var(--section-py)] md:grid-cols-12 md:gap-12">
          <div className="md:col-span-3">
            <div className="flex flex-col gap-4 md:sticky md:top-28">
              <SectionLabel index="02" label="The path" />
              <h2 className="font-serif text-[clamp(32px,3.5vw,48px)] text-[color:var(--ink-primary)]">
                <MaskReveal delay={0.1}>The path so far.</MaskReveal>
              </h2>
            </div>
          </div>
          <Stagger as="ol" stagger={0.08} className="md:col-span-9">
            {experience.map((e) => (
              <StaggerItem
                key={`${e.years}-${e.role}`}
                as="li"
                className="grid grid-cols-1 gap-2 border-t border-[color:var(--hairline)] py-6 sm:grid-cols-[140px_1fr] sm:gap-8"
              >
                <span className="text-sm text-[color:var(--ink-muted)] tabular-nums">
                  {e.years}
                </span>
                <div>
                  <h3 className="font-sans font-semibold text-[color:var(--ink-primary)]">
                    {e.role}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[color:var(--ink-body)]">
                    {e.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      </div>

      {/* Existing sections keep their own headers + gutters */}
      <AiStack />
      <Credentials />

      <div className="mx-auto max-w-[var(--content-max)] px-[var(--gutter)] box-content">
        {/* 03 — How I work: numbered rules, ink rule on top, no cards */}
        <section className="grid grid-cols-1 gap-8 border-t border-[color:var(--hairline)] py-[var(--section-py)] md:grid-cols-12 md:gap-12">
          <div className="md:col-span-3">
            <div className="flex flex-col gap-4 md:sticky md:top-28">
              <SectionLabel index="03" label="How I work" />
              <h2 className="font-serif text-[clamp(32px,3.5vw,48px)] text-[color:var(--ink-primary)]">
                <MaskReveal delay={0.1}>Four rules that keep solo work honest.</MaskReveal>
              </h2>
            </div>
          </div>
          <Stagger
            as="ol"
            className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:col-span-9"
          >
            {values.map((v, i) => (
              <StaggerItem
                key={v.title}
                as="li"
                className="border-t border-[color:var(--ink-primary)] pt-5"
              >
                <span
                  aria-hidden
                  className="font-serif text-[40px] leading-none text-[color:var(--ink-primary)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-sans text-lg font-semibold text-[color:var(--ink-primary)]">
                  {v.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--ink-body)]">
                  {v.body}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* Closer: elevated card, two doors */}
        <section className="pb-[var(--section-py)]">
          <Reveal>
            <div className="flex flex-col gap-8 rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-[clamp(32px,5vw,64px)] shadow-[var(--shadow-card)] md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-4">
                <h2 className="max-w-[18ch] font-serif text-[clamp(32px,4vw,56px)] text-[color:var(--ink-primary)]">
                  Fractional engagement, or a full-time seat.
                </h2>
                <p className="max-w-[46ch] text-[color:var(--ink-body)]">
                  Both doors are open. Say what you&rsquo;re after and I&rsquo;ll
                  reply within two business days.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <CTALink href="/contact?intent=fractional" size="md">
                  Book a fractional call
                  <span aria-hidden>→</span>
                </CTALink>
                <CTALink href="/contact?intent=full-time" variant="outline" size="md">
                  Discuss full-time
                  <span aria-hidden>→</span>
                </CTALink>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </main>
  );
}
