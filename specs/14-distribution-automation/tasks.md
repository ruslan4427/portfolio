# Tasks — Sprint 14 · Distribution automation

Sequential within a phase; phases A → B → C → D → E → F. B unblocks C
via publisher signatures. D unblocks after B and C. E and F can start
after D.

---

## Phase A — Editorial calendar

- [ ] **A1.** Create `content/blog/schedule.yml` with a commented
  scaffold + one placeholder entry for `launching-the-journal` (times
  set to a far-future date so it doesn't publish during setup).
- [ ] **A2.** Create `content/blog/schedule.mjs` — exports
  `readSchedule()` returning `Record<slug, { linkedin?: Date; devto?: Date }>`.
  Uses `js-yaml` (already in deps). Throws on malformed YAML, unknown
  channel, unparseable ISO date, or slug not present in
  `content/blog/*.mdx`. (Consumed only by cron scripts, so `.mjs` — no
  Next runtime dependency.)
- [ ] **A3.** Extend `content/blog.ts` — `DistributionChannel` gets
  optional `publishedUrl?: string` and `error?: string`. Additive; no
  callers break. Include validator entries for both.
- [ ] **A4.** Add `.env.distribution` to `.gitignore`. Add
  `.env.distribution.example` (checked in, empty values, comments
  describing what each secret is + how to obtain).
- [ ] **A5.** Verify — `npx tsc --noEmit` clean; run
  `node --input-type=module -e "import('./content/blog/schedule.mjs').then(m => m.readSchedule()).then(s => console.log(JSON.stringify(s, null, 2)))"`
  and confirm no errors.

## Phase B — Publisher library

- [ ] **B1.** Create `lib/distribution/types.mjs` — JSDoc typedefs only
  (no runtime code): `PublishResult` (`{ publishedUrl, remoteId }`),
  `PublishOptions` (`{ dryRun, log? }`), `Publisher` (function).
- [ ] **B2.** Create `lib/distribution/render.mjs` — export
  `renderMarkdownForDevto(mdxSource, frontmatter)` and
  `renderPlainTextForLinkedIn(mdxSource, frontmatter, canonicalUrl)`.
  - dev.to renderer: strip MDX imports + JSX components (regex is
    sufficient given our component surface). Body remains valid
    dev.to-flavored markdown.
  - LinkedIn renderer: reduce to plain text with `[title](url)` →
    `title (url)`, `**bold**` → `bold`, code blocks → `[code omitted]`,
    hook line = first paragraph, canonical link appended as trailing
    `Full post: <url>`, hard cap 2900 chars with `…` suffix.
  - Add renderer smoke script `scripts/render-smoke.mjs` covering:
    heading strip, link preserve, code omit placeholder, 2900-char clamp.
- [ ] **B3.** Create `lib/distribution/devto.mjs` — exports
  `publishToDevto(post, opts)`. Reads `DEVTO_API_KEY` from env.
  `dryRun`: logs request body, returns a synthetic
  `{ publishedUrl: "https://dev.to/dryrun/<slug>", remoteId: "dryrun-<slug>" }`.
- [ ] **B4.** Create `lib/distribution/linkedin.mjs` — exports
  `publishToLinkedIn(post, opts)`. Reads `LINKEDIN_ACCESS_TOKEN` +
  `LINKEDIN_MEMBER_URN` from env. Hits
  `POST https://api.linkedin.com/v2/ugcPosts` with headers
  `Authorization: Bearer <token>`, `X-Restli-Protocol-Version: 2.0.0`,
  `Content-Type: application/json` (do NOT set `LinkedIn-Version` —
  that header belongs to the review-gated `/rest/posts` surface).
  Body = UGC ShareContent with `shareCommentary.text` + `ARTICLE`
  media pointing to canonical URL. Response URN read from `x-restli-id`
  header (201 = success). On 401 raises `LinkedInAuthError` so cron
  can trigger refresh + retry once.
- [ ] **B5.** Manual verification — create `scripts/publish-one.mjs`
  harness that takes `--slug <s> --channel devto --dry-run`, run
  against `launching-the-journal`, verify request body looks right.
  Then run `--channel linkedin --dry-run`, same.

## Phase C — OAuth handshake script

- [ ] **C1.** LinkedIn App creation (Ruslan does): create app at
  `https://www.linkedin.com/developers/apps`, name "hrekov.dev
  distribution", associate with a Company page (LinkedIn requires one
  even for personal posting — the requirement doesn't force company
  posting), add "Share on LinkedIn" + "Sign In with LinkedIn using
  OpenID Connect" products, register `http://localhost:8787/callback`
  as authorized redirect URL. Note client ID + secret.
- [ ] **C2.** Create `scripts/linkedin-oauth.mjs` — the one-time
  handshake script. Uses Node's `http` for the callback server,
  `child_process.exec('open <url>')` for browser launch,
  `crypto.randomUUID()` for state.
  - Exchanges code for tokens via
    `POST https://www.linkedin.com/oauth/v2/accessToken`.
  - Fetches member info from `GET https://api.linkedin.com/v2/userinfo`
    (OpenID) — grabs `sub` field, formats as
    `urn:li:person:<sub>` (member URN).
  - Writes `.env.distribution` with all six values (client id, secret,
    access token, refresh token, member URN, refresh token issued at).
  - Prints paste-block to stdout: exactly what to `gh secret set` for
    each key.
- [ ] **C3.** Run handshake, populate GH secrets. Verify `node
  scripts/publish-one.mjs --slug launching-the-journal --channel
  linkedin --dry-run` succeeds using the new token (dry-run still
  requires token load — because `getEnv()` throws on missing).
- [ ] **C4.** Document the handshake in `DEVLOG.md` — one entry
  covering: LinkedIn app config, first token issuance timestamp,
  scope granted, redirect URI. Future-you cares.

## Phase D — Publish cron

- [ ] **D1.** Create `scripts/lib/git.mjs` — helpers `stageFile(path)`,
  `commit(message, opts?)`, `pushWithRetry(retries = 3)`. Configures
  `user.name` + `user.email` at first call. Emits shell errors as
  thrown Node errors with the stderr preserved.
- [ ] **D2.** Create `scripts/lib/devlog.mjs` — `appendDevlogEntry({
  heading, problem, decision, result, lesson })`. Formats to match
  existing `DEVLOG.md` style (H2 with date + slug, four labeled
  paragraphs, trailing `---`).
- [ ] **D3.** Create `scripts/lib/frontmatter.mjs` — pure functions
  `readPostFrontmatter(mdxPath)`, `updateDistributionChannel(mdxPath,
  channel, patch)` — parses with `gray-matter`, writes back
  preserving body verbatim.
- [ ] **D4.** Create `scripts/lib/ledger.mjs` — reads + appends to
  `.distribution-ledger.jsonl`. `hasBeenPublished(slug, channel):
  boolean`, `recordPublish({ slug, channel, publishedUrl, ts, remoteId })`.
  Ledger is committed to repo (small, append-only, resistant to
  frontmatter mutation bugs).
- [ ] **D5.** Create `scripts/publish-due.mjs` — orchestrator.
  - Load blog posts + schedule.
  - For each `(slug, channel)`: due if `schedule[slug][channel] <=
    now && frontmatter.distribution[channel].status === "pending" &&
    !ledger.hasBeenPublished(slug, channel)`.
  - For each due: call publisher. On success: `ledger.recordPublish`
    → `updateDistributionChannel` (status: "posted", publishedUrl) →
    `appendDevlogEntry`. On failure: `updateDistributionChannel`
    (status: "failed", error).
  - After all posts: `git add content/blog/*.mdx DEVLOG.md
    .distribution-ledger.jsonl` → `commit("chore(cron): publish due
    posts [skip ci]")` → `pushWithRetry()`.
  - CLI flag `--dry-run` skips publishers' network calls AND skips
    frontmatter mutation + git ops.
- [ ] **D6.** Create `.github/workflows/publish-blog.yml`:
  ```yaml
  name: Publish blog
  on:
    schedule:
      - cron: '15 * * * *'
    workflow_dispatch:
      inputs:
        dryRun:
          type: boolean
          default: true
  jobs:
    publish:
      runs-on: ubuntu-latest
      permissions:
        contents: write
      steps:
        - uses: actions/checkout@v4
          with:
            token: ${{ secrets.GITHUB_TOKEN }}
        - uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: npm
        - run: npm ci --ignore-scripts
        - name: Publish due posts
          env:
            DEVTO_API_KEY: ${{ secrets.DEVTO_API_KEY }}
            LINKEDIN_ACCESS_TOKEN: ${{ secrets.LINKEDIN_ACCESS_TOKEN }}
            LINKEDIN_MEMBER_URN: ${{ secrets.LINKEDIN_MEMBER_URN }}
            LINKEDIN_CLIENT_ID: ${{ secrets.LINKEDIN_CLIENT_ID }}
            LINKEDIN_CLIENT_SECRET: ${{ secrets.LINKEDIN_CLIENT_SECRET }}
            LINKEDIN_REFRESH_TOKEN: ${{ secrets.LINKEDIN_REFRESH_TOKEN }}
          run: |
            node scripts/publish-due.mjs \
              ${{ (github.event_name == 'workflow_dispatch' && inputs.dryRun) && '--dry-run' || '' }}
  ```
- [ ] **D7.** First live test — set `launching-the-journal` `devto`
  scheduled for 10 minutes from now, run `workflow_dispatch dryRun=true`
  first (verify request body in logs), then let the hourly cron fire
  live. Watch dev.to for the post + frontmatter for the mutation.
- [ ] **D8.** Same test flow for LinkedIn channel.
- [ ] **D9.** DEVLOG entry — mark Phase D shipped with observed
  latency, first published URLs, any surprises.

## Phase E — Refresh worker

- [ ] **E1.** Create `scripts/linkedin-refresh.mjs` — exchanges refresh
  token, prints new tokens as `gh secret set` commands OR (if `GH_TOKEN`
  present in env) invokes them via child_process. Includes `expiresIn`
  and `refreshTokenExpiresIn` logging.
- [ ] **E2.** GH secret `GH_ADMIN_TOKEN` — Ruslan creates fine-grained
  PAT scoped to `secrets: write` on this repo only. Adds to repo
  secrets.
- [ ] **E3.** Create `.github/workflows/linkedin-refresh.yml`:
  ```yaml
  name: Refresh LinkedIn token
  on:
    schedule:
      - cron: '0 6 * * 1'
    workflow_dispatch:
  jobs:
    refresh:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: npm
        - run: npm ci --ignore-scripts
        - env:
            LINKEDIN_CLIENT_ID: ${{ secrets.LINKEDIN_CLIENT_ID }}
            LINKEDIN_CLIENT_SECRET: ${{ secrets.LINKEDIN_CLIENT_SECRET }}
            LINKEDIN_REFRESH_TOKEN: ${{ secrets.LINKEDIN_REFRESH_TOKEN }}
            GH_TOKEN: ${{ secrets.GH_ADMIN_TOKEN }}
          run: node scripts/linkedin-refresh.mjs
  ```
- [ ] **E4.** Manual `workflow_dispatch` — confirm secret rotation
  visible in repo secret's "Updated" timestamp; confirm new access
  token works via a dry-run publish call.
- [ ] **E5.** DEVLOG entry — capture the token expiry math + calendar
  reminder for refresh-token cliff (year from initial handshake).

## Phase F — blog-drafter Claude Code skill

- [ ] **F1.** Create `.claude/skills/blog-drafter/SKILL.md` — trigger
  phrase `/blog-drafter <devlog-heading>`, describes inputs, outputs,
  the 7 steps from spec §F, reference to `research/style-guide.md` for
  format definitions.
- [ ] **F2.** Create four templates in
  `.claude/skills/blog-drafter/templates/` — one per BlogFormat
  (`build-log`, `pattern`, `case-study`, `skeptic`). Each ships full
  frontmatter placeholders + Format-specific section outlines from the
  style guide.
- [ ] **F3.** Manual dogfood — pick one un-shipped DEVLOG entry (e.g.,
  today's P1.1 pivot), run the skill on it, verify output MDX file
  passes `next build`. Iterate until first-try success.
- [ ] **F4.** DEVLOG entry — record the first successful chernetka
  generation with generation time + drift observed.

---

## Sprint close checklist

- [ ] All 6 case study + 1 blog post routes still build clean.
- [ ] `node scripts/render-smoke.mjs` passes.
- [ ] `npx tsc --noEmit` clean.
- [ ] `launching-the-journal` visible on dev.to + LinkedIn with
  canonical URL pointing back to hrekov.dev.
- [ ] `memory/iteration-14.md` written with: which phases shipped,
  what got deferred, first observed cron latency, LinkedIn token
  expiry date, refresh token expiry date.
- [ ] STABLE_LOGIC.md gains an entry for any locked idempotency
  invariants (ledger-then-frontmatter-then-git ordering).
