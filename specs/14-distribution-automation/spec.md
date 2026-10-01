# Spec — Sprint 14 · Distribution automation (schedule + LinkedIn + dev.to APIs)

**Class.** L (new external integrations × 2, secrets management, GH Actions cron, > 3 files)
**Date.** 2026-09-29
**Owner.** Ruslan (product decisions, one-time OAuth handshake, secret provisioning), Claude Opus (implementation)

---

## 1. Why this exists

Sprint 11 shipped the blog surface + a `BlogDistribution` frontmatter stub
(`content/blog.ts` already types `linkedin | devto | twitter` channels with
`scheduledFor` + `status: pending | posted | manual`). One post shipped
(`launching-the-journal.mdx`). Zero of them are actually cross-posted.

The content strategy locked in Sprint 10 (`research/style-guide.md`) says
distribution ceiling — not writing quality — is what caps recruiter reach.
A post that lives only at `hrekov.dev/blog/<slug>` is invisible to the
recruiter who scrolls LinkedIn on lunch or the founder who reads dev.to on
the toilet. Manual copy-paste at post time (a) rarely happens, (b) loses
the canonical URL when it does.

This sprint makes cross-posting the default: author writes MDX with a
`scheduledFor`, commits, and an hourly GitHub Actions cron publishes to
LinkedIn + dev.to at the scheduled time and mutates the frontmatter back
to `status: posted` with the published URL.

## 2. What must stay the same

- Blog schema — `BlogDistribution` type in `content/blog.ts` (already
  landed Sprint 11) is the contract. Do not widen.
- Canonical URL policy — cross-posts must set `canonical_url` (dev.to) /
  Article `originalUrl` (LinkedIn API where supported) to
  `https://hrekov.dev/blog/<slug>`. SEO parked on the source, not the
  mirror.
- Visual system, motion contract, DotGrid, monochrome + green rule —
  none of this sprint touches the UI. All work is in `.github/workflows/`,
  `scripts/`, `lib/distribution/`, and `.claude/skills/blog-drafter/`.
- ShipLoop protocol — cron commits use a bot identity but the git email
  routes to Ruslan; every publish appends a `DEVLOG.md` line so the paper
  trail is uniform with human commits.

## 3. Scope

### In

1. **Editorial calendar** — `content/blog/schedule.yml` holds per-slug
   scheduled times. Overrides frontmatter `scheduledFor` when both exist
   (calendar wins — it's the operator surface, frontmatter is a fallback).
2. **dev.to publisher** — POST `https://dev.to/api/articles` with `Api-Key`
   header. Body = MDX rendered to plain markdown + `canonical_url` +
   `published: true` + `tags` (from frontmatter). Response `url` written
   back to frontmatter.
3. **LinkedIn publisher** — POST `https://api.linkedin.com/v2/ugcPosts`
   (UGC Posts API — the self-serve surface for `w_member_social`;
   `X-Restli-Protocol-Version: 2.0.0`), Author URN = personal profile
   URN, commentary text = MDX rendered to plain-text excerpt (LI doesn't
   render markdown), canonical URL travels as `ARTICLE` media
   `originalUrl` (LinkedIn renders it as a link card, not embedded in
   commentary body). Response `x-restli-id` header → post URN → published
   URL `https://www.linkedin.com/feed/update/<urn>/` written back to
   frontmatter. Rate limit: 150 requests/day/member. **Do not use
   `/rest/posts`** — that endpoint requires Community Management API
   partner review, multi-week gate.
4. **OAuth handshake** — one-time local script that opens LinkedIn auth
   dialog with `w_member_social` + `openid profile email` scopes,
   receives the code on `http://localhost:8787/callback`, exchanges for
   access + refresh tokens, writes tokens to a `.env.distribution` file
   (git-ignored) and prints the Base64 refresh token for pasting into
   GitHub Secrets.
5. **Token refresh worker** — weekly GH Actions cron that exchanges the
   refresh token for a new access token (LinkedIn access tokens = 60 days,
   refresh tokens = 365 days). Writes new access token back into GH
   Secrets via `gh secret set` from the workflow.
6. **Publish cron** — hourly GH Actions workflow. Steps: checkout →
   Node script reads calendar + frontmatter → finds due posts → per due
   post per due channel: renders body, calls channel publisher, mutates
   frontmatter → git add + commit + push (bot identity, `[skip ci]` in
   commit message to prevent Vercel rebuild loop when only frontmatter
   flips).
7. **`.claude/skills/blog-drafter/`** — Claude Code skill: takes a
   DEVLOG entry (Problem/Decision/Result/Lesson) + a target `format`
   (`build-log` | `pattern` | etc.) and drafts a full
   `content/blog/<slug>.mdx` with valid frontmatter (`slug` derived from
   Result heading, `publishedAt` = today, `scheduledFor` fields empty
   for operator to fill in).

### Out

- **Twitter / X.** LinkedIn covers the recruiter channel; X is high-effort
  low-return for this audience. Frontmatter `twitter.status` stays
  `"manual"`, no publisher.
- **Medium.** Deprecated per content strategy (dev.to replaced it). No
  RSS import, no cross-post.
- **Analytics on cross-post performance.** GA4 shows referrer traffic;
  a proper cross-post dashboard is a later sprint.
- **Automatic retry on 5xx.** First attempt only; failure → workflow
  step fails → GH sends email → Ruslan re-runs. Retry logic waits until
  we see actual flakiness.
- **Company page posting.** Personal profile only. Company page requires
  Marketing Developer Platform review (multi-week); the "Share on
  LinkedIn" product gives us personal `w_member_social` self-serve.
- **Draft/scheduled state on the remote.** dev.to has drafts, LinkedIn
  has scheduled posts. We schedule locally (calendar) and publish live
  at fire time — no server-side draft dance.

## 4. Data model additions

### 4.1 `content/blog/schedule.yml` (new file)

```yaml
# Operator surface for scheduled cross-posts.
# Format: <slug>: { <channel>: <ISO-8601 UTC datetime> }
# Wins over frontmatter distribution.<channel>.scheduledFor when both set.
# Blank channels default to frontmatter or "unscheduled".

launching-the-journal:
  linkedin: 2026-10-01T13:00:00Z
  devto: 2026-10-01T14:00:00Z
```

Validator: fails build if slug missing from `content/blog/*.mdx`, if
datetime unparseable, if channel not in `{ linkedin, devto }`.

### 4.2 Blog frontmatter distribution block — status transitions

Already typed in `content/blog.ts` (Sprint 11). Runtime states:

- `pending` — awaiting scheduled time (frontmatter default when absent)
- `posted` — publisher succeeded; `publishedUrl` populated
- `manual` — explicitly opted-out of auto-publish (twitter default)
- `failed` — publisher raised; `error` string populated (new, additive)

Extend `DistributionChannel` type to add optional `publishedUrl?: string`
and `error?: string`. Additive change, no callers break.

### 4.3 Secrets

GitHub repository secrets:

| Name | Purpose | Source |
|------|---------|--------|
| `DEVTO_API_KEY` | dev.to per-user API key | dev.to → Settings → Extensions |
| `LINKEDIN_CLIENT_ID` | Public app ID | LinkedIn app dashboard |
| `LINKEDIN_CLIENT_SECRET` | App secret | LinkedIn app dashboard |
| `LINKEDIN_ACCESS_TOKEN` | 60-day member token | Handshake script output; refresh worker overwrites weekly |
| `LINKEDIN_REFRESH_TOKEN` | 365-day refresh token | Handshake script output; rotated at ~day 300 |
| `LINKEDIN_MEMBER_URN` | `urn:li:person:xxx` | Handshake script output (from `/v2/me`) |
| `GH_BOT_TOKEN` | Fine-grained PAT with `contents: write` on this repo | GitHub Settings → Developer settings — used only if `GITHUB_TOKEN` can't push (branch protection); default is `GITHUB_TOKEN` |

Local `.env.distribution` mirrors these keys for manual publish testing;
git-ignored, never committed.

## 5. External API contracts (reference)

### 5.1 dev.to

```
POST https://dev.to/api/articles
Api-Key: $DEVTO_API_KEY
Content-Type: application/json

{
  "article": {
    "title": "<frontmatter.title>",
    "body_markdown": "<rendered markdown>",
    "published": true,
    "canonical_url": "https://hrekov.dev/blog/<slug>",
    "tags": <frontmatter.tags.slice(0, 4)>,
    "description": "<frontmatter.tagline>"
  }
}

→ 201 { id, url, ... }
```

Failure modes: 401 (bad key), 422 (validation — usually tag limit or
duplicate title), 429 (rate limit — dev.to rate is generous, likely N/A).

### 5.2 LinkedIn (Share on LinkedIn — UGC Posts API, self-serve)

```
POST https://api.linkedin.com/v2/ugcPosts
Authorization: Bearer $LINKEDIN_ACCESS_TOKEN
X-Restli-Protocol-Version: 2.0.0
Content-Type: application/json

{
  "author": "$LINKEDIN_MEMBER_URN",
  "lifecycleState": "PUBLISHED",
  "specificContent": {
    "com.linkedin.ugc.ShareContent": {
      "shareCommentary": {
        "text": "<hook line>\n\n<body plaintext excerpt, <=2900 chars>"
      },
      "shareMediaCategory": "ARTICLE",
      "media": [{
        "status": "READY",
        "originalUrl": "https://hrekov.dev/blog/<slug>",
        "title":       { "text": "<frontmatter.title>" },
        "description": { "text": "<frontmatter.tagline>" }
      }]
    }
  },
  "visibility": {
    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
  }
}

→ 201 with x-restli-id: urn:li:share:xxxxxxxxxxxxxxx
   Published URL: https://www.linkedin.com/feed/update/<urn>/
```

**Explicit rejection of `/rest/posts`:** the newer REST Posts API (which
would use `LinkedIn-Version: 202409`) is gated behind the Community
Management API partner review, which takes weeks and requires
business-justification screening. Self-serve `w_member_social` — the
scope granted by the "Share on LinkedIn" product — only authorizes the
legacy `/v2/ugcPosts` UGC surface. UGC is deprecated in LinkedIn's
long-term roadmap but remains supported for open-permission apps and
is what we ship on.

Failure modes: 401 (token expired — refresh flow triggers, cron retries
once), 403 (scope missing — regression, workflow fails hard, Ruslan
re-runs handshake), 422 (commentary text >3000 chars — renderer clamps
at 2900, so this only fires on a renderer bug).

Rate limit: 150 requests/day per member (application-wide 100 000/day).

### 5.3 LinkedIn OAuth refresh

```
POST https://www.linkedin.com/oauth/v2/accessToken
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
&refresh_token=$LINKEDIN_REFRESH_TOKEN
&client_id=$LINKEDIN_CLIENT_ID
&client_secret=$LINKEDIN_CLIENT_SECRET

→ 200 { access_token, expires_in, refresh_token?, refresh_token_expires_in? }
```

LinkedIn sometimes returns a new refresh_token (rotation), sometimes not
(stability). Worker always writes both if present.

## 6. Security posture

- OAuth handshake is one-time, on Ruslan's Mac, over localhost — no
  redirect URI hosted anywhere the public can reach.
- Tokens live in GH Actions secrets, decrypted only at workflow runtime,
  never logged (`echo ::add-mask::` on read; publisher script never
  `console.log`s the token, only the URL response).
- Bot commits use `github-actions[bot]` identity; no personal PAT unless
  branch protection forces one.
- Publisher script is `--no-net` between reading frontmatter and calling
  publishers — no untrusted file reads inside the API call sequence.
- MDX → plain-text renderer sanitizes: strips HTML tags, escapes URLs
  through `new URL()` (drops malformed), truncates commentary at 2900
  chars with `…` suffix.
- Failure on any single post is isolated — one 422 doesn't tank the
  whole workflow; each post publishes in its own try/catch and writes
  its own status.

## 7. Success criteria

- `launching-the-journal` publishes to dev.to at the scheduled time,
  frontmatter mutates to `status: posted` with `publishedUrl` populated,
  a `DEVLOG.md` entry lands, all within 60 minutes of `scheduledFor`.
- Same post publishes to LinkedIn, canonical link visible at the bottom
  of the post body on LinkedIn.
- Refresh worker runs weekly at Monday 06:00 UTC; access token
  successfully rotates; no manual intervention.
- `.claude/skills/blog-drafter/` invoked from a DEVLOG entry produces
  a valid MDX file — passes `next build` MDX validation on first try.
- One end-to-end dry run before hooking real credentials — script has
  `--dry-run` flag that renders and logs the request bodies without
  making network calls.

## 8. Non-goals (explicit)

- No frontend UI for editing the schedule — YAML file is the operator
  surface. If demand justifies it later, that's a new spec.
- No analytics ingestion. GA4 sees the referrer traffic already.
- No email digest of publish outcomes; GH Actions email notification on
  workflow failure is enough.
- No cross-post to hosted note-taking / Mastodon / Bluesky. Scope creep
  danger; revisit if audience research changes.

## 9. Open questions (resolve before implementation)

1. **LinkedIn API version pinning.** `202409` is current at spec time.
   Do we hard-pin per script, or read from env? → **Decision:** hard-pin
   per script, bump in one place when LinkedIn deprecates. Comment cites
   the migration doc URL.
2. **Idempotency on commit-back failure.** If publish succeeds but git
   push fails, the next cron would re-publish. → **Decision:** publisher
   commits frontmatter FIRST with `status: posted, publishedUrl: <url>`
   using the response, then pushes. If push fails, retry 3× with backoff
   (2s → 8s → 32s). If still failing, workflow fails — Ruslan sees email,
   `publishedUrl` is already in the frontmatter locally on the runner
   (lost when runner destroyed), so next cron would double-post. To avoid
   this: also POST a one-line record to a private log file in the repo
   (`.distribution-ledger.jsonl`, git-ignored on Vercel side but committed
   otherwise) so the ledger persists even if commit-back fails. Cron
   consults ledger first, frontmatter second.
3. **MDX → plain text fidelity.** LinkedIn strips `**bold**`, `_italic_`,
   `[link](url)`. Renderer: keep link text, drop URL from inline links,
   append important URLs as a "Links:" block at the end. → **Confirm
   with Ruslan** before writing the renderer.
