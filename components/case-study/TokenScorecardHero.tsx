"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { TokenScorecard, TokenScorecardModelMix } from "@/content/case-studies";
import { Lightbox } from "@/components/ui/Lightbox";
import { Counter } from "@/components/ui/Counter";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TIER_LABEL: Record<0 | 1 | 2, string> = {
  0: "0 · naked",
  1: "1 · self-spec",
  2: "2 · ShipLoop",
};

const MODEL_LABEL: Record<keyof TokenScorecardModelMix, string> = {
  opus: "Opus",
  sonnet: "Sonnet",
  haiku: "Haiku",
};

function humanizeTokens(n: number): { value: string; unit: string } {
  if (n >= 1_000_000_000) return { value: (n / 1_000_000_000).toFixed(2), unit: "B tokens" };
  if (n >= 1_000_000) return { value: (n / 1_000_000).toFixed(1), unit: "M tokens" };
  if (n >= 1_000) return { value: (n / 1_000).toFixed(1), unit: "k tokens" };
  return { value: String(n), unit: "tokens" };
}

function MixBar({ mix, active, scale = 1 }: { mix: TokenScorecardModelMix; active: boolean; scale?: number }) {
  const entries = (Object.keys(MODEL_LABEL) as Array<keyof TokenScorecardModelMix>)
    .map((k) => ({ key: k, pct: mix[k] ?? 0 }))
    .filter((e) => e.pct > 0);
  if (entries.length === 0) return null;
  return (
    <div>
      <div
        className="flex w-full overflow-hidden rounded-[var(--radius-pill)] bg-[color:var(--hairline)]"
        style={{ height: `${0.375 * scale}rem` }}
        role="img"
        aria-label={`Model mix: ${entries.map((e) => `${e.pct}% ${MODEL_LABEL[e.key]}`).join(", ")}`}
      >
        {entries.map((e, i) => (
          <motion.span
            key={e.key}
            initial={{ width: 0 }}
            animate={{ width: active ? `${e.pct}%` : 0 }}
            transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease: EASE }}
            className={`block h-full ${
              i === 0
                ? "bg-[color:var(--ink-primary)]"
                : i === 1
                  ? "bg-[color:var(--ink-body)]"
                  : "bg-[color:var(--ink-muted)]"
            }`}
          />
        ))}
      </div>
      <dl
        className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-sans text-[color:var(--ink-muted)]"
        style={{ fontSize: `${0.6875 * scale}rem` }}
      >
        {entries.map((e, i) => (
          <motion.div
            key={e.key}
            className="flex items-baseline gap-1.5"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: active ? 1 : 0, y: active ? 0 : 4 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.06, ease: EASE }}
          >
            <dt>{MODEL_LABEL[e.key]}</dt>
            <dd className="tabular-nums text-[color:var(--ink-body)]">{e.pct}%</dd>
          </motion.div>
        ))}
      </dl>
    </div>
  );
}

function ScorecardBody({
  scorecard,
  humanized,
  scale = 1,
  animKey,
}: {
  scorecard: TokenScorecard;
  humanized: { value: string; unit: string } | null;
  scale?: number;
  animKey: string;
}) {
  return (
    <div
      key={animKey}
      className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14 md:items-start"
    >
      <div>
        {humanized ? (
          <motion.div
            className="flex items-baseline gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
          >
            <span
              className="font-serif leading-none text-[color:var(--ink-primary)] tabular-nums"
              style={{ fontSize: `${3.75 * scale}rem` }}
            >
              <Counter text={humanized.value} active duration={1.1} />
            </span>
            <motion.span
              className="font-sans text-[color:var(--ink-muted)]"
              style={{ fontSize: `${0.875 * scale}rem` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5, ease: EASE }}
            >
              {humanized.unit}
            </motion.span>
          </motion.div>
        ) : (
          <div>
            <div
              className="font-serif leading-tight text-[color:var(--ink-muted)]"
              style={{ fontSize: `${2.25 * scale}rem` }}
            >
              unmeasurable
            </div>
            <p className="mt-3 max-w-[36ch] font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
              Pre-ShipLoop sessions ran in shared home-dir logs; token
              attribution isn’t reconstructable.
            </p>
          </div>
        )}

        <motion.dl
          className="mt-6 flex flex-wrap gap-x-6 gap-y-3 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65, ease: EASE }}
        >
          <div className="flex items-baseline gap-1.5">
            <dt>Complexity</dt>
            <dd className="text-[color:var(--ink-body)]">{scorecard.complexity}</dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt>Duration</dt>
            <dd className="text-[color:var(--ink-body)]">{scorecard.duration}</dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt>Tier</dt>
            <dd className="text-[color:var(--ink-body)]">{TIER_LABEL[scorecard.tier]}</dd>
          </div>
        </motion.dl>
      </div>

      <div>
        <motion.h3
          className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16, ease: EASE }}
        >
          Model mix
        </motion.h3>
        <div className="mt-3">
          <MixBar mix={scorecard.modelMix} active scale={scale} />
        </div>
      </div>
    </div>
  );
}

export function TokenScorecardHero({ scorecard }: { scorecard?: TokenScorecard }) {
  const [open, setOpen] = useState(false);
  if (!scorecard) return null;
  const measured = scorecard.tokens !== null;
  const humanized = measured ? humanizeTokens(scorecard.tokens as number) : null;

  return (
    <motion.section
      className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-8 md:p-10"
      aria-labelledby="token-scorecard-heading"
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="flex items-start justify-between gap-3">
        <h2
          id="token-scorecard-heading"
          className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]"
        >
          Token scorecard
        </h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Expand token scorecard"
          className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)] transition hover:text-[color:var(--ink-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--ink-primary)]"
        >
          Expand ↗
        </button>
      </div>

      <div className="mt-6">
        <ScorecardBody
          scorecard={scorecard}
          humanized={humanized}
          animKey={`inline-${open ? "x" : "0"}`}
        />
      </div>

      <Lightbox
        open={open}
        onClose={() => setOpen(false)}
        label="Token scorecard"
      >
        <div className="w-full max-w-[1100px] p-6 md:p-10">
          <ScorecardBody
            scorecard={scorecard}
            humanized={humanized}
            scale={1.4}
            animKey={`lb-${open ? "1" : "0"}`}
          />
        </div>
      </Lightbox>
    </motion.section>
  );
}
