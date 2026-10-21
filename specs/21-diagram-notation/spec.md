# Spec — Sprint 21 · Diagram notation (Diagram + FlowSchema)

**Class.** S/L boundary — one new module, two components rebuilt, MDX shape
props corrected in 4 cases. No prose changes.
**Date.** 2026-10-21

## Why
Case-study diagrams used shapes whose meanings collide with the notations
readers already know (circle = person, though BPMN uses it for events;
parallelogram = server work, though ISO 5807 uses it for data), drew
diagonal centre-to-centre lines, rendered labels at 10–11px, gave sequence
flows no arrowheads, had no text alternative, and wrapped the whole figure
in a `<button>`.

## Standards applied
- **ISO 5807** flowchart symbols: process = rectangle, decision = diamond,
  data / I-O = parallelogram, terminator = stadium, stored data = cylinder.
- **C4** for people (dark "Person" box) and data stores.
- Orthogonal connectors, arrowhead at target only, one flow direction per
  row; solid = main flow, dashed = async / optional / return.
- **WCAG 1.1.1** text alternative ("Read as steps", generated in reading
  order from the edges), **1.4.1** no colour-only meaning (status words,
  shapes, line styles), **2.1.1** keyboard-reachable scroll regions and an
  always-visible ≥44px Expand button.
- Legend generated for every symbol and line style in use.
- Legibility floor: canvases render at ≥0.8 scale and scroll (with a hint)
  instead of shrinking text below ~11px.

## Out of scope
WireflowMap, RaceTimeline (already moved to monochrome before/after in
Sprint 20), ActivityChart, PaybackBar.

## Constraint kept
Animation contract from `content/case-studies/CLAUDE.md` §7 (figure reveal,
replay on every scroll) stays; reduced motion renders static.
