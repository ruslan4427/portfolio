# QA iteration 1 — site-wide audit (2026-10-18)

Scope: 20 routes × 1440px + 390px, local `next dev`, Chromium, axe-core 4.10,
computed-style inventory, Nielsen's 10 scored for a prospective client.
Visual report + case-study concept live on the design canvas
(Audit.dc.html, CaseConcept.dc.html).

## P1
1. Case count disagrees: home "Four" (numbered 01/04/05/06), /work + metadata +
   OG + about bio "Five", six MDX files exist.
2. Case pages open with TokenScorecard (internal metrics, "unmeasurable",
   "Tier 0 · naked"); status badge shows "sprint-4".
3. No skim path: 2/6 cases have recruiterSummary; ViewToggle not mounted and
   [data-view] CSS gone, so <TechnicalDetail> does nothing.
4. axe color-contrast (serious) on /work + 6 cases: --ink-faint 48px numerals
   (CaseStudyVisuals.tsx:59, CaseStudySchemas.tsx:452), Noble cover captions.
5. RaceTimeline before/after tints use red + green (CaseStudySchemas.tsx:1417-1420);
   FloatingEmailCTA emerald/red states.
6. Cases end in the generic footer — no next/prev case, no case-specific CTA.

## P2
- Rendered DOM: 3 font families (ui-monospace ×168 nodes), radii 4px ×140,
  6px ×9, 24px ×20; 34 font sizes, 612 nodes at 10–11px.
- scrollable-region-focusable on hrekov-dev <pre> and AgentReplay;
  aria-prohibited-attr + invalid <dl> on /tools.
- Nested <aside> and BackToWork outside landmarks on all case + blog pages.
- Floating "Send me a message" pill covers body text on mobile.
- Inconsistent case heroes (image / summary / scorecard).

## P3
- heading-order h1→h3 on /work, /tools; empty <th> on noble-saas.
- Hydration warning on first dev compile of hrekov-dev, lexora, smm-factory;
  not reproduced on reload — recheck in prod build.
- Scheduled post (2026-10-19) rendered 404 UI with HTTP 200 in dev.
- CLAUDE.md lists ViewToggle / [data-view] rules that no longer exist.

## Nielsen (client lens)
H1 3 · H2 2 · H3 4 · H4 2 · H5 4 · H6 3 · H7 2 · H8 3 · H9 4 · H10 4

## Holds
All text colours on the ink ramp; 0 horizontal overflow at 390px; one h1 per
route; home, about, services, contact, blog index, privacy, 404 axe-clean.

## Next
Case-study redesign (reading lens Founder/Hiring/Engineer, 2-min/full depth,
chapter rail, outcome-first hero, lens CTA, prev/next) — needs
specs/<N>-case-study-lens/ spec.md + plan.md + tasks.md before build.
