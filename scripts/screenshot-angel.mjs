import { chromium } from "playwright";
import path from "node:path";

const outPath = path.resolve(
  "/Users/ruslan/portfolio/public/case-studies/angel/pipeline.webp",
);

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
  colorScheme: "light",
});
const page = await context.newPage();
await page.goto("http://localhost:3000/work/angel", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

// FlowSchema renders as <figure class="not-prose my-10">; pick the one with
// multiple children (not a stray singleton figure elsewhere).
const figure = page.locator("article figure.not-prose").first();
await figure.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
const box = await figure.boundingBox();
if (!box) throw new Error("no bounding box");

// Pad the figure crop so the title + top rows feel breathing-room-aware,
// then force a 16:10 landscape frame around the top rows (the full pipeline
// is tall — showing all 5 stages would be too narrow a strip).
const padX = 32;
const topRowsHeight = 420;
const clipW = Math.round(topRowsHeight * 1.6);
const clipH = topRowsHeight;
const centerX = box.x + box.width / 2;
const clipX = Math.max(0, Math.min(1440 - clipW, Math.round(centerX - clipW / 2)));
const clipY = Math.max(0, Math.round(box.y - 24));

await page.screenshot({
  path: outPath,
  type: "webp",
  quality: 92,
  clip: { x: clipX, y: clipY, width: clipW, height: clipH },
});

await browser.close();
console.log("✓", outPath, { clipX, clipY, clipW, clipH, padX });
