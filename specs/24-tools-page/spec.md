# 24 — /tools redesign

**Date.** 2026-10-21
**Class.** L (one page, 8 components) · owner request: "тепер також зроби редизайн сторінки тулс"

## Problem

/tools reads as one long wall. Each tool card prints everything at once:
why, what it systematizes, three impact tiles with method and baseline,
measured / unmeasured lists and a conclusion. Then comes a seven-column
scorecard, a four-panel methodology and seven skill cards. A visitor
cannot tell at a glance how many tools there are or what each one buys
them. Styling predates design system v2: 10–11px uppercase labels, mono
type (third family), the green status dot used as a "pass" mark, ad-hoc
type sizes. The "Inside ShipLoop." heading does not render under
reduced motion.

## Goal

Same clarity rule as /work (Sprint 23): inventory first, equal
treatment, details on demand.

1. **Header** — the count up front (`Two open-source tools.`), one-line
   lede, license facts.
2. **Overview** — two equal cards, `01 / 02`, name, tagline, headline
   number, jump link to the section.
3. **One section per tool** — left: number, name, tagline, GitHub,
   install with copy. Right: description, why / what it systematizes,
   three impact numbers on accent rules, conclusion. Method, baseline,
   measured / unmeasured lists go into one `<details>` ("How these are
   measured"). ShipLoop's section lists its commands as compact rows
   grouped by stage (name, when to use, invocation).
4. **Scorecard** — question-led heading, the table on v2 tokens,
   methodology collapsed under `<details>`.

## Rules

- Tokens only; 13px floor (`--type-caption`); no uppercase tracking labels.
- Two families: code and commands set in Inter (matches MDX `code`).
- Green stays for availability. Hygiene pass = ink ✓ + text.
- Brick accent only on the impact number rules and the active jump link.
- Content (`content/tools*.ts`, `scorecard.json`) unchanged.
- Native `<details>` for disclosure — keyboard and screen-reader ready,
  no JS.

## Done when

- 1440 and 390: no horizontal overflow; axe clean.
- Every number on the old page is still reachable.
- tsc + lint clean on touched files; prod build passes.
