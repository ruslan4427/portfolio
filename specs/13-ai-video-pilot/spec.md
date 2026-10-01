# Spec — Sprint 13 · AI video pilot #1 (portfolio meta narrative)

**Class.** L (new content asset + new site surface + new content pipeline; > 3 files, > 1h; discovery required)
**Date.** 2026-09-27
**Owner.** Ruslan (script sign-off, voice + face seed, final publish), Claude Opus (script draft, screen-record shot list, production log, embed plumbing)
**Depends on.** #74 — meta case study `hrekov-dev` (shipped, source narrative)
**Blocks.** Scale-out to 4 more episodes (noble / angel / lexora / fieldmark), each as a separate task

---

## 1. Why this exists

The meta case study (`/work/hrekov-dev`) is prose. It describes the memory system, the ShipLoop classifier, the DEVLOG → STABLE_LOGIC promotion discipline. Prose is enough for a fractional client who already reached the site. It is not enough for the platforms where new attention actually comes from in 2026 — YouTube, LinkedIn native video, X native video.

Two questions this pilot must answer before we invest in 4 more episodes:

1. **Does fully-AI-produced video read as credible?** If HeyGen + Instant Voice Clone reads as "obviously AI, low effort," we kill it and go screen-record + real voice-over. If it reads as "AI, but on purpose, and it works," we scale.
2. **Does screen-first (not talking-head-first) actually land the pitch?** The `portfolio_ai_video_pivot` memory hints that showing the codebase / DEVLOG / memory system on screen is the real differentiator. This pilot tests that thesis with a 70/30 screen-vs-avatar ratio.

Framing throughout: **transparent AI production**. The video description names every tool used, the total cost, the total elapsed time. That transparency is the demo — anyone can copy the pipeline; the discipline is what they cannot.

## 2. What must stay the same

- Site visual system (Playfair, `#F5F4EF`, monochrome + green dot). Do not introduce a video theme.
- MDX pipeline. The pilot embeds via a small `<VideoEmbed>` MDX component (or plain HTML5 `<video>` if the MDX shell resists) inside `/work/hrekov-dev`.
- No new nav item. No `/video` section. The pilot ships as an artifact inside the meta case study body + a companion blog post (production log).
- No auto-play, no muted preview loops, no cover-image gimmicks. Video is opt-in click, per site-wide "quiet premium" register.

## 3. Positioning (locked in discovery)

- **Primary audience.** Same as meta case study — fractional client evaluating solo builder for 2–4 month engagement. Video makes the workflow *legible* faster than prose.
- **Secondary audience.** Peer practitioner / engineering manager scrolling LinkedIn or YouTube. The video is designed to survive a 3-second scroll test with a specific hook.
- **Explicitly not for.** General "AI creator" audience. This is not "watch me use Cursor." This is "watch how a shippable multi-session project actually runs."

## 4. Format lock (from discovery — no further re-litigation)

| Dimension | Locked value | Rationale |
|---|---|---|
| Runtime | 3:30–4:15 min pilot (target 4:00) | Pilot ≠ finale. Dialogue format adds ~30s vs monologue; still inside fast go/no-go read window. Full 8–12 min waits on pilot signal. |
| Format | **Dialogue** — Ruslan avatar as guest, stock female avatar as interviewer. 4 Q&A pairs sandwiched between monologue hook + close. | Monologue read as AI-lecture in 2026 → dead retention on social. Voice-only interviewer read as compromise (per Ruslan feedback 2026-09-27). Full 2-avatar dialogue is the register-appropriate choice; stock template for interviewer contains uncanny risk (pre-vetted lip-sync). |
| Screen-to-face ratio | ~60% screen-record / ~40% talking head (either speaker) | Screen still carries the meat; face-time bumped because dialogue exchanges need visual context. Total face-time budget: ~90 sec (fits HeyGen Creator plan). |
| Voice — guest | ElevenLabs Instant Voice Clone (10s Ruslan seed) | PVC training is still just a script (`voice_training/training_script.md`). ICV is passable for pilot; PVC upgrade waits on pilot signal. |
| Voice — interviewer | ElevenLabs premade voice — **Rachel** (fallback Sarah) | Rachel is the flagship warm-female "podcast host" preset, mid-tempo, matches Ruslan's cadence without over-performing. Free (already in the Starter plan character quota). |
| Talking-head tool | HeyGen Photo Avatar (Ruslan) + HeyGen Stock Template Avatar (interviewer) | Photo-avatar for guest is the mature path. Stock template for interviewer contains uncanny risk — pre-vetted, viewer instantly reads as "obviously AI stock" and moves on (bypasses uncanny valley). |
| B-roll | None (no Runway) for pilot | Runway is $$$ per generation. Screen-record is the b-roll. Cinematic inserts wait on pilot signal. |
| Editing | CapCut (free, macOS) | Sufficient for 3-min cut. No color-grade budget for pilot. |
| Music | Uppbeat free tier or none | If nothing lands under 60 sec, ship without music. |
| Script source | Written video-native from scratch | MDX prose adapted for video reads stilted. Video wants tighter hooks + shorter clauses. |
| Visual treatment | Light monochrome studio — site-aligned (paper `#F5F4EF` + ink `#111`) | Video embeds inside `/work/hrekov-dev` MDX; jarring contrast reads as external insert. Register match: quiet documentary, not TED-stage. Also: flat off-white lighting is what HeyGen's photo avatars render cleanest — dark dramatic lighting amplifies uncanny cues. |

## 5. Script — narrative arc (final wording in plan)

Working structure for ~600 spoken words (4:00 at ~150 wpm delivery). Dialogue
format: **G** = Ruslan (guest) monologue, **H↔G** = interviewer-guest exchange.

1. **Hook (0:00–0:15, ~40 words, G solo).** "You're watching a video about a portfolio. The portfolio is at hrekov.dev. My voice, my face, this whole edit — every second AI-generated. That's not the trick. The trick is what's on the other tab."
2. **Q1 — The problem + memory folder (0:15–1:30, ~180 words, H↔G).** H asks about the stateless-LLM problem. G answers with memory-folder demo (screen shows `ls memory/`, then the CSS-cascade file).
3. **Q2 — The index file (1:30–2:05, ~90 words, H↔G).** H asks "so Claude reads all 17 files every session?" G shows MEMORY.md, explains pointer pattern.
4. **Q3 — The classifier (2:05–2:55, ~135 words, H↔G).** H asks about the nine classes ("isn't that overhead?"). G walks through the ShipLoop table, defends the ceremony.
5. **Q4 — The proof (2:55–3:40, ~135 words, H↔G).** H says "prove the numbers actually match reality." G runs verify:numbers, pushes, live URL loads.
6. **Close (3:40–4:00, ~50 words, G solo).** "HeyGen for my face and hers. ElevenLabs cloned my voice and picked one for hers. OBS for the screen. CapCut for the cut. About fifty dollars, five days. Everything you saw on screen is real and public at github.com/ruslan4427/portfolio. The discipline is the moat. The tools are just today."

Script is authored in `content/video-scripts/hrekov-dev-pilot.md` — versioned, reviewable, diff-able. Not in MDX. Every line labeled `> H:` or `> G:` for edit clarity.

## 6. Shot list — screen recordings

Each shot is a discrete OBS clip, named `shot-NN-<label>.mp4`, target 8–20 sec each.

1. Terminal `ls -1 memory/*.md | sort` → cursor scroll → highlight `feedback_css_cascade_first.md`
2. `cat memory/feedback_css_cascade_first.md` → cursor read to end
3. `cat memory/MEMORY.md | head -20` → highlight index format
4. VS Code open `CLAUDE.md` → scroll to ShipLoop table → highlight rows
5. VS Code open `DEVLOG.md` → scroll to top → count entries visible in scrollbar
6. VS Code open `STABLE_LOGIC.md` → scroll top-to-bottom → title bar shows 9 headings
7. Terminal `npm run verify:numbers` → OK green line
8. Terminal `git status` clean → `git push origin main` → GitHub reachable
9. Browser Vercel dashboard → build success → live URL click → `hrekov.dev/work/hrekov-dev` open

All recordings at 1920x1080, 30fps, MP4. macOS system font, **LIGHT editor theme** (VS Code "Light+" / GitHub Light) + LIGHT terminal theme (Solarized Light / macOS Basic) — for continuity with the site's paper palette when the iframe embed sits inside `/work/hrekov-dev`. Dark theme is off-brand for this pilot even inside recorded footage.

## 7. Talking-head segments

### 7.1 Guest — Ruslan (custom photo-avatar)

- **Hook (0:00–0:15).** HeyGen avatar from Ruslan portrait. Background: paper `#F5F4EF` if HeyGen accepts custom hex, else nearest neutral cream (never white `#FFF` — clinical; never off-cream — hipster). Cropped head-and-shoulders, static wide. Voice: ElevenLabs ICV.
- **Q1–Q4 answer segments (~5–10 sec face-time each, ~30 sec total across all four).** Same avatar/crop. Hard cuts from screen back to face to open each answer, then cut back to screen for the demonstration.
- **Close (3:40–4:00).** Same avatar/crop. Different script.

Total guest face-time: ~55 sec.

### 7.2 Interviewer — stock template (female)

- **Q1–Q4 question segments (~4–8 sec each, ~25 sec total).** HeyGen stock template avatar picked via search criteria (C1a): female, native English, apparent age 30–45, business-casual, head-and-shoulders crop, plain or blurred background.
- **Composited background.** If the stock avatar ships with a coloured/office background, chroma-key it in CapCut and composite onto paper `#F5F4EF` to preserve the visual lock. If chroma-key introduces artifacts, accept the stock background only if it's neutral enough not to fight paper.
- **Not shown on screen elsewhere** — no cutaways, no reaction shots outside her own question segments. Keeps face-time budget tight.

Total interviewer face-time: ~25 sec.

Combined face-time: ~80 sec. Both avatars comfortably fit HeyGen Creator plan (5 min/mo).

### 7.3 Portrait capture spec (A3 input to HeyGen — Ruslan's avatar)

Ruslan shoots or picks a portrait with **soft natural side-light** (window light from ~45° at head-height), not overhead flat fluorescent and not dramatic single-source. Off-white plain wall behind (not textured, not deep-color, not bookshelf-busy). This lighting choice governs how HeyGen fakes head-turn animation later — soft side-light gives the avatar readable structure; flat overhead reads restless; hard drama reads uncanny.

**Locked portrait (2026-09-27):** `IMG_5930.HEIC` — 1737×3088 real phone selfie, off-white plain wall, soft fronto-lateral daylight, dark forest-green solid tee, direct-to-camera neutral expression, mouth closed, small single earring. Staged at `.local-raw/video-pilot/portrait.{HEIC,jpg}` (gitignored — never commits to repo). Wardrobe pivot from earlier "hoodie + scarf" placeholder — solid tee reads cleaner in HeyGen photo-avatar render (less texture noise around collar during idle chest motion) and does not visually collide with the site's `#22C55E` availability accent (dark forest ≠ saturated lime).

Total HeyGen runtime billed: ~30 sec (well within the free/starter tier).

## 8. Site surface — where it lives

### 8.1 Primary: embed inside `/work/hrekov-dev`

New section added to the MDX body (position: after §7 "What the machine produced," before §8 "Context re-hydration"). Heading: "See it run — 3 minute video."

Embed via HTML5 `<video>` element with:
- `controls` (native browser controls, no custom shell)
- `preload="metadata"` (do not autoload full file)
- `poster="/video/hrekov-dev-pilot-poster.jpg"` (first frame or a hand-picked still)
- Source: YouTube-hosted URL if bandwidth is a concern; self-hosted MP4 in `/public/video/` for portable pilot. Plan picks after weighing Vercel bandwidth quota.

### 8.2 Secondary: production log as blog post

New blog post at `/blog/how-this-portfolio-shipped-on-video`. Format: **process** (per `content/blog.ts` blog format schema; use `receipts` if that format exists — plan checks). Length: ~800 words. Contents:

- Total cost breakdown line-by-line
- Total elapsed time (record, script, generate, edit)
- Tool list with why-picked-vs-alternative
- Prompt log for HeyGen + ElevenLabs settings
- Go/no-go signal + what would trigger pilot #2

### 8.3 Tertiary: distribution copies

Same source video, cut for platform. All hosted on YouTube (canonical); LI + X get native-uploaded copies (higher reach than link-out on those platforms).

- YouTube: 3:30 full pilot, unlisted at first, made public on cross-post day.
- LinkedIn native: same 3:30, native-upload (no external link). LinkedIn caption ~1300 chars.
- X native: 2:20 cut (drop §4 classifier detail; keep hook + memory + close). Native-upload. Caption ~250 chars + thread with 2 stills.

## 9. Cost + time budget

**Cost cap: $50 total.** Above this, pause and escalate.

| Line item | Estimated | Notes |
|---|---|---|
| HeyGen Photo Avatar (1 month) | $29 | Cancel same month. |
| ElevenLabs Starter (1 month) | $5 | 10k characters/mo — enough for 3 iterations. |
| Uppbeat (music, optional) | $0–7 | Free tier if a track fits; skip if not. |
| Buffer | $9 | Re-generations, second HeyGen render if first fails. |
| **Total** | **~$50** | |

**Time cap: 5 elapsed days from spec to publish.** Above this, cut scope (drop close-segment, drop music, ship as screen-only) and publish.

Rough breakdown:
- Day 1: script draft + Ruslan portrait + voice seed upload
- Day 2: HeyGen intro/outro render + OBS shot list capture
- Day 3: CapCut edit (rough cut)
- Day 4: revisions + poster still + upload to YouTube
- Day 5: cross-post day (LI + X + embed + production-log blog)

## 10. Acceptance criteria

A **shipped** #75 must satisfy all of:

1. Video file exists on disk (`/public/video/hrekov-dev-pilot.mp4`) OR YouTube URL is unlisted-published, plus poster still.
2. Runtime 3:30–4:15 (target 4:00). Under 3:30 or over 4:15 = fail spec.
3. Embedded in `/work/hrekov-dev` MDX in the correct position (per §8.1). MDX still parses. Toggle still works.
4. Production log blog post published at `/blog/how-this-portfolio-shipped-on-video`. Contains cost breakdown, tool list, prompt log, elapsed time.
5. YouTube upload public (unlisted → public on cross-post day). Title, description, thumbnail set. Description ends with `github.com/ruslan4427/portfolio` link.
6. LinkedIn native post published. Native upload (not YouTube link). Caption includes "fully AI-generated" transparency line.
7. X native post published. Native upload. Thread has ≥1 still + link to full YouTube.
8. Production cost documented and ≤ $50.
9. Elapsed time documented and ≤ 5 calendar days.
10. Script committed at `content/video-scripts/hrekov-dev-pilot.md`.
11. Shot-list source clips committed to `/public/video/raw/` OR listed in production log with clip labels (large binaries decision made in plan).
12. Watch-through metric captured 7 days after cross-post — logged in the go/no-go section of the production log.
13. No auto-play. No muted preview. `controls` attribute present. `preload="metadata"`.
14. Poster still respects site palette (paper / ink; no purple / neon / video-thumbnail-standard cliches).
15. A11y: video tag has `<track kind="captions">` pointing at a WebVTT file generated from the script. Captions live at `/public/video/hrekov-dev-pilot.vtt`.
16. No visual regression on `/work/hrekov-dev` after embed. Executive/Technical toggle still switches; no CLS on video block.
17. TypeScript + build clean.

## 11. Explicit non-goals

- **No custom video player.** Use native HTML5 `<video>`. No Video.js, no Plyr.
- **No PVC (Professional Voice Clone).** Deferred to post-pilot. Instant Voice Clone is the pilot voice — imperfect on purpose.
- **No Runway B-roll.** Deferred to post-pilot.
- **No motion graphics beyond CapCut defaults.** No After Effects. Text overlays only for stat numbers (36%, 12 sprints).
- **No music-heavy soundtrack.** If Uppbeat has nothing fitting, ship silent with voice-only. Silence is on-brand.
- **No paid promotion.** Organic reach only. Pilot signal must be readable through organic performance.
- **No comparison video ("HeyGen vs Hedra") .** That's a different piece of content; not this pilot.
- **No behind-the-scenes bloopers.** Cut is cut. Production log is the transparency layer, not outtakes.
- **No new site-wide component library expansion.** `<VideoEmbed>` MDX component if created is scoped to this one file; not generalized.
- **No episode 2 planning inside this sprint.** Go/no-go decision comes 7 days post-ship. Episode 2 is a separate task, only created if signal is green.

## 12. Risks + open items

### 12.1 HeyGen photo-avatar reads as uncanny valley

Biggest risk. Mitigations:
- Only 30 seconds of face-time total. Bulk of runtime is screen.
- Static wide shot, no head-turn animation. Reduces uncanny cues.
- Transparency framing: caption + description name it as AI-generated up-front. Frames uncanny-ness as intentional demo, not accident.

Fallback if pilot render still reads wrong: cut talking-head entirely, ship as 3-min screen-only with voice-over. Do NOT re-shoot with a real camera — that breaks the "AI-produced" positioning.

### 12.2 Instant Voice Clone reads as robotic

Second-biggest. Mitigations:
- Script written for casual delivery (short clauses, contractions, one profanity-adjacent word if it lands).
- 10-second voice seed picked from Ruslan's *most conversational* audio, not his most-polished.
- Post-process: light EQ + de-ess in CapCut. No aggressive processing.

Fallback: swap to a stock ElevenLabs voice that sounds close to Ruslan; disclose in production log.

### 12.3 Vercel bandwidth quota (self-hosted MP4)

Free tier: 100GB/mo. A 3-min 1080p MP4 is ~100MB. 1000 views = 100GB → quota hit.

Decision: **YouTube-host the pilot; embed via YouTube iframe** (or use YouTube as the `<video>` source with the Watch URL through a lightweight embed shim). Self-host only the poster still + captions. Plan finalizes.

### 12.4 Watch-through metric ambiguous

If watch-through is between 25% and 40%, the go/no-go call is ambiguous. Pre-lock decision: **treat 25–40% as a soft-no. Ship pilot #2 only if the ambiguous data point comes with strong qualitative signal** (specific comments, DM outreach, followers-to-clicks conversion). Pure metric silence in the middle band = pause.

### 12.5 Script rewrites blow the time budget

If Ruslan wants 3+ script iterations, the 5-day cap slips. Mitigation: **spec §5 arc is locked**; iterations are wording-only, not structure-only. Wording iterations in Google Doc / MDX, one 30-min session each, max 3.

### 12.6 Legal — likeness for HeyGen photo avatar

HeyGen ToS require the person in the photo to consent. Ruslan is the person. Consent implicit. Only relevant if we ever ship a video with a non-Ruslan face (out of scope).

### 12.7 Cross-posting on LinkedIn day-1 vs day-3

Some creators stagger LI vs YT to avoid platform de-prioritization. Locked: **cross-post same day**. This is a pilot; ceremonial staggering costs more than the algorithm cost.

### 12.8 Production log leaks prompts that give competitors a shortcut

Not actually a risk — the memory system + spec discipline is the moat, not the specific HeyGen prompt. Log everything.

## 13. Reference material

- `specs/12-portfolio-meta-case-study/spec.md` — source narrative, positioning
- `content/case-studies/hrekov-dev.mdx` — prose to compress into video script
- `memory/portfolio_ai_video_pivot.md` — the pivot rationale (screen-first)
- `memory/portfolio_content_strategy.md` — audience/format/distribution locks
- `content/blog.ts` — blog format schema (production log post)
- HeyGen docs — Photo Avatar spec
- ElevenLabs docs — Instant Voice Clone spec + character limits
- CapCut for Mac — timeline + export presets
