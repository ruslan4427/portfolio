"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import * as simpleIcons from "simple-icons";
import type { SimpleIcon } from "simple-icons";
import { ExpandButton, Lightbox } from "@/components/ui/Lightbox";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type StackItem = {
  name: string;
  slug?: string;
  version?: string;
  path?: string;
};

const slugToKey = (slug: string) =>
  "si" + slug.charAt(0).toUpperCase() + slug.slice(1);

function resolveIconPath(item: StackItem): string | null {
  if (item.path) return item.path;
  if (!item.slug) return null;
  const key = slugToKey(item.slug);
  const icon = (simpleIcons as unknown as Record<string, SimpleIcon>)[key];
  return icon?.path ?? null;
}

function hostOf(href: string) {
  try {
    return new URL(href).host.replace(/^www\./, "");
  } catch {
    return href;
  }
}

function StackIcon({ item }: { item: StackItem }) {
  const path = resolveIconPath(item);
  if (path) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-7 w-7 fill-current text-[color:var(--ink-primary)]"
      >
        <path d={path} />
      </svg>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[color:var(--ink-primary)]/90 font-sans text-[13px] font-semibold text-[color:var(--bg-elevated)]"
    >
      {item.name.charAt(0)}
    </span>
  );
}

export function StackRow({
  items,
  live,
  dateRange,
  caption,
}: {
  items: StackItem[];
  live?: { label?: string; href: string };
  dateRange?: string;
  caption?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: EASE }}
      className="not-prose my-6"
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item, i) => (
          <motion.div
            key={item.name + i}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.3, delay: i * 0.04, ease: EASE }}
            className="flex min-h-[104px] flex-col justify-between rounded-[12px] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-3.5"
          >
            <StackIcon item={item} />
            <div className="mt-3">
              <div className="font-sans text-[13px] font-medium leading-tight text-[color:var(--ink-primary)]">
                {item.name}
              </div>
              {item.version && (
                <div className="mt-0.5 font-sans text-[11px] tabular-nums text-[color:var(--ink-muted)]">
                  {item.version}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {live && (
          <motion.a
            href={live.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.3,
              delay: items.length * 0.04,
              ease: EASE,
            }}
            className="group flex min-h-[104px] flex-col justify-between rounded-[12px] border border-[color:var(--ink-primary)] bg-[color:var(--ink-primary)] p-3.5 text-[color:var(--bg-elevated)] no-underline transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)]/40"
          >
            <div className="flex items-center justify-between">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: "#22C55E" }}
              />
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 opacity-80 transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </div>
            <div className="mt-3">
              <div className="font-sans text-[13px] font-medium leading-tight">
                {live.label ?? "Live product"}
              </div>
              <div className="mt-0.5 truncate font-sans text-[11px] opacity-70">
                {hostOf(live.href)}
              </div>
            </div>
          </motion.a>
        )}
      </div>
      {(dateRange || caption) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-[12px] text-[color:var(--ink-muted)]">
          {dateRange && (
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
                <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
              </svg>
              {dateRange}
            </span>
          )}
          {caption && <span>{caption}</span>}
        </div>
      )}
    </motion.div>
  );
}

const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={`h-4 w-4 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12.5L10 17.5L19 7.5" />
  </svg>
);

const DashIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={`h-4 w-4 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
  >
    <path d="M6 12h12" />
  </svg>
);

type PhoneRowItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  label?: string;
};

export function PhoneRow({
  items,
  caption,
}: {
  items: PhoneRowItem[];
  caption?: string;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const count = items.length;
  const gridClass =
    count === 2
      ? "grid-cols-2"
      : count === 3
        ? "grid-cols-3"
        : "grid-cols-1";
  const current = openIdx !== null ? items[openIdx] : null;
  return (
    <figure className="not-prose my-10">
      <div className={`grid ${gridClass} gap-3 sm:gap-4`}>
        {items.map((item, i) => (
          <motion.div
            key={item.src}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
            className="flex flex-col items-center"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(i)}
              aria-label={`Expand ${item.alt}`}
              className="group relative block w-full overflow-hidden rounded-[var(--radius-tile)] border border-[color:var(--hairline)] transition hover:-translate-y-0.5 hover:border-[color:var(--outline)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--ink-primary)]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="(min-width: 768px) 220px, 33vw"
                className="block h-auto w-full"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]/90 text-[color:var(--ink-primary)] opacity-0 backdrop-blur-sm transition group-hover:opacity-100 group-focus-visible:opacity-100"
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
            {item.label && (
              <div className="mt-3 font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                {item.label}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-5 text-center font-sans text-xs text-[color:var(--ink-muted)]">
          {caption}
        </figcaption>
      )}
      <Lightbox
        open={current !== null}
        onClose={() => setOpenIdx(null)}
        label={current?.label ?? current?.alt}
      >
        {current && (
          <Image
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            sizes="(min-width: 1024px) 80vw, 92vw"
            className="block h-auto max-h-[86vh] w-auto max-w-full rounded-[var(--radius-tile)] border border-[color:var(--hairline)] object-contain"
          />
        )}
      </Lightbox>
    </figure>
  );
}

type CompareColumn = {
  name: string;
  price: string;
  verdict?: string;
  highlight?: boolean;
};

type CompareRow = {
  label: string;
  values: (boolean | string)[];
};

export function CompareGrid({
  columns,
  rows,
  caption,
}: {
  columns: CompareColumn[];
  rows: CompareRow[];
  caption?: string;
}) {
  return (
    <figure className="not-prose my-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, ease: EASE }}
        className="overflow-x-auto rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]"
      >
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[color:var(--hairline)]">
              <th className="px-4 py-4 font-sans text-[11px] uppercase tracking-wider text-[color:var(--ink-muted)]">
                &nbsp;
              </th>
              {columns.map((col) => (
                <th
                  key={col.name}
                  className={`px-4 py-4 align-top font-sans text-sm ${
                    col.highlight
                      ? "bg-[color:var(--bg-page)] text-[color:var(--ink-primary)]"
                      : "text-[color:var(--ink-body)]"
                  }`}
                >
                  <div
                    className={`font-serif text-[18px] leading-tight ${
                      col.highlight ? "text-[color:var(--ink-primary)]" : ""
                    }`}
                  >
                    {col.name}
                  </div>
                  <div className="mt-1 font-sans text-xs tabular-nums text-[color:var(--ink-muted)]">
                    {col.price}
                  </div>
                  {col.verdict && (
                    <div className="mt-2 font-sans text-[11px] uppercase tracking-wider text-[color:var(--ink-muted)]">
                      {col.verdict}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-[color:var(--hairline)] last:border-b-0"
              >
                <td className="px-4 py-3 font-sans text-[13px] text-[color:var(--ink-body)]">
                  {row.label}
                </td>
                {row.values.map((v, j) => {
                  const col = columns[j];
                  const cellCls = col?.highlight
                    ? "bg-[color:var(--bg-page)]"
                    : "";
                  if (v === true) {
                    return (
                      <td
                        key={j}
                        className={`px-4 py-3 text-[color:var(--ink-primary)] ${cellCls}`}
                      >
                        <CheckIcon />
                      </td>
                    );
                  }
                  if (v === false) {
                    return (
                      <td
                        key={j}
                        className={`px-4 py-3 text-[color:var(--ink-faint)] ${cellCls}`}
                      >
                        <DashIcon />
                      </td>
                    );
                  }
                  return (
                    <td
                      key={j}
                      className={`px-4 py-3 font-sans text-[13px] text-[color:var(--ink-body)] ${cellCls}`}
                    >
                      {v}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      {caption && (
        <figcaption className="mt-4 text-center font-sans text-xs text-[color:var(--ink-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

type SchematicIcon =
  | "browser"
  | "database"
  | "cloud"
  | "server"
  | "lock"
  | "shield"
  | "warning"
  | "check"
  | "bolt"
  | "doc"
  | "user"
  | "code"
  | "api"
  | "clock"
  | "box"
  | "sync"
  | "cache"
  | "pin"
  | "mail"
  | "bug";

type FlowNode = {
  label: string;
  detail?: string;
  status?: "ok" | "warn" | "fail";
  bullets?: string[];
  icon?: SchematicIcon;
};

type FlowRowDiagram = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  width?: number;
  height?: number;
};

type FlowRow = {
  label: string;
  nodes?: FlowNode[];
  diagram?: FlowRowDiagram;
  tone?: "before" | "after" | "neutral";
  meta?: string;
};

const statusDot: Record<NonNullable<FlowNode["status"]>, string> = {
  ok: "bg-[color:var(--ink-primary)]",
  warn: "bg-[color:var(--ink-faint)] ring-1 ring-[color:var(--outline)]",
  fail: "bg-transparent ring-1 ring-[color:var(--ink-primary)]",
};

const schematicIconPaths: Record<SchematicIcon, string> = {
  browser:
    "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm2 4h14M7 6.5h.01M9.5 6.5h.01",
  database:
    "M4 6c0-1.5 3.6-3 8-3s8 1.5 8 3-3.6 3-8 3-8-1.5-8-3zm0 0v12c0 1.5 3.6 3 8 3s8-1.5 8-3V6M4 12c0 1.5 3.6 3 8 3s8-1.5 8-3",
  cloud:
    "M17 18H8A5 5 0 1 1 9.6 8.3a6 6 0 1 1 11.4 2.4A4 4 0 0 1 17 18z",
  server:
    "M4 4h16v6H4V4zm0 10h16v6H4v-6zM7 7h.01M7 17h.01M11 7h6M11 17h6",
  lock:
    "M6 10V7a6 6 0 0 1 12 0v3M5 10h14v10H5V10z",
  shield:
    "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z",
  warning:
    "M12 3l10 18H2L12 3zm0 7v5m0 3v.01",
  check: "M4 12l5 5L20 6",
  bolt: "M13 2 3 14h8l-2 8 10-12h-8l2-8z",
  doc: "M8 3h7l5 5v13H8V3zm7 0v5h5",
  user:
    "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z",
  code: "M8 7 3 12l5 5m8-10 5 5-5 5M14 4l-4 16",
  api: "M4 10h16v6H4v-6zm3 0V6m10 4V6M7 20v-4m10 4v-4",
  clock: "M12 7v5l3 2m-3-11a9 9 0 1 1 0 18 9 9 0 0 1 0-18z",
  box: "M3 7h18v4H3V7zm2 4v10h14V11M10 15h4",
  sync:
    "M4 12a8 8 0 0 1 13.5-5.8L21 9m0-5v5h-5M20 12a8 8 0 0 1-13.5 5.8L3 15m0 5v-5h5",
  cache:
    "M4 6c0-1 3.5-2 8-2s8 1 8 2-3.5 2-8 2-8-1-8-2zm0 0v6c0 1 3.5 2 8 2s8-1 8-2V6m-8 10v4m-4-4v4m8-4v4",
  pin: "M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zm0 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  mail: "M3 7h18v12H3V7zm0 0 9 7 9-7",
  bug: "M9 4h6m-3 2v2M5 10h14M6 14h12M7 7a5 5 0 0 1 10 0v10a5 5 0 0 1-10 0V7zm-4 7h4m14 0h4M4 20l3-2m14 2-3-2M4 10l3 2m14-2-3 2",
};

function SchematicIconMark({ name }: { name: SchematicIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 shrink-0 text-[color:var(--ink-primary)]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={schematicIconPaths[name]} />
    </svg>
  );
}

const rowAccent: Record<NonNullable<FlowRow["tone"]>, string> = {
  before: "before:bg-[color:var(--ink-faint)]",
  after: "before:bg-[color:var(--ink-primary)]",
  neutral: "before:bg-[color:var(--outline)]",
};

function FlowConnector({
  orientation,
  delay,
}: {
  orientation: "horizontal" | "vertical";
  delay: number;
}) {
  const isH = orientation === "horizontal";
  if (isH) {
    return (
      <motion.svg
        viewBox="0 0 56 24"
        aria-hidden="true"
        className="h-6 w-12 shrink-0 text-[color:var(--outline)]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "-40px" }}
      >
        <motion.circle
          cx="4"
          cy="12"
          r="2.4"
          fill="currentColor"
          stroke="none"
          variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
          transition={{ duration: 0.2, delay }}
        />
        <motion.path
          d="M6 12 H50"
          variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1 } }}
          transition={{ duration: 0.5, delay: delay + 0.1, ease: EASE }}
        />
        <motion.circle
          cx="52"
          cy="12"
          r="2.4"
          fill="currentColor"
          stroke="none"
          variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
          transition={{ duration: 0.2, delay: delay + 0.55 }}
        />
      </motion.svg>
    );
  }
  return (
    <motion.svg
      viewBox="0 0 24 44"
      aria-hidden="true"
      className="h-11 w-6 shrink-0 text-[color:var(--outline)]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-30px" }}
    >
      <motion.circle
        cx="12"
        cy="4"
        r="2.4"
        fill="currentColor"
        stroke="none"
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
        transition={{ duration: 0.2, delay }}
      />
      <motion.path
        d="M12 6 V38"
        variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1 } }}
        transition={{ duration: 0.45, delay: delay + 0.1, ease: EASE }}
      />
      <motion.circle
        cx="12"
        cy="40"
        r="2.4"
        fill="currentColor"
        stroke="none"
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
        transition={{ duration: 0.2, delay: delay + 0.5 }}
      />
    </motion.svg>
  );
}

function FlowNodeCard({
  node,
  delay,
}: {
  node: FlowNode;
  delay: number;
}) {
  const pulse = node.status === "fail";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, delay, ease: EASE }}
      className={`relative flex w-full max-w-[460px] shrink-0 flex-col rounded-[12px] border border-[color:var(--hairline)] bg-[color:var(--bg-page)] px-4 py-3.5 ${
        pulse ? "ring-1 ring-[color:var(--ink-primary)]/15" : ""
      }`}
    >
      {pulse && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[12px] ring-1 ring-[color:var(--ink-primary)]/25"
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + 0.6,
          }}
        />
      )}
      <div className="flex items-start gap-2.5">
        {node.icon ? (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]">
            <SchematicIconMark name={node.icon} />
          </span>
        ) : node.status ? (
          <span
            aria-hidden
            className={`mt-[6px] inline-block h-2 w-2 shrink-0 rounded-full ${statusDot[node.status]}`}
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {node.icon && node.status && (
              <span
                aria-hidden
                className={`inline-block h-2 w-2 shrink-0 rounded-full ${statusDot[node.status]}`}
              />
            )}
            <span className="font-sans text-[13px] font-medium leading-tight text-[color:var(--ink-primary)]">
              {node.label}
            </span>
          </div>
        </div>
      </div>
      {node.detail && (
        <div className="mt-1 font-sans text-[11px] text-[color:var(--ink-muted)]">
          {node.detail}
        </div>
      )}
      {node.bullets && node.bullets.length > 0 && (
        <ul className="mt-2 space-y-0.5 font-sans text-[11px] leading-[1.5] text-[color:var(--ink-body)]">
          {node.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span
                aria-hidden
                className="mt-[6px] inline-block h-[3px] w-[3px] shrink-0 rounded-full bg-[color:var(--ink-muted)]"
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function FlowDiagramBody({ row }: { row: FlowRow }) {
  const d = row.diagram!;
  const [open, setOpen] = useState(false);
  return (
    <div className="relative -mx-2">
      <div className="group relative overflow-x-auto rounded-[var(--radius-tile)] bg-[color:var(--bg-page)]/60 p-2">
        <DiagramCanvas
          nodes={d.nodes}
          edges={d.edges}
          width={d.width ?? 900}
          height={d.height ?? 260}
          ariaLabel={row.label}
          minWidth={560}
        />
        <ExpandButton
          onClick={() => setOpen(true)}
          label={`Expand ${row.label}`}
          className="absolute right-3 top-3 opacity-70 transition group-hover:opacity-100"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 rounded-r-[var(--radius-tile)] bg-gradient-to-l from-[color:var(--bg-elevated)] to-transparent md:hidden"
      />
      <Lightbox open={open} onClose={() => setOpen(false)} label={row.label}>
        <div className="w-full">
          <DiagramCanvas
            nodes={d.nodes}
            edges={d.edges}
            width={d.width ?? 900}
            height={d.height ?? 260}
            ariaLabel={row.label}
            minWidth={d.width ?? 900}
          />
        </div>
      </Lightbox>
    </div>
  );
}

export function FlowSchema({
  title,
  rows,
  caption,
}: {
  title?: string;
  rows: FlowRow[];
  caption?: string;
}) {
  return (
    <figure className="not-prose my-10">
      {title && (
        <div className="mb-4 font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
          {title}
        </div>
      )}
      <div className="space-y-5">
        {rows.map((row, rIdx) => {
          const tone = row.tone ?? "neutral";
          return (
            <div
              key={row.label + rIdx}
              className={`relative overflow-hidden rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-5 pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] ${rowAccent[tone]}`}
            >
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <div className="font-sans text-[10px] uppercase tracking-wide text-[color:var(--ink-muted)] whitespace-nowrap">
                  <span className="mr-2 font-serif text-[color:var(--ink-primary)]">
                    {tone === "before" ? "◴" : tone === "after" ? "●" : "○"}
                  </span>
                  {row.label}
                </div>
                {row.meta && (
                  <div className="font-sans text-[10px] tabular-nums text-[color:var(--ink-muted)] whitespace-nowrap">
                    {row.meta}
                  </div>
                )}
              </div>
              {row.diagram ? (
                <FlowDiagramBody row={row} />
              ) : (
                <div className="flex flex-col items-center">
                  {(row.nodes ?? []).map((node, nIdx) => {
                    const nodeDelay = rIdx * 0.2 + nIdx * 0.15;
                    const nodeList = row.nodes ?? [];
                    const isLast = nIdx === nodeList.length - 1;
                    return (
                      <Fragment key={node.label + nIdx}>
                        <FlowNodeCard node={node} delay={nodeDelay} />
                        {!isLast && (
                          <FlowConnector
                            orientation="vertical"
                            delay={nodeDelay + 0.15}
                          />
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-sans text-xs text-[color:var(--ink-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* --------------------------------------------------------------------------
 * Diagram — BPMN-style schematic for workflows, information architecture,
 * and problem→solution flows. SVG grid with 4 shape primitives, colored
 * branching edges, outcome badges, optional legend.
 * -------------------------------------------------------------------------- */

type DiagramShape = "role" | "event" | "action" | "process";
type DiagramColor = "neutral" | "success" | "danger" | "faint";
type DiagramOutcome = "approved" | "denied";
type DiagramEdgeStyle = "solid" | "dashed";

type DiagramNode = {
  id: string;
  shape: DiagramShape;
  label: string;
  x: number;
  y: number;
  color?: DiagramColor;
  outcome?: DiagramOutcome;
  icon?: SchematicIcon;
  sub?: string;
};

type DiagramEdge = {
  from: string;
  to: string;
  color?: DiagramColor;
  style?: DiagramEdgeStyle;
  label?: string;
};

type DiagramLegendItem = {
  shape: DiagramShape;
  label: string;
};

const diagramShapeDims: Record<DiagramShape, { w: number; h: number }> = {
  role: { w: 76, h: 76 },
  event: { w: 160, h: 72 },
  action: { w: 188, h: 108 },
  process: { w: 172, h: 72 },
};

const diagramColorStroke: Record<DiagramColor, string> = {
  neutral: "var(--ink-primary)",
  success: "#22C55E",
  danger: "#111111",
  faint: "var(--outline)",
};

const diagramColorFill: Record<DiagramColor, string> = {
  neutral: "var(--bg-elevated)",
  success: "var(--bg-elevated)",
  danger: "var(--bg-elevated)",
  faint: "var(--bg-page)",
};

function diagramEdgeAnchor(
  node: DiagramNode,
  towardsX: number,
  towardsY: number,
) {
  const { w, h } = diagramShapeDims[node.shape];
  const dx = towardsX - node.x;
  const dy = towardsY - node.y;
  if (node.shape === "role") {
    const r = w / 2;
    const len = Math.hypot(dx, dy) || 1;
    return { x: node.x + (dx / len) * r, y: node.y + (dy / len) * r };
  }
  const hw = w / 2;
  const hh = h / 2;
  const absDx = Math.abs(dx) || 0.0001;
  const absDy = Math.abs(dy) || 0.0001;
  const sx = hw / absDx;
  const sy = hh / absDy;
  const s = Math.min(sx, sy);
  return { x: node.x + dx * s, y: node.y + dy * s };
}

function DiagramShapeEl({ node }: { node: DiagramNode }) {
  const { w, h } = diagramShapeDims[node.shape];
  const color = node.color ?? "neutral";
  const stroke = diagramColorStroke[color];
  const fill = diagramColorFill[color];
  const strokeWidth = color === "faint" ? 1.1 : 1.4;
  const common = { fill, stroke, strokeWidth };
  if (node.shape === "role") {
    return <circle cx={node.x} cy={node.y} r={w / 2} {...common} />;
  }
  if (node.shape === "event") {
    return (
      <rect
        x={node.x - w / 2}
        y={node.y - h / 2}
        width={w}
        height={h}
        rx={12}
        ry={12}
        {...common}
      />
    );
  }
  if (node.shape === "action") {
    const points = `${node.x},${node.y - h / 2} ${node.x + w / 2},${node.y} ${node.x},${node.y + h / 2} ${node.x - w / 2},${node.y}`;
    return <polygon points={points} {...common} />;
  }
  const skew = 14;
  const points = `${node.x - w / 2 + skew},${node.y - h / 2} ${node.x + w / 2},${node.y - h / 2} ${node.x + w / 2 - skew},${node.y + h / 2} ${node.x - w / 2},${node.y + h / 2}`;
  return <polygon points={points} {...common} />;
}

function DiagramOutcomeBadge({ node }: { node: DiagramNode }) {
  if (!node.outcome) return null;
  const { w, h } = diagramShapeDims[node.shape];
  const bx = node.x + w / 2 - 4;
  const by = node.y - h / 2 + 4;
  const approved = node.outcome === "approved";
  return (
    <g>
      <circle
        cx={bx}
        cy={by}
        r={10}
        fill={approved ? "#22C55E" : "#111111"}
        stroke="var(--bg-elevated)"
        strokeWidth={2}
      />
      <text
        x={bx}
        y={by + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-sans)"
        fontSize={11}
        fontWeight={700}
        fill="#FFFFFF"
      >
        {approved ? "✓" : "✗"}
      </text>
    </g>
  );
}

function DiagramNodeLabel({ node }: { node: DiagramNode }) {
  const { w, h } = diagramShapeDims[node.shape];
  let padX: number;
  let padY: number;
  if (node.shape === "action") {
    padY = Math.round(h * 0.26);
    const innerHGuess = h - padY * 2;
    const inscribedW = w * (1 - innerHGuess / h);
    padX = Math.round((w - inscribedW) / 2);
  } else if (node.shape === "role") {
    padX = 10;
    padY = 10;
  } else {
    padX = 12;
    padY = 12;
  }
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;
  return (
    <foreignObject
      x={node.x - innerW / 2}
      y={node.y - innerH / 2}
      width={innerW}
      height={innerH}
      style={{ pointerEvents: "none" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          gap: 2,
          textAlign: "center",
          fontFamily: "var(--font-sans)",
          color: "var(--ink-primary)",
          lineHeight: 1.15,
        }}
      >
        {node.icon && <SchematicIconMark name={node.icon} />}
        <span style={{ fontSize: 11, fontWeight: 500 }}>{node.label}</span>
        {node.sub && (
          <span
            style={{
              fontSize: 10,
              color: "var(--ink-muted)",
              fontWeight: 400,
            }}
          >
            {node.sub}
          </span>
        )}
      </div>
    </foreignObject>
  );
}

function DiagramEdgeEl({
  edge,
  nodes,
  markerIds,
}: {
  edge: DiagramEdge;
  nodes: Record<string, DiagramNode>;
  markerIds: Record<DiagramColor, string>;
}) {
  const src = nodes[edge.from];
  const dst = nodes[edge.to];
  if (!src || !dst) return null;
  const color = edge.color ?? "neutral";
  const stroke = diagramColorStroke[color];
  const style = edge.style ?? "solid";
  const a = diagramEdgeAnchor(src, dst.x, dst.y);
  const b = diagramEdgeAnchor(dst, src.x, src.y);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const isHorizontalDominant = Math.abs(dx) >= Math.abs(dy);
  const perpOffset = 14;
  const lx = isHorizontalDominant ? mx : mx + perpOffset;
  const ly = isHorizontalDominant ? my - perpOffset : my;
  return (
    <g>
      <motion.line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={stroke}
        strokeWidth={color === "faint" ? 1.1 : 1.4}
        strokeDasharray={style === "dashed" ? "5 4" : undefined}
        markerEnd={`url(#${markerIds[color]})`}
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: EASE }}
      />
      {edge.label && (
        <g>
          <rect
            x={lx - edge.label.length * 3.1 - 6}
            y={ly - 9}
            width={edge.label.length * 6.2 + 12}
            height={18}
            rx={9}
            ry={9}
            fill="var(--bg-page)"
            stroke="var(--hairline)"
            strokeWidth={1}
          />
          <text
            x={lx}
            y={ly + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="var(--font-sans)"
            fontSize={10}
            fontWeight={500}
            fill="var(--ink-muted)"
          >
            {edge.label}
          </text>
        </g>
      )}
    </g>
  );
}

function DiagramLegendShape({ shape }: { shape: DiagramShape }) {
  const cx = 14;
  const cy = 10;
  if (shape === "role") {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill="var(--bg-elevated)"
        stroke="var(--ink-primary)"
        strokeWidth={1.2}
      />
    );
  }
  if (shape === "event") {
    return (
      <rect
        x={2}
        y={3}
        width={24}
        height={14}
        rx={4}
        ry={4}
        fill="var(--bg-elevated)"
        stroke="var(--ink-primary)"
        strokeWidth={1.2}
      />
    );
  }
  if (shape === "action") {
    return (
      <polygon
        points="14,2 25,10 14,18 3,10"
        fill="var(--bg-elevated)"
        stroke="var(--ink-primary)"
        strokeWidth={1.2}
      />
    );
  }
  return (
    <polygon
      points="6,3 26,3 22,17 2,17"
      fill="var(--bg-elevated)"
      stroke="var(--ink-primary)"
      strokeWidth={1.2}
    />
  );
}

type DiagramCanvasProps = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  width: number;
  height: number;
  ariaLabel?: string;
  minWidth?: number;
};

function DiagramCanvas({
  nodes,
  edges,
  width,
  height,
  ariaLabel,
  minWidth,
}: DiagramCanvasProps) {
  const nodeMap: Record<string, DiagramNode> = {};
  for (const n of nodes) nodeMap[n.id] = n;
  const markerIds: Record<DiagramColor, string> = {
    neutral: "diagram-arrow-neutral",
    success: "diagram-arrow-success",
    danger: "diagram-arrow-danger",
    faint: "diagram-arrow-faint",
  };
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel ?? "Diagram"}
      className="block h-auto w-full"
      style={{ minWidth: minWidth ?? Math.min(width, 640) }}
    >
      <defs>
        {(Object.keys(markerIds) as DiagramColor[]).map((c) => (
          <marker
            key={c}
            id={markerIds[c]}
            viewBox="0 0 10 10"
            refX={8}
            refY={5}
            markerWidth={6}
            markerHeight={6}
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={diagramColorStroke[c]} />
          </marker>
        ))}
      </defs>
      <g>
        {edges.map((e, i) => (
          <DiagramEdgeEl
            key={`${e.from}->${e.to}-${i}`}
            edge={e}
            nodes={nodeMap}
            markerIds={markerIds}
          />
        ))}
      </g>
      <g>
        {nodes.map((n, i) => (
          <motion.g
            key={n.id}
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}
          >
            <DiagramShapeEl node={n} />
            <DiagramNodeLabel node={n} />
            <DiagramOutcomeBadge node={n} />
          </motion.g>
        ))}
      </g>
    </svg>
  );
}

export function Diagram({
  title,
  nodes,
  edges,
  width = 760,
  height = 420,
  legend,
  caption,
}: {
  title?: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  width?: number;
  height?: number;
  legend?: DiagramLegendItem[];
  caption?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <figure className="not-prose my-10">
      {title && (
        <div className="mb-3 font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
          {title}
        </div>
      )}
      {legend && legend.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-3 py-2">
          {legend.map((item) => (
            <div
              key={item.shape + item.label}
              className="flex items-center gap-2 font-sans text-[11px] text-[color:var(--ink-muted)]"
            >
              <svg
                viewBox="0 0 28 20"
                aria-hidden="true"
                className="h-4 w-6 shrink-0"
              >
                <DiagramLegendShape shape={item.shape} />
              </svg>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
      <div className="group relative overflow-x-auto rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-page)] p-4">
        <DiagramCanvas
          nodes={nodes}
          edges={edges}
          width={width}
          height={height}
          ariaLabel={title}
        />
        <ExpandButton
          onClick={() => setOpen(true)}
          label={title ? `Expand ${title}` : "Expand diagram"}
          className="absolute right-3 top-3 opacity-70 transition group-hover:opacity-100"
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-sans text-xs text-[color:var(--ink-muted)]">
          {caption}
        </figcaption>
      )}
      <Lightbox
        open={open}
        onClose={() => setOpen(false)}
        label={title}
        caption={caption}
      >
        <div className="w-full">
          <DiagramCanvas
            nodes={nodes}
            edges={edges}
            width={width}
            height={height}
            ariaLabel={title}
            minWidth={width}
          />
        </div>
      </Lightbox>
    </figure>
  );
}

/* --------------------------------------------------------------------------
 * TechNotes — curated grid of technical references for engineers reading
 * a case study: commits, patterns, docs, repos, posts. Visually active:
 * monospace kind label, serif title, hover lift + arrow slide.
 * -------------------------------------------------------------------------- */

type TechNoteKind =
  | "commit"
  | "pattern"
  | "docs"
  | "repo"
  | "post"
  | "flag"
  | "tool"
  | "spec";

type TechNoteItem = {
  kind: TechNoteKind;
  label: string;
  title: string;
  description?: string;
  href: string;
};

const techNoteKindMeta: Record<TechNoteKind, { glyph: string }> = {
  commit: { glyph: "⟨/⟩" },
  pattern: { glyph: "◇" },
  docs: { glyph: "§" },
  repo: { glyph: "▣" },
  post: { glyph: "¶" },
  flag: { glyph: "⚑" },
  tool: { glyph: "⚙" },
  spec: { glyph: "⌘" },
};

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function TechNotes({
  title = "For engineers — go deeper",
  badge = "Technical references",
  subtitle,
  caption,
  items,
}: {
  title?: string;
  badge?: string;
  subtitle?: string;
  caption?: string;
  items: TechNoteItem[];
}) {
  if (!items || items.length === 0) return null;
  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: EASE }}
      className="not-prose my-12 overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 sm:p-8"
      aria-labelledby="tech-notes-heading"
    >
      <div className="mb-6 border-b border-[color:var(--hairline)] pb-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-md bg-[color:var(--ink-primary)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--bg-elevated)]">
            <span aria-hidden className="text-[color:var(--bg-elevated)]/80">
              {"</>"}
            </span>
            {badge}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--ink-muted)]">
            {items.length} ref{items.length === 1 ? "" : "s"}
          </span>
        </div>
        <h2
          id="tech-notes-heading"
          className="font-serif text-2xl leading-tight text-[color:var(--ink-primary)] sm:text-3xl"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 font-sans text-sm text-[color:var(--ink-muted)]">
            {subtitle}
          </p>
        )}
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => {
          const external = isExternalHref(item.href);
          const meta = techNoteKindMeta[item.kind];
          return (
            <li key={`${item.kind}-${i}-${item.href}`}>
              <a
                href={item.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group relative flex h-full flex-col gap-2 rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-page)] p-4 transition hover:-translate-y-0.5 hover:border-[color:var(--outline)] hover:shadow-[0_8px_24px_-16px_rgba(17,17,17,0.25)] focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)]/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                    <span
                      aria-hidden
                      className="text-[color:var(--ink-primary)]"
                    >
                      {meta.glyph}
                    </span>
                    {item.kind}
                    <span className="text-[color:var(--ink-muted)]/70">·</span>
                    <span className="truncate text-[color:var(--ink-primary)]/80">
                      {item.label}
                    </span>
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-3.5 w-3.5 shrink-0 translate-x-0 text-[color:var(--ink-muted)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--ink-primary)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {external ? (
                      <>
                        <path d="M7 17 17 7" />
                        <path d="M9 7h8v8" />
                      </>
                    ) : (
                      <>
                        <path d="M5 12h14" />
                        <path d="m13 5 7 7-7 7" />
                      </>
                    )}
                  </svg>
                </div>
                <div className="font-serif text-base leading-snug text-[color:var(--ink-primary)]">
                  {item.title}
                </div>
                {item.description && (
                  <p className="font-sans text-[13px] leading-relaxed text-[color:var(--ink-muted)]">
                    {item.description}
                  </p>
                )}
              </a>
            </li>
          );
        })}
      </ul>
      {caption && (
        <p className="mt-5 font-sans text-xs text-[color:var(--ink-muted)]">
          {caption}
        </p>
      )}
    </motion.aside>
  );
}

/* --------------------------------------------------------------------------
 * WireflowMap — user-flow-map style schematic. Browser-window skeletons as
 * nodes (title bar + traffic-light dots + stylized mock content), primary
 * ink-solid edges for the main pipeline, muted dashed edges for annotation
 * routes, right-side callout panels, two-item legend. Use when the system
 * is a sequence of discrete surfaces/agents rather than a BPMN flow.
 * -------------------------------------------------------------------------- */

type WireflowMock =
  | { kind: "slack"; lines: string[] }
  | { kind: "grid"; rows: number; cols: number }
  | { kind: "chart"; bars: number[] }
  | { kind: "list"; items: string[] }
  | { kind: "chips"; items: string[] }
  | { kind: "wireframe"; bars?: number };

export type WireflowNode = {
  id: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  sub?: string;
  mock: WireflowMock;
  accent?: boolean;
  caption?: string;
  labelPos?: "below" | "above" | "hidden";
};

type WireflowEdgeKind = "primary" | "annotation";
type WireflowBend = "h-first" | "v-first";

export type WireflowEdge = {
  from: string;
  to: string;
  kind: WireflowEdgeKind;
  bend?: WireflowBend;
  waypoints?: Array<{ x: number; y: number }>;
};

export type WireflowCallout = {
  x: number;
  y: number;
  w?: number;
  h?: number;
  title?: string;
  items: string[];
};

export type WireflowLegendItem = {
  kind: WireflowEdgeKind;
  label: string;
};

const WF_NODE_W = 200;
const WF_NODE_H = 160;
const WF_TITLE_H = 26;

function WireflowMockContent({ node }: { node: WireflowNode }) {
  const w = node.w ?? WF_NODE_W;
  const h = node.h ?? WF_NODE_H;
  const px = node.x + 10;
  const py = node.y + WF_TITLE_H + 8;
  const innerW = w - 20;
  const innerH = h - WF_TITLE_H - 16;
  const m = node.mock;

  if (m.kind === "slack") {
    const rowH = Math.min(16, innerH / Math.max(m.lines.length, 1));
    return (
      <g>
        {m.lines.map((line, i) => (
          <g key={i}>
            <circle
              cx={px + 5}
              cy={py + rowH / 2 + i * rowH}
              r={3.5}
              fill="var(--hairline)"
            />
            <text
              x={px + 14}
              y={py + rowH / 2 + i * rowH + 3}
              fontFamily="var(--font-sans)"
              fontSize={9}
              fill="var(--ink-body)"
            >
              {line}
            </text>
          </g>
        ))}
      </g>
    );
  }

  if (m.kind === "grid") {
    const { rows, cols } = m;
    const gap = 3;
    const cellW = (innerW - (cols - 1) * gap) / cols;
    const cellH = (innerH - (rows - 1) * gap) / rows;
    const squares: React.ReactNode[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        squares.push(
          <rect
            key={`${r},${c}`}
            x={px + c * (cellW + gap)}
            y={py + r * (cellH + gap)}
            width={cellW}
            height={cellH}
            rx={2}
            fill="var(--hairline)"
          />,
        );
      }
    }
    return <g>{squares}</g>;
  }

  if (m.kind === "chart") {
    const max = Math.max(...m.bars, 1);
    const barGap = 3;
    const barW = (innerW - (m.bars.length - 1) * barGap) / m.bars.length;
    return (
      <g>
        {m.bars.map((v, i) => {
          const barH = (v / max) * (innerH - 8);
          return (
            <rect
              key={i}
              x={px + i * (barW + barGap)}
              y={py + innerH - barH}
              width={barW}
              height={barH}
              rx={1}
              fill="var(--ink-faint)"
            />
          );
        })}
      </g>
    );
  }

  if (m.kind === "list") {
    const rowH = Math.min(15, innerH / Math.max(m.items.length, 1));
    return (
      <g>
        {m.items.map((item, i) => (
          <g key={i}>
            <circle
              cx={px + 3}
              cy={py + rowH / 2 + i * rowH}
              r={1.4}
              fill="var(--ink-muted)"
            />
            <text
              x={px + 10}
              y={py + rowH / 2 + i * rowH + 3}
              fontFamily="var(--font-sans)"
              fontSize={9}
              fill="var(--ink-body)"
            >
              {item}
            </text>
          </g>
        ))}
      </g>
    );
  }

  if (m.kind === "chips") {
    const chipH = 15;
    const chipGap = 4;
    let xcur = px;
    let ycur = py + 4;
    return (
      <g>
        {m.items.map((item, i) => {
          const chipW = Math.max(28, item.length * 5.2 + 10);
          if (xcur + chipW > px + innerW) {
            xcur = px;
            ycur += chipH + chipGap;
          }
          const el = (
            <g key={i}>
              <rect
                x={xcur}
                y={ycur}
                width={chipW}
                height={chipH}
                rx={7}
                fill="transparent"
                stroke="var(--outline)"
                strokeWidth={0.8}
              />
              <text
                x={xcur + chipW / 2}
                y={ycur + chipH / 2 + 3}
                fontFamily="var(--font-sans)"
                fontSize={9}
                fill="var(--ink-body)"
                textAnchor="middle"
              >
                {item}
              </text>
            </g>
          );
          xcur += chipW + chipGap;
          return el;
        })}
      </g>
    );
  }

  const bars = m.bars ?? 4;
  const rowH = innerH / bars;
  return (
    <g>
      {Array.from({ length: bars }).map((_, i) => (
        <rect
          key={i}
          x={px}
          y={py + i * rowH + 2}
          width={innerW * (0.5 + ((i * 37) % 50) / 100)}
          height={Math.max(rowH - 6, 2)}
          rx={2}
          fill="var(--hairline)"
        />
      ))}
    </g>
  );
}

function WireflowWindow({ node }: { node: WireflowNode }) {
  const w = node.w ?? WF_NODE_W;
  const h = node.h ?? WF_NODE_H;
  return (
    <g>
      <rect
        x={node.x}
        y={node.y}
        width={w}
        height={h}
        rx={10}
        ry={10}
        fill="var(--bg-elevated)"
        stroke="var(--outline)"
        strokeWidth={node.accent ? 1.6 : 1.2}
      />
      <line
        x1={node.x}
        y1={node.y + WF_TITLE_H}
        x2={node.x + w}
        y2={node.y + WF_TITLE_H}
        stroke="var(--hairline)"
        strokeWidth={1}
      />
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={node.x + 11 + i * 9}
          cy={node.y + WF_TITLE_H / 2}
          r={2.6}
          fill="var(--ink-faint)"
        />
      ))}
      {node.accent && (
        <circle
          cx={node.x + w - 11}
          cy={node.y + WF_TITLE_H / 2}
          r={3.2}
          fill="#22C55E"
        />
      )}
      <text
        x={node.x + 44}
        y={node.y + WF_TITLE_H / 2 + 3}
        fontFamily="var(--font-sans)"
        fontSize={8.5}
        fill="var(--ink-muted)"
        style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
      >
        {node.title}
      </text>
      <WireflowMockContent node={node} />
      {node.labelPos !== "hidden" && (() => {
        const pos = node.labelPos ?? "below";
        const captionY =
          pos === "above"
            ? node.y - (node.sub ? 20 : 8)
            : node.y + h + 15;
        const subY =
          pos === "above"
            ? node.y - 7
            : node.y + h + (node.caption ? 28 : 15);
        return (
          <>
            {node.caption && (
              <text
                x={node.x + w / 2}
                y={captionY}
                fontFamily="var(--font-sans)"
                fontSize={10}
                fill="var(--ink-muted)"
                textAnchor="middle"
                stroke="var(--bg-page)"
                strokeWidth={3.5}
                strokeLinejoin="round"
                paintOrder="stroke"
              >
                {node.caption}
              </text>
            )}
            {node.sub && (
              <text
                x={node.x + w / 2}
                y={subY}
                fontFamily="ui-monospace, Menlo, monospace"
                fontSize={9}
                fill="var(--ink-faint)"
                textAnchor="middle"
                stroke="var(--bg-page)"
                strokeWidth={3.5}
                strokeLinejoin="round"
                paintOrder="stroke"
              >
                {node.sub}
              </text>
            )}
          </>
        );
      })()}
    </g>
  );
}

function wireflowRect(node: WireflowNode) {
  const w = node.w ?? WF_NODE_W;
  const h = node.h ?? WF_NODE_H;
  return {
    x: node.x,
    y: node.y,
    w,
    h,
    cx: node.x + w / 2,
    cy: node.y + h / 2,
  };
}

function routeWireflowEdge(
  from: WireflowNode,
  to: WireflowNode,
  edge: WireflowEdge,
) {
  const a = wireflowRect(from);
  const b = wireflowRect(to);
  if (edge.waypoints && edge.waypoints.length > 0) {
    return [{ x: a.cx, y: a.cy }, ...edge.waypoints, { x: b.cx, y: b.cy }];
  }
  const bend =
    edge.bend ??
    (Math.abs(b.cx - a.cx) > Math.abs(b.cy - a.cy) ? "h-first" : "v-first");

  if (bend === "h-first") {
    const startX =
      b.cx > a.cx + a.w / 2
        ? a.x + a.w
        : b.cx < a.x
          ? a.x
          : a.cx;
    const startY = a.cy;
    const endX = b.cx;
    const endY = b.cy > a.cy ? b.y : b.y + b.h;
    return [
      { x: startX, y: startY },
      { x: endX, y: startY },
      { x: endX, y: endY },
    ];
  }
  const startY =
    b.cy > a.cy + a.h / 2
      ? a.y + a.h
      : b.cy < a.y
        ? a.y
        : a.cy;
  const startX = a.cx;
  const endY = b.cy;
  const endX = b.cx > a.cx ? b.x : b.x + b.w;
  return [
    { x: startX, y: startY },
    { x: startX, y: endY },
    { x: endX, y: endY },
  ];
}

function WireflowEdgeEl({
  edge,
  fromNode,
  toNode,
  markerIds,
}: {
  edge: WireflowEdge;
  fromNode: WireflowNode;
  toNode: WireflowNode;
  markerIds: Record<WireflowEdgeKind, string>;
}) {
  const pts = routeWireflowEdge(fromNode, toNode, edge);
  const d = pts
    .map((p, i) => (i === 0 ? `M${p.x} ${p.y}` : `L${p.x} ${p.y}`))
    .join(" ");
  const stroke =
    edge.kind === "primary" ? "var(--ink-primary)" : "var(--ink-muted)";
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={edge.kind === "primary" ? 1.6 : 1.2}
      strokeDasharray={edge.kind === "annotation" ? "4 3" : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
      markerEnd={`url(#${markerIds[edge.kind]})`}
    />
  );
}

function WireflowCalloutEl({ callout }: { callout: WireflowCallout }) {
  const w = callout.w ?? 220;
  const h = callout.h ?? 180;
  const titleH = callout.title ? 22 : 0;
  const availH = h - titleH - 20;
  const rowH = availH / Math.max(callout.items.length, 1);
  return (
    <g>
      <rect
        x={callout.x}
        y={callout.y}
        width={w}
        height={h}
        rx={10}
        ry={10}
        fill="var(--bg-elevated)"
        stroke="var(--outline)"
        strokeWidth={1.2}
      />
      {callout.title && (
        <>
          <text
            x={callout.x + 14}
            y={callout.y + 15}
            fontFamily="var(--font-sans)"
            fontSize={9}
            fill="var(--ink-primary)"
            style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
          >
            {callout.title}
          </text>
          <line
            x1={callout.x + 14}
            y1={callout.y + titleH}
            x2={callout.x + w - 14}
            y2={callout.y + titleH}
            stroke="var(--hairline)"
            strokeWidth={1}
          />
        </>
      )}
      {callout.items.map((item, i) => {
        const yBase = callout.y + titleH + 12 + i * rowH + rowH / 2;
        return (
          <g key={i}>
            <circle
              cx={callout.x + 18}
              cy={yBase - 3}
              r={1.6}
              fill="var(--ink-muted)"
            />
            <text
              x={callout.x + 26}
              y={yBase}
              fontFamily="var(--font-sans)"
              fontSize={10}
              fill="var(--ink-body)"
            >
              {item}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function WireflowCanvas({
  nodes,
  edges,
  callouts,
  width,
  height,
  ariaLabel,
  minWidth,
}: {
  nodes: WireflowNode[];
  edges: WireflowEdge[];
  callouts?: WireflowCallout[];
  width: number;
  height: number;
  ariaLabel?: string;
  minWidth?: number;
}) {
  const nodeMap: Record<string, WireflowNode> = {};
  for (const n of nodes) nodeMap[n.id] = n;
  const markerIds: Record<WireflowEdgeKind, string> = {
    primary: "wireflow-arrow-primary",
    annotation: "wireflow-arrow-annotation",
  };
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel ?? "Wireflow map"}
      className="block h-auto w-full"
      style={{ minWidth: minWidth ?? Math.min(width, 480) }}
    >
      <defs>
        {(Object.keys(markerIds) as WireflowEdgeKind[]).map((k) => (
          <marker
            key={k}
            id={markerIds[k]}
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={6}
            markerHeight={6}
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 z"
              fill={k === "primary" ? "var(--ink-primary)" : "var(--ink-muted)"}
            />
          </marker>
        ))}
      </defs>
      <g>
        {edges.map((e, i) => {
          const from = nodeMap[e.from];
          const to = nodeMap[e.to];
          if (!from || !to) return null;
          return (
            <WireflowEdgeEl
              key={`${e.from}->${e.to}-${i}`}
              edge={e}
              fromNode={from}
              toNode={to}
              markerIds={markerIds}
            />
          );
        })}
      </g>
      <g>
        {nodes.map((n, i) => (
          <motion.g
            key={n.id}
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
          >
            <WireflowWindow node={n} />
          </motion.g>
        ))}
      </g>
      {callouts && callouts.length > 0 && (
        <g>
          {callouts.map((c, i) => (
            <WireflowCalloutEl key={i} callout={c} />
          ))}
        </g>
      )}
    </svg>
  );
}

export function WireflowMap({
  title,
  nodes,
  edges,
  callouts,
  legend,
  caption,
  width = 1240,
  height = 920,
}: {
  title?: string;
  nodes: WireflowNode[];
  edges: WireflowEdge[];
  callouts?: WireflowCallout[];
  legend?: WireflowLegendItem[];
  caption?: string;
  width?: number;
  height?: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <figure className="not-prose my-10">
      {title && (
        <div className="mb-3 font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
          {title}
        </div>
      )}
      {legend && legend.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-3 py-2">
          {legend.map((item) => (
            <div
              key={item.kind + item.label}
              className="flex items-center gap-2 font-sans text-[11px] text-[color:var(--ink-muted)]"
            >
              <svg
                viewBox="0 0 32 10"
                aria-hidden="true"
                className="h-3 w-10 shrink-0"
              >
                <line
                  x1={1}
                  y1={5}
                  x2={24}
                  y2={5}
                  stroke={
                    item.kind === "primary"
                      ? "var(--ink-primary)"
                      : "var(--ink-muted)"
                  }
                  strokeWidth={item.kind === "primary" ? 1.6 : 1.2}
                  strokeDasharray={item.kind === "annotation" ? "4 3" : undefined}
                />
                <path
                  d="M 22 1.5 L 30 5 L 22 8.5"
                  fill="none"
                  stroke={
                    item.kind === "primary"
                      ? "var(--ink-primary)"
                      : "var(--ink-muted)"
                  }
                  strokeWidth={item.kind === "primary" ? 1.6 : 1.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
      <div className="group relative overflow-x-auto rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-page)] p-4">
        <WireflowCanvas
          nodes={nodes}
          edges={edges}
          callouts={callouts}
          width={width}
          height={height}
          ariaLabel={title}
        />
        <ExpandButton
          onClick={() => setOpen(true)}
          label={title ? `Expand ${title}` : "Expand wireflow"}
          className="absolute right-3 top-3 opacity-70 transition group-hover:opacity-100"
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-sans text-xs text-[color:var(--ink-muted)]">
          {caption}
        </figcaption>
      )}
      <Lightbox
        open={open}
        onClose={() => setOpen(false)}
        label={title}
        caption={caption}
      >
        <div className="w-full">
          <WireflowCanvas
            nodes={nodes}
            edges={edges}
            callouts={callouts}
            width={width}
            height={height}
            ariaLabel={title}
            minWidth={width}
          />
        </div>
      </Lightbox>
    </figure>
  );
}

