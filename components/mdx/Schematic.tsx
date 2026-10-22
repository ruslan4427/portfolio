"use client";

import { useEffect, useId, useRef, useState } from "react";
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
 * Layout is automatic (Sprint 22): nodes are laid out for the measured
 * width of the text column — layered top-to-bottom for branching graphs,
 * a left-to-right "snake" for simple chains — with fixed gaps, so nothing
 * overlaps and node text stays at 14px. MDX x/y are ignored.
 *
 * Connectors are orthogonal with the arrowhead at the target only.
 * Solid = main flow, dashed = async / optional / return path, faint =
 * secondary. `color: "success"` marks the key path and is drawn in the
 * brick accent; the approved outcome gets the accent frame. Meaning is
 * always also carried by shape, glyph, label or line style. Every diagram
 * gets a legend for what it uses and a text alternative ("Read as steps")
 * per WCAG 1.1.1. Click opens the full-screen view.
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
  /** Kept for MDX compatibility; layout is automatic. */
  x?: number;
  y?: number;
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

const HEIGHT: Record<Kind, number> = {
  actor: 60,
  data: 72,
  store: 80,
  process: 72,
  decision: 104,
  terminal: 60,
};

const SKEW = 14;
const MIN_GAP_X = 40;
const MAX_GAP_X = 150;
const GAP_Y = 56;
const PAD = 12;
const MIN_NODE_W = 150;
const MAX_NODE_W = 220;
const LABEL_CHAR_W = 6.8;
const LANE = 8;

const labelWidth = (label?: string) => (label ? label.length * LABEL_CHAR_W + 18 : 0);

function kindOf(node: DiagramNode, hasOutgoing: boolean): Kind {
  // A decision keeps its diamond even when it ends the flow; the ✓/✕ glyph
  // carries the result.
  if (node.outcome && !hasOutgoing && node.shape !== "action") return "terminal";
  if (node.shape === "event" && (node.icon === "database" || node.icon === "cache")) return "store";
  return SHAPE_KIND[node.shape];
}

/**
 * Node height grows with its wrapped text, so a narrow column never clips a
 * label. Widths are rough per-character estimates for Inter at 14 / 12.5px.
 */
function nodeHeight(node: DiagramNode, kind: Kind, w: number): number {
  const inner =
    kind === "decision" ? w * 0.6 : kind === "data" ? w - SKEW * 2 - 8 : w - 20;
  const lines = (text: string, charW: number) => Math.max(1, Math.ceil((text.length * charW) / Math.max(40, inner)));
  const labelLen = node.label.length + (node.outcome ? 2 : 0);
  const content =
    (node.icon && kind !== "store" && kind !== "decision" ? 20 : 0) +
    lines("x".repeat(labelLen), 7.8) * 17 +
    (node.sub ? lines(node.sub, 6.6) * 15 : 0) +
    (kind === "store" ? 14 : 0);
  const needed = kind === "decision" ? content / 0.62 + 8 : content + 14;
  return Math.max(HEIGHT[kind], Math.ceil(needed));
}

function isKey(node: { color?: DiagramColor; outcome?: DiagramOutcome }) {
  return node.color === "success" || node.outcome === "approved";
}

/* ------------------------------- Layout --------------------------------- */

type Placed = DiagramNode & { kind: Kind; x: number; y: number; w: number; h: number; row: number };
type RouteKind = "direct" | "back" | "skip";
type Layout = {
  nodes: Record<string, Placed>;
  order: string[];
  routes: RouteKind[];
  width: number;
  height: number;
  /** Inner edge of each side corridor (where gutter routes run). */
  left: number;
  right: number;
  leftGutter: number;
  rightGutter: number;
};

/** Edge indices that point back up the flow (found by DFS in author order). */
function findBackEdges(nodes: DiagramNode[], edges: DiagramEdge[]): Set<number> {
  const back = new Set<number>();
  const state = new Map<string, 0 | 1 | 2>();
  const visit = (id: string) => {
    state.set(id, 1);
    edges.forEach((e, i) => {
      if (e.from !== id) return;
      const st = state.get(e.to) ?? 0;
      if (st === 1) back.add(i);
      else if (st === 0) visit(e.to);
    });
    state.set(id, 2);
  };
  const incoming = new Set(edges.map((e) => e.to));
  for (const n of nodes) if (!incoming.has(n.id) && !state.get(n.id)) visit(n.id);
  for (const n of nodes) if (!state.get(n.id)) visit(n.id);
  return back;
}

function buildRows(
  nodes: DiagramNode[],
  fwd: DiagramEdge[],
  cols: number,
): { rows: string[][]; snake: boolean } {
  const inDeg = new Map<string, number>();
  const outDeg = new Map<string, number>();
  for (const e of fwd) {
    inDeg.set(e.to, (inDeg.get(e.to) ?? 0) + 1);
    outDeg.set(e.from, (outDeg.get(e.from) ?? 0) + 1);
  }
  const rows: string[][] = [];
  const isChain = nodes.every((n) => (inDeg.get(n.id) ?? 0) <= 1 && (outDeg.get(n.id) ?? 0) <= 1);
  if (isChain) {
    // Follow the chain from its head so reading order is flow order.
    const next = new Map(fwd.map((e) => [e.from, e.to]));
    const seq: string[] = [];
    for (const h of nodes.filter((n) => !inDeg.get(n.id)).map((n) => n.id)) {
      let cur: string | undefined = h;
      while (cur && !seq.includes(cur)) {
        seq.push(cur);
        cur = next.get(cur);
      }
    }
    for (const n of nodes) if (!seq.includes(n.id)) seq.push(n.id);
    for (let i = 0; i < seq.length; i += cols) rows.push(seq.slice(i, i + cols));
    return { rows, snake: true };
  }
  // Longest-path ranks over forward edges; ranks wider than `cols` wrap.
  const order = nodes.map((n) => n.id);
  const rank = new Map<string, number>(order.map((id) => [id, 0]));
  for (let guard = 0, changed = true; changed && guard < nodes.length + 2; guard++) {
    changed = false;
    for (const e of fwd) {
      const r = (rank.get(e.from) ?? 0) + 1;
      if (r > (rank.get(e.to) ?? 0)) {
        rank.set(e.to, r);
        changed = true;
      }
    }
  }
  const maxRank = Math.max(0, ...rank.values());
  const slot = new Map<string, number>();
  for (let r = 0; r <= maxRank; r++) {
    const ids = order
      .filter((id) => rank.get(id) === r)
      .map((id, i) => {
        const ps = fwd.filter((e) => e.to === id).map((e) => slot.get(e.from)).filter((x): x is number => x !== undefined);
        return { id, i, bc: ps.length ? ps.reduce((a, b) => a + b, 0) / ps.length : i };
      })
      .sort((a, b) => a.bc - b.bc || a.i - b.i)
      .map((o) => o.id);
    for (let i = 0; i < ids.length; i += cols) {
      const row = ids.slice(i, i + cols);
      rows.push(row);
      row.forEach((id, j) => slot.set(id, j - (row.length - 1) / 2));
    }
  }
  return { rows, snake: false };
}

export function layoutDiagram(nodes: DiagramNode[], edges: DiagramEdge[], width: number): Layout {
  const back = findBackEdges(nodes, edges);
  const fwd = edges.filter((_, i) => !back.has(i));
  const outgoing = new Set(edges.map((e) => e.from));
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  // Gap between columns must hold the widest edge label that may sit in it.
  const gapX = Math.min(MAX_GAP_X, Math.max(MIN_GAP_X, ...edges.map((e) => labelWidth(e.label) + 16)));

  // Pass 1: rows at a provisional column count, to learn which edges need
  // a side corridor; pass 2: final geometry with the corridors reserved.
  const colsFor = (usable: number) =>
    Math.max(1, Math.min(4, Math.floor((usable + gapX) / (MIN_NODE_W + 24 + gapX))));
  let leftGutter = 0;
  const rightGutter = back.size ? 28 + Math.max(0, ...[...back].map((i) => labelWidth(edges[i].label))) : 0;
  let cols = colsFor(width - PAD * 2 - rightGutter);
  let built = buildRows(nodes, fwd, cols);
  const rowIndex = () => {
    const m = new Map<string, number>();
    built.rows.forEach((row, r) => row.forEach((id) => m.set(id, r)));
    return m;
  };
  let rowOf = rowIndex();
  const skipLabels = () =>
    edges
      .map((e, i) => ({ e, i }))
      .filter(({ e, i }) => !back.has(i) && (rowOf.get(e.to) ?? 0) - (rowOf.get(e.from) ?? 0) > 1);
  if (skipLabels().length) {
    leftGutter = 28 + Math.max(0, ...skipLabels().map(({ e }) => labelWidth(e.label)));
    const next = colsFor(width - PAD * 2 - leftGutter - rightGutter);
    if (next !== cols) {
      cols = next;
      built = buildRows(nodes, fwd, cols);
      rowOf = rowIndex();
      const skips = skipLabels();
      leftGutter = skips.length ? 28 + Math.max(0, ...skips.map(({ e }) => labelWidth(e.label))) : 0;
    }
  }

  const usable = Math.max(MIN_NODE_W, width - PAD * 2 - leftGutter - rightGutter);
  const nodeW = Math.min(MAX_NODE_W, Math.max(MIN_NODE_W - 20, (usable - (cols - 1) * gapX) / cols));
  const gridW = cols * nodeW + (cols - 1) * gapX;
  const left = PAD + leftGutter + Math.max(0, (usable - gridW) / 2);
  const placed: Record<string, Placed> = {};
  let y = PAD;
  built.rows.forEach((row, r) => {
    const kinds = row.map((id) => kindOf(byId[id], outgoing.has(id)));
    const heights = row.map((id, j) => nodeHeight(byId[id], kinds[j], nodeW));
    const rowH = Math.max(...heights);
    // Snake rows keep their grid columns; layered rows are centred.
    const offset = built.snake ? 0 : ((cols - row.length) * (nodeW + gapX)) / 2;
    row.forEach((id, j) => {
      const col = built.snake && r % 2 === 1 ? cols - 1 - j : j;
      const kind = kinds[j];
      placed[id] = {
        ...byId[id],
        kind,
        row: r,
        w: nodeW,
        h: heights[j],
        x: left + offset + col * (nodeW + gapX) + nodeW / 2,
        y: y + rowH / 2,
      };
    });
    y += rowH + GAP_Y;
  });

  const routes: RouteKind[] = edges.map((e, i) => {
    if (back.has(i)) return "back";
    const a = placed[e.from];
    const b = placed[e.to];
    if (a && b && b.row - a.row > 1) return "skip";
    return "direct";
  });

  return {
    nodes: placed,
    order: built.rows.flat(),
    routes,
    width,
    height: y - GAP_Y + PAD,
    left,
    right: left + gridW,
    leftGutter,
    rightGutter,
  };
}

/* ------------------------------- Shapes --------------------------------- */

function NodeShape({ node }: { node: Placed }) {
  const { x, y, w, h, kind } = node;
  const faint = node.color === "faint";
  const key = isKey(node);
  const stroke = key ? "var(--accent)" : faint ? "var(--outline-strong)" : "var(--ink-primary)";
  const fill = key ? "var(--accent-soft)" : faint ? "var(--bg-page)" : "var(--bg-elevated)";
  const strokeWidth = key || kind === "terminal" ? 2 : 1.5;
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
        <polygon points={`${l + SKEW},${t} ${l + w},${t} ${l + w - SKEW},${t + h} ${l},${t + h}`} {...common} />
      );
    case "store": {
      const ry = 8;
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
  const inset =
    kind === "decision" ? { x: w * 0.2, y: h * 0.16 } : kind === "data" ? { x: SKEW + 4, y: 6 } : { x: 10, y: 6 };
  const top = kind === "store" ? 10 : 0;
  const innerW = w - inset.x * 2;
  const innerH = h - inset.y * 2 - top;
  const onDark = kind === "actor";
  const showIcon = node.icon && kind !== "store" && kind !== "decision";
  return (
    <foreignObject x={x - innerW / 2} y={y - innerH / 2 + top / 2} width={innerW} height={innerH} style={{ pointerEvents: "none" }}>
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
          lineHeight: 1.2,
          color: onDark ? "var(--ink-on-dark)" : node.color === "faint" ? "var(--ink-muted)" : "var(--ink-primary)",
        }}
      >
        {showIcon && (
          <SchematicIconMark
            name={node.icon!}
            className={`h-4 w-4 shrink-0 ${onDark ? "text-[color:var(--ink-on-dark)]" : "text-[color:var(--ink-primary)]"}`}
          />
        )}
        <span style={{ fontSize: 14, fontWeight: 600 }}>
          {node.outcome && (
            <span style={{ color: node.outcome === "approved" ? "var(--accent)" : "inherit" }}>
              {node.outcome === "approved" ? "✓ " : "✕ "}
            </span>
          )}
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

function sideX(n: Placed, dir: 1 | -1) {
  const hw = n.kind === "data" ? n.w / 2 - SKEW / 2 : n.w / 2;
  return n.x + dir * hw;
}

/** Orthogonal route between two placed nodes. */
function route(a: Placed, b: Placed, kind: RouteKind, lane: number, layout: Layout): { pts: Pt[]; mid: Pt } {
  if (kind === "back") {
    // Return path: out the right side, up the right corridor, back in.
    const gx = layout.right + 12 + lane * LANE;
    const s = { x: sideX(a, 1), y: a.y };
    const e = { x: sideX(b, 1), y: b.y };
    return {
      pts: [s, { x: gx, y: s.y }, { x: gx, y: e.y }, e],
      mid: { x: layout.right + layout.rightGutter / 2 + 6, y: (s.y + e.y) / 2 },
    };
  }
  if (kind === "skip") {
    // Edge that jumps a row: down the left corridor so it crosses no node.
    const gx = layout.left - 12 - lane * LANE;
    const s = { x: sideX(a, -1), y: a.y };
    const e = { x: sideX(b, -1), y: b.y };
    return {
      pts: [s, { x: gx, y: s.y }, { x: gx, y: e.y }, e],
      mid: { x: layout.left - layout.leftGutter / 2 - 6, y: (s.y + e.y) / 2 },
    };
  }
  if (Math.abs(a.y - b.y) < 4) {
    const dir = b.x >= a.x ? 1 : -1;
    const s = { x: sideX(a, dir as 1 | -1), y: a.y };
    const e = { x: sideX(b, (-dir) as 1 | -1), y: b.y };
    return { pts: [s, e], mid: { x: (s.x + e.x) / 2, y: s.y } };
  }
  const s = { x: a.x, y: a.y + a.h / 2 };
  const e = { x: b.x, y: b.y - b.h / 2 };
  const my = e.y - GAP_Y / 2;
  if (Math.abs(s.x - e.x) < 2) return { pts: [s, e], mid: { x: s.x, y: my } };
  return { pts: [s, { x: s.x, y: my }, { x: e.x, y: my }, e], mid: { x: (s.x + e.x) / 2, y: my } };
}

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
  index,
  layout,
  lane,
  markers,
  reduced,
}: {
  edge: DiagramEdge;
  index: number;
  layout: Layout;
  lane: number;
  markers: Record<"ink" | "faint" | "accent", string>;
  reduced: boolean;
}) {
  const a = layout.nodes[edge.from];
  const b = layout.nodes[edge.to];
  if (!a || !b) return null;
  const tone = edge.color === "success" ? "accent" : edge.color === "faint" ? "faint" : "ink";
  const stroke = tone === "accent" ? "var(--accent)" : tone === "faint" ? "var(--outline-strong)" : "var(--ink-primary)";
  const { pts, mid } = route(a, b, layout.routes[index], lane, layout);
  const labelW = labelWidth(edge.label);
  return (
    <g>
      <motion.path
        d={roundedPath(pts)}
        fill="none"
        stroke={stroke}
        strokeWidth={tone === "accent" ? 2 : tone === "faint" ? 1.2 : 1.5}
        strokeDasharray={edge.style === "dashed" ? "6 5" : undefined}
        markerEnd={`url(#${markers[tone]})`}
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: false, margin: "-40px" }}
        transition={{ duration: 0.5, ease: EASE }}
      />
      {edge.label && (
        <g>
          <rect x={mid.x - labelW / 2} y={mid.y - 11} width={labelW} height={22} rx={11} fill="var(--bg-page)" stroke="var(--hairline)" />
          <text
            x={mid.x}
            y={mid.y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="var(--font-sans)"
            fontSize={12.5}
            fill={tone === "accent" ? "var(--accent)" : "var(--ink-body)"}
          >
            {edge.label}
          </text>
        </g>
      )}
    </g>
  );
}

/* ------------------------------- Canvas --------------------------------- */

function useMeasuredWidth(fallback: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = Math.round(entries[0].contentRect.width);
      if (w > 0) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

export function DiagramCanvas({
  nodes,
  edges,
  ariaLabel,
  fallbackWidth = 680,
}: {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  ariaLabel?: string;
  fallbackWidth?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const reduced = usePrefersReducedMotion();
  const { ref, width } = useMeasuredWidth(fallbackWidth);
  const layout = layoutDiagram(nodes, edges, width);
  const markers = { ink: `arr-${uid}`, faint: `arr-f-${uid}`, accent: `arr-a-${uid}` };
  const markerFill = { ink: "var(--ink-primary)", faint: "var(--outline-strong)", accent: "var(--accent)" };
  const lanes = { back: 0, skip: 0 };

  return (
    <div ref={ref} className="w-full">
      <svg
        width={layout.width}
        height={layout.height}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        role="img"
        aria-label={ariaLabel ?? "Diagram"}
        className="block h-auto max-w-full"
      >
        <defs>
          {(Object.keys(markers) as (keyof typeof markers)[]).map((k) => (
            <marker key={k} id={markers[k]} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill={markerFill[k]} />
            </marker>
          ))}
        </defs>
        <g>
          {edges.map((e, i) => (
            <Connector
              key={`${e.from}-${e.to}-${i}`}
              edge={e}
              index={i}
              layout={layout}
              lane={layout.routes[i] === "direct" ? 0 : lanes[layout.routes[i] as "back" | "skip"]++}
              markers={markers}
              reduced={reduced}
            />
          ))}
        </g>
        <g>
          {layout.order.map((id, i) => {
            const n = layout.nodes[id];
            return (
              <motion.g
                key={id}
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{ duration: 0.3, delay: i * 0.04, ease: EASE }}
              >
                <NodeShape node={n} />
                <NodeLabel node={n} />
              </motion.g>
            );
          })}
        </g>
      </svg>
    </div>
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

function LineGlyph({ color, dashed }: { color: string; dashed?: boolean }) {
  return (
    <svg viewBox="0 0 28 22" aria-hidden="true" className="h-[18px] w-6 shrink-0">
      <path d="M2,11 H22" stroke={color} strokeWidth={dashed ? 1.5 : 2} strokeDasharray={dashed ? "4 3" : undefined} />
      <path d="M20,7 L26,11 L20,15 z" fill={color} />
    </svg>
  );
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
  const outgoing = new Set(edges.map((e) => e.from));
  const used = new Set(nodes.map((n) => kindOf(n, outgoing.has(n.id))));
  const labels = new Map<Kind, string>();
  for (const item of legend ?? []) {
    const kind = SHAPE_KIND[item.shape];
    if (used.has(kind)) labels.set(kind, item.label);
  }
  const kinds = KIND_ORDER.filter((k) => used.has(k));
  const hasDashed = edges.some((e) => e.style === "dashed");
  const hasKey = edges.some((e) => e.color === "success") || nodes.some(isKey);
  if (kinds.length < 2 && !hasDashed && !hasKey) return null;

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
        <LineGlyph color="var(--ink-primary)" />
        <span>Flow</span>
      </li>
      {hasKey && (
        <li className="flex items-center gap-2">
          <LineGlyph color="var(--accent)" />
          <span>Key path / outcome</span>
        </li>
      )}
      {hasDashed && (
        <li className="flex items-center gap-2">
          <LineGlyph color="var(--ink-primary)" dashed />
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

export function DiagramSteps({ nodes, edges }: { nodes: DiagramNode[]; edges: DiagramEdge[] }) {
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
      <ol className="space-y-1.5 px-4 pb-4 font-sans text-[length:var(--type-small)] leading-[1.5] text-[color:var(--ink-body)]">
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

/**
 * The diagram itself is the control that opens the full-screen view. A div
 * with button semantics, because a real <button> may only hold phrasing
 * content and diagrams hold lists and SVG.
 */
export function ZoomTarget({
  label,
  onOpen,
  children,
  className = "",
}: {
  label: string;
  onOpen: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-label={`Open full screen: ${label}`}
      className={`block w-full cursor-zoom-in rounded-[var(--radius-tile)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] ${className}`}
    >
      {children}
    </div>
  );
}

export function Diagram({
  title,
  nodes,
  edges,
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
  const name = title ?? "Diagram";

  return (
    <motion.figure
      className="not-prose my-10"
      initial={reduced ? false : { opacity: 0, y: 28, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {title && <p className="mb-3 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">{title}</p>}
      <div className="mb-3">
        <DiagramLegend nodes={nodes} edges={edges} legend={legend} />
      </div>
      <ZoomTarget label={name} onOpen={() => setOpen(true)} className="border border-[color:var(--hairline)] bg-[color:var(--bg-page)] p-3">
        <DiagramCanvas nodes={nodes} edges={edges} ariaLabel={name} />
      </ZoomTarget>
      <DiagramSteps nodes={nodes} edges={edges} />
      {caption && (
        <figcaption className="mt-4 font-sans text-[length:var(--type-caption)] leading-[1.6] text-[color:var(--ink-muted)]">{caption}</figcaption>
      )}
      <Lightbox open={open} onClose={() => setOpen(false)} label={title} caption={caption}>
        <div className="w-full max-w-[1100px]">
          <DiagramCanvas nodes={nodes} edges={edges} ariaLabel={name} fallbackWidth={1000} />
        </div>
      </Lightbox>
    </motion.figure>
  );
}
