import Image from "next/image";
import type { ReactNode } from "react";
import type { ArtifactType } from "@/content/blog";
import { PhoneRow } from "./CaseStudySchemas";

export function Figure({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}) {
  return (
    <figure className="not-prose my-10">
      <div className="overflow-hidden rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 768px) 70ch, 92vw"
          className="block h-auto w-full"
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-sans text-xs leading-relaxed text-[color:var(--ink-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

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
      className="no-underline transition-transform hover:-translate-y-px focus-visible:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)]/40 focus-visible:rounded-sm"
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

type MetricGridItem = {
  value: string;
  label: string;
  hint?: string;
};

const metricGridCols: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

export function MetricGrid({
  items,
  columns = 3,
}: {
  items: MetricGridItem[];
  columns?: 2 | 3 | 4;
}) {
  return (
    <div
      className={`not-prose my-10 grid ${metricGridCols[columns]} divide-y divide-[color:var(--hairline)] border-y border-[color:var(--hairline)] py-6 text-center sm:divide-x sm:divide-y-0`}
    >
      {items.map((item, i) => (
        <div key={i} className="px-4 py-4 sm:py-0">
          <div className="font-serif text-[clamp(28px,3.5vw,44px)] leading-none text-[color:var(--ink-primary)] tabular-nums">
            {item.value}
          </div>
          <div className="mt-2 font-sans text-[11px] uppercase tracking-wider text-[color:var(--ink-muted)]">
            {item.label}
          </div>
          {item.hint && (
            <div className="mt-1 font-sans text-[12px] leading-snug text-[color:var(--ink-muted)]">
              {item.hint}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function BeforeAfter({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-3 md:grid-cols-2">
      {children}
    </div>
  );
}

type BeforeAfterPanelProps = {
  label: "Before" | "After";
  date?: string;
  commit?: string;
  commitHref?: string;
  children: ReactNode;
};

function BeforeAfterPanel({
  label,
  date,
  commit,
  commitHref,
  children,
}: BeforeAfterPanelProps) {
  const chipInner = (
    <>
      <span aria-hidden className="font-serif text-[color:var(--ink-muted)]">
        ⌥
      </span>
      <span>{commit}</span>
    </>
  );
  const chip = commit ? (
    commitHref ? (
      <a
        href={commitHref}
        target={commitHref.startsWith("http") ? "_blank" : undefined}
        rel={commitHref.startsWith("http") ? "noopener noreferrer" : undefined}
        className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-page)] px-2 py-0.5 font-sans text-[11px] text-[color:var(--ink-primary)] no-underline transition-colors hover:border-[color:var(--outline)]"
      >
        {chipInner}
      </a>
    ) : (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-page)] px-2 py-0.5 font-sans text-[11px] text-[color:var(--ink-primary)]">
        {chipInner}
      </span>
    )
  ) : null;
  return (
    <div className="rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[color:var(--hairline)] px-4 py-2">
        <span className="font-sans text-[11px] uppercase tracking-wide text-[color:var(--ink-muted)]">
          {label}
          {date ? <span className="ml-1.5 normal-case tracking-normal text-[color:var(--ink-muted)]"> · {date}</span> : null}
        </span>
        {chip}
      </div>
      <div className="px-4 py-3 text-[14px] leading-[1.6] text-[color:var(--ink-body)] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

export function Before(props: Omit<BeforeAfterPanelProps, "label">) {
  return <BeforeAfterPanel {...props} label="Before" />;
}

export function After(props: Omit<BeforeAfterPanelProps, "label">) {
  return <BeforeAfterPanel {...props} label="After" />;
}

export function TechnicalDetail({
  summary,
  children,
}: {
  summary: string;
  children: ReactNode;
}) {
  return (
    <details className="group my-6 rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-3 font-sans text-sm text-[color:var(--ink-primary)]">
        <span
          aria-hidden
          className="inline-block text-[color:var(--ink-muted)] transition-transform duration-200 group-open:rotate-90"
        >
          ›
        </span>
        <span className="flex-1">{summary}</span>
        <span className="text-[11px] uppercase tracking-wide text-[color:var(--ink-muted)]">
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
  MetricGrid,
  BeforeAfter,
  Before,
  After,
  TechnicalDetail,
  PhoneRow,
  Figure,
};
