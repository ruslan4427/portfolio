# Spec — Sprint 23 · /work index redesign

**Class.** S/L boundary — page + two components rewritten; no new data
beyond a per-lens "start here" pick in `content/case-lenses.ts`.
**Date.** 2026-10-21

## Why
`/work` still speaks the pre-Sprint-20 language: centred badge hero, copy
saying "Five case studies" while six exist, a Year filter with one value,
cards that show only name, role and one metric, status "Active" for a
pre-launch project, white/black overlay chips, 11px text and an italic
display numeral (both off-system).

## What
1. Left-aligned hero matching the case template; count derived from
   `projects.length`; the same **Reading as** lens control (shared
   localStorage key with case pages, no depth toggle here).
2. **Start here** — a full-width card for the case that answers the chosen
   reader first (founder → Noble, hiring → hrekov-dev, engineer →
   smm-factory), with the lens headline and four stats.
3. Card grid — cover, plain-language status, title, lens headline, two lens
   stats on accent rules, stack tags, "Read case". Lens links carry
   `?for=` so the case opens in the same view.
4. Filters — Stack and Type chips with live counts; zero-count options and
   single-value rows hidden; v2 chips (≥44px, aria-pressed, focus ring).
5. v2 cleanup in ProjectCard: on-dark tokens for cover chips, 13px floor,
   no italic numeral, token radii.

## Unchanged
Animated covers, `projects.ts` as the single source of order and metadata,
static rendering of the page shell.
