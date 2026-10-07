const LINKEDIN_CHAR_CAP = 2900;
const SITE_BASE = "https://hrekov.dev";

function expandPhoneRowBlock(block) {
  const items = [];
  const itemRegex = /\{\s*([\s\S]*?)\s*\}/g;
  let m;
  while ((m = itemRegex.exec(block)) !== null) {
    const inner = m[1];
    const src = /src:\s*"([^"]+)"/.exec(inner)?.[1];
    if (!src) continue;
    const alt = /alt:\s*"([^"]*)"/.exec(inner)?.[1] ?? "";
    const label = /label:\s*"([^"]*)"/.exec(inner)?.[1] ?? "";
    items.push({ src, alt, label });
  }
  const captionMatch = /caption=(?:"([^"]+)"|\{`([^`]+)`\})/.exec(block);
  const caption = captionMatch?.[1] ?? captionMatch?.[2] ?? "";
  return { items, caption };
}

function phoneRowToMarkdownImages(items, caption) {
  const parts = items.map((it) => {
    const url = it.src.startsWith("http") ? it.src : `${SITE_BASE}${it.src}`;
    const alt = it.alt.replace(/\s+/g, " ").trim();
    const line = `![${alt}](${url})`;
    return it.label ? `${line}\n\n*${it.label}*` : line;
  });
  if (caption) parts.push(`*${caption}*`);
  return parts.join("\n\n");
}

function phoneRowToPlaceholder(items) {
  const n = items.length;
  return `_[${n} screenshot${n === 1 ? "" : "s"} — see full post]_`;
}

/**
 * Strip MDX-specific syntax from raw MDX so it can be published as
 * portable CommonMark (dev.to) or further reduced to plain text
 * (LinkedIn). Rules — deliberately conservative:
 *   1. Drop `import` and `export` lines.
 *   2. Drop `<TechnicalDetail>...</TechnicalDetail>` blocks (executive
 *      framing carries; deep-dive lives on canonical URL).
 *   3. Convert `<Cost label="X" value="Y" />` → `**X:** Y`.
 *   4. Convert `<Diff>` `<Artifact>` `<PromptLog>` `<MetricGrid>` blocks
 *      to a bracketed placeholder — dev.to visitors follow the canonical
 *      link for the interactive versions.
 *   5. `<PhoneRow>` — in `images: "inline"` mode (default) expand to
 *      absolute-URL markdown images; in `"placeholder"` mode (LinkedIn)
 *      shrink to `[N screenshots — see full post]`.
 *   6. Leave regular markdown untouched.
 *
 * @param {string} source
 * @param {{ images?: "inline" | "placeholder" }} [opts]
 */
function stripMdxForMarkdown(source, opts = {}) {
  const imageMode = opts.images ?? "inline";
  let out = source;

  out = out.replace(/^\s*import\s.+?;?\s*$/gm, "");
  out = out.replace(/^\s*export\s.+?;?\s*$/gm, "");

  out = out.replace(/<TechnicalDetail\b[^>]*>[\s\S]*?<\/TechnicalDetail>/g, "");

  out = out.replace(
    /<Cost\s+([^>]+?)\s*\/>/g,
    (_, attrs) => {
      const label = /label="([^"]+)"/.exec(attrs)?.[1];
      const value = /value="([^"]+)"/.exec(attrs)?.[1];
      if (label && value) return `**${label}:** ${value}`;
      return "";
    },
  );

  out = out.replace(
    /<PhoneRow\b[\s\S]*?\/>/g,
    (match) => {
      const { items, caption } = expandPhoneRowBlock(match);
      if (items.length === 0) return "";
      return imageMode === "placeholder"
        ? phoneRowToPlaceholder(items)
        : phoneRowToMarkdownImages(items, caption);
    },
  );

  out = out.replace(
    /<(Diff|Artifact|PromptLog|MetricGrid)\b[^>]*(?:\/>|>[\s\S]*?<\/\1>)/g,
    (_, name) => `_[${name} — see full post]_`,
  );

  out = out.replace(
    /<div\b[^>]*className=(?:"[^"]*"|\{[^}]*\})[^>]*>([\s\S]*?)<\/div>/g,
    "$1",
  );

  out = out.replace(/\n{3,}/g, "\n\n");

  return out.trim();
}

/**
 * Build the dev.to article body — canonical link is set via the API's
 * `canonical_url` field, not inline.
 */
export function renderMarkdownForDevto(mdxSource /*, frontmatter */) {
  return stripMdxForMarkdown(mdxSource);
}

/**
 * Reduce MDX to LinkedIn plain text.
 *
 *   - Headings become paragraphs (LinkedIn has no `#` styling).
 *   - Links `[title](url)` → `title (url)`.
 *   - Bold/italic markers stripped.
 *   - Code fences → `[code omitted — see full post]`.
 *   - Inline code → the code text, unwrapped.
 *   - JSX components handled as in stripMdxForMarkdown.
 *   - First paragraph becomes the hook (no prefix added — LinkedIn
 *     truncates after ~200 chars in-feed, so first sentence matters).
 *   - Canonical link appended as `Full post: <url>`.
 *   - Hard cap 2900 chars (LinkedIn UGC limit is 3000; we leave 100 for
 *     the "…" + canonical suffix).
 */
export function renderPlainTextForLinkedIn(mdxSource, frontmatter, canonicalUrl) {
  let body = stripMdxForMarkdown(mdxSource, { images: "placeholder" });

  body = body.replace(/```[\s\S]*?```/g, "\n[code omitted — see full post]\n");
  body = body.replace(/`([^`]+)`/g, "$1");

  body = body.replace(/^#{1,6}\s+/gm, "");

  body = body.replace(/\*\*([^*]+)\*\*/g, "$1");
  body = body.replace(/__([^_]+)__/g, "$1");
  body = body.replace(/(?<![*])\*([^*\n]+)\*(?![*])/g, "$1");
  body = body.replace(/(?<![_\w])_([^_\n]+?)_(?![_\w])/g, "$1");

  body = body.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");

  body = body.replace(/^\s*[-*]\s+/gm, "• ");

  body = body.replace(/\n{3,}/g, "\n\n").trim();

  const suffix = `\n\nFull post: ${canonicalUrl}`;
  const budget = LINKEDIN_CHAR_CAP - suffix.length;
  if (body.length > budget) {
    body = body.slice(0, budget - 1).trimEnd() + "…";
  }

  return body + suffix;
}

export const _internals = { stripMdxForMarkdown, LINKEDIN_CHAR_CAP };
