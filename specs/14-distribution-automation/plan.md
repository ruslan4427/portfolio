# Plan — Sprint 14 · Distribution automation

Phase sequencing. Each phase is independently verifiable and doesn't
require the next to be started.

---

## Phase A — Editorial calendar (foundation)

**Goal:** `content/blog/schedule.yml` exists, parses, validates against
existing blog posts, exposes typed reader.

**Files added:**
- `content/blog/schedule.yml` (empty scaffold)
- `content/blog/schedule.ts` — `readSchedule()` returns `Record<slug, { linkedin?: Date; devto?: Date }>`, throws on malformed YAML, unknown slug, unparseable date, unknown channel.

**Files modified:**
- `content/blog.ts` — extend `DistributionChannel` type with optional `publishedUrl?: string` and `error?: string` (additive).

**Verify:** `npx tsc --noEmit` clean; a `node` smoke script that reads scaffold + one entry logs the parsed structure without error.

**Effort:** ~1h.

---

## Phase B — Publisher library (per-channel modules)

**Goal:** Two importable functions — `publishToDevto(post, opts)` and
`publishToLinkedIn(post, opts)` — return `{ publishedUrl }` or throw.
Each is testable in isolation with mocked `fetch`.

**Files added:**
- `lib/distribution/render.ts` — MDX → plain markdown (dev.to) and MDX → plain text (LinkedIn) renderers. Uses `unified` + `remark-parse` + `remark-stringify` (dev.to) / custom visitor stripping formatting (LinkedIn).
- `lib/distribution/devto.ts` — dev.to publisher.
- `lib/distribution/linkedin.ts` — LinkedIn publisher.
- `lib/distribution/types.ts` — `PublishResult`, `PublishOptions`, etc.

**Verify:** Each publisher has a `--dry-run` code path (checked via
`opts.dryRun`). Test writes stdout the request body and skips fetch.
Manual: run against a throwaway dev.to article + LinkedIn scratch post,
delete after.

**Effort:** ~4h (LinkedIn plaintext renderer is the tricky bit).

---

## Phase C — OAuth handshake script (one-time, local)

**Goal:** `node scripts/linkedin-oauth.mjs` opens browser, catches
callback, prints access + refresh tokens + member URN. Ruslan pastes
into GitHub Secrets.

**Files added:**
- `scripts/linkedin-oauth.mjs` — spawns local HTTP server on `:8787`,
  opens `https://www.linkedin.com/oauth/v2/authorization?...` with
  `w_member_social openid profile email` scopes and `state=<nonce>`,
  waits for `/callback?code=...&state=...`, exchanges code for tokens,
  fetches `/v2/userinfo` for member URN, writes `.env.distribution`,
  logs a "paste this into GH Secrets" block.

**Dependency:** LinkedIn App created at
`https://www.linkedin.com/developers/apps` with "Share on LinkedIn"
product added, redirect URI `http://localhost:8787/callback` registered.

**Verify:** Running the script produces a valid access token that
successfully POSTs to `/v2/me` (script self-tests with a `GET /v2/me`
before printing "success").

**Effort:** ~2h (LinkedIn OAuth is well-documented; sunk cost is
LinkedIn app creation + product approval, which is instant self-serve
for "Share on LinkedIn").

---

## Phase D — Publish cron (GH Actions orchestrator)

**Goal:** Hourly workflow finds due posts + due channels, publishes,
commits frontmatter mutation, appends DEVLOG line.

**Files added:**
- `.github/workflows/publish-blog.yml` — `on: schedule: - cron: '15 * * * *'` (hourly at :15 to dodge peak GH cron congestion); `on: workflow_dispatch:` for manual runs.
- `scripts/publish-due.mjs` — reads schedule + frontmatter, computes due set (`scheduledFor <= now && status === "pending" && not in ledger`), publishes, mutates frontmatter, commits.
- `.distribution-ledger.jsonl` (created by first cron run) — `{ slug, channel, publishedUrl, ts }` per publish. Idempotency guard.
- `scripts/lib/git.mjs` — helpers for `git add`, `git commit`, `git push` with retry+backoff.
- `scripts/lib/devlog.mjs` — appends a standardized DEVLOG entry.

**Files modified:**
- `.gitignore` — add `.env.distribution`.
- `content/blog/schedule.yml` — real entry for `launching-the-journal`
  so the first cron has something to publish (Ruslan sets time when
  ready to test).

**Bot identity:** `git config user.name "hrekov-bot"`,
`user.email "actions@hrekov.dev"`. Commit message includes `[skip ci]`
to prevent Vercel deploy on frontmatter-only mutation (Vercel *will*
still rebuild via the git integration webhook, but the message flag
lets us filter in analytics).

**Verify:** `workflow_dispatch` trigger with `dryRun=true` input renders
+ logs but doesn't publish or commit. First real run publishes one post.

**Effort:** ~3h.

---

## Phase E — Refresh worker (weekly)

**Goal:** Weekly workflow refreshes LinkedIn access token before its
60-day expiry.

**Files added:**
- `.github/workflows/linkedin-refresh.yml` — `on: schedule: - cron: '0 6 * * 1'` (Monday 06:00 UTC).
- `scripts/linkedin-refresh.mjs` — exchanges refresh token, updates access + refresh tokens via `gh secret set` (workflow uses `gh` CLI, `env: GH_TOKEN: ${{ secrets.GH_ADMIN_TOKEN }}`).

**Dependency:** New secret `GH_ADMIN_TOKEN` — fine-grained PAT with
`secrets: write` on this repo only. Ruslan creates + adds.

**Verify:** `workflow_dispatch` trigger runs the flow manually, checks
new access token is 60d fresh via `.exp` field of a decoded response,
publishes a test noop post to verify the new token works.

**Effort:** ~2h.

---

## Phase F — blog-drafter Claude Code skill

**Goal:** Invoking `/blog-drafter <devlog-heading>` from a Claude Code
session generates a `content/blog/<slug>.mdx` chernetka.

**Files added:**
- `.claude/skills/blog-drafter/SKILL.md` — describes trigger + inputs +
  outputs, format switches (`build-log` | `pattern` | `case-study` |
  `skeptic`), reference to style guide.
- `.claude/skills/blog-drafter/templates/build-log.mdx` — skeleton with
  frontmatter placeholders, section headers matching Format C.
- `.claude/skills/blog-drafter/templates/pattern.mdx`.
- `.claude/skills/blog-drafter/templates/case-study.mdx`.
- `.claude/skills/blog-drafter/templates/skeptic.mdx`.

**Skill behavior (encoded in SKILL.md):**
1. Read DEVLOG entry by its date+heading.
2. Ask user: which format? which slug? which tags?
3. Load matching template.
4. Fill frontmatter (dates, slug, format, readingTime = paragraph count / 3, featured = false, distribution = `linkedin: {status:"pending"}, devto: {status:"pending"}, twitter: {status:"manual"}`).
5. Fill body from DEVLOG's Problem/Decision/Result/Lesson.
6. Write to `content/blog/<slug>.mdx`.
7. Print: `open content/blog/<slug>.mdx` (per auto-open memory) + suggest adding to `schedule.yml`.

**Verify:** Manual — invoke skill on one existing DEVLOG entry, verify
file passes `next build`.

**Effort:** ~2h.

---

## Total effort

~14h engineering. Can be sequenced as A → B → C → D (E, F parallel to D
once B is done). Full sequence completes in one focused day + one review
+ commit day if OAuth handshake goes clean.

---

## Risk register

| # | Risk | Mitigation |
|---|------|------------|
| 1 | LinkedIn "Share on LinkedIn" product might now require review despite older docs claiming self-serve | Verify at app-creation step (Phase C prep); if review needed, spec pauses at Phase C and Ruslan submits app for review in parallel |
| 2 | Vercel rebuilds on every cron commit (frontmatter-only) → deploy noise | `[skip ci]` in commit message; Vercel still triggers via git integration webhook, but at least log-filterable. If bad, add `[[skip]]` frontmatter marker + Vercel ignore build script |
| 3 | LinkedIn plain-text renderer strips something important (code blocks, tables) | Renderer emits `[code omitted — see full post]` placeholder; hook line + canonical link do the work |
| 4 | Refresh token expires (365 days) — first cliff = late September 2027 | Add `.distribution-ledger.jsonl` metadata for `refresh_token_issued_at`; Ruslan calendar reminder auto-generated from that; also refresh worker logs remaining days |
| 5 | dev.to tag limit (4 tags, hyphenated only) | Renderer clamps + slugifies before POST; validator warns at build time if frontmatter has > 4 or non-slug tags |
| 6 | Idempotency edge — publish succeeds, commit fails, ledger POST also fails | Ledger write happens on the runner FS before push; if push fails 3× runner still has the state — but runner is destroyed. Accept this small window; if it ever fires, a duplicate LinkedIn post has to be manually deleted. Acceptable |
| 7 | Publisher discovers real bug after first live post — can't unring the bell | Every publish under `--dry-run` mode first (workflow_dispatch input). First real publish is a nervous manual `workflow_dispatch dryRun=false` on `launching-the-journal` at a time Ruslan is watching |

---

## Notes on ShipLoop discipline

- Phase A + B are S-class (< 3 files each, tight scope) — can be
  implemented under sonnet if needed.
- Phase C + D + E are L — Opus for planning, sonnet for execution.
- Phase F is a skill definition (mostly markdown + templates) — sonnet
  or haiku.
- Every phase closes with a DEVLOG Problem/Decision/Result/Lesson block.
- Memory checkpoint at Sprint 14 close: `memory/iteration-14.md`.
