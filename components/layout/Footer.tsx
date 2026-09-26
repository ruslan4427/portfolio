import { CTALink } from "@/components/ui/CTAButton";

const socials = [
  { label: "GitHub", href: "https://github.com/ruslan4427", short: "GH" },
  { label: "X", href: "https://x.com/ruslan4427", short: "X" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", short: "IN" },
  { label: "Email", href: "mailto:rusgrekovua@gmail.com", short: "@" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative px-[var(--gutter)] pb-16 pt-[var(--section-py)]">
      <div className="mx-auto max-w-[var(--content-max)]">
        <div className="relative overflow-hidden rounded-[calc(var(--radius-card)+8px)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-6 py-16 shadow-[var(--shadow-card)] md:py-24">
          <div className="relative flex flex-col items-center gap-8 text-center">
            <h2 className="font-serif text-[clamp(40px,6vw,88px)] text-[color:var(--ink-primary)]">
              Tell me what your idea is,
              <br />
              and let&rsquo;s do it.
            </h2>
            <CTALink href="/contact">Let&rsquo;s talk</CTALink>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 items-center gap-6 md:grid-cols-3">
          <div className="font-sans text-sm text-[color:var(--ink-muted)] md:text-left">
            © Ruslan Hrekov {year}. All rights reserved.
          </div>
          <div aria-hidden className="hidden md:block" />
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <ul className="flex flex-wrap items-center gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    {...(s.href.startsWith("mailto:")
                      ? {}
                      : { target: "_blank", rel: "noreferrer" })}
                    aria-label={s.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] font-sans text-xs font-medium text-[color:var(--ink-primary)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    {s.short}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#top"
              aria-label="Back to top"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] font-sans text-xs text-[color:var(--ink-primary)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span aria-hidden>↑</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
