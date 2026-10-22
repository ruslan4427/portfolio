import Link from "next/link";
import type { ReactNode } from "react";
import { MaskReveal } from "./MaskReveal";
import { Reveal } from "./Reveal";

/**
 * Left-aligned section header shared by the home sections: eyebrow
 * (with a count where one exists), h2, optional lede, optional link.
 */
export function SectionHeader({
  id,
  eyebrow,
  title,
  lede,
  link,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede?: ReactNode;
  link?: { href: string; label: string };
}) {
  return (
    <header className="mb-12 flex flex-wrap items-end justify-between gap-x-12 gap-y-6 border-t border-[color:var(--hairline)] pt-8">
      <div className="flex min-w-0 max-w-[720px] flex-col gap-4">
        <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)] tabular-nums">{eyebrow}</p>
        <h2 id={id} className="font-serif text-[length:var(--type-display-m)] leading-[1.02] text-[color:var(--ink-primary)]">
          <MaskReveal delay={0.1}>{title}</MaskReveal>
        </h2>
        {lede && (
          <Reveal delay={0.15}>
            <p className="text-[length:var(--type-body-l)] leading-[1.55] text-[color:var(--ink-body)]">{lede}</p>
          </Reveal>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="inline-flex min-h-11 items-center gap-2 font-sans text-sm text-[color:var(--ink-primary)] underline decoration-[color:var(--outline)] underline-offset-4 hover:decoration-[color:var(--accent)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
        >
          {link.label} <span aria-hidden>→</span>
        </Link>
      )}
    </header>
  );
}
