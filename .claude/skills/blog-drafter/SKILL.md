---
name: "blog-drafter"
description: "Convert a DEVLOG entry into a full blog post draft at content/blog/<slug>.mdx with valid frontmatter. Format-aware: build-log | pattern | case-study | skeptic. Front-loads the scaffolding so the human editing is only prose."
argument-hint: "<devlog-heading-substring> [format=<format>] [slug=<slug>]"
user-invocable: true
---

## User input

```text
$ARGUMENTS
```

Parse:
- `<devlog-heading-substring>` — required. Substring of the DEVLOG H2 line
  (`## 2026-09-29 · <title>`). If 0 matches → fail. If >1 → ask which.
- `format=` — one of `build-log` | `pattern` | `case-study` | `skeptic`.
  Default: `build-log`.
- `slug=` — kebab-case blog slug. Default: slugified DEVLOG title.

## Purpose

Take a DEVLOG entry (structured as Problem / Decision / Result / Lesson)
and emit a full `content/blog/<slug>.mdx` file with valid frontmatter and
a format-specific section skeleton. The human's only work becomes prose
polish + tagline + tags + scheduling — not scaffolding.

## Steps

1. Read `DEVLOG.md`. Grep for `<devlog-heading-substring>` in H2 lines.
   0 → fail. >1 → surface matches, ask user.
2. Extract the matched entry's Problem / Decision / Result / Lesson blocks.
3. Read `research/style-guide.md` for format-specific voice + shape guidance.
4. Load `templates/<format>.mdx`. Fill frontmatter placeholders:
   - `{{TITLE}}` — Sentence-case rewording of DEVLOG heading (drop date prefix)
   - `{{SLUG}}` — from arg or slugified title
   - `{{TAGLINE}}` — one line, ≤120 chars, action-oriented; draft from Lesson
   - `{{PUBLISHED_AT}}` — today (ISO YYYY-MM-DD)
   - `{{TAGS}}` — quoted array, extract 3–5 from DEVLOG keywords (no more; dev.to caps at 4)
   - `{{READING_TIME}}` — `Math.ceil(paragraph_count / 3)`
5. Fill body placeholders from the four DEVLOG blocks, adjusting per format
   (build-log = chronological; pattern = shape-first; case-study = outcome-
   first; skeptic = pushback-first).
6. Validate: filename == slug, format in valid enum, tags length ≤4, every
   placeholder replaced (no `{{...}}` left in output).
7. Write file to `content/blog/<slug>.mdx`.
8. `open content/blog/<slug>.mdx` (per auto-open memory: VS Code takes the
   file on `open`).
9. Print to the user:
   - Filepath created
   - Suggested `content/blog/schedule.yml` block (commented, opt-in)
   - Reminder to tighten tagline + tags + verify `readingTime`.

## Output

- One MDX file that passes `next build` on first try.
- Terminal footer with next-step commands.

## Not in scope

- Publishing (Sprint 14 cron `scripts/publish-due.mjs` handles).
- MDX → LinkedIn/dev.to plaintext rendering (`lib/distribution/render.ts`).
- Media (hero images, screenshots) — manual for now.

## Failure modes

- Multiple DEVLOG matches → present list, exit.
- Slug already exists at `content/blog/<slug>.mdx` → refuse to overwrite,
  suggest new slug.
- DEVLOG entry missing one of the four labeled blocks → warn, insert a
  `TODO:` placeholder in the corresponding body section.
