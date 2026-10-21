# Spec — Sprint 19 · Design system v2

**Class.** L (token additions across `globals.css`, ~40 component files migrated, new case-study components, STABLE_LOGIC/CLAUDE.md rule changes)
**Date.** 2026-10-21
**Owner.** Ruslan (the four decisions in §6), Claude (spec/plan/implementation).
**Inputs.** `memory/qa-iteration-1.md` (site audit, 2026-10-18); design canvas
artboards *Design tokens — audit*, *Site audit*, *Case study concept*, *Design system v2*.

---

## 1. Why this exists

The v1 system is right about its principles and silent about its gaps. The
2026-10-18 audit measured the rendered site and found:

- **Type has no tokens.** 26 distinct `clamp()` display sizes and 34 font
  sizes overall; 612 text nodes at 10–11px.
- **Dark surfaces have no ink.** Every dark panel uses ad-hoc `white/N` and
  `black/N`, and the email form reached for Tailwind `emerald` and `red`.
- **States have no recipe.** "No second hue" is a rule without an answer, so
  error/success and before/after diagrams invented red and green tints.
- **Shapes drift.** 4px ×140, 6px ×9, 24px ×20, 28px, 20px in the DOM;
  `@theme` radii hard-code pixels instead of pointing at `:root`.
- **Controls are under-contrasted.** `--outline` is 1.3:1 on paper; inputs
  and toggles need 3:1 (WCAG 1.4.11).
- **The case-study redesign needs parts that don't exist:** a segmented
  control, a chapter rail, stat/fact tiles, an inverse CTA panel, case nav.

## 2. What must stay the same

- Paper `#F5F4EF`, white, the 4-step ink ramp, CTA pair — values unchanged.
- **Green `#22C55E` stays the only hue** and stays availability-only.
- Two families: Playfair Display upright (display), Inter (everything else).
  See §6.1 for the one proposed code-only exception.
- `--radius-card | --radius-tile | --radius-pill` keep their values.
- Every animation honours `prefers-reduced-motion`; cursor effects gate on
  `(hover: hover)`.
- Additive only: no v1 token is renamed or re-valued.

## 3. Scope

### In
1. Tokens in `tokens-v2.css` (this folder) merged into `app/globals.css`.
2. Migrate components off retired values (§5).
3. New components: `ui/SegmentedControl`, `case-study/ChapterRail`,
   `case-study/StatTile`, `case-study/FactTile`, `case-study/LensCTA`,
   `case-study/CaseNav`.
4. State recipes (§4.4) applied to `FloatingEmailCTA`, `ContactForm`,
   `RaceTimeline`.
5. Docs: CLAUDE.md Design tokens + Motion sections, STABLE_LOGIC rules.

### Out
- The case-study page restructure itself (reading lens, depth toggle,
  chapter order) — Sprint 20 spec, built on these components.
- Dark mode for the whole site. On-dark tokens serve panels only.
- Project cover artwork (`.lx-* / .fm-* / .sm-*` and `phones/*`): documented
  as an exempt scope, not migrated.

## 4. Requirements

### 4.1 Tokens
Exactly the set in `tokens-v2.css`: inverse surface, 4 on-dark inks,
`--outline-strong`, 9-step type scale, `--radius-panel` + `--radius-inline`,
`--shadow-float`, `--focus-ring`, 4 motion tokens (0ms under reduced
motion), 3 measures. `@theme` radii reference `var(--radius-*)`.

### 4.2 Type
- Every display heading uses one of `--text-display-{xl,l,m,s}`.
- Nothing renders below `--text-caption` (13px).
- Eyebrow/micro labels: 13px, sentence case, `--ink-muted`, no tracking.

### 4.3 Colour use
- `--ink-faint` is never text — numerals included (fixes axe
  color-contrast on /work + 6 cases).
- Inputs, toggles, checkboxes use `--outline-strong`.
- Dark panels use the on-dark ramp only.

### 4.4 State recipes (no hue)
- **Error:** 2px `--ink-primary` border, circled-! icon, 600-weight message,
  `aria-invalid` + `aria-describedby`.
- **Success:** filled ink disc with a check + message. Never the status green.
- **Before / after:** before = 1.5px dashed `--ink-muted` on paper,
  after = 1.5px solid `--ink-primary` on white; text labels always visible.

### 4.5 Components
Specs as drawn on the *Design system v2* artboard. All interactive parts
≥44px hit area, visible `--focus-ring`, keyboard operable, `aria-pressed`
/ `aria-current` as drawn.

## 5. Retired in components
Tailwind `red-* / emerald-*`, `white/N`, `black/N` (outside cover artwork);
`rounded-md / -sm / -xl / [4px] / [20px] / [28px]`; `text-[10px]`,
`text-[11px]`, `text-[12px]`; hand-typed `text-[clamp(...)]`.

## 6. Decisions needed before build

1. **Code font.** Allow `--font-code` = system mono stack, `<pre>/<code>`
   only, no webfont — written into STABLE_LOGIC as the single exception?
   *Recommended: yes.* Alternative: Inter + `tabular-nums` everywhere.
2. **Labels.** Move all uppercase tracked micro-labels to 13px sentence case?
   *Recommended: yes.*
3. **Large radius.** Add `--radius-panel: 24px` (and move the 28px email
   panel to it) rather than flatten to 16px? *Recommended: add.*
4. **Token scorecard.** Demote from the top of each case into a "How it's
   built" chapter, with an outcome `StatTile` on top? *Recommended: yes*
   (implemented in Sprint 20, but the decision shapes StatTile).

## 7. Done when
- `grep` finds no retired value from §5 outside the exempt scope.
- axe: zero `color-contrast` and zero `scrollable-region-focusable` on the
  20 audited routes.
- Rendered DOM: ≤ 2 font families (3 if §6.1 = yes, code elements only),
  5 radius values, no text < 13px.
- CLAUDE.md and STABLE_LOGIC.md describe v2; DEVLOG entry written.
