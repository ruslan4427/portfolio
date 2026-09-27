"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

type View = "executive" | "technical";

const STORAGE_KEY = "caseStudyView";

function readStored(): View {
  if (typeof window === "undefined") return "executive";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "technical" ? "technical" : "executive";
}

function applyToArticle(view: View) {
  const article = document.querySelector<HTMLElement>("article[data-view]");
  if (article) article.setAttribute("data-view", view);
}

export function ViewToggle() {
  const [view, setView] = useState<View>("executive");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = readStored();
    setView(stored);
    applyToArticle(stored);
    setMounted(true);
  }, []);

  const set = (next: View) => {
    if (next === view) return;
    setView(next);
    applyToArticle(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage errors (private mode, etc.)
    }
    const slug = document
      .querySelector<HTMLElement>("article[data-view]")
      ?.dataset.slug;
    track("case_study_view_toggle", { view: next, slug });
  };

  return (
    <div
      className="pointer-events-auto fixed right-[var(--gutter)] top-24 z-30 inline-flex items-center gap-0.5 rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-0.5 shadow-[var(--shadow-card)]"
      role="group"
      aria-label="Case study view"
    >
      <button
        type="button"
        onClick={() => set("executive")}
        aria-pressed={mounted ? view === "executive" : undefined}
        className={`rounded-full px-3 py-1.5 font-sans text-xs transition-colors ${
          mounted && view === "executive"
            ? "bg-[color:var(--ink-primary)] text-[color:var(--cta-ink)]"
            : "text-[color:var(--ink-muted)] hover:text-[color:var(--ink-primary)]"
        }`}
      >
        Executive
      </button>
      <button
        type="button"
        onClick={() => set("technical")}
        aria-pressed={mounted ? view === "technical" : undefined}
        className={`rounded-full px-3 py-1.5 font-sans text-xs transition-colors ${
          mounted && view === "technical"
            ? "bg-[color:var(--ink-primary)] text-[color:var(--cta-ink)]"
            : "text-[color:var(--ink-muted)] hover:text-[color:var(--ink-primary)]"
        }`}
      >
        Technical
      </button>
    </div>
  );
}
