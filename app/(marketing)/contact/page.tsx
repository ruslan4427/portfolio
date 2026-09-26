import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/sections/ContactForm";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { SocialPill } from "@/components/ui/SocialPill";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch about a fractional engagement, a full-time role, or just to say hi.",
};

const SOCIALS = [
  { label: "Email", href: "mailto:rusgrekovua@gmail.com", short: "@" },
  { label: "GitHub", href: "https://github.com/ruslan4427", short: "GH" },
  { label: "X", href: "https://x.com/ruslan4427", short: "X" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", short: "IN" },
] as const;

export default function ContactPage() {
  return (
    <main id="main" className="relative min-h-screen">
      <section className="px-[var(--gutter)] pt-40 pb-24">
        <div className="mx-auto flex max-w-[var(--content-max)] flex-col items-center">
          <Reveal>
            <SectionBadge label="Contact" />
          </Reveal>
          <h1 className="mt-8 text-center font-serif text-[clamp(48px,8vw,96px)] leading-[0.98] text-[color:var(--ink-primary)]">
            <MaskReveal mode="mount" delay={0.15}>
              Let&rsquo;s talk.
            </MaskReveal>
          </h1>
          <Reveal delay={0.25}>
            <p className="mt-6 max-w-xl text-center text-[color:var(--ink-body)]">
              Tell me what you&rsquo;re building. I reply within two business days,
              and I&rsquo;ll tell you fast if I&rsquo;m the wrong fit.
            </p>
          </Reveal>

          <Reveal delay={0.35} className="mt-12 w-full max-w-lg">
            <Suspense fallback={<FormFallback />}>
              <ContactForm />
            </Suspense>
          </Reveal>

          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <Reveal>
              <p className="font-sans text-xs uppercase tracking-wider text-[color:var(--ink-muted)]">
                Prefer email?
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <a
                href="mailto:rusgrekovua@gmail.com"
                className="font-sans text-sm text-[color:var(--ink-primary)] underline underline-offset-4"
              >
                rusgrekovua@gmail.com
              </a>
            </Reveal>
            <Stagger
              as="ul"
              className="mt-2 flex flex-wrap items-center justify-center gap-2"
              delayChildren={0.2}
              stagger={0.08}
            >
              {SOCIALS.filter((s) => !s.href.startsWith("mailto:")).map((s) => (
                <StaggerItem key={s.label} as="li" y={16} duration={0.65}>
                  <SocialPill href={s.href} label={s.label} short={s.short} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>
    </main>
  );
}

function FormFallback() {
  return (
    <div
      aria-hidden
      className="h-[520px] rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] shadow-[var(--shadow-card)]"
    />
  );
}
