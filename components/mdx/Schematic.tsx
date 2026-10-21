"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { Lightbox } from "@/components/ui/Lightbox";
import { usePrefersReducedMotion } from "@/lib/motion";

/* --------------------------------------------------------------------------
 * Schematic notation for case-study diagrams (Sprint 21).
 *
 * Shapes follow ISO 5807 flowchart symbols, with C4 conventions for people
 * and data stores, so a reader who knows either reads these without a key:
 *
 *   role     → Person / role   dark box (C4 "Person")
 *   event    → Data / signal   parallelogram (ISO 5807 data / input-output)
 *              …with icon database|cache → Data store, cylinder
 *   process  → Process step    rectangle (ISO 5807 process)
 *   action   → Decision / gate diamond (ISO 5807 decision)
 *   non-decision node with `outcome` and no outgoing edge → Outcome, stadium
 *              (ISO 5807 terminator) with ✓ / ✕
 *
 * Connectors are orthogonal with the arrowhead at the target only.
 * Solid = main flow, dashed = async / optional / return path, faint =
 * secondary. Monochrome: state is carried by shape, glyph and line style,
 * never hue. Every diagram gets a legend for the symbols it uses and a
 * text alternative ("Read as steps") per WCAG 1.1.1.
 *
 * Animation keeps the case-study contract (content/case-studies/CLAUDE.md
 * §7): reveal replays on every scroll; reduced motion renders static.
 * -------------------------------------------------------------------------- */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export type SchematicIcon =
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

const schematicIconPaths: Record<SchematicIcon, string> = {
  browser:
    "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm2 4h14M7 6.5h.01M9.5 6.5h.01",
  database:
    "M4 6c0-1.5 3.6-3 8-3s8 1.5 8 3-3.6 3-8 3-8-1.5-8-3zm0 0v12c0 1.5 3.6 3 8 3s8-1.5 8-3V6M4 12c0 1.5 3.6 3 8 3s8-1.5 8-3",
  cloud: "M17 18H8A5 5 0 1 1 9.6 8.3a6 6 0 1 1 11.4 2.4A4 4 0 0 1 17 18z",
  server: "M4 4h16v6H4V4zm0 10h16v6H4v-6zM7 7h.01M7 17h.01M11 7h6M11 17h6",
  lock: "M6 10V7a6 6 0 0 1 12 0v3M5 10h14v10H5V10z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z",
  warning: "M12 3l10 18H2L12 3zm0 7v5m0 3v.01",
  check: "M4 12l5 5L20 6",
  bolt: "M13 2 3 14h8l-2 8 10-12h-8l2-8z",
  doc: "M8 3h7l5 5v13H8V3zm7 0v5h5",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z",
  code: "M8 7 3 12l5 5m8-10 5 5-5 5M14 4l-4 16",
  api: "M4 10h16v6H4v-6zm3 0V6m10 4V6M7 20v-4m10 4v-4",
  clock: "M12 7v5l3 2m-3-11a9 9 0 1 1 0 18 9 9 0 0 1 0-18z",
  box: "M3 7h18v4H3V7zm2 4v10h14V11M10 15h4",
  sync: "M4 12a8 8 0 0 1 13.5-5.8L21 9m0-5v5h-5M20 12a8 8 0 0 1-13.5 5.8L3 15m0 5v-5h5",
  cache:
    "M4 6c0-1 3.5-2 8-2s8 1 8 2-3.5 2-8 2-8-1-8-2zm0 0v6c0 1 3.5 2 8 2s8-1 8-2V6m-8 10v4m-4-4v4m8-4v4",
  pin: "M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zm0 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  mail: "M3 7h18v12H3V7zm0 0 9 7 9-7",
  bug: "M9 4h6m-3 2v2M5 10h14M6 14h12M7 7a5 5 0 0 1 10 0v10a5 5 0 0 1-10 0V7zm-4 7h4m14 0h4M4 20l3-2m14 2-3-2M4 10l3 2m14-2-3 2",
};

export function SchematicIconMark({
  name,
  className = "h-5 w-5 shrink-0 text-[color:var(--ink-primary)]",
}: {
  name: SchematicIcon;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
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

/* ---------------------------- Types (MDX API) ---------------------------- */

export type DiagramShape = "role" | "event" | "action" | "process";
export type DiagramColor = "neutral" | "success" | "danger" | "faint";
type DiagramOutcome = "approved" | "denied";
type DiagramEdgeStyle = "solid" | "dashed";

export type DiagramNode = {
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

export type DiagramEdge = {
  from: string;
  to: string;
  color?: DiagramColor;
  style?: DiagramEdgeStyle;
  label?: string;
};

export type DiagramLegendItem = {
  shape: DiagramShape;
  label: string;
};

/* ------------------------------ Notation -------------------------------- */

type Kind = "actor" | "data" | "store" | "process" | "decision" | "terminal";

const KIND_ORDER: Kind[] = ["actor", "data", "store", "process", "decision", "terminal"];

const KIND_NAME: Record<Kind, string> = {
  actor: "Person / role",
  data: "Data / signal",
  store: "Data store",
  process: "Process step",
  decision: "Decision / gate",
  terminal: "Outcome",
};

const SHAPE_KIND: Record<DiagramShape, Kind> = {
  role: "actor",
  event: "data",
  process: "process",
  action: "decision",
};

const DIMS: Record<Kind, { w: number; h: number }> = {
  actor: { w: 132, h: 64 },
  data: { w: 176, h: 76 },
  store: { w: 176, h: 84 },
  process: { w: 176, h: 76 },
  decision: { w: 180, h: 112 },
  terminal: { w: 176, h: 64 },
};

const SKEW = 16;

function kindOf(node: DiagramNode, hasOutgoing: boolean): Kind {
  // A decision keeps its diamond even when it ends the flow; the ✓/✕ glyph
  // carries the result.
  if (node.outcome && !hasOutgoing && node.shape !== "action") return "terminal";
  if (node.shape === "event" && (node.icon === "database" || node.icon === "cache")) return "store";
  return SHAPE_KIND[node.shape];
}

type Placed = DiagramNode & { kind: Kind; w: number; h: number };

function place(nodes: DiagramNode[], edges: DiagramEdge[]): Record<string, Placed> {
  const outgoing = new Set(edges.map((e) => e.from));
  const map: Record<string, Placed> = {};
  for (const n of nodes) {
    const kind = kindOf(n, outgoing.has(n.id));
    map[n.id] = { ...n, kind, ...DIMS[kind] };
  }
  return map;
}

/* ------------------------------- Shapes --------------------------------- */

function NodeShape({ node }: { node: Placed }) {
  const { x, y, w, h, kind } = node;
  const faint = node.color === "faint";
  const stroke = faint ? "var(--outline-strong)" : "var(--ink-primary)";
  const fill = faint ? "var(--bg-page)" : "var(--bg-elevated)";
  const strokeWidth = kind === "terminal" ? 2 : 1.5;
  const dash = faint ? "4 3" : undefined;
  const common = { stroke, strokeWidth, strokeDasharray: dash, fill };
  const l = x - w / 2;
  const t = y - h / 2;

  switch (kind) {
    case "actor":
      return <rect x={l} y={t} width={w} height={h} rx={14} fill="var(--bg-inverse)" stroke="var(--bg-inverse)" />;
    case "process":
      return <rect x={l} y={t} width={w} height={h} rx={6} {...common} />;
    case "terminal":
      return <rect x={l} y={t} width={w} height={h} rx={h / 2} {...common} />;
    case "decision":
      return <polygon points={`${x},${t} ${l + w},${y} ${x},${t + h} ${l},${y}`} {...common} />;
    case "data":
      return (
        <polygon
          points={`${l + SKEW},${t} ${l + w},${t} ${l + w - SKEW},${t + h} ${l},${t + h}`}
          {...common}
        />
      );
    case "store": {
      const ry = 9;
      return (
        <g>
          <path
            d={`M${l},${t + ry} A${w / 2},${ry} 0 0 1 ${l + w},${t + ry} V${t + h - ry} A${w / 2},${ry} 0 0 1 ${l},${t + h - ry} Z`}
            {...common}
          />
          <path d={`M${l},${t + ry} A${w / 2},${ry} 0 0 0 ${l + w},${t + ry}`} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
        </g>
      );
    }
  }
}

function NodeLabel({ node }: { node: Placed }) {
  const { x, y, w, h, kind } = node;
  const inset = kind === "decision" ? { x: w * 0.22, y: h * 0.2 } : kind === "data" ? { x: SKEW + 6, y: 8 } : { x: 10, y: 8 };
  const top = kind === "store" ? 10 : 0;
  const innerW = w - inset.x * 2;
  const innerH = h - inset.y * 2 - top;
  const onDark = kind === "actor";
  return (
    <foreignObject
      x={x - innerW / 2}
      y={y - innerH / 2 + top / 2}
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
          lineHeight: 1.15,
          color: onDark ? "var(--ink-on-dark)" : node.color === "faint" ? "var(--ink-muted)" : "var(--ink-primary)",
        }}
      >
        {node.icon && kind !== "store" && (
          <SchematicIconMark
            name={node.icon}
            className={`h-[18px] w-[18px] shrink-0 ${onDark ? "text-[color:var(--ink-on-dark)]" : "text-[color:var(--ink-primary)]"}`}
          />
        )}
        <span style={{ fontSize: 14, fontWeight: 600 }}>
          {node.outcome ? `${node.outcome === "approved" ? "✓" : "✕"} ` : ""}
          {node.label}
        </span>
        {node.sub && (
          <span style={{ fontSize: 12.5, fontWeight: 400, color: onDark ? "var(--ink-on-dark-muted)" : "var(--ink-muted)" }}>
            {node.sub}
          </span>
        )}
      </div>
    </foreignObject>
  );
}

/* ------------------------------ Connectors ------------------------------ */

type Pt = { x: number; y: number };

function port(n: Placed, side: "l" | "r" | "t" | "b"): Pt {
  const hw = n.kind === "data" ? n.w / 2 - SKEW / 2 : n.w / 2;
  if (side === "l") return { x: n.x - hw, y: n.y };
  if (side === "r") return { x: n.x + hw, y: n.y };
  if (side === "t") return { x: n.x, y: n.y - n.h / 2 };
  return { x: n.x, y: n.y + n.h / 2 };
}

/** Orthogonal route: exit along the dominant axis, one elbow pair. */
function route(a: Placed, b: Placed): { pts: Pt[]; mid: Pt } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const s = port(a, dx >= 0 ? "r" : "l");
    const e = port(b, dx >= 0 ? "l" : "r");
    if (Math.abs(s.y - e.y) < 2) return { pts: [s, e], mid: { x: (s.x + e.x) / 2, y: s.y } };
    const mx = (s.x + e.x) / 2;
    return { pts: [s, { x: mx, y: s.y }, { x: mx, y: e.y }, e], mid: { x: mx, y: (s.y + e.y) / 2 } };
  }
  const s = port(a, dy >= 0 ? "b" : "t");
  const e = port(b, dy >= 0 ? "t" : "b");
  if (Math.abs(s.x - e.x) < 2) return { pts: [s, e], mid: { x: s.x, y: (s.y + e.y) / 2 } };
  const my = (s.y + e.y) / 2;
  return { pts: [s, { x: s.x, y: my }, { x: e.x, y: my }, e], mid: { x: (s.x + e.x) / 2, y: my } };
}

/** Polyline with rounded inner corners. */
function roundedPath(pts: Pt[], r = 10): string {
  if (pts.length < 3) return `M${pts[0].x},${pts[0].y} L${pts[1].x},${pts[1].y}`;
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i - 1];
    const c = pts[i];
    const n = pts[i + 1];
    const r1 = Math.min(r, Math.hypot(c.x - p.x, c.y - p.y) / 2);
    const r2 = Math.min(r, Math.hypot(n.x - c.x, n.y - c.y) / 2);
    const a = { x: c.x - Math.sign(c.x - p.x) * r1, y: c.y - Math.sign(c.y - p.y) * r1 };
    const b = { x: c.x + Math.sign(n.x - c.x) * r2, y: c.y + Math.sign(n.y - c.y) * r2 };
    d += ` L${a.x},${a.y} Q${c.x},${c.y} ${b.x},${b.y}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L${last.x},${last.y}`;
}

function Connector({
  edge,
  nodes,
  markerId,
  markerFaintId,
  reduced,
}: {
  edge: DiagramEdge;
  nodes: Record<string, Placed>;
  markerId: string;
  markerFaintId: string;
  reduced: boolean;
}) {
  const a = nodes[edge.from];
  const b = nodes[edge.to];
  if (!a || !b) return null;
  const faint = edge.color === "faint";
  const { pts, mid } = route(a, b);
  const labelW = edge.label ? edge.label.length * 7 + 18 : 0;
  return (
    <g>
      <motion.path
        d={roundedPath(pts)}
        fill="none"
        stroke={faint ? "var(--outline-strong)" : "var(--ink-primary)"}
        strokeWidth={faint ? 1.2 : 1.5}
        strokeDasharray={edge.style === "dashed" ? "6 5" : undefined}
        markerEnd={`url(#${faint ? markerFaintId : markerId})`}
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: false, margin: "-40px" }}
        transition={{ duration: 0.5, ease: EASE }}
      />
      {edge.label && (
        <g>
          <rect
            x={mid.x - labelW / 2}
            y={mid.y - 12}
            width={labelW}
            height={24}
            rx={12}
            fill="var(--bg-page)"
            stroke="var(--hairline)"
          />
          <text
            x={mid.x}
            y={mid.y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="var(--font-sans)"
            fontSize={12.5}
            fill="var(--ink-body)"
          >
            {edge.label}
          </text>
        </g>
      )}
    </g>
  );
}

/* ------------------------------- Canvas --------------------------------- */

export function DiagramCanvas({
  nodes,
  edges,
  width,
  height,
  ariaLabel,
  describedBy,
  minScale = 0.8,
}: {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  width: number;
  height: number;
  ariaLabel?: string;
  describedBy?: string;
  /** Smallest render scale before the canvas scrolls instead of shrinking. */
  minScale?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const reduced = usePrefersReducedMotion();
  const placed = place(nodes, edges);
  const markerId = `arrow-${uid}`;
  const markerFaintId = `arrow-faint-${uid}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel ?? "Diagram"}
      aria-describedby={describedBy}
      className="block h-auto w-full"
      style={{ minWidth: minScale > 0 ? Math.round(width * minScale) : undefined }}
    >
      <defs>
        {[
          [markerId, "var(--ink-primary)"],
          [markerFaintId, "var(--outline-strong)"],
        ].map(([id, fill]) => (
          <marker
            key={id}
            id={id}
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={7}
            markerHeight={7}
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill={fill} />
          </marker>
        ))}
      </defs>
      <g>
        {edges.map((e, i) => (
          <Connector
            key={`${e.from}-${e.to}-${i}`}
            edge={e}
            nodes={placed}
            markerId={markerId}
            markerFaintId={markerFaintId}
            reduced={reduced}
          />
        ))}
      </g>
      <g>
        {Object.values(placed).map((n, i) => (
          <motion.g
            key={n.id}
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-40px" }}
            transition={{ duration: 0.3, delay: i * 0.04, ease: EASE }}
          >
            <NodeShape node={n} />
            <NodeLabel node={n} />
          </motion.g>
        ))}
      </g>
    </svg>
  );
}

/* ------------------------ Legend + text alternative ---------------------- */

function LegendGlyph({ kind }: { kind: Kind }) {
  const s = { fill: "var(--bg-elevated)", stroke: "var(--ink-primary)", strokeWidth: 1.3 };
  switch (kind) {
    case "actor":
      return <rect x={2} y={4} width={24} height={14} rx={4} fill="var(--bg-inverse)" />;
    case "data":
      return <polygon points="7,4 27,4 21,18 1,18" {...s} />;
    case "store":
      return (
        <g>
          <path d="M4,7 A10,3 0 0 1 24,7 V16 A10,3 0 0 1 4,16 Z" {...s} />
          <path d="M4,7 A10,3 0 0 0 24,7" fill="none" stroke="var(--ink-primary)" strokeWidth={1.3} />
        </g>
      );
    case "process":
      return <rect x={2} y={4} width={24} height={14} rx={2} {...s} />;
    case "decision":
      return <polygon points="14,1 26,11 14,21 2,11" {...s} />;
    case "terminal":
      return <rect x={2} y={4} width={24} height={14} rx={7} {...s} strokeWidth={1.8} />;
  }
}

export function DiagramLegend({
  nodes,
  edges,
  legend,
}: {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  legend?: DiagramLegendItem[];
}) {
  const placed = place(nodes, edges);
  const used = new Set(Object.values(placed).map((n) => n.kind));
  const labels = new Map<Kind, string>();
  for (const item of legend ?? []) {
    const kind = SHAPE_KIND[item.shape];
    if (used.has(kind)) labels.set(kind, item.label);
  }
  const kinds = KIND_ORDER.filter((k) => used.has(k));
  const hasDashed = edges.some((e) => e.style === "dashed");
  if (kinds.length + (hasDashed ? 1 : 0) < 2) return null;

  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-body)]">
      {kinds.map((k) => (
        <li key={k} className="flex items-center gap-2">
          <svg viewBox="0 0 28 22" aria-hidden="true" className="h-[18px] w-6 shrink-0">
            <LegendGlyph kind={k} />
          </svg>
          <span>
            {labels.get(k) ?? KIND_NAME[k]}
            {labels.has(k) && labels.get(k) !== KIND_NAME[k] && (
              <span className="text-[color:var(--ink-muted)]"> · {KIND_NAME[k].toLowerCase()}</span>
            )}
          </span>
        </li>
      ))}
      <li className="flex items-center gap-2">
        <svg viewBox="0 0 28 22" aria-hidden="true" className="h-[18px] w-6 shrink-0">
          <path d="M2,11 H22" stroke="var(--ink-primary)" strokeWidth={1.5} />
          <path d="M20,7 L26,11 L20,15 z" fill="var(--ink-primary)" />
        </svg>
        <span>Main flow</span>
      </li>
      {hasDashed && (
        <li className="flex items-center gap-2">
          <svg viewBox="0 0 28 22" aria-hidden="true" className="h-[18px] w-6 shrink-0">
            <path d="M2,11 H22" stroke="var(--ink-primary)" strokeWidth={1.5} strokeDasharray="4 3" />
            <path d="M20,7 L26,11 L20,15 z" fill="var(--ink-primary)" />
          </svg>
          <span>Async / optional</span>
        </li>
      )}
    </ul>
  );
}

/** Edges in reading order (breadth-first from nodes with no incoming edge). */
function orderedEdges(nodes: DiagramNode[], edges: DiagramEdge[]): DiagramEdge[] {
  const incoming = new Set(edges.map((e) => e.to));
  const roots = nodes.filter((n) => !incoming.has(n.id)).map((n) => n.id);
  const queue = roots.length ? [...roots] : nodes.slice(0, 1).map((n) => n.id);
  const seen = new Set<string>(queue);
  const out: DiagramEdge[] = [];
  const used = new Set<DiagramEdge>();
  while (queue.length) {
    const id = queue.shift()!;
    for (const e of edges) {
      if (e.from !== id || used.has(e)) continue;
      used.add(e);
      out.push(e);
      if (!seen.has(e.to)) {
        seen.add(e.to);
        queue.push(e.to);
      }
    }
  }
  return [...out, ...edges.filter((e) => !used.has(e))];
}

export function DiagramSteps({
  id,
  nodes,
  edges,
}: {
  id?: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const steps = orderedEdges(nodes, edges);
  if (steps.length === 0) return null;
  const name = (nid: string) => {
    const n = byId[nid];
    if (!n) return nid;
    const outcome = n.outcome ? ` (${n.outcome === "approved" ? "✓ approved" : "✕ denied"})` : "";
    return `${n.label}${outcome}`;
  };
  return (
    <details className="group mt-3 rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 font-sans text-sm text-[color:var(--ink-primary)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
        <span>Read as steps ({steps.length})</span>
        <span aria-hidden className="transition-transform duration-[var(--dur-fast)] group-open:rotate-180">
          ↓
        </span>
      </summary>
      <ol id={id} className="space-y-1.5 px-4 pb-4 font-sans text-[length:var(--type-small)] leading-[1.5] text-[color:var(--ink-body)]">
        {steps.map((e, i) => (
          <li key={`${e.from}-${e.to}-${i}`} className="flex gap-3">
            <span className="min-w-[22px] text-[length:var(--type-caption)] text-[color:var(--ink-muted)] tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              <span className="text-[color:var(--ink-primary)]">{name(e.from)}</span>
              {" → "}
              <span className="text-[color:var(--ink-primary)]">{name(e.to)}</span>
              {e.label && <span className="text-[color:var(--ink-muted)]"> — {e.label}</span>}
              {e.style === "dashed" && <span className="text-[color:var(--ink-muted)]"> (async / optional)</span>}
            </span>
          </li>
        ))}
      </ol>
    </details>
  );
}

/* ------------------------------- Figure --------------------------------- */

// Canvases wider than this (at the legibility floor) can't fit the 720px
// article column, so they scroll and say so.
const COLUMN_PX = 680;

export function WideHint({ width }: { width: number }) {
  if (width * 0.8 <= COLUMN_PX) return null;
  return (
    <p className="mt-2 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
      Wide diagram — scroll sideways, or use Expand for the full view.
    </p>
  );
}

export function ExpandButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[color:var(--outline-strong)] bg-[color:var(--bg-elevated)] px-3.5 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-primary)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M10 2h4v4M6 14H2v-4M14 2 9 7M2 14l5-5" />
      </svg>
      Expand
    </button>
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
  const reduced = usePrefersReducedMotion();
  const stepsId = useId();
  const name = title ?? "Diagram";

  return (
    <motion.figure
      className="not-prose my-10"
      initial={reduced ? false : { opacity: 0, y: 28, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        {title ? (
          <p className="pt-2.5 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">{title}</p>
        ) : (
          <span />
        )}
        <ExpandButton label={`Expand diagram: ${name}`} onClick={() => setOpen(true)} />
      </div>
      <div className="mb-3">
        <DiagramLegend nodes={nodes} edges={edges} legend={legend} />
      </div>
      <div
        tabIndex={0}
        role="region"
        aria-label={`${name} (scrolls sideways on small screens)`}
        className="overflow-x-auto rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-page)] p-4 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
      >
        <DiagramCanvas
          nodes={nodes}
          edges={edges}
          width={width}
          height={height}
          ariaLabel={name}
          describedBy={stepsId}
        />
      </div>
      <WideHint width={width} />
      <DiagramSteps id={stepsId} nodes={nodes} edges={edges} />
      {caption && (
        <figcaption className="mt-4 font-sans text-[length:var(--type-caption)] leading-[1.6] text-[color:var(--ink-muted)]">
          {caption}
        </figcaption>
      )}
      <Lightbox open={open} onClose={() => setOpen(false)} label={title} caption={caption}>
        <div className="w-full">
          <DiagramCanvas nodes={nodes} edges={edges} width={width} height={height} ariaLabel={name} minScale={0} />
        </div>
      </Lightbox>
    </motion.figure>
  );
}
