"use client";

import { useConsent } from "./ConsentContext";

export function ConsentResetLink() {
  const { mounted, consent, reset } = useConsent();
  if (!mounted || consent === "unset") return null;

  return (
    <button
      type="button"
      onClick={reset}
      className="font-sans text-xs text-[color:var(--ink-muted)] underline underline-offset-4 transition-colors hover:text-[color:var(--ink-primary)] focus-visible:text-[color:var(--ink-primary)] focus-visible:outline-none"
    >
      Reset analytics preference
    </button>
  );
}
