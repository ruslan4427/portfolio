# Spec — Sprint 11 · Blog foundation + case study L2/L3 + GA4

**Class.** L (new routes, new content type, new analytics integration, > 3 files)
**Date.** 2026-09-26
**Owner.** Ruslan (product decisions), Claude Opus (implementation)

---

## 1. Why this exists

Sprint 9 shipped the multi-page portfolio. Sprint 10 (research/style-guide.md)
locked the content strategy: portfolio becomes portfolio + AI-collaboration
journal. Primary audience is recruiters/hiring founders; secondary is
engineering managers. The style guide's format recommendation is Format D
(case-study-as-teardown) for anchor posts and Format C (build-log) for cadence.

This sprint builds the infrastructure the strategy needs before any post
can ship:

1. **A blog surface** — `/blog/` route, MDX pipeline, RSS feed, sitemap
   integration. Without this, "publish a post" is a manual copy-paste job
   into the case studies folder and there's no distinction between a
   long-form case study and a shorter build-log.

2. **A case study upgrade** — the existing 5 case studies are L1 (narrative
   only). The style guide says recruiters trust posts anchored to verifiable
   artifacts. L2 (supporting artifacts) + L3 (process transparency) close that
   gap. A single toggle switches between an Executive view (recruiter-optimized
   summary) and a Technical view (full artifacts + DEVLOG refs).

3. **Analytics + SEO plumbing** — GA4 (chosen by user despite alternatives),
   geo-gated cookie consent for EU visitors, Google Search Console verification.
   Without this we can't tell which posts land, which platforms drive traffic,
   or which queries we rank for.

Sprint 12 will add distribution automation (schedule.yml + LinkedIn/dev.to
APIs + GitHub Actions cron + blog-drafter agent). That work depends on the
routes and post schema this sprint establishes.

## 2. What must stay the same

Visual system is untouched (locked at Sprint 7, font pivot 2026-09-24):

- Playfair Display upright display type, Inter body
- Warm paper `#F5F4EF` background, ink `#111` primary
- Monochrome + green availability dot only
- DotGrid canvas ambient monochrome
- Rounded card shells (`--radius-card`, `--radius-tile`, `--radius-pill`)
- FadeUp / MaskReveal / Reveal / Stagger motion primitives
- `prefers-reduced-motion` respected everywhere

A blog post page and a case study page share the same chrome as `/about`
and `/services` — a visitor should not sense a new content type was added.

## 3. Site tree additions

```
/blog                    Blog index — "Start here" curated + chronological
/blog/[slug]             Individual post (build-log, case-study-as-teardown,
                         skeptic, pattern — format drives page shell)
/rss.xml                 RSS 2.0 feed (all posts, most recent first)
```

Existing `/work/[slug]` case study pages gain the L2/L3 apparatus and
the Executive/Technical toggle. No new routes for case studies — the
enhancement is composition inside the existing page.

Nav gains one link: **Journal** (routes to `/blog`). Position in Nav:
between Work and About. Rationale for "Journal" over "Blog": word "blog"
codes as content-marketing to the target audience; "Journal" reads as
engineering notebook (per style guide, Format C is the build-log — this
is a lab-notebook register, not a personal-brand register).

## 4. Post types and format schema

Blog posts have a `format` field in frontmatter that controls page
decoration (badge label, meta-line copy, layout defaults):

| `format` value | Badge label | Length | Layout hint |
|---|---|---|---|
| `case-study` | "Case Study" | 900-2500 words | Anchor-post shell, artifacts sidebar |
| `build-log` | "Build Log" | 300-600 words | Notebook shell, denser, no sidebar |
| `skeptic` | "Field Note" | variable | Essay shell, wide prose column |
| `pattern` | "Pattern" | variable | Docs shell, TOC surfaced |

The `format` determines which React shell renders the MDX body. All shells
share the same header (badge, title, tagline, meta line) — only the body
container width and side-material differ.

## 5. Blog post frontmatter (locked schema)

```yaml
---
title: string                          # display title
slug: string                           # URL slug, matches filename
tagline: string                        # one-sentence claim, used in meta + OG
publishedAt: YYYY-MM-DD                # required
updatedAt: YYYY-MM-DD                  # optional, drives lastmod in sitemap
format: case-study | build-log | skeptic | pattern
tags: string[]                         # 2-4 tags, used for filtering + dev.to
readingTime: number                    # minutes, computed if omitted
featured: boolean                      # curated "Start here"?
canonical: string                      # defaults to hrekov.dev/blog/<slug>
# Sprint 12 will consume these — noop in Sprint 11:
distribution:
  linkedin: { scheduledFor?: ISO8601, status: pending|posted|manual }
  devto:    { scheduledFor?: ISO8601, status: pending|posted|manual }
  twitter:  { status: manual }
# Optional L2 artifacts for recruiter credibility (per style guide):
artifacts:
  - type: commit | pr | screenshot | prompt | cost | timeline | link
    label: string                      # human label
    href?: string                      # for commit/pr/screenshot/link
    detail?: string                    # for cost/prompt/timeline, inline
---
```

**Validation** — a helper in `content/blog/index.ts` throws at build time if:
- `format` is not one of the four literals
- `publishedAt` is not a valid date
- Multiple posts share a slug
- `featured: true` but no `tagline` (curated posts must have a scannable line)

## 6. Blog index (`/blog`)

**Composition:**

- SectionBadge "Journal"
- Playfair Display H1: "Notes from the workbench." (final copy in plan)
- Sub-headline (~1-2 sentences): frames the register — "case studies,
  build logs, and the occasional field note about working with AI in
  production." No engagement bait.
- **Start here** — grid of `featured: true` posts (2-3 cards, largest
  format, `format === "case-study"` typically). Same card shell as
  ProjectCard but with post-format badge instead of role tag.
- **Chronological** — remaining posts as a compact list (rows, not cards):
  date · format badge · title · tagline. Denser than the featured grid.
  Grouped by year with a subtle year heading if list crosses years.
- **Empty state** — until the first post ships, show a "Coming soon" muted
  paragraph. Do not ship with a placeholder card that looks like real
  content.

**Filtering (v1 scope):** none. Chronological + curated is enough for
the first ~20 posts. Filter chips can come in a later sprint if the
post volume justifies them.

## 7. Blog post page (`/blog/[slug]`)

**Composition (shared by all four formats):**

- BackToJournal pill (matches existing BackToWork pattern)
- Header block (centered, `max-w-[65ch]`):
  - SectionBadge with format label
  - MaskReveal title in Playfair Display (`clamp(48px, 8vw, 96px)`)
  - Tagline paragraph
  - Meta line: `publishedAt · readingTime min read · format label`
  - Tag row: rounded-full pill per tag
- MDX body (`max-w-[65ch]`, format determines container class)
- **Artifacts section** (only if `artifacts` non-empty): compact
  "Receipts" block below the body. Renders inline for build-logs; a
  right-side sidebar on wide viewports for case studies.
- Related links: 2-3 links to prior posts by name (per checklist item
  #10 — signals body of work). Manual curation in frontmatter
  (`related: [slug1, slug2]`) or auto-derived from shared tags. Ship
  with manual in v1.
- No CTA card at bottom — Footer card in root layout is the sole closer.

**MDX components available in posts:**

- All existing `components/mdx/MdxComponents.tsx` (headings, code blocks,
  links, images).
- New: `<Artifact>`, `<Cost>`, `<PromptLog>`, `<Diff>`, `<TechnicalDetail>`
  — these are shells that render richer than plain markdown and read
  correctly in both Executive and Technical view (see §8 for the toggle).

**JSON-LD:** `BlogPosting` schema on each post page (headline, description,
datePublished, dateModified, author, keywords, url, wordCount, mainEntityOfPage).

## 8. Case study L2/L3 upgrade + view toggle

Existing `/work/[slug]` case studies gain three additions:

### 8.1 Frontmatter extension

```yaml
# existing L1 fields...
recruiterSummary: string    # 2-3 short paragraphs, Executive-mode surface
supportingArtifacts:        # L2 — verifiable receipts
  - type: commit | pr | screenshot | cost | timeline | prompt | link
    label: string
    href?: string
    detail?: string
devlogRefs:                 # L3 — process transparency
  - date: YYYY-MM-DD
    entry: string           # DEVLOG.md heading text
    summary: string         # one-sentence what happened
    href?: string           # anchor into DEVLOG.md on GitHub if we surface it
```

### 8.2 Executive vs Technical view

**Executive (default)** — recruiter-optimized:

- `recruiterSummary` renders as a highlighted block at the top (before
  the MDX body).
- Key numbers surfaced as a small stats strip (extracted from
  `supportingArtifacts` where `type: cost | timeline`).
- MDX body renders normally except `<TechnicalDetail>` blocks are
  collapsed (`<details>` element, closed by default).
- `supportingArtifacts` render as a compact "Receipts" section — one line
  per artifact, links only.
- `devlogRefs` render as a single summary link: "Full process log →" that
  points to the Technical view.

**Technical** — full detail:

- `recruiterSummary` still shown (it's not marketing fluff, it's context).
- `<TechnicalDetail>` blocks expanded inline.
- `supportingArtifacts` render as an expanded block with `detail` shown for
  cost/prompt/timeline entries.
- `devlogRefs` render as an expanded list, each entry with date + heading +
  summary. Links to DEVLOG anchors if `href` is set.

### 8.3 Toggle mechanism

- Toggle is a sticky pill at top-right of the case study page, below Nav.
  Two states: "Executive · Technical". Same pill shell as existing filter
  chips on `/work`.
- Toggle state lives in `localStorage` under key `caseStudyView` — persists
  across case studies and page reloads. Default `executive` if unset.
- Implementation: CSS-driven show/hide via `data-view="executive|technical"`
  attribute on `<article>`. `<TechnicalDetail>` blocks and expanded artifact
  detail are styled `display: none` under `[data-view="executive"]`. This
  avoids re-rendering React trees on toggle and keeps the toggle instant.
- Reduce-motion respected: toggle transition is opacity-only, no scale/slide.

### 8.4 Backfill

One case study is backfilled with real L2 + L3 data as the reference
implementation and the "wow" post recruiters see first. **Suggested:**
noble-saas (flagship, already the most-fleshed-out draft). Ruslan approves
during plan phase.

## 9. RSS feed

- `app/rss.xml/route.ts` — Route Handler returning
  `Content-Type: application/rss+xml; charset=utf-8`.
- Content: all blog posts (not case studies — different content type,
  different audience for the feed).
- Fields per item: title, link (absolute URL), guid (same as link,
  `isPermaLink="true"`), pubDate (RFC 822), description (tagline, CDATA
  wrapped), category (first tag).
- Channel: title "hrekov.dev · Journal", link, description, language en-us,
  lastBuildDate.
- **Autodiscovery link** in root layout `<head>`:
  ```html
  <link rel="alternate" type="application/rss+xml"
        title="hrekov.dev · Journal" href="/rss.xml" />
  ```

## 10. Analytics — GA4 + geo-gated consent + GSC

### 10.1 GA4 setup

- New env var `NEXT_PUBLIC_GA_ID` (format `G-XXXXXXXXXX`). Documented in
  `.env.example`.
- `<Analytics>` client component in root layout: loads gtag via
  `next/script` with `strategy="afterInteractive"`, guarded by consent
  logic below.
- Custom events (initial set):
  - `blog_post_read` — fired when scroll depth on `/blog/[slug]` crosses 75%
  - `case_study_view_toggle` — fired on Executive ↔ Technical switch, with
    label indicating direction
  - `contact_form_submit` — fired on successful contact form submission
    (Server Action success), with `intent` as event param
  - `external_link_click` — fired when user clicks a link with
    `hostname !== 'hrekov.dev'`, with `href` and `hostname` params
- Page view tracking uses GA4's default (auto-collected on route change via
  Next.js App Router — need to hook `router.events` equivalent in App
  Router; `usePathname` + `useSearchParams` in a client component).

### 10.2 Cookie consent — geo-gated

- Middleware at `middleware.ts` (root) reads `x-vercel-ip-country` header
  and sets a `x-geo-eu` header on the request. EU country list: 27 EU
  member states + UK + EEA (Norway, Iceland, Liechtenstein) + Switzerland
  (for parity). Full list in `lib/consent-geo.ts`.
- `<ConsentGate>` client component in root layout reads the header via a
  cookie set by middleware (`geo-eu=1|0`, 24h TTL) — cookies are the only
  way for a client component to read middleware-set state without
  server-round-tripping.
- If `geo-eu=0`: GA4 loads unconditionally. No banner.
- If `geo-eu=1`: GA4 does not load until user acts on banner. Banner shows:
  - Two buttons: **Accept** (primary, black pill) and **Reject** (ghost
    hairline pill).
  - Copy: one sentence, no dark patterns. Suggested: "This site uses
    Google Analytics to understand which posts land. Accept to help, or
    reject — nothing else changes." (Final copy in plan.)
  - Sits at bottom of page in a card (rounded-16, hairline border,
    `--bg-elevated`, `--shadow-card`). Max-width `max-w-2xl`, centered.
    Not a full-width bar (looks less spammy).
  - Fixed positioning, `bottom-4`, above Footer.
  - On accept: sets `consent=accepted` cookie (365d), banner dismisses,
    GA4 loads.
  - On reject: sets `consent=rejected` cookie (365d), banner dismisses,
    GA4 does not load. Preference sticks across sessions.
  - No X close button — only Accept or Reject. Ambiguous close = ambiguous
    consent = GDPR violation.
- **Reset link** in Footer (small muted text): "Reset analytics preference"
  — clears the cookie, banner returns on next page load. Required by GDPR
  (right to withdraw consent).

### 10.3 Google Search Console

- Ruslan creates GSC account for `hrekov.dev`.
- Verification via HTML meta tag (simplest, no DNS round-trip):
  `<meta name="google-site-verification" content="<token>" />` in root
  layout, token stored in `NEXT_PUBLIC_GSC_VERIFICATION` env var.
- Post-verification: submit `sitemap.xml` in GSC UI (manual step, one-time,
  documented in README).
- GSC surfaces query data with ~48h latency — no live integration needed
  in Sprint 11.

## 11. Acceptance criteria

A **shipped** Sprint 11 must satisfy all of:

1. **Routes** — `/blog`, `/blog/[slug]` (for at least one seed post),
   `/rss.xml` all return 200. Sitemap includes all blog posts with correct
   `lastmod`.
2. **Blog post schema validation** — a post missing a required field or
   with an invalid `format` value fails the build (`npm run build`).
3. **Format-driven layout** — a `case-study` post renders with wider body
   + artifacts sidebar (on `>=lg`); a `build-log` post renders with denser
   body + no sidebar. Same header for both.
4. **Case study Executive/Technical toggle** — one backfilled case study
   (Ruslan-approved, likely noble-saas) renders both views. Toggle switches
   instantly (no re-render lag), persists to `localStorage`, and the
   default is Executive.
5. **L2 artifacts render** — supported types (commit, pr, screenshot,
   cost, timeline, prompt, link) each have a distinct visual treatment.
   Links open in new tabs with `rel="noopener"`.
6. **L3 devlog refs render** — expanded in Technical view, collapsed to a
   single link in Executive view.
7. **RSS feed valid** — passes W3C Feed Validator (validator.w3.org/feed).
   Autodiscovery `<link>` present in `<head>` on all pages.
8. **JSON-LD present** — each blog post has valid `BlogPosting` JSON-LD;
   each case study still has valid `Article` JSON-LD.
9. **GA4 loads** — with `NEXT_PUBLIC_GA_ID` set, non-EU visitors trigger
   `gtag('config', ID)` on page load (verified in DevTools Network tab
   filtering `collect?v=2`).
10. **Consent banner geo-gates correctly** — visitors from EU country IPs
    see banner; non-EU visitors do not. GA4 does not fire until Accept
    clicked. Reject blocks GA4 permanently until preference reset.
11. **Custom events fire** — `blog_post_read`, `case_study_view_toggle`,
    `contact_form_submit`, `external_link_click` all visible in GA4
    Real-Time report during smoke test.
12. **GSC verification** — meta tag present in `<head>` when
    `NEXT_PUBLIC_GSC_VERIFICATION` is set. Absent when unset (no empty tag
    shipped).
13. **A11y preserved** — Consent banner is focus-trapped when open,
    `aria-labelledby` on the container, Accept/Reject buttons have visible
    focus rings, Escape does NOT dismiss (would be ambiguous consent).
    Reset link in Footer is keyboard-operable.
14. **Reduce-motion preserved** — no new animations added anywhere that
    disrespect `prefers-reduced-motion`. Case study toggle is instant, not
    animated.
15. **Build clean** — `npx tsc --noEmit` passes, `npm run build`
    generates static blog index + all blog post pages + rss.xml route.
16. **No visual regressions** — home, `/about`, `/services`, `/contact`,
    `/work` render identically to pre-sprint. Only `/work/[slug]` gains
    the toggle pill (unobtrusively).
17. **First post live** — one seed post exists (`format: case-study` or
    `format: build-log`) covering the Sprint 10-11 meta-story (building
    the journal). Passes recruiter-credibility checklist score >=8/10 per
    style guide.

## 12. Explicit non-goals

- **No auto-publish to LinkedIn / dev.to / X.** That's Sprint 12.
- **No editorial calendar UI.** `content/blog/schedule.yml` file (if
  needed for planning) is human-edited only. UI is out of scope.
- **No comments.** Not planned; Disqus/Utterances would be a separate spec.
- **No email subscription / newsletter.** Deferred to Sprint 15+ if list
  becomes a priority (per style guide + memory).
- **No search UI.** Sitemap + Google are the search. In-site search adds
  complexity without proportional benefit at <20 posts.
- **No related-posts algorithm.** Manual `related: [slug]` in frontmatter.
- **No syntax highlighting beyond default MDX.** Adding Shiki / Prism is a
  perf + config decision worth its own sprint.
- **No image optimization pipeline beyond `next/image`.** No LQIP, no CDN
  transforms — Vercel handles enough.
- **No draft/preview mode.** Posts in `content/blog/` with `publishedAt >
  today` are simply hidden by the loader; no separate preview route.
- **No i18n.** English only.
- **No Plausible / Umami dual-tracking.** GA4 only, per user choice.

## 13. Risks + open items

- **Cookie consent legal completeness.** Geo-gating by IP is a *good-faith*
  approximation, not a legal guarantee — some EU users on VPNs won't see
  the banner. This matches how most sites handle it, but is worth naming.
  If Ruslan later wants stricter compliance, the fallback is to show the
  banner globally (annoying non-EU users) or integrate a paid CMP like
  Cookiebot ($10-30/mo). Recommendation for v1: geo-gate is fine for a
  personal portfolio.
- **Middleware overhead.** Every request hits middleware to set the
  geo-eu cookie. Vercel Edge Middleware is fast (~1-5ms) and free at
  portfolio traffic volume. If it starts costing money, revisit.
- **GA4 script weight.** ~50KB gzip. Loading via `strategy="afterInteractive"`
  keeps it off the critical path. Speed Insights will show the delta post-ship.
- **DEVLOG references stability.** L3 refs point to DEVLOG.md entries by
  date + heading. If DEVLOG.md gets reformatted, refs break silently. A
  small pre-build script that validates every `devlogRefs` entry resolves
  against DEVLOG.md would prevent this — added to plan if we have budget.
- **noble-saas case study data.** Backfill requires Ruslan supplying real
  commit hashes, cost numbers, timeline. Placeholder acceptable in initial
  commit; real data before shipping.
- **First blog post content.** The seed post (Sprint 10-11 meta) is the
  first read a recruiter gets. Ruslan drafts, Claude edits — not the
  other way around. Draft doesn't ship until it clears the style guide
  checklist.
- **Vercel build time.** Blog + case study pages are all static (SSG).
  Build time grows linearly with post count. At 100 posts we may need to
  revisit ISR; not this sprint.
- **GA4 vs Vercel Analytics duplication.** Both tools will report similar
  metrics. That's fine — they serve different purposes (Vercel = fast
  glance, GA4 = deep funnel). No consolidation planned.

## 14. Reference material

- `research/style-guide.md` — Sprint 10 output, content strategy source
- `memory/portfolio_content_strategy.md` — strategic decisions layer
- `content/case-studies/` — existing MDX pipeline, blog reuses the pattern
- `specs/09-site-restructure/` — reference format for spec/plan/tasks
- Next.js 16 docs: `node_modules/next/dist/docs/` (App Router, Middleware,
  Route Handlers, next/script strategies)
- Vercel geo headers: `x-vercel-ip-country` (auto-populated on every
  request, no config needed)
- GA4 event reference: developers.google.com/analytics/devguides/collection/ga4/reference/events
- GDPR consent guidance: edps.europa.eu/data-protection/our-work/subjects/cookies_en
