# Plan — Sprint 19 · Design system v2

**Spec.** `specs/19-design-system-v2/spec.md`

1. **Tokens (no visual change).** Merge `tokens-v2.css` into
   `app/globals.css` — `:root` additions, reduced-motion override, `@theme`
   mappings; point `@theme` radii at `var(--radius-*)`. Build + lint.
2. **Type migration.** Map each `text-[clamp(...)]` to the nearest scale step
   (table on the artboard: 6 → xl, 7 → l, 8 → m, 5 → s). Replace
   `text-[10px|11px|12px]` with `text-[length:var(--text-caption)]`; drop
   `uppercase tracking-*` on labels (if §6.2 = yes).
3. **Colour migration.** `--ink-faint` text → `--ink-muted`
   (CaseStudyVisuals.tsx:59, CaseStudySchemas.tsx:452). On-dark ramp in
   FloatingEmailCTA, ProjectCard overlays, VideoModal. `--outline-strong`
   on inputs and toggles.
4. **State recipes.** FloatingEmailCTA success/error, ContactForm errors,
   RaceTimeline `rtToneClasses` before/after.
5. **Shape migration.** Footer + email panel → `--radius-panel`; inline code
   and focus outlines → `--radius-inline`; remove 4px/20px/28px literals;
   one spelling for pills.
6. **Focus.** Replace hand-rolled `ring-2 ring-ink/40` with `--focus-ring`
   via one utility.
7. **New components.** SegmentedControl, ChapterRail, StatTile, FactTile,
   LensCTA, CaseNav — built against the tokens, not yet mounted on case
   pages (that's Sprint 20).
8. **Docs.** CLAUDE.md tokens/motion/file layout (drop the stale ViewToggle
   entry and breathing-dots sentence, fix `--section-py`), STABLE_LOGIC
   rules for §4.2–4.4 and §6 outcomes, DEVLOG entry.
9. **Verify.** Re-run the 20-route sweep (screenshots, axe, DOM inventory);
   compare against `memory/qa-iteration-1.md`; write `qa-iteration-2.md`.

Risk: step 2 touches many files and can shift layout. Do it per route
group (home → marketing pages → cases → blog → tools), sweeping after each.
