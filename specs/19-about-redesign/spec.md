# Sprint 19 (chronological 20) — `/about` reconcile with Claude Design output

> Note: sprint folder is `19-about-redesign` to continue numeric sequence,
> even though chronologically this follows the Sprint 18 archetype/hygiene
> release. Branch: `sprint-20-about-redesign`.

## Context

Controlled test of Claude Design "Design in codebase" mode on 2026-10-18
produced a redesign proposal for `/about`. The proposal is editorially
strong — numbered section rail ("01 — Bio", "02 — The path", "03 — How I
work"), hairline-separated inline timeline ledger, closer card with two
doors — and all ten `@/components/...` and `@/content/...` imports
resolved against the real tree. See `references/workflows/mockup-to-code.md`
and `memory/reference_claude_design_capabilities.md` for the full test
log.

This sprint applies that proposal to the real file, with three editorial
decisions locked up-front rather than accepted blindly.

## Source

Claude Design "Design in codebase" output targeting
`ruslan4427/portfolio`, prompt-constrained to:

- monochrome + the existing `--status-live` dot only
- two font families (serif display, sans everything else), upright
- paper + elevated colors from existing tokens
- token-only radii
- reduced-motion respected

## Decisions (locked)

- **D1 — drop** the "At a glance" ledger (`facts` array in the hero
  aside). Facts like "Based: Kyiv → Ohio" / "Timezone: ET workable" belong
  on `/contact` or `/services`, not above the fold here.
- **D2 — keep** the existing `<Credentials />` section. Claude Design
  silently dropped it; re-insert between `<AiStack />` and the "03 — How I
  work" rules block. Content order:
  Hero → Bio → "02 — The path" (inline) → AiStack → Credentials → "03 —
  How I work" (inline) → Closer.
- **D3 — inline** `<Experience />` and `<Values />` as Claude Design
  proposed. Rationale: the inline version adds the numbered section rail
  ("01 — Bio" / "02 — The path" / "03 — How I work") that only reads as a
  through-line when the sections share one top-level grid, not when
  individual components own their own `<section>` + header. Accept the
  minor duplication of layout logic in exchange for the editorial device.
  Keep `<Credentials />` as a component call (section rail doesn't need
  to span it).

## Non-decisions (editorial, not scoped)

- `metadata.openGraph` — add, matching `/tools` sibling's shape (title,
  description, url).
- No new tokens. No new fonts. No new motion primitives.

## Files touched

- `app/(marketing)/about/page.tsx` — full rewrite.
- (optional) `DEVLOG.md` — append Problem/Decision/Result/Lesson entry.

## Acceptance

- `npx tsc --noEmit` passes.
- `npm run build` passes.
- `npm run verify:numbers` passes.
- Content preserved: `bio[]` 4 paragraphs, `experience[]` 7 entries,
  `credentials` featured + 4 Anthropic items, `values[]` 4 rules.
- `prefers-reduced-motion` respected (no new motion beyond existing
  `Reveal` / `MaskReveal` / `Stagger`).
- Monochrome rule holds — only chromatic element remains
  `<StatusPill>` if used (hero kept bare of chrome in this scope — no
  pill, no accent).

## Out of scope

- Visual QA against the live mockup URL (user owns, happens in
  browser).
- Any change to `/work`, `/services`, `/blog`, `/contact`.
- Any shared component change (keep `<Experience />` / `<Values />`
  callable from elsewhere).

## Risks

- The inline rail couples the page to `experience` + `values` data
  shapes. If those shapes change, this page needs an edit. Documented in
  the decision above — accepted.
- Section rhythm with the component-style `<AiStack />` / `<Credentials />`
  interleaved with inline blocks might read uneven at some viewport
  widths. Visual QA step (user) is the gate.
