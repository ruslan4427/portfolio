"use client";

import { useId, useState } from "react";
import { track } from "@/lib/analytics";

export function InstallBlock({ command, caption, source = "install_block" }: { command: string; caption?: string; source?: string }) {
  const [copied, setCopied] = useState(false);
  const id = useId();

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      track("tools_install_copy", { source });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API blocked (older Safari, insecure context). Fall back to
      // selecting the text so the user can copy manually.
      const node = document.getElementById(id);
      if (!node) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]">
        <div className="flex items-center justify-between gap-4 border-b border-[color:var(--hairline)] py-1.5 pl-4 pr-1.5">
          <span className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">Install</span>
          <button
            type="button"
            onClick={onCopy}
            aria-label={copied ? "Copied install command" : "Copy install command"}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-pill)] px-3 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-primary)] transition-colors duration-[var(--dur-fast)] hover:bg-[color:var(--bg-page)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              {copied ? (
                <path d="M2.5 6.5 L5 9 L9.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <>
                  <rect x="3.5" y="3.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1" />
                  <path d="M2 8 V2.5 A0.5 0.5 0 0 1 2.5 2 H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                </>
              )}
            </svg>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre
          tabIndex={0}
          className="whitespace-pre-wrap break-all px-4 py-3 font-sans text-[length:var(--type-caption)] leading-relaxed text-[color:var(--ink-primary)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
        >
          <code id={id} className="font-sans">{command}</code>
        </pre>
      </div>
      {caption && (
        <p className="font-sans text-[length:var(--type-caption)] leading-relaxed text-[color:var(--ink-muted)]">{caption}</p>
      )}
    </div>
  );
}
