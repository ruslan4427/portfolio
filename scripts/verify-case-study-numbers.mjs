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
const NOBLE_MDX = join(REPO, "content/case-studies/noble-saas.mdx");
const PROJECTS = join(REPO, "content/projects.ts");
const DEVLOG = join(REPO, "DEVLOG.md");
const STABLE = join(REPO, "STABLE_LOGIC.md");
const MEMORY_DIR = join(
  homedir(),
  ".claude/projects/-Users-ruslan-portfolio/memory",
);
const NOBLE_REPO = join(homedir(), "noble-saas");
const NOBLE_START = "2026-04-08"; // first commit day; frozen
const NOBLE_SPRINT_END = "2026-04-18"; // day 10 inclusive; frozen
const SMM_REPO = join(homedir(), "smm-factory");
const SMM_FIRST_COMMIT = "2026-06-08"; // frozen; drives case-study timeline claims
const SMM_MDX = join(REPO, "content/case-studies/smm-factory.mdx");
const ANGEL_REPO = join(homedir(), "angel");
const ANGEL_FIRST_HASH = "b652cd3"; // frozen; the only commit in Angel's repo
const ANGEL_MDX = join(REPO, "content/case-studies/angel.mdx");
const FIELDMARK_REPO = join(homedir(), "fieldmark");
const FIELDMARK_FIRST_HASH = "f05b752"; // frozen; initial commit
const FIELDMARK_AUTH_HASH = "8b18221"; // frozen; native ASAuthorization pivot (build 21)
const FIELDMARK_SUBMIT_HASH = "071b10c"; // frozen; build 21 submitted
const FIELDMARK_MDX = join(REPO, "content/case-studies/fieldmark.mdx");
const LEXORA_REPO = join(homedir(), "lexora");
const LEXORA_MDX = join(REPO, "content/case-studies/lexora.mdx");

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
    const onVercel = process.env.VERCEL === "1";
    const banner =
      "─".repeat(72) +
      "\n⚠  PARTIAL GUARDRAIL — memory-dependent checks are SKIPPED here.\n" +
      `   Dir: ${MEMORY_DIR}\n` +
      `   Reason: directory not present (${onVercel ? "Vercel build" : "local run without ~/.claude memory"}).\n` +
      "   Impact: body-prose + MetricGrid + §4 ls listings are NOT reconciled.\n" +
      "   The authoritative check runs locally on prebuild; Vercel is downstream only.\n" +
      "─".repeat(72);
    console.warn(`\n${banner}\n`);
    return null;
  }
  return readdirSync(MEMORY_DIR).filter(
    (f) => f.endsWith(".md") && f !== "MEMORY.md",
  ).length;
}

function nobleDisk() {
  if (!existsSync(NOBLE_REPO)) {
    const onVercel = process.env.VERCEL === "1";
    const banner =
      "─".repeat(72) +
      "\n⚠  PARTIAL GUARDRAIL — Noble repo checks are SKIPPED here.\n" +
      `   Dir: ${NOBLE_REPO}\n` +
      `   Reason: directory not present (${onVercel ? "Vercel build" : "local run without Noble checkout"}).\n` +
      "   Impact: noble-saas.mdx commit counts + STABLE_LOGIC line count are NOT reconciled.\n" +
      "─".repeat(72);
    console.warn(`\n${banner}\n`);
    return null;
  }
  const run = (cmd) =>
    execSync(cmd, { cwd: NOBLE_REPO, encoding: "utf8" }).trim();
  const totalCommits = +run("git rev-list --count HEAD");
  const first10Commits = +run(
    `git log --since="${NOBLE_START} 00:00:00" --until="${NOBLE_SPRINT_END} 23:59:59" --oneline | wc -l`,
  );
  const stableFile = join(NOBLE_REPO, "docs/STABLE_LOGIC.md");
  const stableLines = existsSync(stableFile)
    ? readFileSync(stableFile, "utf8").trimEnd().split("\n").length
    : null;
  return { totalCommits, first10Commits, stableLines };
}

const disk = {
  devlog: countHeadings(DEVLOG),
  stable: countHeadings(STABLE),
  sprints: distinctSprints(),
  daysSpan: devlogDaySpan(),
  memory: memoryFileCount(),
};

const noble = nobleDisk();

function smmDisk() {
  if (!existsSync(SMM_REPO)) {
    console.warn(
      `\n⚠ smm-factory repo not on this machine (${SMM_REPO}) — skipping smm checks\n`,
    );
    return null;
  }
  const run = (cmd) =>
    execSync(cmd, { cwd: SMM_REPO, encoding: "utf8" }).trim();
  const firstCommit = run(
    "git log --reverse --format=%ad --date=short | head -1",
  );
  const knowledgeDir = join(SMM_REPO, "knowledge");
  const knowledgeFiles = existsSync(knowledgeDir)
    ? readdirSync(knowledgeDir).filter((f) => f.endsWith(".md")).length
    : null;
  return { firstCommit, knowledgeFiles };
}

const smm = smmDisk();

function angelDisk() {
  if (!existsSync(ANGEL_REPO)) {
    console.warn(
      `\n⚠ angel repo not on this machine (${ANGEL_REPO}) — skipping angel checks\n`,
    );
    return null;
  }
  const run = (cmd) =>
    execSync(cmd, { cwd: ANGEL_REPO, encoding: "utf8" }).trim();
  const totalCommits = +run("git rev-list --count HEAD");
  const firstHash = run("git log --reverse --format=%h | head -1");
  const agentsDir = join(ANGEL_REPO, "agents");
  const agentFiles = existsSync(agentsDir)
    ? readdirSync(agentsDir).filter((f) => f.endsWith(".md")).length
    : null;
  const docsDir = join(ANGEL_REPO, "docs");
  const docFiles = existsSync(docsDir)
    ? readdirSync(docsDir).filter((f) => f.endsWith(".md")).length
    : null;
  return { totalCommits, firstHash, agentFiles, docFiles };
}

const angel = angelDisk();

function fieldmarkDisk() {
  if (!existsSync(FIELDMARK_REPO)) {
    console.warn(
      `\n⚠ fieldmark repo not on this machine (${FIELDMARK_REPO}) — skipping fieldmark checks\n`,
    );
    return null;
  }
  const run = (cmd) =>
    execSync(cmd, { cwd: FIELDMARK_REPO, encoding: "utf8" }).trim();
  const totalCommits = +run("git rev-list --count HEAD");
  const firstHash = run("git log --reverse --format=%h | head -1");
  const authSprintCommits = +run(
    `git log --since="2026-09-18 00:00:00" --until="2026-09-18 23:59:59" --oneline | wc -l`,
  );
  const hasAuthHash =
    run(`git cat-file -t ${FIELDMARK_AUTH_HASH} 2>/dev/null || echo missing`) ===
    "commit";
  const hasSubmitHash =
    run(`git cat-file -t ${FIELDMARK_SUBMIT_HASH} 2>/dev/null || echo missing`) ===
    "commit";
  return { totalCommits, firstHash, authSprintCommits, hasAuthHash, hasSubmitHash };
}

const fieldmark = fieldmarkDisk();

function lexoraDisk() {
  if (!existsSync(LEXORA_REPO)) {
    console.warn(
      `\n⚠ lexora repo not on this machine (${LEXORA_REPO}) — skipping lexora checks\n`,
    );
    return null;
  }
  const run = (cmd) =>
    execSync(cmd, { cwd: LEXORA_REPO, encoding: "utf8" }).trim();
  const totalCommits = +run("git rev-list --count HEAD");
  // version: 1.0.0+15 → build 15
  const pubspec = readFileSync(join(LEXORA_REPO, "pubspec.yaml"), "utf8");
  const vMatch = pubspec.match(/^version:\s*\d+\.\d+\.\d+\+(\d+)/m);
  const buildNumber = vMatch ? +vMatch[1] : null;
  // last commit date — anchors the "as of YYYY-MM-DD" claim
  const lastCommitDate = run("git log -1 --format=%ad --date=short");
  const skillsDir = join(LEXORA_REPO, ".claude/skills");
  const skillCount = existsSync(skillsDir)
    ? readdirSync(skillsDir, { withFileTypes: true }).filter((d) =>
        d.isDirectory(),
      ).length
    : null;
  // supported languages — count unique ('xx-XX', 'Label') entries in the
  // language picker (one of the three picker files; they share the same list)
  const picker = join(
    LEXORA_REPO,
    "lib/features/playlists/presentation/create_playlist_sheet.dart",
  );
  let languages = null;
  if (existsSync(picker)) {
    const src = readFileSync(picker, "utf8");
    const codes = new Set();
    for (const m of src.matchAll(/\('([a-z]{2}-[A-Z]{2})',\s*'[^']+'\)/g)) {
      codes.add(m[1]);
    }
    languages = codes.size || null;
  }
  // silent MP3s in assets/audio/silence_*.mp3
  const audioDir = join(LEXORA_REPO, "assets/audio");
  const silentMp3s = existsSync(audioDir)
    ? readdirSync(audioDir).filter((f) => /^silence_\d+s\.mp3$/.test(f)).length
    : null;
  // unit tests — count test( occurrences in test/ (not integration_test/)
  const unitTestsRaw = run(
    `find test -name "*.dart" -exec grep -c "^[[:space:]]*test(" {} + | awk -F: '{s+=$2} END {print s}'`,
  );
  const unitTests = +unitTestsRaw || null;
  return {
    totalCommits,
    buildNumber,
    lastCommitDate,
    skillCount,
    languages,
    silentMp3s,
    unitTests,
  };
}

const lexora = lexoraDisk();

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

// 4. projects.ts hrekov-dev metric — "K memory files · N promoted rules"
//    (collection → discipline frame; shortened 2026-10-03 per expert Finding 6)
if (disk.memory !== null) {
  const projects = readFileSync(PROJECTS, "utf8");
  const metricMatch = projects.match(
    /slug:\s*"hrekov-dev"[\s\S]{0,800}?metric:\s*"([^"]+)"/,
  );
  if (!metricMatch) problems.push("hrekov-dev metric field not found in projects.ts");
  else {
    const metric = metricMatch[1];
    const m = metric.match(
      /(\d+)\s+memory\s+files?\s*·\s*(\d+)\s+promoted\s+rules?/i,
    );
    if (!m) problems.push(`projects.ts metric unparsable: "${metric}"`);
    else {
      const [, mem, rules] = m;
      if (+mem !== disk.memory) problems.push(`projects.ts memory: text=${mem}, disk=${disk.memory}`);
      if (+rules !== disk.stable) problems.push(`projects.ts promoted rules: text=${rules}, disk=${disk.stable}`);
    }
  }
}

// 5. projects.ts hrekov-dev tagline — "...X memory files, one recursive proof."
if (disk.memory !== null) {
  const WORDS = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty","twenty-one","twenty-two","twenty-three","twenty-four","twenty-five","twenty-six","twenty-seven","twenty-eight","twenty-nine","thirty","thirty-one","thirty-two","thirty-three","thirty-four","thirty-five","thirty-six","thirty-seven","thirty-eight","thirty-nine","forty","forty-one","forty-two","forty-three","forty-four","forty-five","forty-six","forty-seven","forty-eight","forty-nine","fifty"];
  const projects = readFileSync(PROJECTS, "utf8");
  const tagMatch = projects.match(
    /slug:\s*"hrekov-dev"[\s\S]{0,400}?tagline:\s*"([^"]+)"/,
  );
  if (tagMatch) {
    const tag = tagMatch[1];
    const wordMatch = tag.match(/—\s*([a-z-]+)\s+memory\s+files/i);
    if (wordMatch) {
      const spoken = wordMatch[1].toLowerCase();
      const expected = WORDS[disk.memory];
      if (expected && spoken !== expected)
        problems.push(`projects.ts tagline word: "${spoken}" ≠ "${expected}" (${disk.memory} memory files)`);
    }
  }

  const mdxSrc = readFileSync(MDX, "utf8");
  const mdxTagMatch = mdxSrc.match(/^tagline:\s*(.+)$/m);
  if (mdxTagMatch) {
    const wordMatch = mdxTagMatch[1].match(/,\s*([a-z-]+)\s+memory\s+files/i);
    if (wordMatch) {
      const spoken = wordMatch[1].toLowerCase();
      const expected = WORDS[disk.memory];
      if (expected && spoken !== expected)
        problems.push(`hrekov-dev.mdx tagline word: "${spoken}" ≠ "${expected}" (${disk.memory} memory files)`);
    }
  }
}

// 6. hrekov-dev.mdx body — "## 6. ... — the X% number" and "That's X%. The other Y% stayed..."
{
  const mdxSrc = readFileSync(MDX, "utf8");
  const expectedPct = (disk.stable / disk.devlog) * 100;
  const headingMatch = mdxSrc.match(/^## 6\..*?—\s*the\s+(\d+(?:\.\d+)?)%\s+number/m);
  if (headingMatch && Math.abs(+headingMatch[1] - expectedPct) > 0.5)
    problems.push(`mdx §6 heading pct: text=${headingMatch[1]}%, disk=${expectedPct.toFixed(1)}%`);
  const bodyMatch = mdxSrc.match(/That's\s+(\d+(?:\.\d+)?)%\.\s*The other\s+(\d+(?:\.\d+)?)%/);
  if (bodyMatch) {
    if (Math.abs(+bodyMatch[1] - expectedPct) > 0.5)
      problems.push(`mdx §6 body "That's X%": text=${bodyMatch[1]}%, disk=${expectedPct.toFixed(1)}%`);
    const complement = 100 - expectedPct;
    if (Math.abs(+bodyMatch[2] - complement) > 0.5)
      problems.push(`mdx §6 body "other Y%": text=${bodyMatch[2]}%, expected=${complement.toFixed(1)}%`);
  }
}

// 7. hrekov-dev.mdx body — number-word prose claims against disk
//    (STABLE_LOGIC rule 2026-10-03: numbers-in-prose cover body, not only frontmatter)
if (disk.memory !== null) {
  const WORDS = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty","twenty-one","twenty-two","twenty-three","twenty-four","twenty-five","twenty-six","twenty-seven","twenty-eight","twenty-nine","thirty","thirty-one","thirty-two","thirty-three","thirty-four","thirty-five","thirty-six","thirty-seven","thirty-eight","thirty-nine","forty","forty-one","forty-two","forty-three","forty-four","forty-five","forty-six","forty-seven","forty-eight","forty-nine","fifty"];
  const mdxSrc = readFileSync(MDX, "utf8");
  const bodyOnly = mdxSrc.replace(/^---\n[\s\S]*?\n---/, ""); // strip frontmatter
  const checks = [
    { pattern: /\b([a-z-]+)\s+memory\s+files?\b/gi, expectedWord: WORDS[disk.memory], unit: "memory files" },
    { pattern: /\b([a-z-]+)\s+Markdown\s+files?\b/g, expectedWord: WORDS[disk.memory], unit: "Markdown files" },
    { pattern: /\b([a-z-]+)\s+journal\s+entr(?:y|ies)\b/gi, expectedWord: WORDS[disk.devlog], unit: "journal entries" },
    { pattern: /\b([a-z-]+)\s+sprints?\s+across\s+([a-z-]+)\s+calendar\s+days?\b/gi, expectedWord: null, unit: "sprints-across-days" },
  ];
  for (const { pattern, expectedWord, unit } of checks) {
    if (unit === "sprints-across-days") {
      for (const m of bodyOnly.matchAll(pattern)) {
        const [, sw, dw] = m;
        const expectedS = WORDS[disk.sprints];
        const expectedD = WORDS[disk.daysSpan];
        if (expectedS && sw.toLowerCase() !== expectedS)
          problems.push(`mdx body: "${sw} sprints across ${dw} days" — sprint word should be "${expectedS}" (disk=${disk.sprints})`);
        if (expectedD && dw.toLowerCase() !== expectedD)
          problems.push(`mdx body: "${sw} sprints across ${dw} days" — day-span word should be "${expectedD}" (disk=${disk.daysSpan})`);
      }
      continue;
    }
    for (const m of bodyOnly.matchAll(pattern)) {
      const spoken = m[1].toLowerCase();
      // only check if spoken is actually a number-word (skip "the", "same", etc.)
      if (!WORDS.includes(spoken)) continue;
      if (expectedWord && spoken !== expectedWord)
        problems.push(`mdx body: "${spoken} ${unit}" should be "${expectedWord} ${unit}" (disk=${WORDS.indexOf(expectedWord)})`);
    }
  }
}

// 8. hrekov-dev.mdx <MetricGrid items={…}> JSX — sprints / calendar days / sprints-per-day
//    (STABLE_LOGIC rule 2026-10-03: JSX items array must reconcile against disk)
{
  const mdxSrc = readFileSync(MDX, "utf8");
  const gridMatch = mdxSrc.match(/<MetricGrid[\s\S]*?items=\{\[([\s\S]*?)\]\}/);
  if (gridMatch) {
    const items = gridMatch[1];
    const parseItem = (label) => {
      const re = new RegExp(`value:\\s*"([^"]+)"[^}]*label:\\s*"${label}"`, "i");
      const m = items.match(re);
      return m ? m[1] : null;
    };
    const sprintsVal = parseItem("sprints");
    const daysVal = parseItem("calendar days");
    const perDayVal = parseItem("sprints / day");
    if (sprintsVal !== null && +sprintsVal !== disk.sprints)
      problems.push(`mdx <MetricGrid> sprints: text=${sprintsVal}, disk=${disk.sprints}`);
    if (daysVal !== null && +daysVal !== disk.daysSpan)
      problems.push(`mdx <MetricGrid> calendar days: text=${daysVal}, disk=${disk.daysSpan}`);
    if (sprintsVal !== null && daysVal !== null && perDayVal !== null) {
      const expectedPer = disk.sprints / disk.daysSpan;
      const stripped = perDayVal.replace(/^~/, "");
      if (Math.abs(+stripped - expectedPer) > 0.1)
        problems.push(`mdx <MetricGrid> per-day: text=${perDayVal}, expected=~${expectedPer.toFixed(1)}`);
    }
  }
}

// 9. Noble projects.ts tagline + metric vs noble-saas repo truth
if (noble !== null) {
  const projects = readFileSync(PROJECTS, "utf8");

  // tagline — "— N commits, one frozen file."
  const tagMatch = projects.match(
    /slug:\s*"noble-saas"[\s\S]{0,400}?tagline:\s*"([^"]+)"/,
  );
  if (tagMatch) {
    const m = tagMatch[1].match(/—\s*(\d+)\s+commits?,/);
    if (m && +m[1] !== noble.totalCommits)
      problems.push(
        `projects.ts noble tagline commits: text=${m[1]}, disk=${noble.totalCommits}`,
      );
  }

  // metric — "K commits in 10 days to live bookings ..."
  const metricMatch = projects.match(
    /slug:\s*"noble-saas"[\s\S]{0,800}?metric:\s*"([^"]+)"/,
  );
  if (metricMatch) {
    const m = metricMatch[1].match(/(\d+)\s+commits?\s+in\s+10\s+days/i);
    if (m && +m[1] !== noble.first10Commits)
      problems.push(
        `projects.ts noble metric first-10-days: text=${m[1]}, disk=${noble.first10Commits}`,
      );
  }
}

// 10. Noble MDX — tagline + MetricGrid + body first-10-days claim + STABLE_LOGIC line count
if (noble !== null) {
  const src = readFileSync(NOBLE_MDX, "utf8");

  // tagline frontmatter
  const tag = src.match(/^tagline:\s*(.+)$/m);
  if (tag) {
    const m = tag[1].match(/—\s*(\d+)\s+commits?,/);
    if (m && +m[1] !== noble.totalCommits)
      problems.push(
        `noble-saas.mdx tagline commits: text=${m[1]}, disk=${noble.totalCommits}`,
      );
  }

  // MetricGrid "commits"
  const grid = src.match(/<MetricGrid[\s\S]*?items=\{\[([\s\S]*?)\]\}/);
  if (grid) {
    const commitsItem = grid[1].match(
      /value:\s*"(\d+)"[^}]*label:\s*"commits"/,
    );
    if (commitsItem && +commitsItem[1] !== noble.totalCommits)
      problems.push(
        `noble-saas.mdx <MetricGrid> commits: text=${commitsItem[1]}, disk=${noble.totalCommits}`,
      );
  }

  // body "N of those commits landed in the first ten days"
  const first10Body = src.match(
    /\b(\d+)\s+of\s+(?:those|the)\s+commits?\s+landed\s+in\s+the\s+first\s+ten\s+days/i,
  );
  if (first10Body && +first10Body[1] !== noble.first10Commits)
    problems.push(
      `noble-saas.mdx first-ten-days: text=${first10Body[1]}, disk=${noble.first10Commits}`,
    );

  // body "234 commits since April, 74 of them ..."
  const sinceApril = src.match(/(\d+)\s+commits?\s+since\s+April/i);
  if (sinceApril && +sinceApril[1] !== noble.totalCommits)
    problems.push(
      `noble-saas.mdx "N commits since April": text=${sinceApril[1]}, disk=${noble.totalCommits}`,
    );

  // STABLE_LOGIC line count — "170-line docs/STABLE_LOGIC" + "It's 170 lines."
  if (noble.stableLines !== null) {
    const inline = src.match(/(\d+)-line\s+docs\/STABLE_LOGIC/);
    if (inline && +inline[1] !== noble.stableLines)
      problems.push(
        `noble-saas.mdx "${inline[1]}-line docs/STABLE_LOGIC": disk=${noble.stableLines}`,
      );
    const reflection = src.match(/It's\s+(\d+)\s+lines\./);
    if (reflection && +reflection[1] !== noble.stableLines)
      problems.push(
        `noble-saas.mdx "It's N lines": text=${reflection[1]}, disk=${noble.stableLines}`,
      );
  }
}

// 11. smm-factory MDX — anchor first-commit date + knowledge/ file count
if (smm !== null) {
  const src = readFileSync(SMM_MDX, "utf8");

  // first-commit anchor in tech-stack line: "dev YYYY-MM-DD → YYYY-MM-DD"
  const devRange = src.match(/dev\s+(2\d{3}-\d{2}-\d{2})\s*→/);
  if (devRange && devRange[1] !== smm.firstCommit)
    problems.push(
      `smm-factory.mdx dev-start: text=${devRange[1]}, disk first-commit=${smm.firstCommit}`,
    );
  if (SMM_FIRST_COMMIT !== smm.firstCommit)
    problems.push(
      `smm-factory script constant SMM_FIRST_COMMIT=${SMM_FIRST_COMMIT} ≠ disk ${smm.firstCommit}`,
    );

  // knowledge/ file count — "12 markdown files"
  if (smm.knowledgeFiles !== null) {
    const kMatch = src.match(/—\s*(\d+)\s+markdown\s+files/i);
    if (kMatch && +kMatch[1] !== smm.knowledgeFiles)
      problems.push(
        `smm-factory.mdx knowledge/ files: text=${kMatch[1]}, disk=${smm.knowledgeFiles}`,
      );
  }
}

// 12. angel MDX — single-commit anchor + agents/ + docs/ file counts
if (angel !== null) {
  const src = readFileSync(ANGEL_MDX, "utf8");

  // commit hash in body — "`b652cd3`, 2026-05-12"
  const hashMatch = src.match(/`([a-f0-9]{7,40})`,\s*2026-05-12/);
  if (hashMatch && !angel.firstHash.startsWith(hashMatch[1]))
    problems.push(
      `angel.mdx first-commit hash: text=${hashMatch[1]}, disk=${angel.firstHash}`,
    );
  if (!angel.firstHash.startsWith(ANGEL_FIRST_HASH))
    problems.push(
      `angel script constant ANGEL_FIRST_HASH=${ANGEL_FIRST_HASH} ≠ disk ${angel.firstHash}`,
    );

  // "Only one commit exists" + Results "1 commit pushed" — both anchor on 1
  if (angel.totalCommits !== 1) {
    const onlyOne = src.match(/Only\s+one\s+commit\s+exists/i);
    const onePushed = src.match(/1\s+commit\s+pushed/i);
    if (onlyOne || onePushed)
      problems.push(
        `angel.mdx claims 1 commit but disk has ${angel.totalCommits}`,
      );
  }

  // agents/ file count — "5 role contracts in `agents/` ..."
  if (angel.agentFiles !== null) {
    const roleMatch = src.match(/(\d+)\s+role\s+contracts?\s+in\s+`agents\//i);
    const expectedRoles = angel.agentFiles - 1; // minus WORKFLOW.md
    if (roleMatch && +roleMatch[1] !== expectedRoles)
      problems.push(
        `angel.mdx role contracts: text=${roleMatch[1]}, disk=${expectedRoles} (${angel.agentFiles} files in agents/ minus WORKFLOW.md)`,
      );
  }

  // docs/ file count — "6 architecture docs in `docs/`"
  if (angel.docFiles !== null) {
    const docMatch = src.match(/(\d+)\s+architecture\s+docs?\s+in\s+`docs\//i);
    if (docMatch && +docMatch[1] !== angel.docFiles)
      problems.push(
        `angel.mdx docs count: text=${docMatch[1]}, disk=${angel.docFiles}`,
      );
  }
}

// 13. fieldmark MDX — total commits + auth-sprint commits + referenced hashes
if (fieldmark !== null) {
  const src = readFileSync(FIELDMARK_MDX, "utf8");

  // "7 commits" prose claim
  const totalMatch = src.match(/\*\*(\d+)\s+commits?\*\*,\s*\d+\s+of\s+them\s+in\s+the\s+final/i);
  if (totalMatch && +totalMatch[1] !== fieldmark.totalCommits)
    problems.push(
      `fieldmark.mdx total commits: text=${totalMatch[1]}, disk=${fieldmark.totalCommits}`,
    );

  // "5 of them in the final 24h auth sprint" — anchors on commits dated 2026-09-18
  const authMatch = src.match(/(\d+)\s+of\s+them\s+in\s+the\s+final\s+24h\s+auth\s+sprint/i);
  if (authMatch && +authMatch[1] !== fieldmark.authSprintCommits)
    problems.push(
      `fieldmark.mdx auth-sprint commits: text=${authMatch[1]}, disk=${fieldmark.authSprintCommits} (2026-09-18)`,
    );

  // referenced hashes exist in repo
  const hashesInMdx = [...src.matchAll(/commit="([a-f0-9]{7,40})"/g)].map((m) => m[1]);
  for (const h of hashesInMdx) {
    const run = (cmd) =>
      execSync(cmd, { cwd: FIELDMARK_REPO, encoding: "utf8" }).trim();
    try {
      const kind = run(`git cat-file -t ${h} 2>/dev/null || echo missing`);
      if (kind !== "commit")
        problems.push(`fieldmark.mdx references hash ${h} but disk has no such commit`);
    } catch {
      problems.push(`fieldmark.mdx references hash ${h} but disk lookup failed`);
    }
  }

  // frontmatter status must be "shipped" (we flipped it in projects.ts; MDX must agree)
  const statusMatch = src.match(/^status:\s*(\S+)/m);
  if (statusMatch && statusMatch[1] !== "shipped")
    problems.push(
      `fieldmark.mdx frontmatter status: "${statusMatch[1]}" (should be "shipped" — Build 21 is live)`,
    );

  // script constants match disk
  if (!fieldmark.firstHash.startsWith(FIELDMARK_FIRST_HASH))
    problems.push(
      `fieldmark script constant FIELDMARK_FIRST_HASH=${FIELDMARK_FIRST_HASH} ≠ disk ${fieldmark.firstHash}`,
    );
  if (!fieldmark.hasAuthHash)
    problems.push(
      `fieldmark script constant FIELDMARK_AUTH_HASH=${FIELDMARK_AUTH_HASH} not found in repo`,
    );
  if (!fieldmark.hasSubmitHash)
    problems.push(
      `fieldmark script constant FIELDMARK_SUBMIT_HASH=${FIELDMARK_SUBMIT_HASH} not found in repo`,
    );
}

// 14. lexora MDX + projects.ts metric — build number, counts, last-commit date
if (lexora !== null) {
  const src = readFileSync(LEXORA_MDX, "utf8");

  // "Build N in Apple review as of YYYY-MM-DD"
  const buildClaim = src.match(
    /\*\*Build\s+(\d+)\*\*\s+in\s+Apple\s+review\s+as\s+of\s+(2\d{3}-\d{2}-\d{2})/i,
  );
  if (buildClaim) {
    if (lexora.buildNumber !== null && +buildClaim[1] !== lexora.buildNumber)
      problems.push(
        `lexora.mdx build number: text=${buildClaim[1]}, disk pubspec=${lexora.buildNumber}`,
      );
    if (buildClaim[2] !== lexora.lastCommitDate)
      problems.push(
        `lexora.mdx "as of" date: text=${buildClaim[2]}, disk last-commit=${lexora.lastCommitDate}`,
      );
  }

  // tech-stack line: "YYYY-MM-DD → YYYY-MM-DD" — second date must be last commit
  const range = src.match(
    /2026-08-30\s*→\s*(2\d{3}-\d{2}-\d{2})/,
  );
  if (range && range[1] !== lexora.lastCommitDate)
    problems.push(
      `lexora.mdx tech-stack range end: text=${range[1]}, disk last-commit=${lexora.lastCommitDate}`,
    );

  // "N custom skills in `.claude/skills/`"
  if (lexora.skillCount !== null) {
    const skillClaim = src.match(
      /(\d+)\s+custom\s+skills?\s+in\s+`\.claude\/skills\//i,
    );
    if (skillClaim && +skillClaim[1] !== lexora.skillCount)
      problems.push(
        `lexora.mdx skill count: text=${skillClaim[1]}, disk=${lexora.skillCount}`,
      );
  }

  // "N unit tests"
  if (lexora.unitTests !== null) {
    const testClaim = src.match(/\*\*(\d+)\s+unit\s+tests?\*\*/i);
    if (testClaim && +testClaim[1] !== lexora.unitTests)
      problems.push(
        `lexora.mdx unit tests: text=${testClaim[1]}, disk=${lexora.unitTests}`,
      );
  }

  // "N supported languages"
  if (lexora.languages !== null) {
    const langClaim = src.match(/\*\*(\d+)\s+supported\s+languages?\*\*/i);
    if (langClaim && +langClaim[1] !== lexora.languages)
      problems.push(
        `lexora.mdx supported languages: text=${langClaim[1]}, disk=${lexora.languages}`,
      );
  }

  // projects.ts metric — "N languages · M unit tests · K silent MP3s"
  const projects = readFileSync(PROJECTS, "utf8");
  const metricMatch = projects.match(
    /slug:\s*"lexora"[\s\S]{0,800}?metric:\s*"([^"]+)"/,
  );
  if (metricMatch) {
    const metric = metricMatch[1];
    const m = metric.match(
      /(\d+)\s+languages?\s*·\s*(\d+)\s+unit\s+tests?\s*·\s*(\d+)\s+silent\s+MP3s?/i,
    );
    if (m) {
      const [, langs, tests, mp3s] = m;
      if (lexora.languages !== null && +langs !== lexora.languages)
        problems.push(
          `projects.ts lexora metric languages: text=${langs}, disk=${lexora.languages}`,
        );
      if (lexora.unitTests !== null && +tests !== lexora.unitTests)
        problems.push(
          `projects.ts lexora metric unit tests: text=${tests}, disk=${lexora.unitTests}`,
        );
      if (lexora.silentMp3s !== null && +mp3s !== lexora.silentMp3s)
        problems.push(
          `projects.ts lexora metric silent MP3s: text=${mp3s}, disk=${lexora.silentMp3s}`,
        );
    }
  }
}

if (problems.length) {
  console.error("✗ case-study number drift");
  for (const p of problems) console.error("  •", p);
  console.error("\nReconcile text to disk truth (source-of-truth is disk).");
  process.exit(1);
}

console.log("✓ case-study numbers match disk state", {
  devlog: disk.devlog,
  stable: disk.stable,
  sprints: disk.sprints,
  daysSpan: disk.daysSpan,
  memory: disk.memory,
  noble,
  smm,
  angel,
  fieldmark,
  lexora,
});
