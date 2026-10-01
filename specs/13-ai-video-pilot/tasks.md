# Tasks — Sprint 13 · AI video pilot #1 (portfolio meta narrative)

Sequential within a phase; phases must complete in order (A → I). Each task
is small enough to verify in isolation. TaskList IDs assigned when each
sub-task is created.

Parent task in TaskList: **#75**.

---

## Phase A — Script + inputs (Day 1)

- [ ] **A1.** Create `content/video-scripts/hrekov-dev-pilot.md` with 6-segment
  skeleton from plan §3.1. Runtime + wordcount + visual-cue annotations per
  segment.
- [ ] **A2.** Draft script v1 — ~530 words total, hitting spec §5 arc. Claude
  drafts; Ruslan reviews.
- [x] **A3.** Ruslan portrait for HeyGen — locked 2026-09-27 as `IMG_5930.HEIC`
  (1737×3088 real phone selfie, off-white plain wall, soft fronto-lateral
  daylight, dark forest-green solid tee, direct-to-camera neutral expression,
  mouth closed). Staged at `.local-raw/video-pilot/portrait.{HEIC,jpg}`
  (gitignored via `.local-raw/` rule added same day). 4 prior candidates
  rejected: 2× Gemini-generated (stacked-synthesis drift + narrative
  contradiction of "my face"), 1× cafe environment (busy bg, cup/phone
  occluders), 1× office fluorescent overhead (flat cast, blue-folder
  occluder, up-nose low angle). Wardrobe pivot from placeholder hoodie+scarf
  to solid tee — reads cleaner in HeyGen idle chest motion.
- [x] **A4.** Voice seed for ElevenLabs ICV — captured 2026-09-27 as
  `Rainbow Lake Rd.m4a` (Voice Memos, iPhone). 68.8s mono 44.1kHz AAC 65kbps.
  Staged at `.local-raw/video-pilot/voice-seed.m4a` (original) +
  `voice-seed.wav` (16-bit PCM converted via afconvert for ElevenLabs upload
  — WAV preferred over compressed M4A for cloning fidelity). Caveats: (1)
  duration at ElevenLabs ICV minimum (60s hard floor; 3-5min ideal for
  UA-accented English), (2) bitrate is Voice Memos default lossy — acceptable
  for ICV baseline, not PVC-grade. Verify at C2 (first HeyGen+ICV preview);
  if voice reads as weak link, re-record longer/higher-quality before
  committing to full C4/C5 render passes.
- [x] **A5.** Generate WebVTT caption file from final script — created
  2026-09-27 at `content/video-scripts/hrekov-dev-pilot.vtt`. 60 cues,
  sentence-level splits, speaker distinction via `<v G>` / `<v H>` voice
  tags + STYLE block (guest #111, interviewer #3A3A38 — no "G:"/"H:" text
  rendered). Times are PLACEHOLDER based on 150wpm segment boundaries;
  re-time against actual ElevenLabs audio in Phase E5.
- [ ] **A6.** Ruslan sign-off on script v1 (or v2, v3). No further script
  rewrites after A6.

**Checkpoint A:**
- Script locked. Portrait + voice seed on disk. Captions drafted.

## Phase B — Screen shots (Day 2 morning)

- [ ] **B1.** OBS setup — 1920×1080, 30fps, x264 CRF 18, cursor highlight on.
- [ ] **B2.** Recording env prep — terminal font 16pt+, DND on, notifications
  cleared, neutral wallpaper (paper-adjacent cream). **Switch VS Code to
  "Light+" or GitHub Light + terminal to a light preset** (Solarized Light
  / macOS "Basic"). Site-continuity override for the pilot.
- [ ] **B2a.** Menu bar cleanup — hide VPN name, iCloud user, calendar meeting
  titles, any icon that leaks personal info.
- [ ] **B3.** Record shot 01 — `ls -1 memory/*.md | sort` with cursor scroll
  and highlight on `feedback_css_cascade_first.md`.
- [ ] **B4.** Record shot 02 — `cat memory/feedback_css_cascade_first.md`
  with cursor read to end.
- [ ] **B5.** Record shot 03 — `cat memory/MEMORY.md | head -20` with index
  format highlight.
- [ ] **B6.** Record shot 04 — VS Code `CLAUDE.md` scrolled to ShipLoop
  classifier table with row highlights.
- [ ] **B7.** Record shot 05 — VS Code `DEVLOG.md` top-to-bottom scroll
  showing entry count in scrollbar.
- [ ] **B8.** Record shot 06 — VS Code `STABLE_LOGIC.md` top-to-bottom scroll
  showing 9 heading count.
- [ ] **B9.** Record shot 07 — Terminal `npm run verify:numbers` → OK green.
- [ ] **B10.** Record shot 08 — Terminal `git status` clean → `git push
  origin main` → GitHub commit reachable.
- [ ] **B11.** Record shot 09 — Browser Vercel dashboard → build success →
  live URL click → `hrekov.dev/work/hrekov-dev` open.
- [ ] **B12.** QA each `shot-NN-*.mp4` at 100% playback — cursor visible,
  text readable, no personal info leak.

**Checkpoint B:**
- 9 shot files exist in raw folder. All QA-passed.

## Phase C — Talking head (Day 2 afternoon)

- [ ] **C1.** HeyGen account setup. Confirm Creator plan ($29). Log
  purchase to `receipts/`.
- [ ] **C1a.** Search HeyGen stock avatar library for interviewer per plan
  §5.3 criteria (female, native English, 30–45, business-casual,
  head-shoulders, plain bg). Preview 2–3 silently. Pick one. Log
  avatar ID in production log.
- [ ] **C2.** Upload guest portrait to HeyGen. Generate silent preview.
  Sanity-check face read.
- [ ] **C3.** If uncanny on portrait #1: try portrait #2. If still uncanny:
  consult spec §12.1 fallback (drop talking-head, ship screen-only).
- [ ] **C4.** Render 6 guest segments (hook + Q1–Q4 answer intros + close),
  each individually per plan §5.4. Save as `heygen-guest-NN-<label>.mp4`.
- [ ] **C5.** Render 4 interviewer segments (Q1–Q4 questions) per plan §5.5.
  Save as `heygen-interviewer-NN.mp4`.
- [ ] **C5a.** If interviewer avatar shipped with vivid background, run
  CapCut chroma-key pass in Phase E onto paper `#F5F4EF` (task E2a).
- [ ] **C6.** Credit checkpoint — verify <70% of monthly quota consumed.
  If over: drop Q2 interviewer face-time (voice-only), ship guest answers
  over screen for Q2.

**Checkpoint C:**
- 2 HeyGen renders on disk. Face reads acceptable.

## Phase D — Voice (Day 2 afternoon, parallel to C)

- [ ] **D1.** ElevenLabs account setup. Confirm Starter plan ($5). Log to
  `receipts/`.
- [ ] **D2.** Upload Ruslan voice seed. Name "Ruslan-pilot-01". Preview
  a short generation.
- [ ] **D2a.** Select interviewer premade voice — start with **Rachel**.
  Preview test line "So how does the memory system actually work?" to
  sanity-check register. Fallback order: Rachel → Sarah → Alice. Max 2
  auditions.
- [ ] **D3.** Generate guest VO track — paste all guest lines (hook + 4
  answers + close). Download `elevenlabs-guest.mp3`.
- [ ] **D3a.** Generate interviewer VO track — paste 4 question lines.
  Download `elevenlabs-interviewer.mp3`.
- [ ] **D4.** Sanity-listen both tracks in sequence. Does it read as
  conversation or two disconnected reads? If disconnected: tune Rachel
  stability up + Ruslan similarity up, regenerate (max 2 retries).
- [ ] **D5.** Split both tracks into per-segment clips (recommended for
  CapCut sync).

**Checkpoint D:**
- Full VO on disk. Acceptable delivery.

## Phase E — Edit (Day 3)

- [ ] **E1.** CapCut new project. Import all HeyGen renders (6 guest +
  4 interviewer) + 9 shot files + 2 VO tracks (guest + interviewer).
- [ ] **E2.** Timeline assembly per plan §7.1 — track 1 video, track 2
  guest voice, track 3 interviewer voice, track 4 text overlays.
- [ ] **E2a.** If interviewer avatar carries a vivid background, run
  CapCut chroma-key on interviewer segments to composite onto paper
  `#F5F4EF`. QA edge quality (no green fringe).
- [ ] **E3.** Sync voice to visual — align cuts to script segment
  boundaries.
- [ ] **E4.** Text overlays for stat numbers (36%, 12 sprints, 17 memory
  files, ~$50, ~5 days). Ink `#111` on paper `#F5F4EF`, sans, 0.3s fade-in.
  NO white text.
- [ ] **E5.** Import + time WebVTT captions in CapCut (or hand-time).
  Style: sans, white with black outline, bottom third.
- [ ] **E6.** Optional: audition Uppbeat tracks. If nothing fits under
  60 sec, ship voice-only.
- [ ] **E7.** Poster still — use **shot-01 frame** (`ls memory/` output), NOT
  a face frame. "There's substance inside" tone beats clickbait tone.
  Export JPG 1920×1080, quality 85. Save to
  `public/video/hrekov-dev-pilot-poster.jpg` AND raw folder.
- [ ] **E8.** Export MP4 — 1080p30, ~8 Mbps. Save `final-export.mp4`.
- [ ] **E9.** QA playback in QuickTime — audio sync, caption timing, no
  black frames, no cursor artifacts.
- [ ] **E10.** Runtime check: 3:30 ≤ runtime ≤ 4:15. If out of bounds,
  cut or extend (per spec §10.2). Dialogue format target is 4:00.

**Checkpoint E:**
- Final MP4 on disk. QA-clean. Runtime in bounds. Poster on disk (and
  in `public/video/`).

## Phase F — Site embed (Day 4 morning)

- [ ] **F1.** Confirm hosting decision — YouTube-hosted (per plan §7.6 lock).
  If Ruslan flips to self-host: copy MP4 to `public/video/` first.
- [ ] **F2.** Upload MP4 to YouTube as UNLISTED (public switch happens
  in Phase H). Copy `<VIDEO_ID>` from URL.
- [ ] **F3.** Edit `content/case-studies/hrekov-dev.mdx` — insert `## See
  it run` section between §7 and §8 with iframe embed per plan §8.1.
  Substitute real `<VIDEO_ID>`.
- [ ] **F4.** Copy captions VTT to `public/video/hrekov-dev-pilot.vtt`.
  Upload same file to YouTube for CC track.
- [ ] **F5.** Local verify: `curl http://localhost:3000/work/hrekov-dev`
  → 200; render check in browser at desktop + mobile widths — iframe
  loads, aspect box holds shape, no CLS.
- [ ] **F6.** `npm run build` clean. `verify:numbers` still passes.

**Checkpoint F:**
- Case study embeds video. Layout intact. Build green.

## Phase G — Production log blog post (Day 4 afternoon)

- [ ] **G1.** Verify `content/blog.ts` format schema — pick `process` (or
  `receipts` if present + fits). No schema extension.
- [ ] **G2.** Create `content/blog/how-this-portfolio-shipped-on-video.mdx`
  with frontmatter per plan §9.1.
- [ ] **G3.** Draft body sections 1–6 per plan §9.2 (~800 words).
- [ ] **G4.** Fill actual numbers — verified HeyGen bill, verified
  ElevenLabs bill, actual elapsed hours (from git log timestamps + rough
  session estimates).
- [ ] **G5.** Prompt log — verbatim HeyGen input, ElevenLabs settings,
  CapCut export preset. Copy-pasteable.
- [ ] **G6.** Go/no-go criteria section — LOCKED before ship. Specifies
  what 7-day watch data would need to say to trigger pilot #2.
- [ ] **G7.** Local render check — `/blog/how-this-portfolio-shipped-on-video`
  → 200, format-specific styling correct.

**Checkpoint G:**
- Production log post renders. Numbers accurate. Go/no-go criteria
  written and locked.

## Phase H — Cross-post + ship (Day 5)

- [ ] **H1.** Commit local changes: `content/video-scripts/`, MDX edits,
  poster JPG, VTT, blog post, specs/13-* — commit message
  "sprint 13: ai video pilot #1 (hrekov-dev)".
- [ ] **H2.** Push to origin/main. Watch Vercel autobuild.
- [ ] **H3.** Verify prod: `curl https://hrekov.dev/work/hrekov-dev`
  → 200; `curl https://hrekov.dev/blog/how-this-portfolio-shipped-on-video`
  → 200. Iframe loads (video still unlisted — 401 or "unavailable" reads
  are OK at this stage).
- [ ] **H4.** YouTube: flip from Unlisted → Public. Title + description +
  thumbnail + timestamps + CC track confirmed.
- [ ] **H5.** Re-verify site: iframe now serves the public video.
- [ ] **H6.** LinkedIn: native-upload MP4. Caption per plan §10.2. Publish.
- [ ] **H7.** X: post 1 (hook + video native), post 2 reply (tools + cost),
  post 3 reply (production log + repo). No further posts.
- [ ] **H8.** Confirm all 3 platforms live. Note published-at timestamps
  for the go/no-go retro.
- [ ] **H9.** Append DEVLOG entry — Problem/Decision/Result/Lesson —
  covering the ship. Meta-meta-meta.
- [ ] **H10.** TaskUpdate #75 → completed. Do NOT create pilot #2 task
  yet — waits on Phase I.

**Checkpoint H (ship gate):**
- All 17 spec §10 criteria pass.
- 3 platforms live.
- Case study video embed live in prod.
- Production log post live in prod.
- DEVLOG updated.

## Phase I — Retro (Day 12, +7 days after ship)

- [ ] **I1.** Pull YouTube watch-through %, avg view duration, CTR on
  GitHub link, subs delta.
- [ ] **I2.** Pull LinkedIn views, reactions, comment count, qualitative
  comment sample.
- [ ] **I3.** Pull X views, media views, engagement rate, reply sample.
- [ ] **I4.** Pull GA4 pageview delta on `/work/hrekov-dev` (WoW) and on
  the production log post.
- [ ] **I5.** Compare against locked go/no-go criteria from G6.
- [ ] **I6.** Append "Go/no-go" section to production log MDX with actual
  numbers + decision. Commit + push (small update).
- [ ] **I7.** Append DEVLOG entry — what the signal actually said vs
  predicted. Candidate lesson for STABLE_LOGIC promotion (video-workflow
  discipline).
- [ ] **I8.** If **GO**: create task #76 (pilot #2 — Noble narrative).
  If **NO-GO**: create task with pivot plan (screen-only, drop avatar,
  drop PVC path, drop cost).

**Checkpoint I:**
- Signal read + logged.
- Next-step task created (or explicitly not).
- DEVLOG entry appended.
