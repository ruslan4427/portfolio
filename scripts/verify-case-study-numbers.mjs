#!/usr/bin/env node
// Fails the build if the numeric claims in hrekov-dev.mdx drift from
// disk truth (DEVLOG heading count, STABLE_LOGIC heading count, memory
// file count, sprint span). Runs as `prebuild` per package.json.
//
// Memory folder lives outside the repo (~/.claude/projects/...); on
// Vercel it's absent — the script logs and skips those checks rather
// than failing deploy on the missing local artifact.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const REPO = resolve(new URL("..", import.meta.url).pathname);
const MDX = join(REPO, "content/case-studies/hrekov-dev.mdx");
const DEVLOG = join(REPO, "DEVLOG.md");
const STABLE = join(REPO, "STABLE_LOGIC.md");
const MEMORY_DIR = join(
  homedir(),
  ".claude/projects/-Users-ruslan-portfolio/memory",
);

function fail(msg) {
  console.error(`\n✗ verify-case-study-numbers: ${msg}\n`);
  process.exit(1);
}

function readMdxDetails() {
  const source = readFileSync(MDX, "utf8");
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) fail(`no frontmatter block in ${MDX}`);
  const fm = match[1];
  const details = [];
  const re = /^\s*detail:\s*(?:"([^"]+)"|'([^']+)'|(.+))$/gm;
  let m;
  while ((m = re.exec(fm)) !== null) {
    details.push((m[1] ?? m[2] ?? m[3]).trim());
  }
  return details;
}

function countHeadings(path) {
  const src = readFileSync(path, "utf8");
  return (src.match(/^## /gm) ?? []).length;
}

function distinctSprints() {
  const src = readFileSync(DEVLOG, "utf8");
  const seen = new Set();
  for (const m of src.matchAll(/Sprint (\d+)/g)) seen.add(m[1]);
  return seen.size;
}

function devlogDaySpan() {
  const src = readFileSync(DEVLOG, "utf8");
  const dates = [...src.matchAll(/^## (2\d{3}-\d{2}-\d{2})/gm)].map(
    (m) => m[1],
  );
  if (!dates.length) return 0;
  const sorted = [...new Set(dates)].sort();
  const first = new Date(sorted[0] + "T00:00:00Z");
  const last = new Date(sorted[sorted.length - 1] + "T00:00:00Z");
  return Math.round((last - first) / 86_400_000) + 1;
}

function memoryFileCount() {
  if (!existsSync(MEMORY_DIR)) {
    console.warn(
      `⚠ memory dir not on this machine (${MEMORY_DIR}) — skipping memory checks (expected on Vercel)`,
    );
    return null;
  }
  return readdirSync(MEMORY_DIR).filter(
    (f) => f.endsWith(".md") && f !== "MEMORY.md",
  ).length;
}

const disk = {
  devlog: countHeadings(DEVLOG),
  stable: countHeadings(STABLE),
  sprints: distinctSprints(),
  daysSpan: devlogDaySpan(),
  memory: memoryFileCount(),
};

const details = readMdxDetails();
const findDetail = (needle) =>
  details.find((d) => d.toLowerCase().includes(needle));

const problems = [];

// 1. Promotion rate — "9 rules graduated from 24 journal entries · 37.5%"
{
  const claim = findDetail("graduated");
  if (!claim) problems.push('missing "promotion rate" detail (contains "graduated")');
  else {
    const m = claim.match(/(\d+)\s+rules?\s+graduated\s+from\s+(\d+).*?(\d+(?:\.\d+)?)\s*%/i);
    if (!m) problems.push(`promotion detail unparsable: "${claim}"`);
    else {
      const [, num, den, pct] = m;
      if (+num !== disk.stable) problems.push(`STABLE_LOGIC headings: MDX=${num}, disk=${disk.stable}`);
      if (+den !== disk.devlog) problems.push(`DEVLOG headings: MDX=${den}, disk=${disk.devlog}`);
      const expected = (disk.stable / disk.devlog) * 100;
      if (Math.abs(+pct - expected) > 0.5)
        problems.push(`promotion percent: MDX=${pct}%, disk=${expected.toFixed(1)}%`);
    }
  }
}

// 2. Cadence — "11 sprints across 7 calendar days · ~1.5 sprints/day"
{
  const claim = findDetail("sprints across");
  if (!claim) problems.push('missing "cadence" detail (contains "sprints across")');
  else {
    const m = claim.match(/(\d+)\s+sprints?\s+across\s+(\d+)\s+calendar\s+days/i);
    if (!m) problems.push(`cadence detail unparsable: "${claim}"`);
    else {
      const [, sprints, days] = m;
      if (+sprints !== disk.sprints) problems.push(`sprint count: MDX=${sprints}, disk=${disk.sprints}`);
      if (+days !== disk.daysSpan) problems.push(`day span: MDX=${days}, disk=${disk.daysSpan}`);
    }
  }
}

// 3. Ramp-up — "~26 min · 13 memory files × ~2 min context re-hydration each"
if (disk.memory !== null) {
  const claim = findDetail("memory files");
  if (!claim) problems.push('missing "ramp-up" detail (contains "memory files")');
  else {
    const m = claim.match(/~?(\d+)\s*min.*?(\d+)\s+memory\s+files?\s*×\s*~?(\d+)/i);
    if (!m) problems.push(`ramp-up detail unparsable: "${claim}"`);
    else {
      const [, total, files, per] = m;
      if (+files !== disk.memory) problems.push(`memory file count: MDX=${files}, disk=${disk.memory}`);
      if (+total !== +files * +per)
        problems.push(`ramp-up arithmetic: MDX ${total} ≠ ${files}×${per}=${+files * +per}`);
    }
  }
}

if (problems.length) {
  console.error("✗ case-study number drift in", MDX);
  for (const p of problems) console.error("  •", p);
  console.error("\nReconcile MDX to disk truth (source-of-truth is disk).");
  process.exit(1);
}

console.log("✓ case-study numbers match disk state", {
  devlog: disk.devlog,
  stable: disk.stable,
  sprints: disk.sprints,
  daysSpan: disk.daysSpan,
  memory: disk.memory,
});
