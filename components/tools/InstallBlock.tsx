"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

export function InstallBlock({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      track("tools_install_copy", { source: "install_block" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API blocked (older Safari, insecure context). Fall back to
      // selecting the text so the user can copy manually.
      const node = document.getElementById("install-command-text");
      if (!node) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-4 border-b border-[color:var(--hairline)] px-5 py-3">
        <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
          Install
        </span>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "Copied install command" : "Copy install command"}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[color:var(--hairline)] bg-[color:var(--bg-page)] px-3 py-1 font-sans text-xs text-[color:var(--ink-primary)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-elevated)]"
        >
          {copied ? (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2.5 6.5 L5 9 L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden
              >
                <rect x="3.5" y="3.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1" />
                <path d="M2 8 V2.5 A0.5 0.5 0 0 1 2.5 2 H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-sm leading-relaxed text-[color:var(--ink-body)]">
        <code id="install-command-text">{command}</code>
      </pre>
    </div>
  );
}
