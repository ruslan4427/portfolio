"use client";

import { lensIntro, type CaseLensData } from "@/content/case-lenses";
import { useCaseReader } from "./CaseReader";

export function LensHeadline({ data }: { data: CaseLensData }) {
  const { lens } = useCaseReader();
  return (
    <p
      aria-live="polite"
      className="max-w-[28ch] font-serif text-[length:var(--type-display-s)] font-normal leading-[1.25] text-[color:var(--ink-primary)]"
    >
      {data.lenses[lens].headline}
    </p>
  );
}

export function LensStats({ data }: { data: CaseLensData }) {
  const { lens } = useCaseReader();
  return (
    <div className="flex flex-col gap-3.5">
      <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
        {lensIntro[lens]}
      </p>
      <dl className="grid grid-cols-2 gap-x-5 gap-y-4">
        {data.lenses[lens].stats.map((s) => (
          <div key={s.label} className="border-t-2 border-[color:var(--accent)] pt-2.5">
            <dt className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
              {s.label}
            </dt>
            <dd className="mt-1 font-serif text-[length:var(--type-display-s)] leading-[1.05] text-[color:var(--ink-primary)] tabular-nums">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
