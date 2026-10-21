"use client";

import { useState, type ComponentPropsWithoutRef } from "react";

/**
 * Wrapper for each `##` section of a case MDX body (see
 * lib/rehype-case-sections). In "2-min read" CSS shows only the heading and
 * the first block; the button below opens the rest of this one section.
 */
export function CaseSection({ children, ...props }: ComponentPropsWithoutRef<"section">) {
  const [open, setOpen] = useState(false);

  return (
    <section {...props} data-open={open ? "true" : "false"}>
      {children}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="case-section-more mt-2 min-h-11 items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--outline-strong)] bg-[color:var(--bg-elevated)] px-5 font-sans text-sm text-[color:var(--ink-primary)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
      >
        Read the full section
        <span aria-hidden>↓</span>
      </button>
    </section>
  );
}
