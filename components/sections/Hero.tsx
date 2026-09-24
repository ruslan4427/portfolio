import { StatusPill } from "@/components/ui/StatusPill";

const socials = [
  { label: "GitHub", href: "https://github.com/ruslan4427", short: "GH" },
  { label: "X", href: "https://x.com/ruslan4427", short: "X" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", short: "IN" },
  { label: "Email", href: "mailto:rusgrekovua@gmail.com", short: "@" },
] as const;

export function Hero() {
  return (
    <section
      id="top"
      className="relative px-[var(--gutter)] pb-[var(--section-py)] pt-32 md:pt-40"
    >
      <div className="absolute right-[var(--gutter)] top-24 md:top-28">
        <StatusPill status="available" label="Available for Q4 2026" />
      </div>

      <div className="mx-auto grid max-w-[var(--content-max)] gap-12 md:grid-cols-[1.15fr_1fr] md:gap-16">
        <div>
          <div
            aria-hidden
            className="mb-8 flex h-16 w-16 items-center justify-center rounded-[12px] bg-[color:var(--ink-primary)] font-sans text-lg font-semibold text-[color:var(--bg-page)] shadow-[var(--shadow-card)]"
          >
            RG
          </div>
          <h1 className="font-serif text-[clamp(56px,7.5vw,96px)] text-[color:var(--ink-primary)]">
            Software, shipped
            <br />
            honestly.
          </h1>
        </div>

        <div className="flex flex-col gap-8 md:pt-24">
          <ul className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  {...(s.href.startsWith("mailto:")
                    ? {}
                    : { target: "_blank", rel: "noreferrer" })}
                  aria-label={s.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] font-sans text-xs font-medium text-[color:var(--ink-primary)] shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {s.short}
                </a>
              </li>
            ))}
          </ul>
          <p className="max-w-md text-lg leading-relaxed text-[color:var(--ink-body)]">
            I&rsquo;m Ruslan. I build production software with Claude — five
            case studies, honest numbers, commit hashes you can check.
          </p>
          <a
            href="#work"
            className="inline-flex items-center gap-2 font-sans text-sm text-[color:var(--ink-primary)]"
          >
            Discover
            <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
