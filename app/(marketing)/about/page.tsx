import type { Metadata } from "next";
import { AiStack } from "@/components/sections/AiStack";
import { Experience } from "@/components/sections/Experience";
import { Values } from "@/components/sections/Values";
import { CTALink } from "@/components/ui/CTAButton";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { bio } from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ruslan Hrekov — solo builder shipping AI-collaborative software from Kyiv → Ohio. Bio, timeline, AI stack, and the four rules that keep solo work honest.",
};

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
        </div>
      </section>

      <section className="px-[var(--gutter)] pb-8">
        <Stagger className="mx-auto flex max-w-2xl flex-col gap-6 text-[17px] leading-[1.7] text-[color:var(--ink-body)]">
          {bio.map((para, i) => (
            <StaggerItem key={i}>
              <p>{para}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Experience showBadge title={<>The path so far.</>} />

      <AiStack />

      <Values />

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
          </Reveal>
        </div>
      </section>
    </main>
  );
}
