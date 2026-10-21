"use client";

import { useEffect, useMemo, useState } from "react";
import { lensStartHere } from "@/content/case-lenses";
import type { CaseChapter } from "@/lib/rehype-case-sections";
import { useCaseReader } from "./CaseReader";

/**
 * Lists every `##` section of the case body (ids match
 * lib/rehype-case-sections), marks the one in view, and flags where the
 * current reading lens should start. Sticky on lg; a disclosure list on
 * small screens.
 */
export function ChapterRail({ chapters }: { chapters: CaseChapter[] }) {
  const { lens, depth } = useCaseReader();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Active = the last section whose top has passed 30% of the viewport;
  // none before the first one is reached. Recomputed on scroll and resize
  // because "2-min read" changes section heights.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current: string | null = null;
      for (const c of chapters) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= line) current = c.id;
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [chapters]);

  const startId = useMemo(
    () => chapters.find((c) => lensStartHere[lens].test(c.title))?.id ?? chapters[0]?.id,
    [chapters, lens],
  );

  if (chapters.length === 0) return null;

  const activeIndex = chapters.findIndex((c) => c.id === activeId);
  const progress = Math.round(((activeIndex + 1) / chapters.length) * 100);

  const list = (
    <ol className="flex flex-col gap-0.5">
      {chapters.map((c, i) => {
        const active = c.id === activeId;
        return (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              aria-current={active ? "location" : undefined}
              className={`flex min-h-11 items-baseline gap-3 rounded-[var(--radius-tile)] border px-3.5 py-2.5 font-sans text-[length:var(--type-small)] leading-snug transition-colors duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] ${
                active
                  ? "border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] font-semibold text-[color:var(--ink-primary)]"
                  : "border-transparent text-[color:var(--ink-body)] hover:text-[color:var(--ink-primary)]"
              }`}
            >
              <span className="min-w-[22px] text-[length:var(--type-caption)] font-normal text-[color:var(--ink-muted)] tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex flex-col gap-1">
                <span>{c.title}</span>
                {c.id === startId && (
                  <span className="w-fit rounded-[var(--radius-pill)] bg-[color:var(--bg-inverse)] px-2 py-0.5 text-[length:var(--type-caption)] font-normal text-[color:var(--ink-on-dark)]">
                    Start here
                  </span>
                )}
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );

  const label = `${chapters.length} chapters · ${depth === "short" ? "2-min read" : "full story"}`;

  return (
    <nav aria-label="Chapters">
      <details className="group rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-2 lg:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-3 font-sans text-sm text-[color:var(--ink-primary)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
          <span>{label}</span>
          <span aria-hidden className="transition-transform duration-[var(--dur-fast)] group-open:rotate-180">
            ↓
          </span>
        </summary>
        <div className="pt-2">{list}</div>
      </details>

      <div className="sticky top-28 hidden lg:block">
        <p className="mb-2.5 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
          {label}
        </p>
        <div className="mb-3.5 h-0.5 rounded-[var(--radius-pill)] bg-[color:var(--hairline)]">
          <div
            className="h-0.5 rounded-[var(--radius-pill)] bg-[color:var(--ink-primary)] transition-[width] duration-[var(--dur-fast)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-1">{list}</div>
      </div>
    </nav>
  );
}
