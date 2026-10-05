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
| `Diagram`          | Single BPMN diagram without row scaffolding              |
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

---

## 6. Pre-ship checklist

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

## 7. When to break these rules

Only `hrekov-dev.mdx` and `noble-saas.mdx` deviate from §1 — both are
long-form features (10 numbered sections, inline figures, deep technical
grounding). Breaking the pattern there was a documented decision, not a
reflex. If you want to deviate again:

1. Write the reason in `DEVLOG.md` first.
2. Add the new section pattern to §1 as a named variant.
3. Then edit.

If the ask is "just this one case", push back — the whole value of this
rulebook is that five case studies read as one voice.
