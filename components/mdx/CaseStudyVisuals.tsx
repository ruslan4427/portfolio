import Image from "next/image";
import type { ReactNode } from "react";

export function ValueStatement({
  children,
  eyebrow,
}: {
  children: ReactNode;
  eyebrow?: string;
}) {
  return (
    <aside className="not-prose my-12 border-y border-[color:var(--hairline)] py-10">
      {eyebrow && (
        <div className="mb-4 font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
          {eyebrow}
        </div>
      )}
      <p className="font-serif text-[clamp(28px,4vw,44px)] leading-[1.15] text-[color:var(--ink-primary)]">
        {children}
      </p>
    </aside>
  );
}

type NumberedCardsItem = { title: string; body: string };

const numberedCols: Record<1 | 2 | 3, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
};

export function NumberedCards({
  items,
  columns = 2,
}: {
  items: NumberedCardsItem[];
  columns?: 1 | 2 | 3;
}) {
  return (
    <div className={`not-prose my-10 grid ${numberedCols[columns]} gap-4`}>
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6"
        >
          <div className="font-serif text-5xl leading-none text-[color:var(--ink-faint)] tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </div>
          <h3 className="mt-4 font-serif text-xl leading-tight text-[color:var(--ink-primary)]">
            {item.title}
          </h3>
          <p className="mt-2 font-sans text-sm leading-[1.6] text-[color:var(--ink-body)]">
            {item.body}
          </p>
        </div>
      ))}
    </div>
  );
}

export function Pullquote({
  children,
  attribution,
}: {
  children: ReactNode;
  attribution?: string;
}) {
  return (
    <figure className="not-prose my-10">
      <blockquote className="border-l border-[color:var(--ink-primary)] pl-6">
        <p className="font-serif text-[clamp(22px,2.8vw,32px)] leading-[1.3] text-[color:var(--ink-primary)]">
          {children}
        </p>
      </blockquote>
      {attribution && (
        <figcaption className="mt-3 pl-6 font-sans text-xs uppercase tracking-wider text-[color:var(--ink-muted)]">
          — {attribution}
        </figcaption>
      )}
    </figure>
  );
}

type ImpactStatsItem = { value: string; label: string; hint?: string };

const impactCols: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

export function ImpactStats({
  items,
  columns = 3,
}: {
  items: ImpactStatsItem[];
  columns?: 2 | 3 | 4;
}) {
  return (
    <div
      className={`not-prose my-10 grid ${impactCols[columns]} gap-x-8 gap-y-6 border-y border-[color:var(--hairline)] py-8`}
    >
      {items.map((item, i) => (
        <div key={i}>
          <div className="font-serif text-[clamp(36px,5vw,56px)] leading-none text-[color:var(--ink-primary)] tabular-nums">
            {item.value}
          </div>
          <div className="mt-3 font-sans text-sm text-[color:var(--ink-body)]">
            {item.label}
          </div>
          {item.hint && (
            <div className="mt-1 font-sans text-xs text-[color:var(--ink-muted)]">
              {item.hint}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

type FigureFrame = "minimal" | "flat";

export function Figure({
  src,
  alt,
  caption,
  width = 1600,
  height = 1000,
  frame = "minimal",
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  frame?: FigureFrame;
}) {
  const frameClass =
    frame === "flat"
      ? "rounded-[var(--radius-tile)] border border-[color:var(--hairline)] overflow-hidden"
      : "rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-gradient-to-br from-[color:var(--bg-elevated)] to-[color:var(--bg-page)] p-3 sm:p-4";
  const imgClass =
    frame === "flat"
      ? "block h-auto w-full"
      : "block h-auto w-full rounded-[var(--radius-tile)]";
  return (
    <figure className="not-prose my-10">
      <div className={frameClass}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 768px) 65ch, 100vw"
          className={imgClass}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center font-sans text-xs text-[color:var(--ink-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export const caseStudyVisuals = {
  ValueStatement,
  NumberedCards,
  Pullquote,
  ImpactStats,
  Figure,
};
