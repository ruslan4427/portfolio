import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/sections/ContactForm";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { StatusPill } from "@/components/ui/StatusPill";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch about a fractional engagement, a full-time role, or just to say hi.",
};

const CHANNELS = [
  { label: "Email", handle: "rusgrekovua@gmail.com", href: "mailto:rusgrekovua@gmail.com" },
  { label: "LinkedIn", handle: "Ruslan Hrekov", href: "https://www.linkedin.com/in/ruslan-hrekov-b21996315/" },
  { label: "GitHub", handle: "ruslan4427", href: "https://github.com/ruslan4427" },
  { label: "X", handle: "@ruslan4427", href: "https://x.com/ruslan4427" },
  { label: "Dev.to", handle: "hrekov", href: "https://dev.to/hrekov" },
] as const;

const NEXT_STEPS = [
  { title: "You write", body: "What you're building, and where you're stuck or headed." },
  { title: "I reply within two business days", body: "Every message is read by me, not a funnel." },
  { title: "A straight answer", body: "A plan for the next step — or a quick, honest “I'm not the right fit.”" },
] as const;

export default function ContactPage() {
  return (
    <main id="main" className="relative min-h-screen px-[var(--gutter)]">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-12 pt-36 pb-[var(--section-py)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-10 lg:sticky lg:top-28 lg:self-start">
          <header className="flex flex-col items-start gap-5">
            <StatusPill status="available" label="Available for new projects" />
            <h1 className="font-serif text-[length:var(--type-display-l)] leading-[0.98] text-[color:var(--ink-primary)]">
              <MaskReveal mode="mount" delay={0.1}>
                Let&rsquo;s talk.
              </MaskReveal>
            </h1>
            <Reveal delay={0.2}>
              <p className="max-w-[44ch] text-[length:var(--type-body-l)] leading-[1.55] text-[color:var(--ink-body)]">
                Tell me what you&rsquo;re building. Based in Ohio, working EST/CST hours by default.
              </p>
            </Reveal>
          </header>

          <section aria-labelledby="next-heading" className="flex flex-col gap-4">
            <h2 id="next-heading" className="font-sans text-sm font-semibold text-[color:var(--ink-primary)]">
              What happens next
            </h2>
            <ol className="flex flex-col">
              {NEXT_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4 border-t border-[color:var(--hairline)] py-3.5">
                  <span className="font-sans text-[length:var(--type-caption)] text-[color:var(--accent)] tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-sans text-[length:var(--type-small)] font-semibold text-[color:var(--ink-primary)]">
                      {step.title}
                    </span>
                    <span className="text-[length:var(--type-small)] leading-[1.55] text-[color:var(--ink-body)]">{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="direct-heading" className="flex flex-col gap-4">
            <h2 id="direct-heading" className="font-sans text-sm font-semibold text-[color:var(--ink-primary)]">
              Or reach me directly
            </h2>
            <ul className="flex flex-col">
              {CHANNELS.map((c) => {
                const external = !c.href.startsWith("mailto:");
                return (
                  <li key={c.label} className="border-t border-[color:var(--hairline)] last:border-b">
                    <a
                      href={c.href}
                      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="group flex min-h-11 items-center justify-between gap-4 rounded-[var(--radius-inline)] py-2.5 font-sans text-[length:var(--type-small)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
                    >
                      <span className="text-[color:var(--ink-muted)]">{c.label}</span>
                      <span className="flex min-w-0 items-center gap-2 text-[color:var(--ink-primary)]">
                        <span className="truncate underline decoration-[color:var(--outline)] underline-offset-4 group-hover:decoration-[color:var(--accent)]">
                          {c.handle}
                        </span>
                        <span aria-hidden className="text-[color:var(--ink-muted)]">
                          {external ? "↗" : "→"}
                        </span>
                        {external && <span className="sr-only">(opens in new tab)</span>}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <Reveal delay={0.25} className="min-w-0">
          <Suspense fallback={<FormFallback />}>
            <ContactForm />
          </Suspense>
        </Reveal>
      </div>
    </main>
  );
}

function FormFallback() {
  return (
    <div
      aria-hidden
      className="h-[560px] rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] shadow-[var(--shadow-card)]"
    />
  );
}
