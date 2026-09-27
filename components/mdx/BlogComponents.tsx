import type { ReactNode } from "react";
import type { ArtifactType } from "@/content/blog";

const artifactIcon: Record<ArtifactType, string> = {
  commit: "⌥",
  pr: "◇",
  screenshot: "▢",
  prompt: "❝",
  cost: "$",
  timeline: "⧗",
  link: "→",
};

const artifactPrefix: Record<ArtifactType, string> = {
  commit: "commit",
  pr: "PR",
  screenshot: "screenshot",
  prompt: "prompt",
  cost: "cost",
  timeline: "timeline",
  link: "link",
};

export function Artifact({
  type,
  label,
  href,
}: {
  type: ArtifactType;
  label: string;
  href?: string;
}) {
  const inner = (
    <span className="inline-flex items-baseline gap-2 rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-3 py-1 font-sans text-[13px]">
      <span aria-hidden className="font-serif text-[color:var(--ink-muted)]">
        {artifactIcon[type]}
      </span>
      <span className="text-[color:var(--ink-muted)]">{artifactPrefix[type]}</span>
      <span className="text-[color:var(--ink-primary)]">{label}</span>
    </span>
  );
  if (!href) return inner;
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="no-underline transition-transform hover:-translate-y-px focus-visible:-translate-y-px focus-visible:outline-none"
    >
      {inner}
    </a>
  );
}

export function Cost({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-3 rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-4 py-2 font-sans text-sm">
      <span className="text-[color:var(--ink-muted)]">{label}</span>
      <span className="font-serif text-lg text-[color:var(--ink-primary)] tabular-nums">
        {value}
      </span>
    </span>
  );
}

export function PromptLog({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="my-6 rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]">
      <summary className="cursor-pointer list-none px-5 py-3 font-sans text-sm text-[color:var(--ink-primary)] transition-colors hover:text-black">
        <span aria-hidden className="mr-2 text-[color:var(--ink-muted)]">
          ❝
        </span>
        {title}
        <span className="ml-2 text-[11px] uppercase tracking-wide text-[color:var(--ink-muted)]">
          prompt
        </span>
      </summary>
      <div className="border-t border-[color:var(--hairline)] px-5 py-4 font-sans text-[13px] leading-[1.65] text-[color:var(--ink-body)] whitespace-pre-wrap">
        {children}
      </div>
    </details>
  );
}

export function Diff({
  before,
  after,
  language,
}: {
  before: string;
  after: string;
  language?: string;
}) {
  return (
    <div className="my-6 grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]">
        <div className="border-b border-[color:var(--hairline)] px-4 py-2 font-sans text-[11px] uppercase tracking-wide text-[color:var(--ink-muted)]">
          before {language ? `· ${language}` : ""}
        </div>
        <pre className="overflow-x-auto px-4 py-3 font-sans text-[13px] leading-[1.55] text-[color:var(--ink-primary)]">
          {before}
        </pre>
      </div>
      <div className="rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]">
        <div className="border-b border-[color:var(--hairline)] px-4 py-2 font-sans text-[11px] uppercase tracking-wide text-[color:var(--ink-muted)]">
          after {language ? `· ${language}` : ""}
        </div>
        <pre className="overflow-x-auto px-4 py-3 font-sans text-[13px] leading-[1.55] text-[color:var(--ink-primary)]">
          {after}
        </pre>
      </div>
    </div>
  );
}

export function TechnicalDetail({
  summary,
  children,
}: {
  summary: string;
  children: ReactNode;
}) {
  return (
    <details
      data-mode="technical"
      className="my-6 rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]"
    >
      <summary className="cursor-pointer list-none px-5 py-3 font-sans text-sm text-[color:var(--ink-primary)]">
        <span aria-hidden className="mr-2 text-[color:var(--ink-muted)]">
          ⧉
        </span>
        {summary}
        <span className="ml-2 text-[11px] uppercase tracking-wide text-[color:var(--ink-muted)]">
          technical
        </span>
      </summary>
      <div className="border-t border-[color:var(--hairline)] px-5 py-4 text-[15px] leading-[1.7] text-[color:var(--ink-body)]">
        {children}
      </div>
    </details>
  );
}

export const blogComponents = {
  Artifact,
  Cost,
  PromptLog,
  Diff,
  TechnicalDetail,
};
