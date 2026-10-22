import { ConsentResetLink } from "@/components/analytics/ConsentResetLink";
import { FooterCta } from "./FooterCta";

const socials = [
  { label: "GitHub", href: "https://github.com/ruslan4427", short: "GH" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ruslan-hrekov-b21996315/",
    short: "IN",
  },
  {
    label: "Dev.to",
    href: "https://dev.to/hrekov",
    short: "DEV",
  },
  { label: "Email", href: "mailto:rusgrekovua@gmail.com", short: "@" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative px-[var(--gutter)] pb-16 pt-[var(--section-py)]">
      <div className="mx-auto max-w-[var(--content-max)]">
        <FooterCta />

        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
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
