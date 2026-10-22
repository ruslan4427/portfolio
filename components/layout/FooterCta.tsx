"use client";

import { usePathname } from "next/navigation";
import { CTALink } from "@/components/ui/CTAButton";

/** Closing CTA card. Hidden on /contact, where the form already is the call to action. */
export function FooterCta() {
  const pathname = usePathname();
  if (pathname?.startsWith("/contact")) return null;

  return (
    <div className="relative mb-12 overflow-hidden rounded-[calc(var(--radius-card)+8px)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-6 py-16 shadow-[var(--shadow-card)] md:py-24">
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
  );
}
