"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { LENSES, lensLabel, parseLens, type Lens } from "@/content/case-lenses";
import { track } from "@/lib/analytics";

export type Depth = "short" | "full";

type ReaderState = {
  slug: string;
  lens: Lens;
  depth: Depth;
  setLens: (lens: Lens) => void;
  setDepth: (depth: Depth) => void;
};

const ReaderContext = createContext<ReaderState | null>(null);

const LENS_KEY = "case-lens";
const DEPTH_KEY = "case-depth";
const CHANGE_EVENT = "case-reader-change";
const DEFAULT_LENS: Lens = "founder";
const DEFAULT_DEPTH: Depth = "short";

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private mode / blocked storage: the choice just doesn't persist.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

// `?for=` wins over the stored lens so an outreach link pre-selects the view.
function lensSnapshot(): Lens {
  const fromUrl = parseLens(new URLSearchParams(window.location.search).get("for"));
  return fromUrl ?? parseLens(readStorage(LENS_KEY)) ?? DEFAULT_LENS;
}

function depthSnapshot(): Depth {
  const stored = readStorage(DEPTH_KEY);
  return stored === "short" || stored === "full" ? stored : DEFAULT_DEPTH;
}

export function useCaseReader(): ReaderState {
  const ctx = useContext(ReaderContext);
  if (!ctx) throw new Error("useCaseReader must be used inside <CaseReader>");
  return ctx;
}

/**
 * Holds the reading lens (who is reading) and depth (2-min vs full) for a
 * case page, persisted in localStorage. Exposes both as data attributes so
 * CSS can collapse sections without re-rendering the MDX body.
 */
export function CaseReader({
  slug,
  children,
  className,
}: {
  slug: string;
  children: ReactNode;
  className?: string;
}) {
  const lens = useSyncExternalStore(subscribe, lensSnapshot, () => DEFAULT_LENS);
  const depth = useSyncExternalStore(subscribe, depthSnapshot, () => DEFAULT_DEPTH);

  const setLens = useCallback(
    (next: Lens) => {
      const url = new URL(window.location.href);
      if (url.searchParams.has("for")) {
        url.searchParams.delete("for");
        window.history.replaceState(window.history.state, "", url);
      }
      writeStorage(LENS_KEY, next);
      track("case_lens", { slug, lens: next });
    },
    [slug],
  );

  const setDepth = useCallback(
    (next: Depth) => {
      writeStorage(DEPTH_KEY, next);
      track("case_depth", { slug, depth: next });
    },
    [slug],
  );

  const value = useMemo(
    () => ({ slug, lens, depth, setLens, setDepth }),
    [slug, lens, depth, setLens, setDepth],
  );

  return (
    <ReaderContext.Provider value={value}>
      <div data-lens={lens} data-depth={depth} className={className}>
        {children}
      </div>
    </ReaderContext.Provider>
  );
}

const segmentBase =
  "inline-flex min-h-11 items-center rounded-[var(--radius-pill)] px-4 font-sans text-sm transition-colors duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]";

function segmentClass(active: boolean) {
  return `${segmentBase} ${
    active
      ? "bg-[color:var(--bg-inverse)] text-[color:var(--ink-on-dark)]"
      : "text-[color:var(--ink-body)] hover:text-[color:var(--ink-primary)]"
  }`;
}

export function LensControls() {
  const { lens, depth, setLens, setDepth } = useCaseReader();

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
        Reading as
      </span>
      <div
        role="group"
        aria-label="Reading lens"
        className="inline-flex flex-wrap gap-1 sm:flex-nowrap rounded-[var(--radius-pill)] border border-[color:var(--outline-strong)] bg-[color:var(--bg-elevated)] p-0.5"
      >
        {LENSES.map((l) => (
          <button
            key={l}
            type="button"
            aria-pressed={lens === l}
            onClick={() => setLens(l)}
            className={segmentClass(lens === l)}
          >
            {lensLabel[l]}
          </button>
        ))}
      </div>
      <div
        role="group"
        aria-label="Reading depth"
        className="inline-flex gap-1 rounded-[var(--radius-pill)] border border-[color:var(--outline-strong)] bg-[color:var(--bg-elevated)] p-0.5"
      >
        <button
          type="button"
          aria-pressed={depth === "short"}
          onClick={() => setDepth("short")}
          className={segmentClass(depth === "short")}
        >
          2-min read
        </button>
        <button
          type="button"
          aria-pressed={depth === "full"}
          onClick={() => setDepth("full")}
          className={segmentClass(depth === "full")}
        >
          Full story
        </button>
      </div>
    </div>
  );
}
