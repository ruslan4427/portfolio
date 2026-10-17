# Plan — Sprint 16

## Architecture

### Data model

**Case-study frontmatter extension** (`content/case-studies.ts`):

```ts
export type Phase = {
  name: string;          // "Discovery" | "Build" | "QA" | "Ship" | custom
  from: string;          // "2026-09-14"
  to: string;            // "2026-09-19"
};

export type TokenScorecard = {
  // ...existing fields unchanged...
  phases?: Phase[];      // NEW — optional; absent => no BuildTimeline
};
```

**Scorecard JSON extension** (`scorecard.json`):

```json
{
  "projects": [{
    "slug": "...",
    "metrics": { /* unchanged */ },
    "context": { /* unchanged */ },
    "daily": [
      { "date": "2026-09-14", "tokens": 450000, "commits": 8 },
      { "date": "2026-09-15", "tokens": 320000, "commits": 4 }
    ]  // or null if no session data
  }]
}
```

Both additions are **nullable and additive**. Snapshot shape-check CI needs a one-line update to tolerate the new keys.

### Components

```
components/
  tools/
    ScorecardTable.tsx          [REMOVE from /tools, keep file in case we bring back later]
    ScorecardMethodology.tsx    [REMOVE from /tools]
    ToolsBuilt.tsx              [NEW — array of ToolCard]
    ToolCard.tsx                [NEW — one tool, with EffectivenessBlock]
    EffectivenessBlock.tsx      [NEW — why + impact table]
  case-study/
    TokenScorecardAside.tsx     [KEEP, reposition at page level, maybe rename to TokenScorecardHero]
    BuildTimeline.tsx           [NEW — phases + daily density]
    AgentReplay.tsx             [NEW — SVG + state machine]
    AgentReplay/
      types.ts                  [AgentNode, AgentEdge, ReplayStep]
      smm-factory.ts            [data: 4 agents, 4 steps]
```

### Page composition

`app/(marketing)/tools/page.tsx`:
```tsx
<ToolsBuilt tools={[claudeShiploop, uiUxPro]} />
```

`app/(marketing)/work/[slug]/page.tsx` (new order):
```tsx
<article>
  <ArticleHeader />
  <TokenScorecardHero scorecard={...} />      {/* moved from aside */}
  <BuildTimeline phases={...} daily={...} />  {/* if phases && daily */}
  <CaseStudyBody>
    ...MDX content...
    <AgentReplay data={smmFactoryReplay} />   {/* smm-factory only */}
  </CaseStudyBody>
</article>
```

## Phase ordering

| # | Phase | Depends on | Est |
|---|---|---|---|
| 1 | Scorecard parser: emit `daily[]` + regenerate | — | 0.5d |
| 2 | Frontmatter: add `phases?`, update loader + validator | — | 0.5d |
| 3 | ui-ux-pro OSS: rename + strip + README + publish | — | 1d |
| 4 | `TokenScorecardHero` (reposition + resize existing aside) | — | 0.5d |
| 5 | `BuildTimeline` component + annotate 4 case studies | 1, 2 | 2d |
| 6 | `AgentReplay` component + smm-factory data | — | 3-5d |
| 7 | `/tools` rewrite — `ToolsBuilt` + `EffectivenessBlock` | 3 | 1d |
| 8 | QA pass + a11y verification | all above | 0.5d |
| 9 | DEVLOG + MEMORY update + ship | all above | 0.25d |

Phases 1-6 can run partially in parallel; phase 7 depends on phase 3 for the ui-ux-pro link.

**Est total: ~1-1.5 weeks** (compressed, assuming no architectural surprises on AgentReplay).

## Technical decisions

### `BuildTimeline` rendering strategy

- **SVG, not canvas.** Static once rendered; accessibility (role=img, aria-label with phase summary); fewer moving parts than cursor-reactive DotGrid.
- **X-axis = date range** spanning `min(phases[].from)` to `max(phases[].to)`.
- **Row 1: phase bands** as horizontal rectangles with ink-ramp fills (`--ink-primary` → `--ink-body` → `--ink-muted`) — reusing existing ramp. Phase name labels above each band.
- **Row 2: daily density** as thin vertical bars; height = tokens that day (normalized to tallest day = fixed max-height). Hover: tooltip with `{date, tokens, commits}`.
- Mobile: same component, smaller font + no hover tooltips (touch gives no hover state).

### `AgentReplay` rendering strategy

- **SVG nodes** positioned manually per flow (not auto-layout — 4-5 nodes, hand-tuned reads better than dagre output).
- **Agent data file** (`AgentReplay/smm-factory.ts`) declares nodes, edges, and steps separately. Steps reference edges by id.
- **State**: `const [stepIndex, setStepIndex] = useState(0)`. Keyboard listener (arrow keys). `prefers-reduced-motion` disables Framer transitions; static highlight still applied.
- **Side panel**: shows active step's `payload` prop (short string or JSX). "What agent A sent to agent B."
- **Reset / Step → / Step ←** as `<CTAButton size="sm" variant="outline">`.

### `verify:numbers` adjustments

- No new counts in copy from this sprint by default.
- If any `BuildTimeline` summary line like "{N} days from spec to ship" lands in copy, add it to the verifier.
- ui-ux-pro README metrics must be hand-authored and NOT numeric claims we can't verify. "Null is honest" extends to OSS README.

### Parser change rollout (vendored-vs-canonical)

Per Sprint 15 STABLE_LOGIC:
1. Edit `~/shiploop-publish/lib/parse-tokens.ts` (canonical).
2. Add tests at `~/shiploop-publish/test/`.
3. Commit + push shiploop-publish repo.
4. Sync vendored copy: `scripts/scorecard-src/parse-tokens.ts` ← canonical.
5. Regenerate `scorecard.json` via `pnpm scorecard:generate` (or whatever the make target is).
6. Commit portfolio with regenerated JSON + synced vendored copy. One commit, atomic.
7. Snapshot shape-check CI will accept the new key (one-line schema allow-list update).

## Risks

- **AgentReplay scope creep.** Reader may want to inspect the actual prompts, not just the dispatch flow. Hold the line: this sprint ships the flow visualizer, not a prompt browser. If prompts belong anywhere, that's a Sprint 17 call.
- **Phase annotation drift.** If the author updates MDX dates without updating `phases[].from/to`, the BuildTimeline will mislead. Mitigation: a validator pass that checks `phases` dates fall within git-log date range for the case study path.
- **ui-ux-pro rename losing GitHub stars/history.** Low risk — repo is private so no public history to lose.
- **Scorecard parser `daily[]` emit on legacy sessions.** Session JSONL files may not have reliable per-day attribution if sessions span midnight UTC. Mitigation: bucket by local date (America/Kyiv) with a comment explaining the choice; validate on a known case (claude-shiploop) before trusting output on others.
- **Smm-factory agent data accuracy.** The 4-agent architecture needs to be documented in the case study MDX as source of truth; AgentReplay data file imports/mirrors from there. If MDX gets edited and data file doesn't, drift. Mitigation: add a cross-reference comment in both files; consider linting if drift becomes a real pattern.

## Rollback

- `scorecard.json` schema is additive — rolling back the parser just drops the `daily[]` key. Portfolio build tolerates missing key.
- `TokenScorecardHero` is a reposition of existing data; rollback = revert the layout change.
- `BuildTimeline` + `AgentReplay` can be disabled per-case-study by removing frontmatter `phases` field / removing MDX `<AgentReplay>` call.
- `/tools` rewrite is a page-level change; rollback = restore `ScorecardTable` + `ScorecardMethodology` imports.

## Shiploop checkpoints

- After phase 1-2: `memory/sprint-16-iteration-1.md` (data layer locked).
- After phase 5: `memory/sprint-16-iteration-2.md` (BuildTimeline validated on 4 cases).
- After phase 6: `memory/sprint-16-iteration-3.md` (AgentReplay smm-factory pilot).
- After phase 9 ship: `memory/iteration-16.md` + STABLE_LOGIC entries for any crystallized patterns.
