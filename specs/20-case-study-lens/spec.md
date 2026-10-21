# Spec — Sprint 20 · Case-study lens (full-content redesign)

**Class.** L (new case template, 6 new client/server components, MDX section
wrapping, v2 tokens, restyle of case MDX components)
**Date.** 2026-10-21
**Inputs.** Design canvas *Case studies v2* (6 artboards + CaseView template),
`specs/19-design-system-v2/`, `memory/qa-iteration-1.md`. Method: ui-ux-pro
(tokens first → contrast → visual check → trends).

## 1. Why
Audit P1 #2, #3, #6: cases open with internal metrics, offer no skim path
through 7–24 screens, and end in a dead end. Prospective clients, hiring
managers and engineers read the same page for different reasons.

## 2. What must stay the same
- All MDX content renders — nothing is cut. Body order is the author's.
- Monochrome + single availability green; Playfair upright + Inter.
- Static generation (`generateStaticParams`); no `searchParams` on the page.
- Every claim on the page already exists in the MDX / `projects.ts`.
- `prefers-reduced-motion` honoured; no new cursor effects.

## 3. Scope
1. **Hero:** case index / role / year / plain-language status; title;
   lens headline; four lens stats.
2. **Reading lens:** Founder · Hiring manager · Engineer. Changes headline,
   stats, the "Start here" chapter and the closing CTA. Persisted in
   `localStorage`; `?for=founder|hiring|engineer` pre-selects it (for
   outreach links).
3. **Reading depth:** "2-min read" shows each section's heading and lead
   with a per-section "Read the full section"; "Full story" shows all.
4. **At a glance bento:** problem, outcome, built with, timeline,
   "Made with Claude" (model mix + tokens) — transparent AI disclosure.
5. **Chapter rail:** every `##` section of the MDX, scroll-spy, progress;
   sticky on lg, collapsible list on small screens.
6. **How it was made:** TokenScorecardHero + BuildTimeline move below the
   body (decision 4 of Sprint 19).
7. **Close:** lens CTA on the inverse panel with the status pill; previous /
   next case from `projects.ts` order.
8. **Restyle case MDX components** to v2: no faint-ink text, no red/green
   tints, 13px text floor, token radii, keyboard-reachable scroll regions.

## 4. Data
`content/case-lenses.ts` — typed, keyed by slug: `glance`, `statusLabel`,
`lenses.{founder,hiring,engineer}.{headline, stats[4], cta?}`.
Out of scope: extending `verify:numbers` to this file (follow-up; numbers
were copied from MDX / projects.ts).

## 5. Done when
- All 6 `/work/<slug>` render every MDX section; tsc/lint clean for touched
  files.
- axe: no color-contrast or scrollable-region-focusable on case routes.
- Desktop 1440 + mobile 390 screenshots checked; no horizontal overflow.
- DEVLOG entry; CLAUDE.md file layout updated.
