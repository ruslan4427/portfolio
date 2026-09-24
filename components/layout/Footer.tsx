import { SectionBadge } from "@/components/ui/SectionBadge";
import { CTAButton } from "@/components/ui/CTAButton";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      id="contact"
      className="relative px-[var(--gutter)] py-[var(--section-py)]"
    >
      <div className="mx-auto flex max-w-[var(--content-max)] flex-col items-center gap-6 text-center">
        <SectionBadge label="Contact" />
        <h2 className="font-serif text-[clamp(72px,12vw,168px)] text-[color:var(--ink-primary)]">
          Let&rsquo;s talk.
        </h2>
        <p className="max-w-lg text-lg leading-relaxed text-[color:var(--ink-body)]">
          The shortest path from your spec to a shipped, honest artifact. Send
          a one-paragraph problem — I&rsquo;ll reply with a two-paragraph plan.
        </p>
        <div className="mt-4">
          <CTAButton
            href="mailto:rusgrekovua@gmail.com"
            label="Reach out via email"
          />
        </div>
      </div>

      <div className="mx-auto mt-24 flex max-w-[var(--content-max)] flex-col items-start justify-between gap-2 border-t border-[color:var(--hairline)] pt-8 font-sans text-xs text-[color:var(--ink-muted)] md:flex-row md:items-center">
        <span>© {year} Ruslan Grekov · Kyiv → Ohio</span>
        <span>Built with Claude Opus · ShipLoop discipline</span>
      </div>
    </footer>
  );
}
