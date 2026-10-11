# Case study authoring rulebook

Canonical rules for every file in `content/case-studies/*.mdx`. Follow before
writing new case studies and before editing existing ones. These rules exist
because each one maps to a real bug that was shipped and then had to be
undone.

Hard pre-flight: before you ship ANY edit here, run both:

```bash
pnpm verify:numbers            # every claim is matched against DEVLOG.md
node /tmp/dev-errors.mjs       # sweep all 12 routes, zero console errors
```

---

## 1. Canonical section order

Case studies follow one shape so a recruiter scanning five of them never
feels lost. Keep this order; omit a section rather than reorder it. Deviations
(see `hrekov-dev.mdx`, `noble-saas.mdx`) are long-form features and need an
explicit decision, not a reflex.

```mdx
---
frontmatter (see §2)
---

**One-sentence pitch in bold prose.** First line of body, not inside any
component.

<StackRow items={[…]} live={{…}} dateRange="…" />

<ValueStatement eyebrow="…">
one-line posture
</ValueStatement>

## Context           — one short paragraph, no components
## Problem           — one short paragraph, no components
## Division of Labor — markdown table (Layer | Who)
## Prompt Architecture — <PromptLog title="…">verbatim rule</PromptLog>
## Iteration Moment  — <BeforeAfter> with dated panels
                       followed by <FlowSchema> if the arc has >2 states
                       followed by **Lesson:** italic one-liner
                       followed by <PhoneRow> if there are UI captures
## Trade-Offs        — <NumberedCards columns={2} items={[…]} />
## Results (honest)  — <ImpactStats> OR <MetricGrid> OR bullets.
                       The "(honest)" suffix is mandatory — it signals we're
                       not inflating.
## Reflection        — <Pullquote attribution="…">one line</Pullquote>
                       followed by numbered takeaways (1., 2., 3.)
<TechNotes items={[…]} caption="…" />  — closes every case study
```

The recruiter view (L2) and the executive view hide anything inside
`<TechnicalDetail>`. Deep technical passages must be wrapped so the toggle
works.

---

## 2. Frontmatter

```yaml
---
slug: fieldmark            # MUST match the filename exactly (no date prefix)
title: Fieldmark
tagline: One sentence, max ~90 chars. No period if used as a card line.
role: Personal · solo       # or "Team of N · my role"
stack:
  - Flutter
  - Riverpod
year: "2026"
status: shipped            # shipped | in-review | archived
publishedAt: "2026-09-12"  # ISO date, same across content ledger
readingTime: 4             # minutes, integer, honest
---
```

Rules:
- `slug` must equal filename. The loader throws if it doesn't.
- `publishedAt` must parse as an ISO date. Timeline order on `/work` uses it.
- `readingTime` is minutes rounded. Don't claim 2 minutes for a 5-minute read.
- Optional: `recruiterSummary`, `supportingArtifacts`, `devlogRefs`,
  `featured`. Add only when you actually use them.

---

## 3. MDX gotchas (these are not negotiable)

### 3.1 `next-mdx-remote` strips object/array props without `blockJS: false`

Both bodies (`CaseStudyBody.tsx`, `BlogPostBody.tsx`) already set
`blockJS: false`. If you add a new MDX primitive that takes structured props
(`items={[{…}]}`), test it in `pnpm dev` and confirm the prop is NOT
`undefined` on the server render. If it is, the body file is wrong.

### 3.2 Never render `<p>{children}</p>` in an MDX-consumed component

MDX auto-wraps bare prose in `<p>`. A component that puts its children inside
`<p>` produces nested-p and React hydration errors. Use `<div>` with
`[&>p]:m-0` overrides. All existing primitives already do this — follow their
pattern.

### 3.3 Component catalog (what's available, no inventing)

Imported in `components/mdx/CaseStudyBody.tsx`. Use these; do not reach for
raw divs.

| Component          | Purpose                                                  |
|--------------------|----------------------------------------------------------|
| `StackRow`         | Stack grid + `live` link tile + `dateRange`              |
| `ValueStatement`   | Thesis block near top of body                            |
| `BeforeAfter`      | Dated before/after panels around an iteration moment     |
| `FlowSchema`       | BPMN-style multi-row flow (see §4 — most error-prone)    |
| `Diagram`          | Single BPMN diagram without row scaffolding (see §6.1)   |
| `RaceTimeline`     | Time-sequenced lanes (sessions × events) — race/arc stories (see §6.2) |
| `ActivityChart`    | Phase-based bar chart: duration × rate across project phases (see §6.3) |
| `PaybackBar`       | Horizontal 2-option comparison bar with % fills (see §6.4) |
| `WireflowMap`      | User-flow map: browser-window skeletons + 2 arrow kinds  |
| `PhoneRow`         | 2 or 3 mobile captures (NEVER 1) — click opens fullscreen |
| `CompareGrid`      | Table-shaped matrix (3+ columns × rows)                  |
| `NumberedCards`    | Trade-offs, 2 or 4 items, `columns={2}` default          |
| `ImpactStats`      | Big-number results, 3 across (`columns={3}`)             |
| `MetricGrid`       | Longer metric list with context                          |
| `PromptLog`        | Verbatim CLAUDE.md / AGENTS.md excerpt                   |
| `Pullquote`        | Single-line lesson with attribution                      |
| `Figure`           | Single screenshot with caption                           |
| `TechNotes`        | External docs grid — closes every case study             |
| `TechnicalDetail`  | Deep passage; CSS-hidden in executive view               |
| `Artifact` `Cost` `PromptLog` `Diff` | From `BlogComponents` — case studies may use |

**Picking the right data-viz primitive** (resist the reflex to make everything a `FlowSchema`):

| Shape of the story                                 | Primitive          |
|----------------------------------------------------|--------------------|
| Before/after of a decision graph (2 BPMN rows)     | `FlowSchema`       |
| Single BPMN graph, especially 7+ nodes             | `Diagram`          |
| Two sessions racing in wall-clock time             | `RaceTimeline`     |
| How a project's heartbeat changed over phases      | `ActivityChart`    |
| "Option A pays back in N; Option B in M" bar race  | `PaybackBar`       |
| Multi-surface pipeline (agents, screens, services) | `WireflowMap`      |
| Written contrast (not a graph), dated              | `BeforeAfter`      |

Anything else: raise it in chat before shipping.

---

## 4. FlowSchema — the component that keeps biting us

Every FlowSchema bug this project has shipped traces to one of three things:
clipping (viewBox too tight or node too close to edge), composition
(leftmost shifted but siblings not), or shape-text overflow (padding doesn't
match shape geometry). The row card uses `overflow-hidden`, so anything that
leaves the viewBox is sliced off.

### 4.1 Shape dimensions (DO NOT change in MDX — read-only reference)

Defined in `components/mdx/CaseStudySchemas.tsx:843`.

| Shape     | w   | h   | Notes                                           |
|-----------|-----|-----|-------------------------------------------------|
| `role`    | 76  | 76  | Circle. For actors (Dev, PM, Reviewer).         |
| `event`   | 160 | 72  | Rounded rect. Default — commits, submissions.   |
| `action`  | 188 | 108 | Diamond. Decisions / reviews. Big to fit text.  |
| `process` | 172 | 72  | Parallelogram. Running processes.               |

### 4.2 viewBox margin — SYMMETRIC rule

For a row with nodes `nodes[]` and width `vb.width`:

```
min(node.x) ≥  half_width_of_leftmost_node  + 16
max(node.x) ≤  vb.width − half_width_of_rightmost_node − 16
             (−22 if the rightmost node has an outcome badge,
              because the badge extends +6 past the node's right edge)
```

half_width = `shapeDims[node.shape].w / 2`.

Row card has `overflow-hidden`. There is no "it almost fits" — if the
condition fails, text or badge clips.

### 4.3 Both rows in one FlowSchema share the same viewBox width

Pick the wider required viewBox and use it on both rows. Different viewBoxes
scale the two rows differently and make the composition look drunk. This is
the "same scale" rule — don't skip it even when row 1 is clearly narrower.

### 4.4 When you shift the leftmost node, shift ALL siblings by the same delta

If row 2 needed `x += 36` on the leftmost to clear the left edge, every
subsequent node in row 2 also gets `x += 36`. Otherwise the first pair of
nodes collapses together ("склеїлись"). Preserve gaps as a composition
invariant.

### 4.5 Prefer rightward shift over widening viewBox

Widening the viewBox squishes every node. Shifting leftmost rightward (and
all siblings by the same delta) is the correct fix 90% of the time.

### 4.6 Action-diamond text: inscribed-rectangle padding

A rhombus doesn't accept the same text area as a rounded rect of the same
w×h. The schema file already computes `padX` from the inscribed rectangle:

```ts
if (node.shape === "action") {
  padY = Math.round(h * 0.26);               // ~28 for h=108
  const innerHGuess = h - padY * 2;
  const inscribedW = w * (1 - innerHGuess / h);
  padX = Math.round((w - inscribedW) / 2);
}
```

Author-side rule: keep `sub` strings on action diamonds **≤ 14 chars**. If
you need more, shorten the prose or split into two nodes. Do not fight the
geometry.

### 4.7 Edge labels only when semantically rich

An edge color + the destination node's label already convey "rejected" or
"approved". Adding `label: "broken"` or `label: "undisclosed"` to an edge
reads as random noise. Use edge labels only for genuine branches
(`approve` / `edit` / `ignore` on a Y-fork). Never as commentary.

### 4.8 Outcome badges

`outcome: "approved"` → green check extending +6px past node's right edge.
`outcome: "denied"` → red cross, same offset. Only on terminal nodes of a
flow. Compute viewBox using the −22 rule above when a terminal node has a
badge.

### 4.9 Pre-ship visual check

Before committing any FlowSchema change:

```bash
# Launch Playwright headless at the four breakpoints and screenshot each row.
# Script at /tmp/flow-closeup.mjs is the template.
node /tmp/flow-closeup.mjs      # verify no clipping at 1512px
```

Then open the page in a real browser at 1024px and 1280px. The row card
`overflow-hidden` only shows itself when the viewport renders a particular
intermediate width.

---

## 5. Other recurring-bug rules

### 5.1 `PhoneRow` — pairs or threes, never one

A single tall-narrow phone capture in prose looks accidental. If you have
one screenshot, use `<Figure>`. If you have 2 or 3 that belong together,
`<PhoneRow>` groups them side-by-side with click-to-fullscreen.

### 5.2 `ImpactStats` — single-line values

Any numeric value that wraps across two lines kills the composition. The
component already applies `whitespace-nowrap` and a clamp-based font — your
job is to keep the label short enough that it doesn't force a wrap of its
own. Target ≤ 32 chars per `label`.

### 5.3 `StackRow` — live link tile is required when the product is shipped

If `frontmatter.status === "shipped"` AND the product has a public link
(App Store, URL), the StackRow MUST include a `live={{ label, href }}` tile.
Fieldmark has it; Lexora/Angel/smm-factory/hrekov-dev need auditing before
ship.

### 5.4 Dates always ISO (`YYYY-MM-DD`), stacks on both ends

`dateRange="2026-09-12 → 2026-09-19"`. Arrow is U+2192 (`→`), not `->`.
Same for `BeforeAfter date=` and `FlowSchema meta=`. Mixing formats breaks
the "I'm reading the same voice" feel.

### 5.5 Numbers must come from DEVLOG.md

`pnpm verify:numbers` runs in prebuild. If you claim "76 unit tests" or
"7 days", the number has to appear verbatim in `DEVLOG.md`. Make the DEVLOG
entry first, then quote it.

### 5.6 Bold-prose pitch is one sentence

The first line of body is a single bold sentence, outside any component.
It's what Metadata OG + RSS summaries pick up. If it reads like two
sentences crammed together, split and keep only the second one.

### 5.7 "Lesson" one-liners are italic prose, not blockquotes

The pattern is `**Lesson:** *…*` immediately after a `<BeforeAfter>` or
`<FlowSchema>`. Not a blockquote, not a `<Pullquote>`. Pullquote is for the
closing Reflection section only.

### 5.8 Lazy composition — do not reach for custom markup

If you find yourself writing `<div className="…">` directly in MDX, stop.
Either an existing primitive covers the case, or we need a new primitive in
`CaseStudySchemas.tsx` (that goes through a review). Raw markup in MDX bodies
rots the system because the styles aren't shared.

### 5.9 `WireflowMap` — canvas ≤ 920 wide, mocks ≤ 24 chars per line

Use `WireflowMap` when the architecture is a sequence of discrete *surfaces*
(agents, screens, services) rather than a BPMN flow — the orbit in
`smm-factory.mdx` is the reference. Rules:

- Canvas width ≤ 920. Case-study body column is ~695px wide; anything wider
  horizontally scrolls or scales down past legibility. Height is flexible.
- Window default is 160×140. Orchestrator / hub window can be 200×160 with
  `accent: true` for the green status dot.
- Mock kinds: `slack` (≤ 4 lines, ≤ 24 chars/line), `list` (≤ 5 items),
  `grid` (rows × cols thumbnails), `chart` (bar values 0–1), `chips`
  (text pills), `wireframe` (fallback skeleton bars). Longer text clips.
- Two edge kinds only: `primary` (ink solid — the main pipeline) and
  `annotation` (muted dashed — telemetry, routing, callbacks). Mixing more
  dilutes the two-colour legend.
- Right-side `callouts` panel is for *context*, not labels: file inventories,
  decision rules, stack lists. One per diagram max.
- Always include a 2-item `legend` so the two arrow kinds read instantly.
- Caption + sub text under each window render with a bg-page text halo
  (`paintOrder: "stroke"`, `strokeWidth: 3.5`) so edge arrows passing
  underneath don't bleed through the glyphs. If you add new text labels in
  SVG that may overlap edge paths, apply the same halo.
- Each window takes `labelPos: "below" | "above" | "hidden"` (default `below`).
  Rule: when arrows enter a window from *below* its bottom edge, flip its
  label to `above` so the vertical approach doesn't cross the caption text.
  For hub nodes with arrows in all four directions (orchestrator in the
  reference), use `hidden` and let the surrounding callout carry the label.
  Keep label orientation symmetric within a row — flipping only the one
  colliding window reads as a bug.

---

## 6. Data-viz primitives (Diagram, RaceTimeline, ActivityChart, PaybackBar)

All four live in `components/mdx/CaseStudySchemas.tsx` alongside `FlowSchema` /
`WireflowMap`. They share three contracts: a lightbox for close-inspection, a
figure-level reveal, and internal stagger that replays on every scroll
(see §7). Author-facing rules are per-primitive below.

### 6.1 `Diagram` — single BPMN graph

Use when a flow has >6 nodes or needs two tiers (actors above, system below).
`FlowSchema` is for a *before vs after* comparison; `Diagram` is for a single
rich graph.

- Shapes & dimensions: same table as §4.1 (`role` 76, `event` 160, `process`
  172, `action` 188×108).
- Canvas sizing: body column is ~695px wide, but the Diagram SVG scrolls
  horizontally and expands in the lightbox, so budget by node count.
  - ≤ 6 nodes: `width=900, height=320`, single row.
  - 7–10 nodes: `width=1500, height=620`, 2 lanes (actors y≈100, system y≈310,
    outcomes y≈200/420/540). The 10-node Noble booking flow at
    `content/case-studies/noble-saas.mdx:273` is the reference layout.
- `color: "success" | "danger" | "faint"` tints terminal/alt-path nodes.
  Use `outcome: "approved" | "denied"` on the single most important terminal
  node — not on every success/failure leaf, or the badge noise swallows the
  signal.
- Horizontal scroll: inside the body column the `<figure>` lets the SVG
  overflow horizontally so a 1500-wide canvas doesn't shrink to illegibility.

### 6.2 `RaceTimeline` — concurrent sessions on wall-clock time

Shape of the story: *same slot, same moment, two outcomes*. The two Noble
RaceTimelines at `noble-saas.mdx` are the reference.

- Each `row` is a dated panel with its own `tone` (`before` = red tint,
  `after` = green tint, default = neutral). Keep the two-row before/after
  pattern unless you have a genuine third variant.
- Each `session` has `label` + `events[]`. Event `t` is 0–100 (percent of the
  row's time axis). Event `kind`:
  - `"commit" | "ok"` → black diamond (DB write landed)
  - `"fail"` → white circle with black cross (409 / rejected)
  - anything else → black dot (pick / signal)
- `window: { from, to, label }` paints the vulnerability band (hatched +
  dashed border). Only use when the story is "this window is the bug".
- `marker: { t, label }` drops a captioned vertical dashed line (e.g.
  "atomic insert · UNIQUE constraint"). Max 184px label width → ~26 chars.
- `outcome: { kind, label }` adds the right-side pill ("Double-book",
  "One booking"). Required when the row concludes a decision — the pill is
  the punchline.
- Keep `axisTicks` sparse (3–5 ticks) and label with units (`+30s`, `+2m`).

### 6.3 `ActivityChart` — phase-based activity rate

Shape of the story: *how the project's heartbeat changed across named
phases*. Each phase has a `duration` (relative — days, weeks, same unit
across phases) and a `count` (total events). Bar **width** scales to
duration, bar **height** scales to rate (`count / duration`).

- `tone: "peak" | "high" | "normal" | "low"` tints bars from solid ink to
  28% ink. Use `peak` sparingly — one phase per chart max.
- `markers[]` pin events to the right edge of a phase by `afterPhase: id`.
  Use for commit hashes or named pivots. Keep labels ≤ 24 chars.
- Narrow phases (duration < ~5% of total) produce bars under 70px wide and
  their labels collide with the next phase's. The component already
  staggers alternate narrow-bar labels down by 32px and adds a leader line.
  Don't fight it — if the stagger still collides, the story probably wants
  two charts, not one.
- Padding is tuned once (`AC_PAD_B=108`) so the stacked labels + leader have
  room. Don't shrink it to "save space".

### 6.4 `PaybackBar` — 2-option horizontal comparison

Shape of the story: *Option A costs $X and recoups by month M; Option B
costs $Y and never recoups*. Pure 2-row horizontal bar race with %-fill.

- Give both rows the same denominator (e.g. "monthly loss cap") so the
  percentages are comparable.
- Rows render ink-black bar fills on paper-neutral tracks. The *lower* bar
  reads as the better outcome by convention (shorter bar = less bad).
- Caption carries the units ("USD / month"); the bar values are %-of-max
  internally, so the caption is doing the semantic work.

### 6.5 Lightbox on every rich schema

`Diagram`, `FlowSchema`, `RaceTimeline`, `ActivityChart`, `PaybackBar`,
`WireflowMap` all ship with an `ExpandButton` top-right (opacity 0.7 →
hover 1.0) that opens `components/ui/Lightbox.tsx` — a portal modal with
ESC-close, backdrop-click dismiss, `max-w: min(1400px, 96vw)`.

**Non-negotiable rule for authoring new chart primitives**:

- Extract the rendered body into a `rowsBlock` / `chartSvg()` const inside
  the component. Render it once in the inline `<figure>` and again inside
  `<Lightbox>…</Lightbox>`.
- The lightbox version MUST pass `minWidth={0}` (or omit the width-forcing
  prop) so the SVG scales to the modal frame instead of forcing its native
  width — otherwise wide canvases (Diagram 1500, WireflowMap 920) overflow
  past the modal and clip on the right.
- Wrap the `ExpandButton` in a `group relative` container so the opacity
  hover-reveal works.

---

## 7. Animation contract (figure reveal + internal stagger)

Every data-viz primitive in §6 (and `FlowSchema`, `WireflowMap`) follows the
same two-layer animation pattern. **Replay-on-every-scroll is intentional** —
Ruslan asked for it explicitly on 2026-10-10 after a "I don't see animations"
pass, and the whole file now uses `once: false`. Do not revert to `once:true`
without a fresh ask.

### 7.1 EASE constant

```ts
import { EASE } from "./CaseStudySchemas"; // [0.22, 1, 0.36, 1]
```

All timing uses this ease. Different eases across primitives read as drift.

### 7.2 Layer A — figure-level reveal

Wrap the top-level `<figure>` in `motion.figure` with the standard reveal:

```tsx
<motion.figure
  className="not-prose my-10"
  initial={{ opacity: 0, y: 28, scale: 0.985 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  viewport={{ once: false, margin: "0px 0px -80px 0px" }}
  transition={{ duration: 0.7, ease: EASE }}
>
```

Numbers are tuned: `y: 28` (not 12 — needs to read as motion past the fold),
`scale: 0.985 → 1` (subtle), `duration: 0.7` (long enough to feel composed).

### 7.3 Layer B — internal stagger

The figure reveal brings the frame in; internal elements then animate in
*order of narrative importance* with a stagger. Pattern:

- Parent SVG becomes `motion.svg` with `initial="hidden" whileInView="shown"
  variants={{…}} viewport={{ once: false, margin: "0px 0px -40px 0px" }}`.
- Each sub-element becomes `motion.g` / `motion.rect` / `motion.line` with
  shared `variants={{ hidden: {…}, shown: {…} }}` + per-element `transition`
  carrying the stagger `delay`.
- Compute `delay` from the data position so the sequence reads like the
  story: left-to-right by time (`RaceTimeline`, `ActivityChart`), by node
  index (`Diagram`), or by row index (`PaybackBar`).

**SVG scale-pivots**: a `motion.g` that scales needs an explicit pivot or it
scales from `(0,0)` of the SVG and flies off:

```tsx
style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" as const }}
```

(Reference: `RaceTimelineRowSvg` event markers at
`components/mdx/CaseStudySchemas.tsx:1468`.)

### 7.4 Current per-primitive animation inventory

| Primitive       | What animates                                                      |
|-----------------|--------------------------------------------------------------------|
| `FlowSchema`    | Figure reveal + per-node `motion.g` stagger + edge `pathLength`    |
| `Diagram`       | Same as FlowSchema                                                 |
| `RaceTimeline`  | Window hatch fade → lane `pathLength` → event markers pop by `t` → marker/outcome last |
| `ActivityChart` | Bars grow from baseline (`y+h → y`, height `0 → h`), stagger by phase index |
| `PaybackBar`    | Bar widths grow `0% → N%`, stagger by row index                    |
| `WireflowMap`   | Windows fade+rise by node index → edges `pathLength` after both endpoints → callouts fade last |

If you add a new chart primitive, follow this inventory — figure reveal is
non-optional, internal stagger is the difference between "shown" and "told".

### 7.5 `prefers-reduced-motion`

`SmoothScroll` wraps the tree in `<MotionConfig reducedMotion="user">`, so
Framer strips transforms/opacity shifts when the OS has Reduce Motion on.
Do not add CSS-level animations that bypass this (e.g. raw `@keyframes` on
chart bars) — they'd ignore the user's preference.

### 7.6 Verification — the Lenis + Playwright trap

**`page.evaluate(() => window.scrollTo({behavior:"instant"}))` DOES NOT
trigger IntersectionObserver when Lenis is active.** The animations will
appear broken in Playwright but work in a real browser. To verify
replay-on-scroll:

```js
// IN Playwright, test real wheel events, NOT scrollTo:
await page.mouse.move(640, 450);
for (let i = 0; i < 20; i++) {
  await page.mouse.wheel(0, -400);   // scroll up
  await page.waitForTimeout(30);
}
// …sample element state (op/transform)…
for (let i = 0; i < 20; i++) {
  await page.mouse.wheel(0, 400);    // scroll back down
  await page.waitForTimeout(30);
}
```

Reference scripts: `/tmp/portfolio-screens/replay-test5.mjs` (wheel-based,
works), `/tmp/portfolio-screens/replay-test4.mjs` (`scrollTo`-based, false
negative — kept as a cautionary example).

Context for the Playwright context: `reducedMotion: "no-preference"` is
required or `MotionConfig` strips the animations before you can see them.

---

## 8. Pre-ship checklist

Copy-paste this to the session that ships the edit. Every box must be
checked before committing.

```
[ ] pnpm verify:numbers           → passes (every claim traced to DEVLOG)
[ ] node /tmp/dev-errors.mjs      → zero console errors across 12 routes
[ ] FlowSchema (if touched):
    [ ] both rows share viewBox width
    [ ] min(x) and max(x) honor §4.2 symmetric margin
    [ ] siblings shifted by same delta if leftmost moved
    [ ] action diamond subs ≤ 14 chars
    [ ] no decorative edge labels
    [ ] Playwright screenshot at 1512px, no clipping
    [ ] visual check at 1024px and 1280px in real browser
[ ] Chart / Diagram / Lightbox-wearing primitive (if touched):
    [ ] ExpandButton present inside a `group relative` wrapper
    [ ] Lightbox child renders body with `minWidth={0}` (not native width)
    [ ] Both inline AND lightbox versions tested at 1024/1280/1512
    [ ] Right-edge badges/labels not clipped at any of the three widths
[ ] Animation (if a new primitive or body-level `motion.*` added):
    [ ] figure wrapped in `motion.figure` with the §7.2 reveal
    [ ] internal elements use shared variants + per-element delay (§7.3)
    [ ] `viewport.once: false` (replay on every scroll)
    [ ] EASE constant used — no ad-hoc cubic-beziers
    [ ] SVG-scale pivots set via `transformOrigin` + `transformBox:"fill-box"`
    [ ] replay verified via wheel-based Playwright test (NOT `scrollTo`)
[ ] PhoneRow (if touched):
    [ ] 2 or 3 items (never 1)
    [ ] alt text describes what's on screen, not "screenshot of X"
[ ] StackRow:
    [ ] live={{…}} present if status=shipped and link exists
    [ ] dateRange uses → arrow and ISO dates
[ ] First body line is one bold sentence, outside any component
[ ] Section order matches §1 (omit, never reorder)
[ ] TechNotes closes the file
[ ] DEVLOG entry appended (Problem / Decision / Result / Lesson)
```

---

## 9. When to break these rules

Only `hrekov-dev.mdx` and `noble-saas.mdx` deviate from §1 — both are
long-form features (10 numbered sections, inline figures, deep technical
grounding). Breaking the pattern there was a documented decision, not a
reflex. If you want to deviate again:

1. Write the reason in `DEVLOG.md` first.
2. Add the new section pattern to §1 as a named variant.
3. Then edit.

If the ask is "just this one case", push back — the whole value of this
rulebook is that five case studies read as one voice.
