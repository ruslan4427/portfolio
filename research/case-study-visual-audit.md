# Case study visual audit — 2026-09-29

Research doc, not a spec. Recommendations require sign-off before implementation.

**Sources:** 6 case study MDX files, `components/mdx/`, `app/globals.css` tokens, ui-ux-pro `references/trends.md` (refreshed 2026-09-20), `research/style-guide.md`.

---

## TL;DR

The site's 6 case studies are 90% prose, ~10% visual anchors. The MDX visual primitives **already exist** (`Artifact`, `Cost`, `PromptLog`, `Diff`, `TechnicalDetail`) but appear **only in YAML frontmatter** — never in body prose. `hrekov-dev.mdx` is the single exception (custom metric grid, embedded video, one `TechnicalDetail`).

**Biggest leverage:** activate the existing primitives across all 6 studies before building new components. Top-3 quick wins take ~9h total and lift every study without a design system change.

**Trend fit:** the site's foundation (Playfair serif display, Inter body, monochrome + single accent, `clamp()` type, `prefers-reduced-motion`, scroll reveals, skeletons) already tracks 2026 editorial best practice. The gap is at the case-study-body layer, not at the site chrome layer.

---

## Current state matrix

| Study | Words | Sections | Custom MDX in body | Metric grid | Video/image | Numeric claims | Density |
|---|---|---|---|---|---|---|---|
| noble-saas | 3,600 | 9 | 0 | no | none | 18+ | medium |
| angel | 1,300 | 8 | 0 | no | none | 3–5 | **sparse** |
| lexora | 2,000 | 8 | 0 | no | none | 5+ | medium |
| fieldmark | 1,700 | 8 | 0 | no | none | 5+ | medium |
| smm-factory | 2,200 | 8 | 0 | no | none | 5+ | medium |
| hrekov-dev | 4,300 | 10 | 1× TechnicalDetail | 1 custom div | 1 video (2026-09-29) | 18+ | **dense** |

**Reading:** Noble and hrekov-dev carry the numeric weight the site's "receipts-first" ethos promises. Angel is close to a placeholder — 3 verifiable claims across 1,300 words is below the bar set by the style guide.

---

## What 2026 portfolios do (relevant only)

From `trends.md` (fresh):

| Trend | hrekov.dev status | Case-study relevance |
|---|---|---|
| Bento grids (asymmetric card layouts) | Not used in case studies | **High** — for Results/Metrics sections |
| One saturated accent on neutral palette | Present (green available dot) | Reinforce: functional-only, don't spread accent to case bodies |
| Confident serif revival | Present (Playfair) | Already applied in h2/h3 |
| Scroll-triggered reveals | Present (FadeUp) | Could apply to `<MetricGrid>` reveals inside case bodies |
| Transparent AI disclosure | Semi-present (bio + meta case study) | **High** — every case study should surface AI-collab visibly, not narratively |
| Skeleton loaders | Present (loading.tsx per route) | Already applied |
| Prefers-reduced-motion respected | Present | Non-negotiable — maintain |

**Fading (avoid):** heavy neumorphism, autoplay carousels, jelly-bounce hover, AI chat widgets, feature-heavy chrome. None currently present on the site.

---

## Gap inventory

### A. Existing primitives, underused in prose

| Primitive | Uses in body prose | Ideal placement |
|---|---|---|
| `<Artifact>` | 0 (only in frontmatter `supportingArtifacts`) | Inline in Results, Prompt Architecture sections when citing a commit/PR/prompt mid-sentence |
| `<Cost>` | 0 | Inline in Trade-Offs (unit economics), Results (cost breakdown) |
| `<PromptLog>` | 0 | Prompt Architecture sections (Noble, Angel, Lexora, Fieldmark, smm-factory all have decision-gate rules ripe for this) |
| `<Diff>` | 0 | Iteration Moment sections (Noble, Angel, Lexora, Fieldmark, smm-factory all narrate before/after but never render side-by-side) |
| `<TechnicalDetail>` | 1 (hrekov-dev only) | Any technical deep-dive that would break executive skim rhythm |

### B. Missing primitives (candidates to build)

Ordered by leverage per hour:

1. **`<MetricGrid>`** — 3–4 numbers with labels in a bento-style row/grid. Currently one-off custom div at `hrekov-dev.mdx:321-334`. Extract to primitive. Every Results section benefits.
2. **`<Figure>` + `<VideoFigure>`** — image / video with caption. Currently `figcaption` ad-hoc in `hrekov-dev.mdx:75-87`. Extract to primitive so future embeds don't fork the pattern.
3. **`<BeforeAfter>`** — visual (image) before/after tiles. Distinct from `<Diff>` which is code-only. Useful for screenshots of Iteration Moments.
4. **`<Timeline>`** — horizontal sprint/commit-frequency strip. Useful for Angel (4 sprints), hrekov-dev (12 sprints × 8 days), Noble (10-day 151-commit burst).
5. **`<PipelineFlow>`** — visualized decision stages (boxes + arrows or numbered pills). Angel's 5-stage pipeline, Fieldmark's 4-stage gate, smm-factory's 8-agent tree all narrate but never render.
6. **`<CalloutBox>`** — highlighted insight card. `blockquote` currently italic-styled; a non-italic variant would fit "Rule: X. Why: Y." patterns better.

### C. Patterns entirely absent across all 6

- Before/after image tiles (screenshots)
- Timeline / sprint viz
- Architecture diagram (SVG or mermaid)
- Embedded prototype iframe (running demo, Figma embed, code sandbox)
- Comparison table (Product A vs B vs C beyond generic markdown table)
- Progress bar / benchmark bar
- Model stratification diagram (Opus/Sonnet/Haiku routing — surfaces in bio and smm-factory, never visualized)

---

## Prioritized proposals

Each proposal: **What · Where · Why · Effort**.

### Phase 1 — Activate existing primitives (9h total, highest ROI)

**P1.1 — Wire `<Diff>` into Iteration Moment / Trade-Offs sections**
- Where: Noble §5, Angel §5, Lexora §5, Fieldmark §5, smm-factory §5, hrekov-dev §6
- Why: Every study narrates a "before X → after Y" moment. Rendering as side-by-side makes it scannable in <3 seconds. Currently invisible in 6-second recruiter scan.
- Effort: ~30 min per study × 6 = **3h**

**P1.2 — Wire `<PromptLog>` into Prompt Architecture sections**
- Where: Noble §4 (STABLE_LOGIC.md excerpt), Angel §4 (5-stage pipeline), Lexora §4 (spec-first family), Fieldmark §4 (4-stage gate), smm-factory §4 (knowledge/ rules), hrekov-dev §5 (feedback rules)
- Why: The dense prose in Noble's §4 (269 words in one paragraph) is exactly what `<PromptLog>` collapse-expand solves. Recruiters skim; engineers who care can expand.
- Effort: ~30 min per study × 6 = **3h**

**P1.3 — Wire inline `<Artifact>` and `<Cost>` in Results sections**
- Where: All 6 Results sections
- Why: Frontmatter artifacts appear in the sidebar; inline artifacts in flowing prose make claims tactile. "227 commits <Artifact type=commit href=... label=6b29244 />" reads harder than "227 commits (hash: 6b29244)".
- Effort: ~15 min per study × 6 = **1.5h**

**P1.4 — Extract `hrekov-dev.mdx:321-334` custom metric grid to `<MetricGrid>` primitive**
- Where: `components/mdx/BlogComponents.tsx` — add `<MetricGrid columns={3|4} items=[{value, label}] />`
- Why: This is the single most-visible visual in all 6 case studies. Making it a primitive unlocks 6× reuse.
- Effort: **1.5h** (build + apply to hrekov-dev as reference)

### Phase 2 — Add missing high-leverage primitives (6-8h)

**P2.1 — `<Figure>` + `<VideoFigure>` primitives**
- Why: Standardize image/video captions. Currently ad-hoc `<figure className="not-prose">` blocks. A primitive enforces consistent typography and takes `caption`, `credit`, `href` props.
- Effort: **1h** build, **0h** apply (already used ad-hoc)

**P2.2 — `<Timeline>` primitive**
- Why: Sprint durations and commit-frequency bursts are core to the "shipped fast" claim but currently only appear as numbers-in-sentences. A horizontal timeline strip renders the intensity visually.
- Effort: **2h** build, **30 min per apply** × 3 studies (Noble, Angel, hrekov-dev)

**P2.3 — `<BeforeAfter>` primitive (image variant of `<Diff>`)**
- Why: Iteration Moments in Lexora (Gemini migration), smm-factory (WebM → screenshot-per-frame) would land harder as visual tiles than as prose.
- Effort: **1.5h** build. Application blocked on us having actual before/after screenshots — do only when assets exist.

### Phase 3 — Per-study specific improvements

| Study | Specific weakness | Recommended fix |
|---|---|---|
| Noble | §4 269-word Prompt Architecture paragraph | Split with `<PromptLog>` (P1.2) + one `<MetricGrid>` at §7 Results |
| Angel | Ultra-sparse; 3 numeric claims across 1,300 words | Add `<MetricGrid>` at §7 + `<PipelineFlow>` for the 5-stage pipeline; consider whether this study is publishable as-is or needs content pass |
| Lexora | Trade-offs read as checklist; error code 9999999 unexplained | `<Diff>` for Silent MP3 vs SilenceAudioSource; inline explainer for 9999999 |
| Fieldmark | Iteration Moment (Build 20 rejection) is strongest section but only 6 lines | Expand to a `<PromptLog>` with the actual rejection email as the "prompt"; `<Timeline>` for 7-day sprint |
| smm-factory | 21-min rewind vivid but buried; Opus/Sonnet/Haiku routing not visualized | `<CalloutBox>` for the 21-min moment; `<PipelineFlow>` for 8-agent architecture |
| hrekov-dev | Sections 3–5 are three 400+ word text blocks | Break §4 (17-file MEMORY.md list) into card grid; §5 as `<PromptLog>` per rule |

### Phase 4 — Speculative / bigger swings (only if Phase 1–3 land well)

- **Embedded case-study video hero per study** — using the HeyGen Podcast template pattern from `hrekov-dev`, generate a 20-30s "meta intro" for each case study (~30 credits × 5 = 150 credits, ~$5 total). Places a video anchor at the top of each `/work/[slug]` page.
- **Prototype iframe embeds** — for Noble (running SaaS if we have a demo instance), Lexora (App Store link + screenshot carousel).
- **Live GitHub commit-graph visualization** — pull commit frequency data from the case-study repos and render as inline SVG.

---

## Recommended sequence

If we ship this in order, each step reads as complete work even if the next never happens:

1. **P1.4** — build `<MetricGrid>` primitive (1.5h). One new component, one existing div refactored. Ship-ready.
2. **P1.1** — activate `<Diff>` in Iteration Moment sections across all 6 studies (3h). All-existing-primitives, high visibility.
3. **P1.2** — activate `<PromptLog>` in Prompt Architecture sections (3h). Fixes Noble §4 density problem directly.
4. **P1.3** — inline `<Artifact>` + `<Cost>` in Results sections (1.5h). Tactile receipts.
5. **P2.1** — `<Figure>` + `<VideoFigure>` primitive (1h). Retrofits hrekov-dev's ad-hoc pattern.
6. **P3** — per-study specific improvements as bandwidth allows.
7. **P4** — only after Phase 1–3.

**Total Phase 1:** ~9h. Every case study lifts. No new design system risk.

---

## What this doc does NOT recommend

- Redesigning the case study L2/L3 executive/technical view toggle — that shipped in Sprint 11 and works.
- Introducing a second accent color (2026 trend explicitly warns against this — one saturated accent).
- Reintroducing `three`/gsap/WebGL — Sprint 7 pivot is durable, no evidence it needs revisiting.
- Adding motion beyond scroll reveals — current motion contract in `CLAUDE.md` is on-trend and honored.
- Third font family — Playfair + Inter matches 2026 "confident serif revival + geometric-sans body" best-practice.

---

## Open questions before implementation

1. Do we have real before/after screenshots for Iteration Moments? (Answer determines P2.3 feasibility.)
2. Do the case-study repos have public commit-graph data we can pull for Phase 4? (Answer determines whether commit-frequency viz is viable.)
3. Is Angel publishable in its current sparse state, or should it get a content pass first before applying visual primitives to it? (Content problem vs visual problem.)
4. Should `<MetricGrid>` support optional icons per cell, or stay text-only? (Icon adds visual weight but risks looking dashboard-y.)
