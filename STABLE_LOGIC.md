# STABLE_LOGIC

Rules that survive future refactors. If a Claude session wants to change
anything below, it must open a discussion, not a diff.

Promoted from `DEVLOG.md` when a decision has proven itself across at least
two sessions or one full sprint.

---

## Design tokens

- **Page** is `#F5F4EF` (warm paper). Not `#FFF`. Not any cool gray. This
  exact hex. Reason: warm paper reads as editorial and reduces the clinical
  SaaS feel of pure white.
- **Ink** is a monochrome ramp: `#111` primary → `#2A2A28` body → `#6B6B66`
  muted → `#A8A8A2` faint (decorative only, never text).
- **Two hues, two jobs (changed 2026-10-21, Sprint 22, by Ruslan's call).**
  Green `#22C55E` is functional — it signals "available for work" on the
  status dot and is never used decoratively. Brick `--accent` `#A94427`
  (5.38:1 on paper, 5.67:1 for `--accent-ink` on it) is the single emphasis
  hue: key paths and outcomes in diagrams, reading progress, the "Start
  here" marker, key numbers, link hover. It is never a large fill, never on
  the inverse panel, and never carries meaning alone (shape, glyph or label
  goes with it). A third hue needs a fresh discussion.
- **Radii** come from tokens: `--radius-card` (16px), `--radius-tile` (12px),
  `--radius-pill` (999px). No arbitrary `rounded-[Npx]`. If a shape wants
  something else, add a token or reshape the composition.
- **Font families cap at 2**: Playfair Display (serif, upright display,
  weights 400–900) + Inter (sans, body/nav/chrome). No third family. No
  mono. Italic display was pivoted out on 2026-09-24; do not reintroduce
  without a fresh spec.

## Motion

- `prefers-reduced-motion` fallback is a **hard requirement** on every
  animated component. Not a stretch goal.
- `SmoothScroll` early-returns under reduce-motion. `DotGrid` renders the
  static radial-gradient fallback. Framer respects
  `MotionConfig reducedMotion="user"` (opacity only).
- **Cursor-reactive effects also gate on `matchMedia("(hover: hover)")`** —
  no pointer-following animation on touch devices, regardless of
  reduce-motion. Reason: mobile users don't have a cursor to react to.

## Structure

- One source of truth for project metadata: `content/projects.ts`. The
  `ProjectsGrid`, case-study routes, OG images, and sitemap all read from
  this file. Never duplicate.
- Design tokens live in one place: `app/globals.css` `:root` block. Never
  inline hex values in components.

## CSS authorship (Tailwind v4)

- **Every element-level rule in `app/globals.css` lives inside
  `@layer base { ... }`.** Never author `html { ... }`, `body { ... }`,
  `a { ... }`, `::selection { ... }` etc. unlayered. Reason: Tailwind v4
  declares the layer order `theme, base, components, utilities`; any
  *unlayered* rule beats every layered rule regardless of specificity —
  so an unlayered `a { color: inherit }` will silently defeat every
  `text-[color:var(--x)]` utility applied to an anchor. Regression path
  is anchor-based CTA pills rendering dark-on-dark; symptom always
  looks like a JIT/HMR bug and it never is.
- **`@source not "..."` directives in `globals.css` exclude docs from
  the utility scan.** Tailwind v4 auto-scans the whole project including
  `.md`/`.mdx`. `DEVLOG.md`, `STABLE_LOGIC.md`, `AGENTS.md`, `CLAUDE.md`,
  `README.md`, `specs/**/*.md`, and `content/case-studies/**/*.mdx` are
  excluded because they contain class-shaped strings in code fences
  that would otherwise get compiled into (potentially broken) utility
  rules. If you add a new doc file type at the project root, add it to
  the exclude list.

## Next.js 16 conventions

- **`proxy.ts` at repo root, not `middleware.ts`.** Next.js 16 renamed
  the edge-runtime file convention; the exported function is `proxy`
  (previously `middleware`). Both still ship in 16 but `middleware.ts`
  emits a deprecation warning on every dev boot and is queued for
  removal. If you're writing edge code (geo cookies, redirects, auth
  gates), use `proxy.ts`.

## Content authorship

- **MDX filenames must match `frontmatter.slug` exactly** — no date
  prefix, no directory nesting. `content/blog/<slug>.mdx` and
  `content/case-studies/<slug>.mdx`. The validator throws on
  mismatch. Reason: RSS + sitemap + JSON-LD all key on the slug, so
  a filename/slug drift is silently wrong until a reader lands on
  a broken URL. Keep them stapled.
- **Blog frontmatter is validated at build time and throws on
  invalid data.** `format` must be one of the four known values,
  dates must be `YYYY-MM-DD`, `slug` must be unique across posts,
  and a `featured: true` post must have a `tagline` longer than 20
  characters. No fallback rendering — the build fails loudly.
- **Case-study "L2/L3" enhancement is opt-in per study.** The
  ViewToggle only mounts when at least one of
  `recruiterSummary | supportingArtifacts | devlogRefs` is present
  (`hasEnhanced` flag on the page). Case studies with none of those
  fields render unchanged — no regression, no forced-empty
  toggle. When adding L2/L3 fields, use real data only; if a
  recruiter summary would need invented facts, leave the field
  blank and let the body carry the weight.
- **`next-mdx-remote` needs `blockJS: false` for structured MDX
  props.** The default (`blockJS: true`) injects a remark plugin
  that silently strips JS flow expressions from the AST — so
  `columns={3}` survives (attribute value) but
  `items={[{value: "12", label: "sprints"}, …]}` gets removed and
  the primitive receives `items: undefined`. Set `blockJS: false`
  on every `<MDXRemote>` call site (both `CaseStudyBody.tsx` and
  `BlogPostBody.tsx`). Keep `blockDangerousJS` at default — our
  in-repo MDX never uses `require`/`process`/`fetch` globals. Any
  new MDX primitive that takes `items`, `data`, `entries`, or any
  object/array literal from MDX depends on this flag being off.
- **Numbers-in-prose guards cover body + JSX, not only frontmatter.**
  `scripts/verify-case-study-numbers.mjs` (wired as `prebuild`)
  started by inspecting only `frontmatter detail:` strings. On
  2026-10-03 the hrekov-dev case shipped with frontmatter
  reconciled to disk but five body-prose claims (seventeen /
  twenty-six / 26 min) and the §7 `<MetricGrid items={…}>` JSX still
  carrying the old counts — the drift was invisible to CI until the
  first `/shiploop-expert phase=pre-ship` run caught it. Rule: any
  numeric claim that renders to the reader (body prose, JSX
  `items`, inline `<Counter>`) must either be covered by the
  reconciliation script or be marked with a visible stale-date
  snapshot ("as of YYYY-MM-DD"). Extend the script when adding
  a new primitive that renders numbers. Reason: partial
  reconciliation reads worse than no reconciliation — a careful
  reader sees the numbers crossing each other and loses trust in
  all of them. Belongs to AI-collaboration case studies most
  strongly, but applies anywhere a stat appears outside frontmatter.
- **Positional claims must name the sibling, never "on this page" /
  "Nth case study."** Wording that embeds position (`"the other five
  case studies on this page"`, `"this is the 6th case study"`,
  `"listed below"`) silently inverts whenever a `featured` flag flips
  or ordering changes. 2026-10-03 incident: hrekov-dev was promoted
  to `featured: true` and listed first on home per 2026-10-02
  decision, but `hrekov-dev.mdx:58` still read "the other five case
  studies on this page" — false from every vantage point (not on
  `/work/hrekov-dev`, not on home, not on `/work`). Rule: when
  referring to sibling case studies, say "on this site" and name
  them ("Noble, Angel, Lexora, Fieldmark, smm-factory") rather than
  rely on relative position. Capsule
  `.claude/expertise/editorial-portfolio-site.md` already carries
  this as an AI-collab-variant red flag; promoting here because the
  rule applies to all case studies, not only AI-collab ones.
- **The numeric-drift guardrail is local-only; Vercel is not an
  authoritative check.** `verify-case-study-numbers.mjs` reads the
  memory folder at `~/.claude/projects/-Users-ruslan-portfolio/memory/`
  which lives outside the repo and is absent on Vercel. On Vercel the
  script logs a loud PARTIAL GUARDRAIL banner and skips the memory +
  body-prose + MetricGrid + §4-ls checks. This is deliberate — the
  canonical state of the memory folder lives on the author's machine,
  and reconciling against a stale checked-in snapshot would be worse
  than skipping. Rule: treat `prebuild` on a local workstation as the
  authoritative gate before `git push`. Do not try to "fix" the Vercel
  skip by committing a snapshot of the memory folder — it would drift
  on every real memory write. If a future workflow needs CI-side
  verification, export a frozen `memory-manifest.json` from the local
  prebuild and reconcile against that, not against a live folder.

## Analytics + consent

- **GA4 loads conditionally on `analyticsAllowed`, not on `consent
  === "accepted"`.** The rule collapses to
  `mounted && (consent === "accepted" || (!isEu && consent !== "rejected"))`.
  Non-EU visitors are opted in by default, EU visitors stay opted
  out until they click Accept in the banner, and either audience
  can flip via the footer reset link. The GA4 `<Script>` component
  simply doesn't render when disallowed — nothing to disable, no
  cookies dropped.
- **`send_page_view` is off at init; `<PageViews>` fires a manual
  `config` on every route change** with `anonymize_ip: true`. This is
  the App-Router-safe pattern — a plain gtag config sends a page
  view on script load and then never again, because SPA route
  changes aren't full loads.
- **Consent state lives in a first-party `consent` cookie**
  (`accepted | rejected | unset`), and geo is a first-party
  `geo-eu=1|0` cookie set by `proxy.ts` from Vercel's
  `x-vercel-ip-country` edge header. No third-party call to detect
  location; the middleware runs at the edge before rendering. `proxy.ts`
  matcher excludes `_next/static`, `_next/image`, `favicon.ico`,
  `rss.xml`, `sitemap.xml`, `robots.txt`, and any dotted-extension
  file.

## View toggles (case study Executive/Technical)

- **CSS-driven, not React-re-render.** The toggle flips
  `article[data-view]` between `executive` and `technical` and
  three CSS rules in `globals.css` show/hide by class name
  (`.artifact-detail`, `.devlog-full`, `.devlog-summary`,
  `.recruiter-only`) or by `[data-mode="technical"]` on the
  `<TechnicalDetail>` element. Reason: the MDX body is
  server-rendered; a re-render on toggle would tear it down and
  refetch. The DOM stays; the presentation flips. No state
  desync possible.

## Distribution automation (Sprint 14, 2026-09-30)

- **LinkedIn personal posting endpoint is `POST /v2/ugcPosts`.** The
  self-serve `w_member_social` scope authorizes this surface and no other.
  Required headers: `Authorization: Bearer <token>`, `X-Restli-Protocol-Version: 2.0.0`,
  `Content-Type: application/json`. Do NOT set `LinkedIn-Version` — that
  header belongs to `/rest/posts` under the Community Management API,
  which requires LinkedIn partner review (multi-week gate). Symptom of the
  wrong endpoint: 403 despite a seemingly valid token.
- **Publish ordering is ledger → frontmatter → git.** `scripts/publish-due.mjs`
  always writes to `.distribution-ledger.jsonl` *first*, mutates the MDX
  frontmatter *second*, and runs `git add/commit/push` *last*. Reason:
  the ledger is the only durable idempotency guard across runner
  restarts; a crash between the publish and the frontmatter write still
  leaves the ledger entry, so the next cron tick won't double-publish.
  Reversing this order has produced duplicate LinkedIn posts in similar
  pipelines elsewhere — treat the ordering as load-bearing.
- **`.distribution-ledger.jsonl` is checked into git, not gitignored.**
  GH Actions runners are ephemeral — if the ledger isn't in the repo, the
  next run sees an empty guard and re-publishes everything scheduled in
  the past. The cron commit always stages the ledger alongside the
  frontmatter mutation. If you see the file re-appearing in a "should I
  ignore this?" review, the answer is no.
- **Cross-post cron commits carry `[skip ci]`.** Vercel still rebuilds via
  the git integration webhook (frontmatter mutation = content change),
  but the commit message makes the cron origin filterable in logs. Do
  not strip the marker.
- **All distribution scripts are `.mjs`, run via plain `node`, installed
  with `npm ci --ignore-scripts`.** Matches the existing
  `verify-case-study-numbers.mjs` convention; no tsx/bun dependency. The
  `--ignore-scripts` flag skips the Next `prebuild verify:numbers` hook
  (that's a build-time check, not an install-time one).
- **LinkedIn re-handshake reminder is automated via the weekly
  `linkedin-refresh` workflow, not a human calendar.** When
  `LINKEDIN_REFRESH_TOKEN_ISSUED_AT` + today puts the 60-day cliff at
  ≤14 days out, `scripts/linkedin-refresh.mjs` opens a GitHub issue
  labelled `linkedin-token-cliff` (idempotent — skips if an open one
  exists). After a fresh handshake, update the `ISSUED_AT` secret so
  the countdown resets; closing the issue is cosmetic. Removing the
  `issues: write` permission or dropping the `ISSUED_AT` secret
  silently breaks this — don't.

## Scorecard parser (Sprint 15, 2026-10-16)

- **The scorecard parser is vendored, not imported.** The canonical copy
  lives in the OSS repo (`github.com/ruslan4427/claude-shiploop`, path
  `lib/`); the portfolio carries its own copy under
  `scripts/scorecard-src/` (plain `.mjs`, zero dependencies, run via
  `node`). Both trees must emit the same metric shape; the shape — not
  the values — is the invariant. Reason: the OSS artifact's whole
  credibility rests on being inspectable alongside the portfolio data
  that cites it, and a `npm`/`git submodule` dependency would make the
  portfolio's `prebuild verify:numbers` and `npm run scorecard` hidden
  on the install chain. Vendored keeps the parser readable in two
  places with one shape contract between them.
- **Structural drift is guarded by a shape-check CI; value drift is
  not.** `.github/workflows/scorecard-snapshot.yml` runs
  `node scripts/scorecard-src/snapshot-check.mjs` on any push/PR that
  touches `scripts/scorecard-src/**`. The check compares the live
  parser output against the frozen fixture at
  `scripts/__fixtures__/scorecard.expected.json` on **key sets per
  metric and per project**, not on numeric values. Rework and token
  counts drift every commit; that drift is expected. A metric
  disappearing, a project vanishing from config, or a new nullable
  cell silently becoming non-nullable will fail CI. Value drift is
  re-committed via `npm run scorecard:snapshot` when the author decides
  the new numbers are the correct source of truth.
- **The update protocol has four touchpoints, in this order.** When
  the parser schema changes: (1) bump `CONFIG_VERSION` in
  `scripts/scorecard-src/scorecard.config.mjs` AND
  `REQUIRED_CONFIG_VERSION` in the main entry — the lockstep guard
  refuses to run on mismatch; (2) regenerate the fixture with
  `npm run scorecard:snapshot`; (3) run `npm run scorecard:check`
  locally — must pass; (4) commit all three files in one commit so
  the shape-check CI sees them atomically. Same four steps apply in
  the OSS repo. There is no cross-repo commit-SHA pin yet; if the two
  trees diverge in shape, CI will catch it on whichever side the
  snapshot was committed from.
- **Null is honest — the parser never fabricates.** If data is
  absent (no DEVLOG, no spec dates, no session logs, no
  conventional commits), the metric is `null`. The `/tools`
  methodology aside explains null cells transparently. Softening a
  null to "estimated 15k tokens" would reintroduce the exact
  credibility hole the three-tier design (naked / self-spec /
  shiploop) was there to avoid. Rule: the parser can refuse to
  measure; it cannot invent.
- **The three-tier assignment is a human call, not auto-detection.**
  Discipline score (0–1, four binary artifacts) is auto. Tier (0/1/2)
  is a per-project judgment documented in `content/case-studies/<slug>.mdx`
  frontmatter under `tokenScorecard.tier`. The gap between
  "artifacts present" and "institutional discipline" is real — Lexora
  scores 4/4 discipline because speckit left the artifacts behind, but
  tier 0 because ShipLoop didn't exist yet. The parser surfaces both;
  the methodology aside explains the gap. Do not try to collapse the
  two into a single derived value.

## Sprint history — locked directions

- **Sprint 7 (2026-09-23)** established the current minimalist editorial
  direction, replacing a dark WebGL "Lusion-immersive" first draft. A future
  session that wants to reintroduce the dark canvas, three.js, or gsap needs
  a fresh spec + user sign-off. Reference lock: Nizar Ali Dribbble 24766210.
- **Sprint 15 (2026-10-16)** open-sourced the ShipLoop protocol as
  `github.com/ruslan4427/claude-shiploop` (MIT, no sign-up, no telemetry)
  and added the `/tools` scorecard page on hrekov.dev. The install
  one-liner (`curl -sSL https://raw.githubusercontent.com/ruslan4427/claude-shiploop/main/install.sh | bash`)
  merges into existing `CLAUDE.md`, doesn't overwrite rules. A future
  session that wants to retire or re-brand the OSS artifact needs a
  fresh spec; the `/tools` page, meta case study `/work/claude-shiploop`,
  and the blog post `/blog/shipping-claude-shiploop` all point at the
  repo and must move in sync.
