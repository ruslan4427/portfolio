import { readdir } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { publishToDevto } from "../lib/distribution/devto.mjs";
import { publishToLinkedIn } from "../lib/distribution/linkedin.mjs";
import { readSchedule } from "../content/blog/schedule.mjs";
import { readPostFrontmatter, updateDistributionChannel } from "./lib/frontmatter.mjs";
import {
  hasBeenPublished,
  recordPublish,
  LEDGER_RELPATH,
} from "./lib/ledger.mjs";
import { appendDevlogEntry } from "./lib/devlog.mjs";
import {
  stageFiles,
  hasStagedChanges,
  commit,
  pushWithRetry,
} from "./lib/git.mjs";

const { values } = parseArgs({
  options: {
    "dry-run": { type: "boolean", default: false },
    "no-push": { type: "boolean", default: false },
  },
});

const dryRun = values["dry-run"];
const noPush = values["no-push"];

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const CANONICAL_BASE = "https://hrekov.dev/blog";

const PUBLISHERS = {
  devto: publishToDevto,
  linkedin: publishToLinkedIn,
};

function distributionStatus(frontmatter, channel) {
  const dist = frontmatter.distribution;
  if (Array.isArray(dist)) {
    return dist.find((e) => e.channel === channel)?.status ?? "pending";
  }
  if (dist && typeof dist === "object") {
    return dist[channel]?.status ?? "pending";
  }
  return "pending";
}

async function loadPost(slug) {
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const { data, content } = await readPostFrontmatter(mdxPath);
  return {
    mdxPath,
    post: {
      slug,
      frontmatter: data,
      mdxSource: content,
      canonicalUrl: `${CANONICAL_BASE}/${slug}`,
    },
  };
}

async function existingBlogSlugs() {
  const files = await readdir(BLOG_DIR);
  return new Set(
    files.filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, "")),
  );
}

async function computeDue(schedule, now) {
  const slugs = await existingBlogSlugs();
  const due = [];
  for (const [slug, entry] of Object.entries(schedule)) {
    if (!slugs.has(slug)) continue;
    for (const channel of Object.keys(entry)) {
      const scheduledFor = entry[channel];
      if (!(scheduledFor instanceof Date)) continue;
      if (scheduledFor.getTime() > now.getTime()) continue;
      if (await hasBeenPublished(slug, channel)) continue;
      due.push({ slug, channel, scheduledFor });
    }
  }
  return due;
}

async function publishOne({ slug, channel, scheduledFor }) {
  const { mdxPath, post } = await loadPost(slug);
  const currentStatus = distributionStatus(post.frontmatter, channel);
  if (currentStatus === "manual" || currentStatus === "posted") {
    return { skipped: `status=${currentStatus}` };
  }

  const publisher = PUBLISHERS[channel];
  if (!publisher) return { skipped: `no publisher for channel=${channel}` };

  const result = await publisher(post, { dryRun });

  if (dryRun) {
    return { ...result, mdxPath, scheduledFor, dryRun: true };
  }

  await recordPublish({
    slug,
    channel,
    publishedUrl: result.publishedUrl,
    remoteId: result.remoteId,
  });

  await updateDistributionChannel(mdxPath, channel, {
    status: "posted",
    publishedUrl: result.publishedUrl,
    postedAt: new Date().toISOString(),
  });

  return { ...result, mdxPath, scheduledFor };
}

async function main() {
  const now = new Date();
  const schedule = await readSchedule();
  const due = await computeDue(schedule, now);

  if (due.length === 0) {
    console.log("[publish-due] nothing due at", now.toISOString());
    return;
  }

  console.log(`[publish-due] ${due.length} item(s) due:`);
  for (const d of due) {
    console.log(`  · ${d.slug} → ${d.channel} (scheduled ${d.scheduledFor.toISOString()})`);
  }

  const touched = new Set();
  const publishedThisRun = [];
  const failures = [];

  for (const item of due) {
    try {
      const outcome = await publishOne(item);
      if (outcome.skipped) {
        console.log(`  · ${item.slug}/${item.channel} skipped: ${outcome.skipped}`);
        continue;
      }
      console.log(`  · ${item.slug}/${item.channel} → ${outcome.publishedUrl}`);
      publishedThisRun.push({ ...item, ...outcome });
      if (outcome.mdxPath) touched.add(path.relative(process.cwd(), outcome.mdxPath));
    } catch (err) {
      console.error(`  · ${item.slug}/${item.channel} FAILED: ${err.message}`);
      failures.push({ ...item, error: err.message });
      if (!dryRun) {
        try {
          const { mdxPath } = await loadPost(item.slug);
          await updateDistributionChannel(mdxPath, item.channel, {
            status: "failed",
            error: err.message,
            failedAt: new Date().toISOString(),
          });
          touched.add(path.relative(process.cwd(), mdxPath));
        } catch (writeErr) {
          console.error(`    (could not record failure: ${writeErr.message})`);
        }
      }
    }
  }

  if (dryRun) {
    console.log("\n[publish-due] --dry-run — skipping DEVLOG + git ops.");
    return;
  }

  if (publishedThisRun.length > 0) {
    const bullets = publishedThisRun
      .map((p) => `${p.slug}/${p.channel} → ${p.publishedUrl}`)
      .join("; ");
    await appendDevlogEntry({
      heading: "cron · cross-post batch",
      problem: `${due.length} scheduled cross-post(s) reached publish time.`,
      decision: "publish-due.mjs fired via GH Actions hourly cron.",
      result: `Published: ${bullets}. Failures: ${failures.length}.`,
      lesson: "Frontmatter status flipped; ledger entry appended; commit follows.",
    });
    touched.add("DEVLOG.md");
    touched.add(LEDGER_RELPATH);
  }

  if (touched.size === 0) {
    console.log("[publish-due] no files touched — nothing to commit.");
    return;
  }

  await stageFiles([...touched]);
  if (!(await hasStagedChanges())) {
    console.log("[publish-due] staged set empty after add — nothing to commit.");
    return;
  }

  await commit("chore(cron): publish due posts [skip ci]");
  if (noPush) {
    console.log("[publish-due] --no-push — committed locally, skipping push.");
    return;
  }
  await pushWithRetry();
  console.log("[publish-due] pushed.");
}

main().catch((err) => {
  console.error(`[publish-due] fatal: ${err.stack ?? err.message}`);
  process.exit(1);
});
