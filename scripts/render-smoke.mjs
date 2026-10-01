import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  renderMarkdownForDevto,
  renderPlainTextForLinkedIn,
  _internals,
} from "../lib/distribution/render.mjs";

const { LINKEDIN_CHAR_CAP } = _internals;

const assertions = [];

function assert(name, cond, extra) {
  assertions.push({ name, ok: !!cond, extra });
}

const HEADING_STRIP = "## Some heading\n\nBody line";
assert(
  "LinkedIn strips markdown heading marker",
  !renderPlainTextForLinkedIn(HEADING_STRIP, {}, "https://x").includes("## "),
);

const LINK_PRESERVE = "Read [the docs](https://example.com/docs).";
const linkOut = renderPlainTextForLinkedIn(LINK_PRESERVE, {}, "https://x");
assert(
  "LinkedIn link → title (url)",
  linkOut.includes("the docs (https://example.com/docs)"),
  linkOut,
);

const CODE_BLOCK = "Look:\n\n```js\nconsole.log(1);\n```\n\nDone.";
const codeOut = renderPlainTextForLinkedIn(CODE_BLOCK, {}, "https://x");
assert(
  "LinkedIn code fence → omitted placeholder",
  codeOut.includes("[code omitted"),
  codeOut,
);

const LONG_BODY = "word ".repeat(2000).trim();
const capped = renderPlainTextForLinkedIn(LONG_BODY, {}, "https://x");
assert(
  "LinkedIn output honors 2900-char cap",
  capped.length <= LINKEDIN_CHAR_CAP,
  `length=${capped.length}`,
);
assert(
  "LinkedIn output ends with canonical suffix",
  capped.endsWith("Full post: https://x"),
);

const COST_JSX = `<Cost label="AI cost" value="$0.30/wk" />`;
const dev = renderMarkdownForDevto(COST_JSX, {});
assert("dev.to Cost JSX → bold markdown", dev.includes("**AI cost:** $0.30/wk"), dev);

const TECH_DETAIL = "before\n<TechnicalDetail>secret</TechnicalDetail>\nafter";
const dev2 = renderMarkdownForDevto(TECH_DETAIL, {});
assert(
  "dev.to strips <TechnicalDetail> block",
  !dev2.includes("secret") && dev2.includes("before") && dev2.includes("after"),
  dev2,
);

const IMPORT_LINE = `import { foo } from "bar";\n\nHello.`;
const dev3 = renderMarkdownForDevto(IMPORT_LINE, {});
assert("dev.to strips import lines", !dev3.includes("import"), dev3);

const REAL_POST_PATH = path.join(
  process.cwd(),
  "content",
  "blog",
  "launching-the-journal.mdx",
);
try {
  const raw = await readFile(REAL_POST_PATH, "utf8");
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, "");
  const devOut = renderMarkdownForDevto(body, {});
  const liOut = renderPlainTextForLinkedIn(body, {}, "https://hrekov.dev/blog/launching-the-journal");
  assert("real post → dev.to output non-empty", devOut.length > 100);
  assert("real post → LinkedIn output non-empty", liOut.length > 100);
  assert(
    "real post → LinkedIn within cap",
    liOut.length <= LINKEDIN_CHAR_CAP,
    `length=${liOut.length}`,
  );
} catch (err) {
  assert(`real post smoke skipped (${err.code || err.message})`, true);
}

let failed = 0;
for (const a of assertions) {
  const icon = a.ok ? "PASS" : "FAIL";
  if (!a.ok) failed++;
  console.log(`  ${icon}  ${a.name}${a.extra && !a.ok ? `\n         ${a.extra}` : ""}`);
}

if (failed > 0) {
  console.error(`\n${failed}/${assertions.length} assertions failed.`);
  process.exit(1);
} else {
  console.log(`\n${assertions.length}/${assertions.length} assertions passed.`);
}
