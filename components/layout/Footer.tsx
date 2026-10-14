import { ConsentResetLink } from "@/components/analytics/ConsentResetLink";
import { CTALink } from "@/components/ui/CTAButton";

const socials = [
  { label: "GitHub", href: "https://github.com/ruslan4427", short: "GH" },
  { label: "X", href: "https://x.com/ruslan4427", short: "X" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ruslan-hrekov-b21996315/",
    short: "IN",
  },
  {
    label: "Dev.to",
    href: "https://dev.to/ruslan_hrekov_d296523b326",
    short: "DEV",
  },
  { label: "Email", href: "mailto:rusgrekovua@gmail.com", short: "@" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative px-[var(--gutter)] pb-16 pt-[var(--section-py)]">
      <div className="mx-auto max-w-[var(--content-max)]">
        <div className="relative overflow-hidden rounded-[calc(var(--radius-card)+8px)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-6 py-16 shadow-[var(--shadow-card)] md:py-24">
          <div className="relative flex flex-col items-center gap-6 text-center">
            <h2 className="font-serif text-[clamp(40px,6vw,88px)] text-[color:var(--ink-primary)]">
              Ready to ship
              <br />
              without rewrites?
            </h2>
            <CTALink href="/contact">Let&rsquo;s spec your next project</CTALink>
            <p className="font-sans text-sm text-[color:var(--ink-muted)]">
              Based in Ohio. EST/CST sync hours, by default.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 items-center gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-2 font-sans text-sm text-[color:var(--ink-muted)] md:text-left">
            <span>© Ruslan Hrekov {year}. All rights reserved.</span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <a
                href="/privacy"
                className="underline decoration-[color:var(--hairline)] underline-offset-4 transition-colors hover:text-[color:var(--ink-primary)]"
              >
                Privacy
              </a>
              <ConsentResetLink />
            </div>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
