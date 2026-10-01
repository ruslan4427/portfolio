# Plan — Sprint 13 · AI video pilot #1 (portfolio meta narrative)

Reads with `spec.md`. WHAT/HOW is here; WHY is in spec.

---

## 1. Order of operations

```
A. Script + inputs      (video-native script; portrait; voice seed; captions script)
B. Screen shots         (OBS shot list capture; ~9 clips; disk-committed)
C. Talking head         (HeyGen render — intro + outro; 30 sec total)
D. Voice                (ElevenLabs ICV generate for both TH segments + full voice-over)
E. Edit                 (CapCut assemble; captions; poster still; export MP4)
F. Site embed           (add <video> to /work/hrekov-dev; add captions .vtt; poster)
G. Production log post  (/blog/how-this-portfolio-shipped-on-video — process format)
H. Cross-post + ship    (YouTube public → LI native → X native → verify)
I. Retro                (7 days later — watch-through logged; go/no-go recorded)
```

Rationale:
- **A first** — the whole downstream pipeline depends on the script. Nothing else starts until Ruslan signs it off.
- **B before C** — screen recordings are cheap and free; if the shot list turns out unwatchable, we caught it before spending HeyGen credits.
- **C before D** — HeyGen render time is the longest single step (10–30 min per generation). Kick it early so voice work can happen in parallel while it renders.
- **E after A–D** — CapCut edit is the assembly step; needs all raw material on disk.
- **F immediately after E** — get the site version live-but-unlisted so YouTube gets the same file. Site version can be poster-only if YouTube hosts the actual MP4.
- **G before H** — production log is what makes the cross-post captions writable ("read the tools + cost here"). Post it *before* the cross-post so the LinkedIn caption can point at it.
- **H is the ship gate** — same day, three platforms, one push.
- **I is deferred by design** — go/no-go signal needs 7 days of watch data.

## 2. Foundation touched — full file list

### 2.1 NEW files (repo)

```
specs/13-ai-video-pilot/spec.md                       (exists)
specs/13-ai-video-pilot/plan.md                       (this file)
specs/13-ai-video-pilot/tasks.md                      (next)
content/video-scripts/hrekov-dev-pilot.md             NEW — the script, versioned
content/blog/how-this-portfolio-shipped-on-video.mdx  NEW — production log post
public/video/hrekov-dev-pilot-poster.jpg              NEW — poster still
public/video/hrekov-dev-pilot.vtt                     NEW — captions (WebVTT)
```

### 2.2 NEW files (off-repo — large binaries)

```
public/video/hrekov-dev-pilot.mp4                     NEW — only if self-hosted
                                                            (see plan §5.6)
```

If YouTube-hosted (recommended per spec §12.3), the MP4 is uploaded to YouTube; the site references the unlisted URL via `<iframe>` or a lightweight embed component.

### 2.3 NEW files (off-repo — raw production assets)

Do NOT commit to the portfolio repo. Store in a companion folder:

```
~/portfolio-video-raw/pilot-01/
  script-v1.md, script-v2.md, script-final.md
  portrait.jpg                          (Ruslan's photo, HeyGen input)
  voice-seed.mp3                        (10s conversational clip)
  heygen-intro.mp4                      (HeyGen output, ~15 sec)
  heygen-outro.mp4                      (HeyGen output, ~15 sec)
  elevenlabs-voiceover.mp3              (full 3:30 VO track)
  shot-01-memory-ls.mp4 … shot-09-vercel.mp4
  capcut-project/                       (CapCut project file)
  final-export.mp4                      (uploaded to YouTube; poster stripped for public/)
  receipts/                             (HeyGen invoice, ElevenLabs invoice)
```

Reason: portfolio repo stays lightweight; raw production is a *deliverable* per production log but not source code.

### 2.4 EDITED files

```
content/case-studies/hrekov-dev.mdx     — add video embed section between §7 and §8
components/mdx/BlogComponents.tsx       — add <VideoEmbed> component if worth
                                          generalizing; skip if one-off inline
```

### 2.5 UNCHANGED (verify only)

```
app/(marketing)/work/[slug]/page.tsx    — no change; MDX loads normally
app/(marketing)/blog/[slug]/page.tsx    — no change; new post loads via existing loader
content/blog.ts                         — verify existing format schema fits
                                          production log; do not extend schema
```

## 3. Phase A — Script + inputs

### 3.1 Script draft

`content/video-scripts/hrekov-dev-pilot.md` — Markdown file (not MDX; not rendered on site). Structure:

```markdown
# Pilot #1 — "The portfolio that documents itself"

Runtime: 3:30
Wordcount: ~530 (delivery ~150 wpm)
Voice: ElevenLabs ICV (Ruslan seed)

## Segment 1 — Hook (0:00–0:15, ~40 words)
[TALKING HEAD]
> "You're watching a video about a portfolio. …"

## Segment 2 — Problem (0:15–0:45, ~80 words)
[VOICE-OVER + BLACK CARD → cut to screen at 0:35]
> "Every LLM forgets. …"

## Segment 3 — Memory system (0:45–1:45, ~180 words)
[SCREEN: shot-01, shot-02, shot-03]
> …

(…and so on for §4 §5 §6)
```

Every segment names: runtime, wordcount, visual cue (TH / SCREEN + shot ref), delivery notes.

Ruslan iterates in this file. Diffs land as commits (small — this file is text).

### 3.2 Portrait (HeyGen photo-avatar input)

- One high-res still (2048×2048 min).
- Front-facing, neutral expression, eyes at camera, mouth closed, off-white background.
- No hat, no strong shadow, no motion blur.
- Ruslan takes with phone or picks existing headshot; committed to raw folder (not repo).

### 3.3 Voice seed (ElevenLabs ICV input)

- 10-second MP3 or WAV, mono, 44.1kHz, clean (no music, no room echo).
- **Conversational register** — not read-aloud. A snippet of Ruslan talking naturally, mid-thought.
- Pick from: existing loom recording, phone voice memo, or record fresh.

### 3.4 Caption source (VTT)

Generated from final script. WebVTT format. One cue per short clause. Times synced during edit (Phase E).

## 4. Phase B — Screen shots

OBS Studio setup:
- Canvas: 1920×1080, 30fps
- Encoder: x264, CRF 18, keyframe every 2s
- Audio: system audio muted (voice-over added in edit)
- Cursor: highlight enabled (settings → cursor → yellow highlight or CapCut post-effect)

Recording env:
- Full-screen terminal (iTerm2 or Terminal.app) with large font (16pt+, easily readable at 1080p)
- Editor theme: **LIGHT** — VS Code "Light+" or GitHub Light. Terminal LIGHT (Solarized Light or macOS "Basic" swapped to a light preset). This is a pilot-specific override for site continuity; not Ruslan's usual working theme.
- Wallpaper: paper-adjacent neutral (`#F5F4EF` if desktop supports custom hex, else nearest cream). No dark wallpaper, no photo wallpaper.
- Notifications: DND on, mail badge cleared, Slack/Discord quit
- Menu bar: hide personal indicators (VPN, iCloud names, calendar meeting titles)

For each shot in spec §6:
1. Rehearse the cursor path once.
2. Record with 2-second pre-roll + 2-second post-roll (edit trims).
3. Name `shot-NN-<label>.mp4`.
4. QA: watch playback at 100% — cursor visible, text readable, no personal info leak.

## 5. Phase C — Talking head (HeyGen, 2 avatars)

### 5.1 Account + credit

Ruslan sets up HeyGen account. Confirm $29 Creator plan (5 min video/mo — enough for ~80 sec total face-time × 2 avatars + 2 retries).

### 5.2 Guest avatar (Ruslan photo-avatar)

Upload portrait. Confirm consent checkbox. Generate silent preview to sanity-check face read.

If preview reads uncanny before lip-sync: swap portrait, retry. If portrait #2 also uncanny, pause and reconsider (spec §12.1 fallback: voice-only + screen-only).

### 5.3 Interviewer avatar (stock template, female)

Search HeyGen stock avatar library. Criteria:
- Female, native English speaker
- Apparent age 30–45
- Business-casual (no suit/tie news-anchor)
- Head-and-shoulders crop (matches guest)
- Plain or lightly-blurred background (avoid vivid office/greenroom baked bg)

Preview 2–3 candidates silently. Pick the "smart friend asking" not "TV host performing." Log the avatar name/ID in the production log.

If all female templates ship vivid backgrounds: pick least-vivid; plan a CapCut chroma-key pass in Phase E onto paper `#F5F4EF`.

### 5.4 Render — guest segments

Segments to render (individual, easier retry):
- Hook §1 (~15s), Q1 answer intro (~8s), Q2 intro (~5s), Q3 intro (~8s), Q4 intro (~8s), Close §6 (~20s) — total ~65 sec

Voice track: uploaded ElevenLabs ICV (Phase D). If HeyGen requires TTS at generation, use placeholder; swap in CapCut.

Aspect: 16:9. Resolution: 1080p. Background: paper `#F5F4EF` or nearest neutral cream. **Not pure white** (clinical). **Not warm off-cream** (hipster).

### 5.5 Render — interviewer segments

Segments to render:
- Q1 question (~7s), Q2 (~5s), Q3 (~7s), Q4 (~6s) — total ~25 sec

Voice track: uploaded ElevenLabs Rachel (Phase D). Same TTS-placeholder workaround if needed.

### 5.6 Cost checkpoint

Total planned face-time: ~90 sec across both avatars. After all renders, tally credits used. If >70% of monthly quota consumed, drop Q2 face-time (interviewer voice-only for Q2, guest answers over screen only). If >85%, ship as-is — no retry room.

## 6. Phase D — Voice (ElevenLabs, 2 voices)

### 6.1 Instant Voice Clone — guest (Ruslan)

Upload 10-sec conversational seed. Name voice "Ruslan-pilot-01". Preview a short generation to sanity-check accent + pacing.

### 6.2 Premade voice — interviewer (Rachel)

Select "Rachel" from ElevenLabs premade voices. Preview a Q-style test line ("So how does the memory system actually work?") to sanity-check register.

Fallback order: **Rachel → Sarah → Alice**. Only swap if Rachel reads flat on the actual script lines. Do not audition >2 voices — decision fatigue.

### 6.3 Voice-over generation

Two tracks:
- `elevenlabs-guest.mp3` — all guest lines (hook + 4 answers + close), ~450 words
- `elevenlabs-interviewer.mp3` — all interviewer lines (4 questions), ~50 words

Highest quality preset. Total characters ~2500 (under 10k/mo Starter). Split into per-segment clips if CapCut sync benefits — recommended.

### 6.4 Sanity-listen

Play both tracks in sequence. Check: exchange reads as conversation vs "two AIs reading unrelated scripts." If the latter: nudge Rachel's stability slider higher (more measured), nudge ICV's similarity slider higher (more Ruslan-like).

## 7. Phase E — Edit (CapCut)

### 7.1 Timeline assembly

- Track 1: video (HeyGen intro → screen shots 01–09 → HeyGen outro)
- Track 2: voice (ElevenLabs VO, aligned per segment)
- Track 3: text overlays (stat numbers appearing over screen shots — "36%", "12 sprints", "17 memory files")
- Track 4: music (Uppbeat, ducked –12dB under voice; or absent)

### 7.2 Text overlay style

- Font: system sans (CapCut default is fine — no Playfair inside video, video is *not* site chrome)
- Color: **ink `#111` on paper `#F5F4EF`** in all cases (screens are now light-themed per §4, so a single overlay treatment covers all footage). No white text — off-brand under light-monochrome lock.
- Size: readable at mobile scale (Instagram / X portrait crops sample this)
- Animation: minimal fade-in, 0.3s. No motion — matches site's `FadeUp` discipline.

### 7.3 Captions

Import WebVTT (or hand-timed inside CapCut). Style: sans-serif, white with black outline, bottom third, bottom-aligned. Toggle-visible via YouTube CC menu; embedded burned-in for social crops that don't render VTT.

### 7.4 Poster still

Pick a frame at ~0:03 (mid-hook, mouth mostly closed on avatar) OR a hero screen shot (memory `ls` output). Export as JPG, 1920×1080, quality 85. Save to raw folder AND `/public/video/hrekov-dev-pilot-poster.jpg`.

### 7.5 Export

Preset: MP4, H.264, 1080p30, bitrate ~8 Mbps. Filename `final-export.mp4`. QA: play through in QuickTime, check audio sync + caption timing.

### 7.6 Self-host vs YouTube

Locked decision (per spec §12.3): **YouTube hosts the file**; site embeds via YouTube iframe. Rationale: Vercel bandwidth quota + YouTube gives SEO + search discovery.

Site-side impact: no MP4 committed to `public/`. Only the poster + captions (VTT stays useful if we ever fall back to self-host).

Embed technique: minimal `<iframe>` wrapper, `loading="lazy"`, aspect-ratio boxed to prevent CLS. No `youtube-nocookie` (LinkedIn/YouTube tracking is user-consent-gated anyway, and we already ship EU consent + GA4 gating).

If Ruslan strongly prefers self-hosted for aesthetic reasons: commit MP4 to `public/video/`, use HTML5 `<video>`, monitor bandwidth for 30 days.

## 8. Phase F — Site embed

### 8.1 MDX edit inside `hrekov-dev.mdx`

Add a new section between existing §7 and §8. Suggested heading:

```markdown
## See it run

<div className="my-8 aspect-video overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--hairline)]">
  <iframe
    src="https://www.youtube.com/embed/<VIDEO_ID>"
    title="Pilot: The portfolio that documents itself"
    loading="lazy"
    allow="accelerometer; autoplay=false; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    className="h-full w-full border-0"
  />
</div>

A three-and-a-half minute companion to the paragraphs above. Same subject,
different bandwidth. Read the [production log](/blog/how-this-portfolio-shipped-on-video)
for tools + cost + prompts.
```

`<VIDEO_ID>` filled at ship time (Phase H, after YouTube upload).

### 8.2 Verify

- MDX still parses (Executive/Technical toggle still works).
- No CLS: aspect-ratio box holds the iframe slot before load.
- Reduce-motion: `autoplay=false` respected regardless; iframe does not autoplay.
- A11y: `title` attribute set. Captions available inside YouTube player.

## 9. Phase G — Production log blog post

### 9.1 `content/blog/how-this-portfolio-shipped-on-video.mdx`

Format: **process** (verify against `content/blog.ts` schema; if a `receipts` format exists and fits better, use that).

Frontmatter (working shape):

```yaml
---
title: "How this portfolio shipped on video (in five days, for forty-nine dollars)"
slug: how-this-portfolio-shipped-on-video
tagline: "Pilot episode #1. Full cost breakdown, tool list, and go/no-go signal for four more."
publishedAt: 2026-10-02   # target; update at ship
format: process
featured: true
---
```

### 9.2 Structure (~800 words)

1. **Hook (~100).** "The site you're reading now has a video companion. It's 3:30 long. Zero human hours in front of a camera. Here's what it cost and how it was made."
2. **Tools (~200).** Table: tool → purpose → cost → alternative considered → why picked.
3. **Prompt log (~150).** Verbatim HeyGen script input + ElevenLabs settings + CapCut export preset. Copy-pasteable.
4. **Elapsed time (~100).** Day 1 through 5 breakdown.
5. **What we cut (~100).** Runway B-roll (cost), PVC voice (time), music (nothing landed). Why each.
6. **Go/no-go criteria (~150).** What the 7-day watch data would need to say to trigger pilot #2. Locked before ship so it can't be re-litigated afterward.

## 10. Phase H — Cross-post + ship

### 10.1 YouTube

- Upload `final-export.mp4`. Set to Unlisted initially (spec §10.1).
- Title: **"How I shipped a portfolio in 12 sprints — with AI making the whole video too"** (working title; final in tasks).
- Description: template — 1-line hook, 3-line tools list, 1-line cost, `github.com/ruslan4427/portfolio` link, timestamps for the 6 segments.
- Thumbnail: uploaded poster still.
- Captions: upload `.vtt`.
- Category: Science & Technology.
- Set to Public on cross-post day.
- Copy `<VIDEO_ID>` from URL, paste into MDX (Phase F step F3 in tasks).

### 10.2 LinkedIn

- Native video upload (not link).
- Caption structure: hook (1 line) → what you're about to see (2 lines) → tools + cost (compact) → link to production log post → single hashtag `#AIWorkflow` (avoid hashtag salad — kills reach on LI).
- Post from Ruslan's account, not a page.
- No @-mentions of tool companies (removes friction, keeps positioning neutral).

### 10.3 X (Twitter)

- Native video upload (not link).
- Post 1: hook line + video.
- Post 2 (reply): 3-line tools + cost.
- Post 3 (reply): "Full production log: <link>. Repo: <link>."
- No thread longer than 3 posts. Diminishing returns after post 3 on X.

### 10.4 Site publish

Confirm production log blog post frontmatter `publishedAt` set to today. Confirm case study MDX has `<VIDEO_ID>` filled. Commit + push. Vercel builds. Verify prod.

## 11. Phase I — Retro (7 days after ship)

### 11.1 Metrics captured

- YouTube: watch-through % (from YouTube Studio Analytics), avg view duration, click-through on the GitHub link, subs +/−.
- LinkedIn: views, dwell time (if analytics visible), reactions, comments (qualitative).
- X: views, media views, engagement rate, replies/quotes.
- GA4: pageviews on `/work/hrekov-dev` week-over-week; pageviews on the production log post.

### 11.2 Go/no-go recorded

Append a "Go/no-go" section to the production log post with the actual numbers. If **go**, create task #76 (pilot #2 — Noble narrative). If **no-go**, create task with the pivot plan (screen-only, drop avatar, drop PVC, drop cost).

Either way: append a Problem/Decision/Result/Lesson entry to `DEVLOG.md` reflecting what the pilot signal actually said vs what we predicted.

## 12. What could stall — mitigations

- **HeyGen render queue backlog.** Renders can take 10–60 min. Kick renders overnight (Day 2 EOD) so Day 3 morning has them ready.
- **ElevenLabs ICV read robotic.** Try 3 different voice seeds. If all read robotic, swap to a similar stock voice (spec §12.2 fallback), document in production log.
- **CapCut export fails / freezes.** Backup: use DaVinci Resolve free tier. Same timeline, longer export. Adds 1 day if triggered.
- **YouTube upload rejected for AI content.** Not currently policy but changing fast. Fallback: self-host on Vercel (accept bandwidth risk for pilot, monitor).
- **LinkedIn suppresses AI-disclosed video.** Real risk. Fallback: don't hide, but lead the caption with the *outcome* (portfolio shipped), not the AI tools. Tools mentioned in comment 2 of the LI post.
- **Ruslan blocked on script sign-off.** After 24h of no feedback, Claude ships script v1 as-is and moves. Script iterations can happen post-record via re-voice; can't happen post-record on the visual.
- **Budget blown mid-flight.** Hard stop at $50. If HeyGen bill exceeds $30, cut outro and re-render intro at lower resolution.

## 13. Reference

- `spec.md` (this dir) — authoritative scope + criteria
- `specs/12-portfolio-meta-case-study/plan.md` — pattern reference for phase structure
- `content/case-studies/hrekov-dev.mdx` — source narrative
- `memory/portfolio_ai_video_pivot.md` — pivot rationale
- HeyGen docs — https://docs.heygen.com/ (Photo Avatar API + Studio flow)
- ElevenLabs docs — https://elevenlabs.io/docs (ICV + PVC differences)
- CapCut for Mac — https://www.capcut.com/tools/desktop-video-editor
- Uppbeat (music) — https://uppbeat.io/
