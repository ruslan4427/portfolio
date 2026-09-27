# Spec — Sprint 12 · Portfolio meta case study (`hrekov-dev`)

**Class.** L (new case study MDX + new project entry + new /about ↔ /work cross-links; > 3 files, > 1h)
**Date.** 2026-09-27
**Owner.** Ruslan (content decisions, artifact approval), Claude Opus (drafting, plumbing)
**Depends on.** Sprint 11 (case-study L2/L3 apparatus + Executive/Technical toggle) — already shipped
**Blocks.** #75 (AI video pilot — narrates this case study as episode 1)

---

## 1. Why this exists

The portfolio ships with 5 case studies (Noble, Angel, Lexora, Fieldmark, smm-factory)
— each a client-adjacent product with a real user problem. That set answers
"can you ship?" but leaves a specific question open: **how do you decide what
Claude does on any given turn, and how does that decision survive across
sessions?**

Most AI-workflow content in 2026 lives at one of two extremes: (1) marketing
demos ("look at this one-shot output") or (2) tool documentation ("here's how
`--model` flag works"). Neither describes the discipline layer between them —
the memory files, the classifier, the promotion rate from journal to rule.
That layer is our real differentiator, and the fractional client / peer
reader wants to see it before signing.

**A 6th case study, about this portfolio itself, answers this — with the
site the reader is already on as the artifact.** No client to protect, no NDA
to redact, full source visible on GitHub. The "self-obsession" risk (§13.1)
is real but manageable if the case study is scoped as a *system demo*, not a
brag reel.

Sprint 11 shipped the L2/L3 apparatus (recruiter summary + supporting
artifacts + DEVLOG refs + Executive/Technical toggle). This sprint uses that
apparatus at its intended depth for the first time — the meta case study
becomes the reference implementation.

## 2. What must stay the same

Visual + tech system locked (Sprint 7 + Sprint 11):

- Playfair Display display type, Inter body
- `#F5F4EF` paper, ink `#111`, monochrome + green availability dot only
- `<DotGrid />` ambient, `FadeUp` / `MaskReveal` reveals
- Case study page shell (`/work/[slug]/page.tsx`) — do not touch
- `CaseStudyFrontmatter` type + `recruiterSummary` / `supportingArtifacts` /
  `devlogRefs` fields — do not extend the schema in this sprint
- Executive/Technical toggle behavior — do not modify
- MDX components (`Artifact`, `Cost`, `PromptLog`, `Diff`, `TechnicalDetail`)
  — reuse; do not add new ones

If the meta case study needs a component that does not exist, **write it
into the case study MDX inline** (as JSX allowed in MDX) or defer to a
future sprint. This sprint ships content on existing rails.

## 3. Positioning (locked in discovery)

- **Primary audience.** Fractional client — someone deciding whether to hire
  a solo builder for a 2–4 month engagement. They want to see the machine
  that would run their project, before they hand over money.
- **Secondary audience.** Peer practitioner / engineering manager — reads
  for craft, may steal the taxonomy or repost.
- **Explicitly not for.** Cold recruiter first-touch. Recruiters open Noble
  / Angel / Lexora first (client-shaped case studies with named domains).
  The meta study is a *depth* click — the fifth thing they read, not the
  first.

The Executive view (recruiter-facing) exists as a courtesy — a two-paragraph
`recruiterSummary` names the machine and points to the other five. The
Technical view is where this case study lives.

## 4. Narrative — memory system as hero (locked in discovery)

Four candidate story spines were considered (ShipLoop protocol / memory
system / spec-first discipline / model routing). Chosen: **memory system**.

Rationale (short):
- Everyone talks about context windows. Almost nobody talks about the
  persistence layer that makes multi-session projects work.
- Visually strongest — `ls memory/` is instant proof.
- "ShipLoop" is our internal brand; "memory files" is the artifact.

The other three spines are **supporting cast, not co-protagonists**:
- ShipLoop protocol = the classifier that populates memory
- Spec-first discipline = what memory encodes about *how* we work
- Model routing = downstream consequence, already fully covered on
  `/about#stack`

## 5. Case study body — section skeleton

MDX body renders in `/work/hrekov-dev/`. Working title: **"The portfolio
that documents itself."** Final title may change in plan.

Approximate section flow (final wording in draft; not locked here):

1. **Cold open** (~1 paragraph) — names the meta angle up front and disarms
   the self-obsession read. Something like: *"You're reading a case study
   about the site you're on. Below is the machinery — the memory files, the
   classifier, the promotion rate — that shipped it in 7 calendar days and
   will keep shipping the next 100."*
2. **The stateless-model problem** (~2 paragraphs) — one-shot demos vs
   multi-session products. Where Claude forgets. What every real project
   ends up building around it.
3. **The persistence layer** (~3-4 paragraphs + Artifact block) —
   `memory/` directory anatomy. Types (user / feedback / project /
   reference). Frontmatter schema. Show `feedback_css_cascade_first.md` as
   the featured example (Q3 A locked).
4. **The MEMORY.md index** (~2 paragraphs + Artifact block) — the pointer
   file that lets Claude scan 16 files in one Read. Format explained.
5. **The discipline that produces memory** (~2 paragraphs) — ShipLoop
   classifier (Q/B/S/L/R/T/D/M/O). One-sentence lifecycle. Cross-link to
   `/about#stack` for model routing, NOT explained here.
6. **DEVLOG → STABLE_LOGIC — the 37.5% number** (~3 paragraphs + Cost or
   Timeline block for the ratio) — journaling vs learning. Why most
   "lessons" are noise. What earns promotion. Show one graduated rule as
   example.
7. **What the machine produced** (~2 paragraphs + stat strip) — 11 sprints
   in 7 days, ~1.5 sprints/day cadence, 60+ classified tasks, 8 git
   commits, 3480 insertions on Sprint 11 alone. Framed as "the discipline
   accelerates; it does not slow."
8. **Context re-hydration saved per session** (~2 paragraphs) — the
   qualitative list from discovery Q3 (5 concrete questions memory
   answered pre-emptively). "≈26 min ramp-up saved" as soft claim, not
   hero-number.
9. **How to steal it** (~2-3 paragraphs) — the memory taxonomy + frontmatter
   format + `MEMORY.md` index pattern are generalizable. Link to the
   auto-memory spec that ships with Claude Code. Invitation to fork the
   pattern, not the specific files.
10. **The recursive close** (~1 paragraph) — you're browsing the artifact.
    The DotGrid canvas breathing at the edge of the page? Sprint 7. The
    Playfair headline? Sprint 9. The consent banner if you're in the EU?
    Sprint 11. Every visible surface has a memory file behind it and a
    DEVLOG entry crystallizing why.

Approximate total length: **1200–1800 words**. Same order of magnitude as
Noble draft. Not longer — the artifacts do the heavy lifting.

`<TechnicalDetail>` blocks (collapsed in Executive view) can host:
- Raw frontmatter of a memory file (unformatted YAML)
- The full ShipLoop classifier table copy-pasted from CLAUDE.md
- The full auto-memory spec excerpt
Executive readers get the story; Technical readers get the manual.

## 6. Artifacts — locked set (from discovery Q3)

All artifacts render inside the case study body via existing MDX components
(`<Artifact>`, `<Cost>`, `<PromptLog>`, `<Diff>`) — plus one visual TBD in
plan (see §6.5).

### 6.1 Hero visual — `memory/` directory listing

- Rendered as a monospace `<Artifact type="screenshot">` OR as a plain code
  block styled as a shell output. Plan picks the treatment.
- Content: `ls -1 memory/` output with the 16 files, grouped by type via
  visual whitespace, no ANSI colors (respects monochrome rule).
- Alt text: "Directory listing of 16 memory files organized by type."
- Placed after §2 cold open, as the reader's first hit of "wait, this is
  real."

### 6.2 Anatomy of a memory file — `feedback_css_cascade_first.md`

- Full file content, verbatim, in a fenced code block (`markdown` lang).
- Include the frontmatter (name, description, type) + body.
- Placed inside §3 (persistence layer).
- One sentence caption below: "One of 16. Written after a real debug
  session in Sprint 7. Every session after has skipped that trap."

### 6.3 `MEMORY.md` index snippet

- First 10 lines of `MEMORY.md`, verbatim, in a fenced code block.
- Placed inside §4.
- Caption: "The pointer file. Claude reads this in the first turn of every
  session; the individual memory files load only when relevant."

### 6.4 DEVLOG → STABLE_LOGIC diff

- Rendered as `<Diff>` MDX component: left side = an example DEVLOG entry
  (Problem/Decision/Result/Lesson); right side = the STABLE_LOGIC rule it
  became. Ruslan picks the specific pair in plan phase.
- Alternative: two side-by-side blockquotes if `<Diff>` shell is too
  code-y for prose flow.
- Placed inside §6 (promotion rate).

### 6.5 Sprint cadence visualization (open)

- Numeric: **11 sprints × 7 days = ~1.5 sprints/day**. Rendered as a small
  stat strip (3 numbers, mono type) inside §7.
- Optional visual: a small SVG timeline (7 days along x-axis, sprint
  markers as dots). Plan decides whether to build this or keep numeric-only.
  If build, no color — hairline + ink dots only.

### 6.6 The auto-memory spec excerpt

- Rendered inside `<TechnicalDetail>` (Executive-collapsed). Copy the
  "types of memory" section from Claude Code's system prompt as a `yaml`
  or `markdown` code block. Attribute clearly ("Excerpt from Claude Code's
  system-embedded auto-memory spec — not authored by Ruslan, reproduced
  for context.").
- Placed inside §9 (how to steal it) or §3.

### 6.7 Not showing

- No screenshots of the running site inside the case study. The reader is
  already on the site — a screenshot would be tautological.
- No mock terminal recordings. Static blocks read faster.
- No before/after code diffs of the portfolio itself. Git log is
  linkable if a curious reader wants to see the sprints.

## 7. `recruiterSummary` — the 2-paragraph Executive surface

Locked at ~2 short paragraphs, ~120 words total. Draft (plan may tune):

> This portfolio ships as its own 6th case study. The other five (Noble,
> Angel, Lexora, Fieldmark, smm-factory) describe client work. This one
> describes the machine — the memory files, classifier, and promotion
> discipline — that produced all six, in the open, on the exact site you
> are reading.
>
> Written for fractional clients evaluating whether the workflow scales
> to their engagement. If you're screening for craft, start with Noble.
> If you're screening for how work happens, start here.

Note: this deliberately points recruiters away from itself for the
first-touch read. Anti-flex framing.

## 8. `supportingArtifacts` — the L2 receipts strip

Rendered as a compact "Receipts" section in both views (per Sprint 11 §8.2).
Locked entries:

```yaml
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
```

Numbers subject to update at ship time (they will grow as sprints continue —
plan includes a §11 acceptance check: numbers matched to disk state on the
commit that ships this case study).

## 9. `devlogRefs` — the L3 process transparency block

Rendered expanded in Technical view, collapsed to "Full process log →" link
in Executive view. Working set of 4–6 refs (final in plan, cross-checked
against actual DEVLOG.md headings):

- Sprint 7 · font pivot and DotGrid gate — memory that stopped the dark theme
  drift
- Sprint 9 · multi-page IA split — spec triple that changed course mid-sprint
- Sprint 11 · GA4 + EU consent + `proxy.ts` rename — the memory that recorded
  the Next.js 16 naming break
- The `feedback_css_cascade_first.md` origin — the one debug session that
  became a rule

Each entry: `{ date, entry, summary, href? }`. `href` optional — DEVLOG.md
does not currently have per-heading anchors, so v1 refs will render without
links (still valuable as a browsable list). Adding anchor slugs to DEVLOG
headings is a separate small task; not in scope.

## 10. Site-tree additions

```
content/case-studies.ts                       (extend — no schema change)
content/case-studies/hrekov-dev.mdx           NEW — the MDX body
content/projects.ts                           (extend — add 6th project entry)
components/sections/SelectedWork.tsx          (verify — should auto-pick up
                                               the 6th entry without edits)
components/sections/WorkIndex.tsx             (verify — same)
app/(marketing)/work/[slug]/page.tsx          (no change; already parameterized)
app/(marketing)/work/[slug]/opengraph-image.tsx  (no change; already
                                                  parameterized)
```

`content/projects.ts` gains one entry:

```ts
{
  slug: "hrekov-dev",
  name: "hrekov-dev — the portfolio that documents itself",
  role: "solo build · meta case study",
  year: "2026",
  status: "shipped",
  summary: "One-sentence pull, TBD in draft.",
  roleTags: ["solo", "case-study"],
  stackTags: ["Next.js 16", "Claude Opus", "memory system"],
}
```

Slug **`hrekov-dev`** chosen over alternatives (`portfolio-meta`,
`shiploop`) — domain-matching, memorable, does not lean on the internal
"ShipLoop" brand.

## 11. Acceptance criteria

A **shipped** #74 must satisfy all of:

1. **MDX renders** — `/work/hrekov-dev` returns 200, MDX parses without
   errors, Executive view is the default.
2. **Toggle works on this study** — Executive ↔ Technical switch
   instantly, `<TechnicalDetail>` blocks flip visibility, artifact block
   detail expands, `devlogRefs` expand.
3. **`recruiterSummary` renders** — two paragraphs, ~120 words, present at
   top in Executive view, still visible (but not styled as "highlight")
   in Technical view.
4. **6 supporting artifacts render** — 2 commits, 1 link, 1 cost, 2
   timelines — each with the treatment defined in Sprint 11 §8.2.
5. **≥4 devlogRefs render** — expanded in Technical, collapsed to single
   link in Executive.
6. **6th project card appears** — `/work` index shows Hrekov-dev alongside
   the other five; `SelectedWork` on home may or may not surface it (plan
   decides — if not featured, exclude from `SelectedWork` filter).
7. **JSON-LD present** — `Article` schema unchanged from the other five
   case studies (headline, description, datePublished, author).
8. **OG image generates** — per-slug OG image renders with the case study
   title and eyebrow "Meta case study · hrekov-dev".
9. **All numbers in artifacts match disk state at commit** — the ship
   commit runs a script (in `plan.md`) that regenerates:
   - memory file count (`ls memory/ | wc -l`)
   - DEVLOG entry count (`grep -c '^## ' DEVLOG.md`)
   - STABLE_LOGIC rule count (`grep -c '^## ' STABLE_LOGIC.md`)
   - sprint count from git log
   - promotion rate (STABLE_LOGIC / DEVLOG)
   If any number in `supportingArtifacts` disagrees, build script fails
   loudly. This prevents numbers from silently rotting between edits.
10. **Cross-links present** — case study body links to `/about#stack` at
    §5 (routing) and to Noble at §7 (contrast). `/about` gains one line
    at the bottom of `AiStack` section pointing forward to
    `/work/hrekov-dev` for the routing discipline.
11. **`feedback_css_cascade_first.md` and `MEMORY.md` snippets are
    verbatim** — code blocks in the MDX match the current disk content
    (sanity check at ship, not enforced by script).
12. **Reading time computed** — matches Sprint 11 convention (frontmatter
    field or auto-derived).
13. **A11y preserved** — no new interactive components; existing case
    study toggle is a11y-tested.
14. **Reduce-motion preserved** — no new animations.
15. **Build clean** — `npx tsc --noEmit` + `npm run build` both pass.
16. **No visual regression** — the other five case studies + all top-level
    routes render identically.
17. **Sitemap** — `/work/hrekov-dev` appears in `sitemap.xml` with correct
    `lastmod`.

## 12. Explicit non-goals

- **No new MDX component.** Reuse the five Sprint 11 shells. If §6 needs
  something that does not exist, downgrade the artifact to prose + code
  block.
- **No memory-file *changes*.** This case study documents the memory
  system as it exists; it does not add new memory files as part of the
  work. Discovery memories are separate.
- **No auto-generation of the memory listing.** The `ls memory/` snippet
  is copied into the MDX by hand at ship time. If the folder changes,
  edit the MDX. Automating the sync is a Sprint 13+ concern.
- **No SVG timeline visualization if it stalls.** §6.5 falls back to
  numeric stat strip if plan phase decides the SVG is >30 min work.
- **No addition to `Testimonials`.** This case study does not ship with a
  new voice (no client to quote).
- **No podcast / video pilot in this sprint.** #75 (AI video pilot) is
  the next task, blocked-by this one, but its content is authored
  separately.
- **No self-referential CTA.** The case study does not end with "hire me
  to build one for you." The Footer card is the sole closer, per
  site-wide rule.
- **No DEVLOG anchor slugs.** `href` on `devlogRefs` remains optional in
  v1. Adding heading anchors to DEVLOG.md is a separate small task.
- **No i18n.** English only.
- **No home-page hero rework.** Hero currently reads "five case studies";
  plan decides whether to update the number to six or leave "five" as a
  soft-referent to the client-shaped set. Recommendation: keep "five,"
  because the meta study is a *depth* click, not a peer of the client
  work.

## 13. Risks + open items

### 13.1 Self-obsession read

The single biggest risk. Mitigations, all locked in copy:
- Cold open explicitly names the meta angle and disarms it (§5.1).
- `recruiterSummary` points readers away to Noble / Angel first (§7).
- Home hero does not up-count to "six" (§12).
- No "hire me to build one" CTA at end (§12).
- Positioning explicit: not for cold-recruiter first-touch (§3).

Residual risk: a reader who skims will still feel the meta. That's fine —
the intended reader (fractional client evaluating fit, peer studying
craft) will not skim.

### 13.2 Numbers rotting

The 37.5%, 16, 11-sprints-in-7-days, 26-min figures will all shift as the
project continues. Mitigation: acceptance criterion #9 — build script
regenerates numbers and fails on mismatch. Downside: script becomes tech
debt to maintain. Alternative accepted: mark numbers with an "as of
2026-09-27" caveat and update by hand quarterly. Plan picks.

### 13.3 Memory-file exposure

All 16 memory files (plus MEMORY.md) are visible via GitHub after this
ship. Discovery Q3 established none are sensitive. Confirmed inventory:
name/romanization, product decisions, technical feedback — all publishable.
`originSessionId` UUIDs in frontmatter are cosmetic clutter, not PII;
scrub-as-you-touch, not blocker.

### 13.4 Overlap with `/about#stack`

Real risk of dubbing model-routing content. Mitigation: §5 of the case
study **hard-links out** to `/about#stack` and explicitly does not
re-list Opus / Sonnet / Haiku. Enforced in review.

### 13.5 First video pilot (#75) depends on this being shippable

If this case study lands weak, the video narrating it lands weaker. Ship
bar for this case study is higher than "correct on the rails" — it must
read as *the* case study a peer would repost.

### 13.6 GitHub-repo visibility assumption

`supportingArtifacts` link to `https://github.com/ruslan4427/portfolio/commit/...`.
The repo must be public for these links to resolve. Confirm before ship.
If private, either flip to public or replace with local screenshots (loses
half the credibility).

### 13.7 Word budget vs artifact density

Body targets 1200–1800 words but has 6 artifacts + 4-6 devlog refs. Risk
of the body feeling squeezed between blocks. Mitigation: draft first,
prune second — if artifacts crowd prose, drop the SVG timeline (§6.5) or
demote §6.3 to inline mention.

## 14. Reference material

- `specs/11-blog-foundation/spec.md` — L2/L3 apparatus, format schema,
  Executive/Technical toggle mechanics
- `content/case-studies.ts` — types + loader
- `content/case-studies/noble-saas.mdx` — flagship reference draft
- `content/projects.ts` — 6th entry pattern
- `research/style-guide.md` — recruiter-credibility checklist,
  case-study-as-teardown format
- `memory/portfolio_content_strategy.md` — Sprint 10 audience/format lock
- `memory/portfolio_ai_video_pivot.md` — the video pilot (#75) that
  depends on this
- `CLAUDE.md` — ShipLoop protocol + classifier table (source for §5 of
  case study)
- `DEVLOG.md` — source for §6 promotion example + §9 devlogRefs
- `STABLE_LOGIC.md` — source for §6 promotion example
- `memory/MEMORY.md` — source for §6.3 snippet
- `memory/feedback_css_cascade_first.md` — source for §6.2 featured file
