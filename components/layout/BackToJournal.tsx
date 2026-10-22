"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

export function BackToJournal() {
  // false on the server, true once hydrated — the portal needs document.body.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) return null;

  return createPortal(
    <nav aria-label="Back to journal">
    <Link
      href="/blog"
      className="fixed left-[var(--gutter)] top-[88px] z-50 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-3.5 py-1.5 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-primary)] shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)]/40"
    >
      <span aria-hidden>←</span>
      <span>All posts</span>
    </Link>
    </nav>,
    document.body,
  );
}
