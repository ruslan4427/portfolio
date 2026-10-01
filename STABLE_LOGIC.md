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
- **Green `#22C55E` is the only chromatic accent** and is functional — it
  signals "available for work" on the status dot. Never used decoratively.
  If a second signal is needed, it comes from ink weight/opacity, not a hue.
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

## Sprint history — locked directions

- **Sprint 7 (2026-09-23)** established the current minimalist editorial
  direction, replacing a dark WebGL "Lusion-immersive" first draft. A future
  session that wants to reintroduce the dark canvas, three.js, or gsap needs
  a fresh spec + user sign-off. Reference lock: Nizar Ali Dribbble 24766210.
