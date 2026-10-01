import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { load } from "js-yaml";

const SCHEDULE_PATH = path.join(process.cwd(), "content", "blog", "schedule.yml");
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const VALID_CHANNELS = new Set(["linkedin", "devto"]);

/**
 * @typedef {"linkedin" | "devto"} ScheduleChannel
 * @typedef {Partial<Record<ScheduleChannel, Date>>} ScheduleEntry
 * @typedef {Record<string, ScheduleEntry>} Schedule
 */

function fail(msg) {
  throw new Error(`[content/blog/schedule.yml] ${msg}`);
}

async function existingSlugs() {
  const files = await readdir(BLOG_DIR).catch((err) => {
    if (err && err.code === "ENOENT") return [];
    throw err;
  });
  return new Set(
    files.filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, "")),
  );
}

/** @returns {Promise<Schedule>} */
export async function readSchedule() {
  let raw;
  try {
    raw = await readFile(SCHEDULE_PATH, "utf8");
  } catch (err) {
    if (err && err.code === "ENOENT") return {};
    throw err;
  }

  let parsed;
  try {
    parsed = load(raw);
  } catch (err) {
    if (err && err.name === "YAMLException" && /empty/i.test(err.message)) {
      return {};
    }
    throw err;
  }
  if (parsed == null) return {};
  if (typeof parsed !== "object" || Array.isArray(parsed)) {
    fail("root must be a mapping of slug → { channel: datetime }");
  }

  const slugs = await existingSlugs();
  /** @type {Schedule} */
  const out = {};
  for (const [slug, entry] of Object.entries(parsed)) {
    if (!slugs.has(slug)) {
      fail(`unknown slug "${slug}" — no content/blog/${slug}.mdx found`);
    }
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      fail(`entry for "${slug}" must be an object`);
    }
    /** @type {ScheduleEntry} */
    const parsedEntry = {};
    for (const [channel, value] of Object.entries(entry)) {
      if (!VALID_CHANNELS.has(channel)) {
        fail(
          `unknown channel "${channel}" for "${slug}" — must be one of ${[...VALID_CHANNELS].join(", ")}`,
        );
      }
      let date;
      if (value instanceof Date) date = value;
      else if (typeof value === "string") date = new Date(value);
      else fail(`${slug}.${channel} must be an ISO-8601 datetime string`);
      if (Number.isNaN(date.getTime())) {
        fail(`${slug}.${channel} unparseable as datetime`);
      }
      parsedEntry[channel] = date;
    }
    out[slug] = parsedEntry;
  }
  return out;
}
