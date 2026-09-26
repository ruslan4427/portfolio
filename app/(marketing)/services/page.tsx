import type { Metadata } from "next";
import { ServicesFull } from "@/components/sections/ServicesFull";
import { CTALink } from "@/components/ui/CTAButton";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBadge } from "@/components/ui/SectionBadge";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Fractional formats — Discovery Sprint, Fractional CTO, Build Partner, Rescue Audit, Advisory. Plus full-time roles: Staff, Principal, Founding Engineer.",
};

export default function ServicesPage() {
  return (
    <main id="main" className="relative min-h-screen">

      <section className="px-[var(--gutter)] pt-40 pb-12">
        <div className="mx-auto flex max-w-[var(--content-max)] flex-col items-center text-center">
          <Reveal>
            <SectionBadge label="Services" />
          </Reveal>
          <h1 className="mt-8 max-w-[16ch] font-serif text-[clamp(48px,7vw,88px)] leading-[0.98] text-[color:var(--ink-primary)]">
            <MaskReveal mode="mount" delay={0.15}>
              How I engage.
            </MaskReveal>
          </h1>
          <Reveal delay={0.25}>
            <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-[color:var(--ink-body)]">
              Fractional formats for teams that need senior AI-collaboration
              output without a full-time hire. Pick the format that matches
              the decision on the table — I&rsquo;ll tell you if it&rsquo;s
              the wrong one.
            </p>
          </Reveal>
        </div>
      </section>

      <ServicesFull />

      <section className="px-[var(--gutter)] py-[var(--section-py)]">
        <Reveal className="mx-auto max-w-[var(--content-max)]">
          <div className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-8 shadow-[var(--shadow-card)] md:p-12">
            <div className="flex flex-col items-start gap-6">
              <SectionBadge label="Full-time roles" />
              <h2 className="max-w-[22ch] font-serif text-[clamp(28px,3.5vw,44px)] leading-[1.05] text-[color:var(--ink-primary)]">
                Also open to the right full-time seat.
              </h2>
              <p className="max-w-2xl text-[color:var(--ink-body)]">
                Staff, Principal, or Founding Engineer. Small team, product with
                weight, AI collaboration as a first-class part of the stack.
                Kyiv → Ohio, remote-first, US East hours workable.
              </p>
              <CTALink
                href="/contact?intent=full-time"
                variant="outline"
                className="!bg-[color:var(--bg-page)]"
              >
                Discuss full-time
                <span aria-hidden>→</span>
              </CTALink>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="px-[var(--gutter)] pb-[var(--section-py)]">
        <div className="mx-auto flex max-w-[var(--content-max)] flex-col items-center gap-6 text-center">
          <h2 className="max-w-[22ch] font-serif text-[clamp(32px,4vw,56px)] leading-[1.02] text-[color:var(--ink-primary)]">
            <MaskReveal delay={0.15}>
              Pick the format, then let&rsquo;s talk.
            </MaskReveal>
          </h2>
          <Reveal delay={0.2}>
            <p className="max-w-xl text-[color:var(--ink-body)]">
              Send a short brief — what you&rsquo;re building, where it&rsquo;s
              stuck, what &ldquo;shipped&rdquo; would look like. I reply within
              two business days.
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
