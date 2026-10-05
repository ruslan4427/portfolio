"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Lightbox } from "@/components/ui/Lightbox";

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
      <div className="font-serif text-[clamp(28px,4vw,44px)] leading-[1.15] text-[color:var(--ink-primary)] [&>p]:m-0 [&>p]:text-[color:var(--ink-primary)] [&>p]:leading-[1.15]">
        {children}
      </div>
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
        <div className="font-serif text-[clamp(22px,2.8vw,32px)] leading-[1.3] text-[color:var(--ink-primary)] [&>p]:m-0 [&>p]:text-[color:var(--ink-primary)] [&>p]:leading-[1.3]">
          {children}
        </div>
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
          <div className="font-serif text-[clamp(30px,3vw,44px)] leading-none text-[color:var(--ink-primary)] tabular-nums whitespace-nowrap">
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
type FigureKind = "default" | "phone";

export function Figure({
  src,
  alt,
  caption,
  width = 1600,
  height = 1000,
  frame = "minimal",
  kind = "default",
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  frame?: FigureFrame;
  kind?: FigureKind;
}) {
  const [open, setOpen] = useState(false);
  const frameClass =
    frame === "flat"
      ? "rounded-[var(--radius-tile)] border border-[color:var(--hairline)] overflow-hidden"
      : "rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-gradient-to-br from-[color:var(--bg-elevated)] to-[color:var(--bg-page)] p-3 sm:p-4";
  const imgClass =
    frame === "flat"
      ? "block h-auto w-full"
      : "block h-auto w-full rounded-[var(--radius-tile)]";
  const wrapperClass =
    kind === "phone" ? "mx-auto w-full max-w-[320px]" : "";
  const sizes =
    kind === "phone" ? "320px" : "(min-width: 768px) 65ch, 100vw";
  return (
    <figure className="not-prose my-10">
      <div className={wrapperClass}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Expand ${alt}`}
          className={`group relative block w-full text-left transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--ink-primary)] ${frameClass}`}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            className={imgClass}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]/90 text-[color:var(--ink-primary)] opacity-0 backdrop-blur-sm transition group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </span>
        </button>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center font-sans text-xs text-[color:var(--ink-muted)]">
          {caption}
        </figcaption>
      )}
      <Lightbox
        open={open}
        onClose={() => setOpen(false)}
        label={alt}
        caption={caption}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1024px) 80vw, 92vw"
          className="block h-auto max-h-[86vh] w-auto max-w-full rounded-[var(--radius-tile)] border border-[color:var(--hairline)] object-contain"
        />
      </Lightbox>
    </figure>
  );
}

