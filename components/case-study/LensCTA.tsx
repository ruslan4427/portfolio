"use client";

import { defaultCta, type CaseLensData } from "@/content/case-lenses";
import { useCaseReader } from "./CaseReader";

export function LensCTA({ data, title }: { data: CaseLensData; title: string }) {
  const { lens } = useCaseReader();
  const cta = { ...defaultCta(lens, title), ...data.lenses[lens].cta };

  return (
    <section
      aria-labelledby="case-cta-heading"
      className="flex flex-wrap items-end justify-between gap-7 rounded-[var(--radius-panel)] bg-[color:var(--bg-inverse)] p-[clamp(32px,5vw,56px)] text-[color:var(--ink-on-dark)]"
    >
      <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3.5">
        <span className="inline-flex items-center gap-2 self-start rounded-[var(--radius-pill)] border border-[color:var(--hairline-on-dark)] px-3.5 py-1.5 font-sans text-sm">
          <span aria-hidden className="h-2 w-2 rounded-full bg-[color:var(--status-live)]" />
          Available for new projects
        </span>
        <h2
          id="case-cta-heading"
          className="max-w-[20ch] font-serif text-[length:var(--type-display-m)] leading-[1.05]"
        >
          {cta.title}
        </h2>
        <p className="max-w-[48ch] text-[color:var(--ink-on-dark-muted)]">{cta.body}</p>
      </div>
      <a
        href={cta.href}
        className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-pill)] bg-[color:var(--ink-on-dark)] px-6 py-3 font-sans text-sm text-[color:var(--bg-inverse)] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--bg-inverse),0_0_0_4px_var(--ink-on-dark)]"
      >
        {cta.label}
        <span aria-hidden>→</span>
      </a>
    </section>
  );
}
