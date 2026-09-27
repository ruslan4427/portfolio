import { SectionBadge } from "@/components/ui/SectionBadge";
import { Reveal } from "@/components/ui/Reveal";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { credentials } from "@/content/about";

export function Credentials() {
  const { featured, anthropic } = credentials;

  return (
    <section
      id="credentials"
      className="relative px-[var(--gutter)] py-[var(--section-py)]"
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-12 flex flex-col items-center gap-6 text-center">
          <Reveal>
            <SectionBadge label="Credentials" />
          </Reveal>
          <h2 className="font-serif text-[clamp(32px,3.5vw,48px)] text-[color:var(--ink-primary)]">
            <MaskReveal delay={0.15}>The certs that</MaskReveal>
            <br />
            <MaskReveal delay={0.32}>check the taste.</MaskReveal>
          </h2>
        </header>

        <Reveal>
          <a
            href={featured.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-8 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)]/40"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="font-sans text-xs uppercase tracking-wider text-[color:var(--ink-muted)]">
                  {featured.issuer}
                </div>
                <h3 className="mt-3 font-serif text-[clamp(24px,2.6vw,36px)] leading-[1.1] text-[color:var(--ink-primary)]">
                  {featured.title}
                </h3>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-[var(--radius-pill)] border border-[color:var(--hairline)] px-3 py-1 font-sans text-[11px] uppercase tracking-wider text-[color:var(--ink-muted)]">
                    {featured.kind}
                  </span>
                  <span className="font-sans text-[11px] uppercase tracking-wider text-[color:var(--ink-muted)] tabular-nums">
                    · {featured.date}
                  </span>
                </div>
              </div>
              <div className="font-sans text-sm text-[color:var(--ink-body)] transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5">
                Verify <span aria-hidden>→</span>
              </div>
            </div>
          </a>
        </Reveal>

        <div className="mt-10">
          <Reveal>
            <div className="mb-4 flex items-baseline justify-between">
              <div className="font-sans text-xs uppercase tracking-wider text-[color:var(--ink-muted)]">
                Anthropic
              </div>
              <div className="font-sans text-[11px] uppercase tracking-wider text-[color:var(--ink-muted)] tabular-nums">
                {anthropic.date}
              </div>
            </div>
          </Reveal>
          <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {anthropic.items.map((c) => (
              <StaggerItem key={c.verifyUrl}>
                <a
                  href={c.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-5 transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)]/40"
                >
                  <div className="font-sans text-[15px] text-[color:var(--ink-primary)]">
                    {c.title}
                  </div>
                  <div className="font-sans text-xs uppercase tracking-wider text-[color:var(--ink-muted)] transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5">
                    Verify <span aria-hidden>→</span>
                  </div>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
