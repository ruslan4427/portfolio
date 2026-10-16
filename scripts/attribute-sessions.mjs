#!/usr/bin/env node
// Reads every *.jsonl under ~/.claude/projects/-Users-ruslan/, counts
// project-keyword hits per session, classifies SINGLE / MIXED /
// UNCLASSIFIED against REORG_TARGETS, writes tmp/attribution-report.csv.
//
// Streaming parse — handles the 163MB session in the directory without
// loading it into memory.

import { createReadStream } from "node:fs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import {
  ATTRIBUTION_KEYWORDS,
  CONTEXT_TARGETS,
  REORG_TARGETS,
} from "./__fixtures__/attribution-keywords.mjs";

const HOME_DIR_SESSIONS = join(homedir(), ".claude/projects/-Users-ruslan");
const OUT_DIR = join(process.cwd(), "tmp");
const OUT_CSV = join(OUT_DIR, "attribution-report.csv");
const HIT_THRESHOLD = 3;

/** @param {unknown} v */
function extractText(v) {
  if (typeof v === "string") return v;
  if (!v || typeof v !== "object") return "";
  if (Array.isArray(v)) return v.map(extractText).join(" ");
  const obj = /** @type {Record<string, unknown>} */ (v);
  if (typeof obj.text === "string") return obj.text;
  if (typeof obj.content === "string") return obj.content;
  if (Array.isArray(obj.content)) return extractText(obj.content);
  return "";
}

/** @param {Record<string, unknown>} line */
function textFromLine(line) {
  const t = line.type;
  if (t === "queue-operation" && typeof line.content === "string") {
    return line.content;
  }
  if (t === "user" || t === "assistant") {
    const msg = /** @type {Record<string, unknown> | undefined} */ (line.message);
    if (!msg) return "";
    return extractText(msg.content);
  }
  if (t === "ai-title" && typeof line.aiTitle === "string") {
    return line.aiTitle;
  }
  return "";
}

/** @param {string} haystack @param {string} needle */
function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  let count = 0;
  let idx = 0;
  while ((idx = haystack.indexOf(needle, idx)) !== -1) {
    count += 1;
    idx += needle.length;
  }
  return count;
}

/** @param {string} filePath */
async function processSession(filePath) {
  const text = [];
  let firstTs = null;
  let lastTs = null;
  let messageCount = 0;

  const rl = createInterface({
    input: createReadStream(filePath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line) continue;
    let obj;
    try {
      obj = JSON.parse(line);
    } catch {
      continue;
    }
    const ts = typeof obj.timestamp === "string" ? obj.timestamp : null;
    if (ts) {
      if (!firstTs || ts < firstTs) firstTs = ts;
      if (!lastTs || ts > lastTs) lastTs = ts;
    }
    if (obj.type === "user" || obj.type === "assistant") {
      messageCount += 1;
    }
    const t = textFromLine(obj);
    if (t) text.push(t);
  }

  const corpus = text.join(" ").toLowerCase();

  /** @type {Record<string, number>} */
  const hits = {};
  for (const [project, keywords] of Object.entries(ATTRIBUTION_KEYWORDS)) {
    let total = 0;
    for (const kw of keywords) {
      total += countOccurrences(corpus, kw.toLowerCase());
    }
    hits[project] = total;
  }

  return { hits, firstTs, lastTs, messageCount, corpusLength: corpus.length };
}

/** @param {Record<string, number>} hits */
function classify(hits) {
  const scoringReorgTargets = REORG_TARGETS.filter(
    (p) => (hits[p] ?? 0) >= HIT_THRESHOLD,
  );
  if (scoringReorgTargets.length === 1) {
    return { classification: "SINGLE", projectSlug: scoringReorgTargets[0] };
  }
  if (scoringReorgTargets.length >= 2) {
    return { classification: "MIXED", projectSlug: scoringReorgTargets.join("+") };
  }
  const scoringContext = CONTEXT_TARGETS.filter(
    (p) => (hits[p] ?? 0) >= HIT_THRESHOLD,
  );
  if (scoringContext.length > 0) {
    return {
      classification: "CONTEXT_ONLY",
      projectSlug: scoringContext.join("+"),
    };
  }
  return { classification: "UNCLASSIFIED", projectSlug: "" };
}

/** @param {string} v */
function csvCell(v) {
  const s = String(v ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

async function main() {
  const files = (await readdir(HOME_DIR_SESSIONS))
    .filter((f) => f.endsWith(".jsonl"))
    .sort();

  console.log(`Scanning ${files.length} sessions in ${HOME_DIR_SESSIONS}`);

  const rows = [];
  const summary = {
    SINGLE: 0,
    MIXED: 0,
    CONTEXT_ONLY: 0,
    UNCLASSIFIED: 0,
  };
  /** @type {Record<string, number>} */
  const singleByProject = {};

  let i = 0;
  for (const f of files) {
    i += 1;
    const sessionId = f.replace(/\.jsonl$/, "");
    const result = await processSession(join(HOME_DIR_SESSIONS, f));
    const { classification, projectSlug } = classify(result.hits);
    summary[classification] = (summary[classification] ?? 0) + 1;
    if (classification === "SINGLE") {
      singleByProject[projectSlug] = (singleByProject[projectSlug] ?? 0) + 1;
    }
    rows.push({
      session_id: sessionId,
      project_slug: projectSlug,
      classification,
      hit_counts_json: JSON.stringify(result.hits),
      first_message_ts: result.firstTs ?? "",
      last_message_ts: result.lastTs ?? "",
      message_count: result.messageCount,
      corpus_length: result.corpusLength,
    });
    if (i % 10 === 0 || i === files.length) {
      process.stdout.write(`\r  ${i}/${files.length} processed`);
    }
  }
  process.stdout.write("\n");

  await mkdir(OUT_DIR, { recursive: true });
  const header = [
    "session_id",
    "project_slug",
    "classification",
    "hit_counts_json",
    "first_message_ts",
    "last_message_ts",
    "message_count",
    "corpus_length",
  ];
  const csv = [
    header.join(","),
    ...rows.map((r) => header.map((h) => csvCell(r[h])).join(",")),
  ].join("\n");
  await writeFile(OUT_CSV, csv + "\n", "utf8");

  console.log(`\nReport written: ${OUT_CSV}`);
  console.log("\nClassification summary:");
  for (const [cls, n] of Object.entries(summary)) {
    console.log(`  ${cls.padEnd(14)} ${n}`);
  }
  console.log("\nSINGLE breakdown (REORG targets):");
  for (const p of REORG_TARGETS) {
    console.log(`  ${p.padEnd(16)} ${singleByProject[p] ?? 0}`);
  }
  const singleTotal = summary.SINGLE ?? 0;
  const total = files.length;
  const rate = total > 0 ? ((singleTotal / total) * 100).toFixed(1) : "0.0";
  console.log(
    `\nSINGLE rate: ${singleTotal}/${total} = ${rate}%  (bail-out trigger: < 50%)`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
