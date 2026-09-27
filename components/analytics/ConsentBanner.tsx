"use client";

import { useConsent } from "./ConsentContext";

export function ConsentBanner() {
  const { mounted, isEu, consent, accept, reject } = useConsent();

  if (!mounted) return null;
  if (!isEu) return null;
  if (consent !== "unset") return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-[560px] rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-5 shadow-[var(--shadow-card)] md:inset-x-auto md:right-6 md:bottom-6"
    >
      <p className="font-sans text-sm leading-relaxed text-[color:var(--ink-body)]">
        This site uses privacy-preserving analytics (Google Analytics with IP
        anonymisation) to understand which posts land. Nothing is shared with
        third parties. You can change your mind anytime via the footer.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={reject}
          className="rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-page)] px-4 py-2 font-sans text-xs text-[color:var(--ink-primary)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={accept}
          className="rounded-full bg-[color:var(--cta)] px-4 py-2 font-sans text-xs text-[color:var(--cta-ink)] shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
