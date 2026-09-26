"use client";

import { animate } from "framer-motion";
import { useEffect, useState } from "react";
import { easeSmooth, usePrefersReducedMotion } from "@/lib/motion";

type Props = {
  text: string;
  active: boolean;
  duration?: number;
};

const NUMBER_RE = /\d+(?:\.\d+)?/g;

export function Counter({ text, active, duration = 1.1 }: Props) {
  const reduced = usePrefersReducedMotion();
  const tokens = split(text);
  const numericIndices = tokens
    .map((t, i) => (t.kind === "number" ? i : -1))
    .filter((i) => i >= 0);

  const [values, setValues] = useState<number[]>(() =>
    tokens.map((t) => (t.kind === "number" ? 0 : 0)),
  );

  useEffect(() => {
    if (!active || reduced) {
      setValues(
        tokens.map((t) =>
          t.kind === "number" ? t.value : 0,
        ),
      );
      return;
    }

    const controls = numericIndices.map((idx) => {
      const target = (tokens[idx] as { kind: "number"; value: number }).value;
      return animate(0, target, {
        duration,
        ease: easeSmooth,
        onUpdate: (v) => {
          setValues((prev) => {
            const next = [...prev];
            next[idx] = v;
            return next;
          });
        },
      });
    });

    return () => {
      for (const c of controls) c.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduced, text]);

  return (
    <>
      {tokens.map((t, i) => {
        if (t.kind === "text") return <span key={i}>{t.value}</span>;
        const raw = values[i] ?? 0;
        const hasDecimal = String(t.value).includes(".");
        const display = hasDecimal
          ? raw.toFixed(1)
          : Math.round(raw).toString();
        return (
          <span key={i} className="tabular-nums">
            {display}
          </span>
        );
      })}
    </>
  );
}

type Token =
  | { kind: "text"; value: string }
  | { kind: "number"; value: number };

function split(text: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const match of text.matchAll(NUMBER_RE)) {
    const idx = match.index ?? 0;
    if (idx > last) out.push({ kind: "text", value: text.slice(last, idx) });
    out.push({ kind: "number", value: parseFloat(match[0]) });
    last = idx + match[0].length;
  }
  if (last < text.length) out.push({ kind: "text", value: text.slice(last) });
  return out;
}
