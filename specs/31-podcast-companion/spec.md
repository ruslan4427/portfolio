# Spec 31 — Podcast companion (case-study template)

Status: prototype on `feat/podcast-companion` (PR #18). The 3–4 min audio is
not recorded yet; this spec is the **format requirement** that recording must
meet.

## Problem

Case studies carried 8-minute video chunks embedded in the body. Nobody reads
and watches at once, and the video didn't say which part of the text it was
about. We want a companion that:

1. makes it obvious **which part of the case the podcast is talking about**,
2. never hijacks reading (no surprise audio, no replaced cursor),
3. works the same on phone and desktop,
4. lets a viewer switch audio ↔ video **without losing the moment**.

## Audience check

The primary audience is recruiters/hiring managers, who skim. The companion is
**opt-in** and stays quiet until asked. Reading the text alone must stay the
complete experience.

## Rejected (and why)

| Idea | Why not |
|---|---|
| Cursor is the player, click on text plays | Accidental triggers for skim-clickers; replaces the I-beam on a reading page; does nothing on touch. |
| Full-width bottom bar on mobile | Competes with BackToTop + feedback CTA; a second player chrome to maintain. |
| Word/paragraph highlight (read-along) | Only honest for a narration of the page text; our format is a conversation about it. |

## UX (what ships)

1. **Chapter cue above a heading.** For each chapter, a one-line cue sits above
   the heading of the first section the chapter covers: `▶ Listen · 2:30 ·
   40 s` plus the chapter gist. It is a real `<button>`, so it works with touch
   and keyboard. While its chapter plays it reads `❚❚ Now playing · 2:47`.
2. **Now-playing rule.** Every section the current chapter covers gets a brick
   rule in the left margin. The chapter rail marks the same sections. When
   paused, the rule dims.
3. **Moment dock (right edge, vertically centred).**
   - Desktop: shown while the reader is in the article.
   - Phone: shown only once playback has started.
   - Shows the avatar with a progress ring. Hover reveals `Watch § 5–6 · from 2:33`.
4. **Round video.** Clicking the dock (or pressing `V`) opens the video in a
   circle at the same second as the audio. If nothing has played yet, it
   starts at the chapter of the section being read.
   - `Audio only` hands the second back to the audio.
   - `Expand` opens the full modal at the same second.
5. **Drift card.** If none of the playing chapter's sections is on screen, a
   card says `You're reading § 7–8 · the podcast is on § 5–6` and offers two
   buttons: `↑ Back to § 5–6` and `▶ Play § 7–8`.
6. Respects `prefers-reduced-motion` (no smooth scroll).

## Podcast format requirements (the template)

Any podcast attached to a case study must satisfy all of these. Items marked ⚙
are checked by `validatePodcast()` in `content/case-studies/podcasts.ts`. A
violation logs in dev and fails `npm run verify:podcasts`.

1. ⚙ **Total length ≤ 240 s.** Target 180 s.
2. ⚙ **One chapter per group of 1–3 consecutive `##` sections.** Chapters
   follow the article order, with no gaps and no overlaps. Every numbered
   section of the case belongs to exactly one chapter.
3. ⚙ **`sectionIds` must exist** in the rendered MDX. Slug rule:
   `rehype-case-sections`.
4. ⚙ **`startSec` starts at 0 and strictly increases.** Each chapter runs
   15–60 s.
5. ⚙ **Every chapter has a `gist`.** One sentence, ≤ 90 chars, saying what
   this part of the podcast claims. It appears in the cue.
6. **Open each chapter by anchoring it to the text.** The first line names the
   section's idea, e.g. "Section five — memory doesn't write itself."
   Listeners who jump in mid-page need the hook.
7. **Cut chapters on a sentence boundary** and leave ≥ 0.3 s of silence at
   each `startSec`. Seeking must not land mid-word.
8. **Video and audio share one timeline.** Same file, or identical cut, so a
   second in one is the same second in the other.
9. **Speakers talk about the text and do not read it aloud.** Numbers quoted
   must match the MDX (the `verify:numbers` rule).
10. **Square-safe framing.** The round video crops to the centre square, so
    faces stay in the middle 60 %.

## Files

- `content/case-studies/podcasts.ts`: types, data, `validatePodcast()`.
- `components/case-study/PodcastCompanion.tsx`: cue portals, dock, round
  video, drift card.
- `app/globals.css`: now-playing rule and rail marks.
- `scripts/verify-podcasts.mjs`: build-time check against the MDX headings.

## Open

- Analytics: emit `podcast_play` (chapter), `podcast_video_open`, and
  `podcast_drift_action`, so we learn whether recruiters use it at all.
- Recording the hrekov-dev recut to this format.
