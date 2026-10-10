"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

export function BackToJournal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <Link
      href="/blog"
      className="fixed left-[var(--gutter)] top-[88px] z-50 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-3.5 py-1.5 font-sans text-xs text-[color:var(--ink-primary)] shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)]/40"
    >
      <span aria-hidden>←</span>
      <span>All posts</span>
    </Link>,
    document.body,
  );
}
