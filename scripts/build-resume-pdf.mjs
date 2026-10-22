#!/usr/bin/env node
// Render /resume to public/resume.pdf (A4, print CSS, selectable text).
//
// Usage (against a running server):
//   npm run build && npx next start -p 3100 &
//   npm run resume:pdf                # default http://localhost:3100
//   RESUME_URL=https://hrekov.dev/resume npm run resume:pdf
//
// The PDF is generated, never edited by hand: change content/* and re-run.

import { chromium } from "playwright";

const url = process.env.RESUME_URL ?? "http://localhost:3100/resume";
const out = "public/resume.pdf";

const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } : {},
);
const page = await browser.newPage();
await page.emulateMedia({ media: "print", reducedMotion: "reduce" });
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log(`✓ ${out} from ${url}`);
