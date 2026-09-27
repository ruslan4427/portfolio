# Plan — Sprint 12 · Portfolio meta case study (`hrekov-dev`)

Reads with `spec.md`. WHAT/HOW is here; WHY is in spec.

---

## 1. Order of operations

```
A. Rails               (project entry + MDX file + frontmatter — no prose yet)
B. Numbers guardrail   (build-time script + wire into ship checklist)
C. Prose draft         (Claude drafts section-by-section, Ruslan reviews)
D. Artifacts           (embed the 6 locked artifacts inside MDX)
E. Cross-links         (/about#stack forward-link, Noble backlink)
F. Ship verification   (17-criterion pass; commit + push)
```

Rationale for this order:

- **A first** — get the route resolving to a valid MDX file with correct
  frontmatter shape. This unblocks incremental verification (`curl /work/hrekov-dev`
  → 200) before any prose is committed.
- **B second, before prose** — the numbers guardrail script fails the build
  if artifact numbers disagree with disk state. Wiring it before prose means
  every draft iteration gets validated as you type numbers into the MDX.
- **C third, after guardrail** — prevents rework: you write "37.5% promotion
  rate" once, and if it's wrong the script tells you at build time, not
  after ship.
- **D fourth** — artifacts embed inside MDX. They're near-mechanical (import
  the file content, paste in a code block). Doing them after prose keeps
  the story arc intact — artifacts serve the narrative, not the reverse.
- **E fifth** — cross-links are trivial edits (~3 lines total) but need
  both sides to exist before you can point them at each other.
- **F last** — full ship verification against the 17 acceptance criteria
  from spec §11 before commit.

## 2. Foundation touched — full file list

### 2.1 NEW files

```
specs/12-portfolio-meta-case-study/spec.md               (exists)
specs/12-portfolio-meta-case-study/plan.md               (this file)
specs/12-portfolio-meta-case-study/tasks.md              (next)
content/case-studies/hrekov-dev.mdx                      NEW — the case study
scripts/verify-case-study-numbers.mjs                    NEW — guardrail script
```

### 2.2 EDITED files

```
content/projects.ts                     — add 6th entry (hrekov-dev)
content/case-studies.ts                 — no schema change; verify loader
                                          handles the new slug
components/sections/AiStack.tsx         — add one-line forward-link to
                                          /work/hrekov-dev at bottom
package.json                            — add "verify:numbers" script that
                                          runs the guardrail; add to "build"
                                          hook via prebuild
```

### 2.3 UNCHANGED (verify only, no touch)

```
app/(marketing)/work/[slug]/page.tsx       — already parameterized
app/(marketing)/work/[slug]/loading.tsx    — reused
app/(marketing)/work/[slug]/not-found.tsx  — reused
app/(marketing)/work/[slug]/opengraph-image.tsx  — already parameterized
components/sections/SelectedWork.tsx       — should auto-pick new entry
                                             if featured: true
components/sections/WorkIndex.tsx          — same
components/case-study/ViewToggle.tsx       — reused, no change
components/mdx/CaseStudyBody.tsx           — reused
components/mdx/BlogComponents.tsx          — reused (Artifact, Cost, etc.)
app/sitemap.ts                              — should auto-include new slug
```

## 3. Phase A — Rails

### 3.1 `content/projects.ts` — 6th entry

Pattern-match existing entries. Locked shape (final copy in draft):

```ts
{
  slug: "hrekov-dev",
  name: "hrekov-dev — the portfolio that documents itself",
  role: "solo build · meta case study",
  year: "2026",
  status: "shipped",
  summary: "One-sentence pull — TBD in draft. Something like: 'Six sprints, sixteen memory files, one recursive proof.'",
  roleTags: ["solo", "case-study"],
  stackTags: ["Next.js 16", "Claude Opus", "memory system"],
  featured: false,   // do not surface on home <SelectedWork /> — depth click only, per spec §12
}
```

Decision: `featured: false`. Home hero stays "five case studies" per spec
§12. The meta study appears only on `/work` index (chronological/tagged),
not the home carousel.

### 3.2 `content/case-studies/hrekov-dev.mdx` — skeleton first

Ship the frontmatter + 10 empty `## Section` headings + 3-line lorem-style
placeholder per section, plus the locked `recruiterSummary` /
`supportingArtifacts` / `devlogRefs` blocks from spec §7 / §8 / §9. This
gives us:

- A working route that renders (Phase A acceptance)
- A visible skeleton to review flow before writing prose (Phase C)
- Numbers wired into frontmatter for the guardrail script to check (Phase B)

Frontmatter block (locked):

```yaml
---
title: "The portfolio that documents itself"
slug: hrekov-dev
tagline: "Six sprints, sixteen memory files, one recursive proof."
publishedAt: 2026-09-28   # target ship date; update to actual on commit
featured: false
roleTags: [solo, case-study]
stackTags: [Next.js 16, Claude Opus, memory system]
year: 2026
role: "solo build · meta case study"

recruiterSummary: |
  This portfolio ships as its own 6th case study. The other five (Noble,
  Angel, Lexora, Fieldmark, smm-factory) describe client work. This one
  describes the machine — the memory files, classifier, and promotion
  discipline — that produced all six, in the open, on the exact site you
  are reading.

  Written for fractional clients evaluating whether the workflow scales
  to their engagement. If you're screening for craft, start with Noble.
  If you're screening for how work happens, start here.

supportingArtifacts:
  - type: commit
    label: "Sprint 11 — L2/L3 apparatus this case study uses"
    href: "https://github.com/ruslan4427/portfolio/commit/bfe7fd7"
  - type: commit
    label: "Sprint 7 — visual system this case study lives inside"
    href: "https://github.com/ruslan4427/portfolio/commit/7cd977e"
  - type: link
    label: "Full repo — every memory file, DEVLOG entry, spec on disk"
    href: "https://github.com/ruslan4427/portfolio"
  - type: cost
    label: "DEVLOG → STABLE_LOGIC promotion rate"
    detail: "9 rules graduated from 24 journal entries · 37.5%"
  - type: timeline
    label: "Cadence to date"
    detail: "11 sprints across 7 calendar days · ~1.5 sprints/day"
  - type: timeline
    label: "Ramp-up saved per new session"
    detail: "~26 min · 13 memory files × ~2 min context re-hydration each"

devlogRefs:
  - date: 2026-09-24
    entry: "Font pivot — Playfair upright + DotGrid hover-gate"
    summary: "One decision, three memory files created (font, canvas, gate). Later sessions never re-litigated."
  - date: 2026-09-25
    entry: "Sprint 9 — single-page → multi-page IA"
    summary: "Spec triple caught the routing-boundary decision before the first component moved."
  - date: 2026-09-26
    entry: "Sprint 11 — proxy.ts rename + EU consent + MDX slug rule"
    summary: "Next.js 16 broke on middleware.ts; the memory of that break kept future sessions off the old name."
  - date: 2026-09-27
    entry: "CSS @layer cascade — feedback memory"
    summary: "One debug hour became one memory file. Every Tailwind-on-anchor question since has been a one-turn answer."
---
```

(All 4 devlogRefs above are working titles — cross-check against actual
DEVLOG headings in tasks A2. If a DEVLOG heading doesn't match, either
adjust the DEVLOG heading, adjust the ref, or drop the ref.)

## 4. Phase B — Numbers guardrail

### 4.1 `scripts/verify-case-study-numbers.mjs`

Node script (no deps beyond `node:fs`, `node:child_process`). Read
`content/case-studies/hrekov-dev.mdx` frontmatter, extract expected
numbers, compare with disk truth. Exit 1 if mismatch.

Numbers to check (all from spec §8 `supportingArtifacts.detail`):

| MDX claim | Source of truth | Check |
|---|---|---|
| "9 rules ... from 24 journal entries · 37.5%" | `grep -c '^## ' STABLE_LOGIC.md` / `grep -c '^## ' DEVLOG.md` | Numerator + denominator + ratio match |
| "11 sprints across 7 calendar days" | git log for "sprint" markers; span between first + last commit | Sprint count from commit messages; days diff |
| "13 memory files × ~2 min ... ~26 min" | `ls memory/*.md | wc -l` minus MEMORY.md itself | File count matches; ~26 = 13×2 arithmetic check |

Script structure:

```js
// scripts/verify-case-study-numbers.mjs
import { readFileSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";

const MDX = "content/case-studies/hrekov-dev.mdx";
const source = readFileSync(MDX, "utf8");
const [_, fm] = source.match(/^---\n([\s\S]*?)\n---/);

// (parse fm as YAML — use a minimal regex since we only need
// artifact.detail strings; avoid pulling in a YAML dep)

const disk = {
  devlog: countHeadings("DEVLOG.md"),
  stable: countHeadings("STABLE_LOGIC.md"),
  memory: readdirSync("<HOME>/.claude/projects/-Users-ruslan-portfolio/memory/")
    .filter(f => f.endsWith(".md") && f !== "MEMORY.md").length,
  sprints: countSprintCommits(),
  daysSpan: daysBetweenFirstAndLastCommit(),
};

const claims = extractClaimsFromDetails(fm);
const mismatches = compare(claims, disk);

if (mismatches.length) {
  console.error("Number mismatch in", MDX);
  mismatches.forEach(m => console.error("  ", m));
  process.exit(1);
}
console.log("OK — case study numbers match disk state.");
```

Memory folder path is outside the repo (`~/.claude/projects/...`). Script
resolves it via `os.homedir()`. If the folder doesn't exist on the
build machine (Vercel), the script logs a warning and skips memory
checks — do not fail deploy on absence of a local dev artifact.

### 4.2 `package.json` — wire into build

```json
{
  "scripts": {
    "verify:numbers": "node scripts/verify-case-study-numbers.mjs",
    "prebuild": "npm run verify:numbers",
    ...existing
  }
}
```

`prebuild` runs before every `npm run build`, including on Vercel.
Failure blocks deploy.

## 5. Phase C — Prose draft

**Split of labor (per memory `portfolio_content_strategy.md`):**
Ruslan drafts, Claude edits — for blog posts. For this case study,
**invert**: Claude drafts (I have the discovery context loaded), Ruslan
edits. Rationale: this case study is *about* the machine Claude is part
of, so a first draft from Claude carries authentic register. Ruslan
adjusts voice + kills over-claiming.

**Iteration loop:**
1. Claude drafts section N (one at a time, ~150-250 words per section).
2. `open content/case-studies/hrekov-dev.mdx` — Ruslan reads.
3. Ruslan approves, redlines, or asks for a different angle.
4. Move to N+1.

**Do not** draft all 10 sections before review. Ship-blocking risk if
section 1 lands wrong and 2-10 build on it.

**Order of drafting** (not the same as reading order):
- §1 Cold open (sets voice — get this right first)
- §3 Persistence layer (hero, drives everything else)
- §7 What the machine produced (numbers section, ties to guardrail)
- §5 Discipline that produces memory (bridges to /about#stack)
- §6 Promotion rate (contrast with §7)
- §2, §4, §8, §9, §10 (support sections, drafted in flow)

## 6. Phase D — Artifacts embed

### 6.1 §6.1 hero — memory directory listing

Approach: code block, `text` lang, no shell prompt, no ANSI. Sourced
from `ls -1 memory/*.md | sort` at draft time. Update at ship if the
folder has changed.

### 6.2 §6.2 anatomy — `feedback_css_cascade_first.md`

Approach: read file verbatim, embed in fenced ```markdown code block.
Sanity-check at ship: the embedded content matches disk content byte-for-
byte (spec §11.11).

### 6.3 §6.3 MEMORY.md snippet

First 10 lines. Fenced ```markdown block. Same disk-match check.

### 6.4 §6.4 DEVLOG → STABLE_LOGIC diff

Approach: side-by-side blockquotes (not `<Diff>` MDX shell — read-flow
better as prose). Ruslan picks the specific pair during Phase C drafting.

### 6.5 §6.5 sprint cadence stat strip

Numeric-only initial ship (deferred SVG per spec §12). Three stat blocks
side-by-side, mono type, hairline borders. Inline JSX inside MDX or a
minimal `<StatStrip>` shell — inline JSX preferred (no new component).

### 6.6 §6.6 auto-memory excerpt

`<TechnicalDetail>` block. Content: ~30 lines from Claude Code's
auto-memory instructions (types + when to save). Clearly attributed:
"Excerpt from Claude Code's system-embedded auto-memory spec — not
authored by Ruslan, reproduced for context."

## 7. Phase E — Cross-links

### 7.1 `components/sections/AiStack.tsx` — forward link

After the 3-column stack grid, add one small `<Reveal>` block:

```tsx
<Reveal delay={0.2}>
  <p className="mt-8 text-center text-sm text-[color:var(--ink-muted)]">
    See{" "}
    <Link
      href="/work/hrekov-dev"
      className="underline underline-offset-2 hover:text-[color:var(--ink-primary)]"
    >
      the portfolio meta case study
    </Link>
    {" "}for how routing decisions get made in practice.
  </p>
</Reveal>
```

### 7.2 Inside `hrekov-dev.mdx` — backward links

- §5 body links to `/about#stack` inline: "see the model routing rules on
  the [About page's stack section](/about#stack)."
- §7 opening links to Noble: "the other five case studies ([Noble is the
  flagship](/work/noble-saas)) describe client work."

## 8. Phase F — Ship verification (17-crit walkthrough)

Before commit, verify each spec §11 criterion. Group into runnable batches:

**Batch 1 — automated (single script):**
- #1 `/work/hrekov-dev` returns 200 (curl)
- #7 `Article` JSON-LD parses (grep + JSON.parse)
- #8 OG image generates (curl `/work/hrekov-dev/opengraph-image` → 200)
- #9 numbers script passes (npm run verify:numbers)
- #12 reading time computed (grep frontmatter)
- #15 tsc + build pass (npx tsc --noEmit && npm run build)
- #17 sitemap contains `/work/hrekov-dev` (curl + grep)

**Batch 2 — manual browser (Playwright or eyes):**
- #2 toggle switches, TechnicalDetail flips, artifacts expand
- #3 recruiterSummary renders in both views
- #4 all 6 artifacts render with correct type-treatment
- #5 ≥4 devlogRefs render (expanded in Technical, collapsed in Executive)
- #6 6th project card on /work index; NOT on home (featured: false)
- #10 cross-links resolve (/about#stack, /work/noble-saas)
- #11 verbatim-check on embedded files (diff embedded vs disk)
- #13 a11y (existing toggle a11y-tested; no new components)
- #14 reduce-motion (no new animations)
- #16 no visual regression on other 5 case studies + top-level routes

**Batch 3 — post-ship (production only):**
- Verify Vercel deploy passed (prebuild guardrail didn't fail)
- Curl `https://hrekov.dev/work/hrekov-dev` → 200
- OG image resolvable
- GA4 sees pageview event for new slug

## 9. What could stall — mitigations

- **Ruslan unavailable for section reviews.** Fall back: draft all
  sections in one go, mark each as "AWAITING REVIEW", ship as an
  MDX with a "DRAFT" banner (CSS on frontmatter `draft: true`).
  Iterate live. Not preferred — the banner is a public "unfinished" tell.
- **Guardrail script false positive.** If numbers are semantically right
  but formatted differently ("37.5%" vs "37,5%" vs "3/8"), the script
  should normalize before compare. Handled in the regex extractor.
- **Memory folder unreadable on Vercel.** Handled in script — logs and
  skips memory checks. Acceptable — the check catches drift, not truth.
- **DEVLOG heading text doesn't match devlogRefs.entry.** Fix at draft
  time by grepping DEVLOG.md for each `entry` string; adjust either side
  until matched.
- **Case study reads self-important.** Ruslan is the final arbiter.
  Draft with cold-open disarming (§5 §1); if it still reads wrong after
  review, cut a section. Better to ship 800 words that land than 1800
  that don't.

## 10. Reference

- `spec.md` (this dir) — authoritative source for scope, positioning,
  narrative, artifacts, criteria
- `specs/11-blog-foundation/plan.md` — pattern reference for phase
  structure
- `content/case-studies/noble-saas.mdx` — closest existing draft in shape
- `CLAUDE.md` — ShipLoop protocol, source for §5 body of the case study
- `DEVLOG.md`, `STABLE_LOGIC.md` — sources for §6 promotion example
