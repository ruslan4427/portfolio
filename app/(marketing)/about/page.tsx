import type { Metadata } from "next";
import { AiStack } from "@/components/sections/AiStack";
import { Credentials } from "@/components/sections/Credentials";
import { CTALink } from "@/components/ui/CTAButton";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { bio, values } from "@/content/about";
import { experience } from "@/content/experience";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ruslan Hrekov — solo builder shipping AI-collaborative software from Kyiv → Ohio. Bio, timeline, AI stack, and the four rules that keep solo work honest.",
  openGraph: {
    title: "About — Ruslan Hrekov",
    description:
      "Solo builder shipping AI-collaborative software. Bio, timeline, AI stack, and the four rules that keep solo work honest.",
    url: "https://hrekov.dev/about",
  },
};

function RailLabel({ number, label }: { number: string; label: string }) {
  return (
    <aside className="md:sticky md:top-28">
      <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
        <span className="tabular-nums">{number}</span>
        <span className="mx-2">—</span>
        <span>{label}</span>
      </div>
    </aside>
  );
}

export default function AboutPage() {
  return (
    <main id="main" className="relative min-h-screen">
      <section className="px-[var(--gutter)] pt-40 pb-16">
        <div className="mx-auto flex max-w-[var(--content-max)] flex-col items-center">
          <Reveal>
            <SectionBadge label="About" />
          </Reveal>
          <h1 className="mt-8 max-w-[16ch] text-center font-serif text-[clamp(48px,7vw,88px)] leading-[0.98] text-[color:var(--ink-primary)]">
            <MaskReveal mode="mount" delay={0.15}>
              A studio of one, running with the model.
            </MaskReveal>
          </h1>
          <Reveal delay={0.3} className="mt-8">
            <CTALink href="/resume.pdf" download="Ruslan-Hrekov-Resume.pdf" variant="outline" size="md">
              Download résumé
              <span aria-hidden>↓</span>
            </CTALink>
          </Reveal>
        </div>
      </section>

      <section id="bio" className="px-[var(--gutter)] pb-8">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-[140px_1fr] md:gap-10">
          <RailLabel number="01" label="Bio" />
          <Stagger className="flex flex-col gap-6 text-[17px] leading-[1.7] text-[color:var(--ink-body)]">
            {bio.map((para, i) => (
              <StaggerItem key={i}>
                <p>{para}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section
        id="experience"
        className="px-[var(--gutter)] py-[var(--section-py)]"
      >
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-[140px_1fr] md:gap-10">
          <RailLabel number="02" label="The path" />
          <Stagger as="ol" className="flex flex-col">
            {experience.map((e, i) => (
              <StaggerItem
                as="li"
                key={e.years}
                className={`grid grid-cols-1 gap-2 py-6 md:grid-cols-[120px_1fr] md:gap-8 ${
                  i > 0
                    ? "border-t border-[color:var(--hairline)]"
                    : ""
                }`}
              >
                <div className="font-sans text-xs uppercase tracking-wider text-[color:var(--ink-muted)] tabular-nums md:pt-[3px]">
                  {e.years}
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
      </section>

      <AiStack />

      <Credentials />

      <section
        id="how-i-work"
        className="px-[var(--gutter)] py-[var(--section-py)]"
      >
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-[140px_1fr] md:gap-10">
          <RailLabel number="03" label="How I work" />
          <Stagger as="ol" className="flex flex-col">
            {values.map((v, i) => (
              <StaggerItem
                as="li"
                key={v.title}
                className={`grid grid-cols-1 gap-2 py-6 md:grid-cols-[48px_1fr] md:gap-6 ${
                  i > 0
                    ? "border-t border-[color:var(--hairline)]"
                    : ""
                }`}
              >
                <div className="font-serif text-[22px] leading-none tabular-nums text-[color:var(--ink-muted)]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-sans text-lg font-semibold text-[color:var(--ink-primary)]">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--ink-body)]">
                    {v.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="px-[var(--gutter)] pb-[var(--section-py)]">
        <div className="mx-auto flex max-w-[var(--content-max)] flex-col items-center gap-6 text-center">
          <h2 className="max-w-[22ch] font-serif text-[clamp(32px,4vw,56px)] leading-[1.02] text-[color:var(--ink-primary)]">
            <MaskReveal delay={0.15}>
              Fractional engagement, or a full-time seat.
            </MaskReveal>
          </h2>
          <Reveal delay={0.2}>
            <p className="max-w-xl text-[color:var(--ink-body)]">
              Both doors are open. Say what you&rsquo;re after and I&rsquo;ll
              reply within two business days.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
            <CTALink href="/contact?intent=fractional" size="md">
              Book a fractional call
              <span aria-hidden>→</span>
            </CTALink>
            <CTALink href="/contact?intent=full-time" variant="outline" size="md">
              Discuss full-time
              <span aria-hidden>→</span>
            </CTALink>
            <CTALink href="/resume.pdf" download="Ruslan-Hrekov-Resume.pdf" variant="outline" size="md">
              Download résumé
              <span aria-hidden>↓</span>
            </CTALink>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
