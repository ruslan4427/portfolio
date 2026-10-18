// Blog post UI-rework aggregator.
//
// Reads `content/blog/*.mdx` from a project, extracts the optional
// `uiRework` frontmatter block, and summarises it into a single
// `{ backfilledFrom, totalEligible, avgHeroRegenerations, avgQaCatches,
// totalSerializerRoundTrips }` object. The companion metric to the
// `ui-ux-pro` effectiveness block on /tools — the first measurement rig
// for the design skill.
//
// Posts without `uiRework` are counted in `totalEligible` (if they
// shipped) but not in `backfilledFrom`. `avgQaCatches` is null when no
// post has a non-null qaCatches value — pre-rig posts carry null to
// distinguish "ran the pass, found zero" from "didn't run the pass."
//
// Only hrekov-dev has a `content/blog/` directory; other projects
// return null from this aggregator (the config entry has no blog
// surface at all).

import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

/** @param {string} repoPath */
async function readBlogDir(repoPath) {
  const dir = join(repoPath, "content", "blog");
  try {
    const files = await readdir(dir);
    return { dir, files: files.filter((f) => f.endsWith(".mdx")) };
  } catch (e) {
    if (e && typeof e === "object" && e.code === "ENOENT") return null;
    throw e;
  }
}

/** @param {unknown} raw */
function readUiRework(raw) {
  if (!raw || typeof raw !== "object") return null;
  const u = /** @type {Record<string, unknown>} */ (raw);
  const asInt = (v) => (typeof v === "number" && Number.isInteger(v) && v >= 0 ? v : null);
  const hero = asInt(u.heroRegenerations);
  const tone = asInt(u.toneFixes);
  const serializer = asInt(u.serializerRoundTrips);
  const qa = u.qaCatches === null ? null : asInt(u.qaCatches);
  if (hero === null || tone === null || serializer === null) return null;
  if (u.qaCatches !== null && u.qaCatches !== undefined && qa === null) return null;
  return { heroRegenerations: hero, toneFixes: tone, qaCatches: qa, serializerRoundTrips: serializer };
}

/** @param {Record<string, unknown>} fm */
function isPublished(fm) {
  if (typeof fm.publishedAt !== "string") return false;
  const today = new Date().toISOString().slice(0, 10);
  return fm.publishedAt <= today;
}

/**
 * @param {string | null | undefined} repoPath
 * @returns {Promise<{backfilledFrom: number, totalEligible: number, avgHeroRegenerations: number | null, avgQaCatches: number | null, totalSerializerRoundTrips: number, perPost: Array<{slug: string, hasRig: boolean, qaCatches: number | null | "missing"}>} | null>}
 */
export async function aggregateUiRework(repoPath) {
  if (!repoPath) return null;
  const dirInfo = await readBlogDir(repoPath);
  if (!dirInfo) return null;

  let backfilledFrom = 0;
  let totalEligible = 0;
  let heroSum = 0;
  let heroCount = 0;
  let qaSum = 0;
  let qaCount = 0;
  let serializerSum = 0;
  const perPost = [];

  for (const file of dirInfo.files) {
    const raw = await readFile(join(dirInfo.dir, file), "utf8");
    const { data } = matter(raw);
    const fm = /** @type {Record<string, unknown>} */ (data);
    if (!isPublished(fm)) continue;
    totalEligible += 1;

    const rig = readUiRework(fm.uiRework);
    if (!rig) {
      perPost.push({ slug: String(fm.slug ?? file.replace(/\.mdx$/, "")), hasRig: false, qaCatches: "missing" });
      continue;
    }

    backfilledFrom += 1;
    heroSum += rig.heroRegenerations;
    heroCount += 1;
    serializerSum += rig.serializerRoundTrips;
    if (rig.qaCatches !== null) {
      qaSum += rig.qaCatches;
      qaCount += 1;
    }
    perPost.push({
      slug: String(fm.slug ?? file.replace(/\.mdx$/, "")),
      hasRig: true,
      qaCatches: rig.qaCatches,
    });
  }

  const avgHeroRegenerations =
    heroCount === 0 ? null : Number((heroSum / heroCount).toFixed(2));
  const avgQaCatches =
    qaCount === 0 ? null : Number((qaSum / qaCount).toFixed(2));

  return {
    backfilledFrom,
    totalEligible,
    avgHeroRegenerations,
    avgQaCatches,
    totalSerializerRoundTrips: serializerSum,
    perPost,
  };
}
