import { readFile, writeFile } from "node:fs/promises";
import matter from "gray-matter";

/**
 * Read the frontmatter block from an MDX file.
 * @returns {Promise<{ data: Record<string, unknown>, content: string }>}
 */
export async function readPostFrontmatter(mdxPath) {
  const raw = await readFile(mdxPath, "utf8");
  const { data, content } = matter(raw);
  return { data, content };
}

/**
 * Patch a single distribution channel in-place, preserving body verbatim.
 *
 * Supports both frontmatter shapes we have in the codebase:
 *   1. legacy array — `distribution: [{ channel, status, url }, ...]`
 *   2. new object   — `distribution: { linkedin: {...}, devto: {...} }`
 *
 * Writes back with gray-matter's stringify (YAML frontmatter).
 */
export async function updateDistributionChannel(mdxPath, channel, patch) {
  const raw = await readFile(mdxPath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data;

  const dist = data.distribution;

  if (Array.isArray(dist)) {
    const idx = dist.findIndex((e) => e.channel === channel);
    if (idx === -1) {
      dist.push({ channel, ...patch });
    } else {
      dist[idx] = { ...dist[idx], ...patch };
    }
  } else if (dist && typeof dist === "object") {
    dist[channel] = { ...(dist[channel] ?? {}), ...patch };
  } else {
    data.distribution = { [channel]: patch };
  }

  const out = matter.stringify(parsed.content, data);
  await writeFile(mdxPath, out, "utf8");
}
