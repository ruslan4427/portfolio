#!/usr/bin/env node
// Render each algo at full hero scale for one post, so visual comparison is 1:1.
import { writeFile, mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { readFile } from "node:fs/promises";

const src = await readFile(new URL("./gen-hero-previews.mjs", import.meta.url), "utf8");
// eval the algo functions from the preview script
const mod = await import("./gen-hero-previews.mjs").catch(() => null);

// Standalone impls (mirror the preview script).
const W = 1400;
const H = 613;

function hashSlug(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function isolines(seed) {
  const rng = mulberry32(seed);
  const n = 5;
  const freq = Array.from({ length: n }, () => 0.0025 + rng() * 0.009);
  const phase = Array.from({ length: n }, () => rng() * Math.PI * 2);
  const amp = Array.from({ length: n }, () => 0.4 + rng() * 0.9);
  const field = (x, y) => {
    let v = 0;
    for (let i = 0; i < n; i++) v += Math.sin(x * freq[i] + phase[i]) * Math.cos(y * freq[i] * 0.7 + phase[i] * 1.3) * amp[i];
    return v;
  };
  let paths = "";
  const stepY = 11;
  for (let y = -20; y <= H + 20; y += stepY) {
    let d = "";
    for (let x = 0; x <= W; x += 5) {
      const yy = y + field(x, y) * 14;
      d += x === 0 ? `M${x},${yy.toFixed(1)}` : ` L${x},${yy.toFixed(1)}`;
    }
    const alpha = 0.4 + ((y / H) * 0.1);
    paths += `<path d="${d}" stroke="#111" stroke-width="0.55" fill="none" opacity="${alpha.toFixed(2)}"/>`;
  }
  return paths;
}
function halftone(seed) {
  const rng = mulberry32(seed);
  const freq = 0.004 + rng() * 0.008;
  const phase = rng() * Math.PI * 2;
  const warp = 0.002 + rng() * 0.004;
  let dots = "";
  const step = 14;
  const maxR = 4.5;
  for (let y = step; y < H; y += step) {
    for (let x = step; x < W; x += step) {
      const v =
        Math.sin(x * freq + phase) * Math.cos(y * freq * 1.1) +
        Math.sin((x + y) * warp + phase * 1.7) * 0.5;
      const t = (v + 1.5) / 3;
      const r = Math.max(0.3, t * maxR);
      const alpha = 0.15 + t * 0.5;
      dots += `<circle cx="${x}" cy="${y}" r="${r.toFixed(2)}" fill="#111" opacity="${alpha.toFixed(2)}"/>`;
    }
  }
  return dots;
}
function flowfield(seed) {
  const rng = mulberry32(seed);
  const freq = 0.003 + rng() * 0.004;
  const phase = rng() * Math.PI * 2;
  const angle = (x, y) => (Math.sin(x * freq + phase) + Math.cos(y * freq * 1.3 + phase * 1.5)) * Math.PI;
  const particles = 220;
  const steps = 180;
  const stepSize = 2.4;
  let paths = "";
  for (let i = 0; i < particles; i++) {
    let x = rng() * W;
    let y = rng() * H;
    let d = `M${x.toFixed(1)},${y.toFixed(1)}`;
    for (let s = 0; s < steps; s++) {
      const a = angle(x, y);
      x += Math.cos(a) * stepSize;
      y += Math.sin(a) * stepSize;
      if (x < 0 || x > W || y < 0 || y > H) break;
      d += ` L${x.toFixed(1)},${y.toFixed(1)}`;
    }
    paths += `<path d="${d}" stroke="#111" stroke-width="0.4" fill="none" opacity="0.35"/>`;
  }
  return paths;
}

const post = { slug: "shipping-the-cross-poster", title: "Shipping the cross-poster", format: "Build Log" };
const seed = hashSlug(post.slug);

const algos = [
  { key: "isolines", name: "Isolines", body: isolines(seed) },
  { key: "halftone", name: "Halftone", body: halftone(seed) },
  { key: "flowfield", name: "Flow field", body: flowfield(seed) },
];

function pageHtml(a) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;500&display=swap" rel="stylesheet"/>
<style>
  body { margin: 0; background: #ffffff; font-family: 'Inter'; padding: 0; }
  .hero { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; }
  .hero svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 56px 72px; }
  .eyebrow { font-family: 'Inter'; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: #6B6B66; margin-bottom: 14px; }
  .title { font-family: 'Playfair Display'; font-weight: 600; font-size: 84px; line-height: 1.0; color: #111; max-width: 75%; letter-spacing: -0.015em; }
</style>
</head>
<body>
  <div class="hero">
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#F5F4EF"/>
      ${a.body}
    </svg>
    <div class="overlay">
      <div class="eyebrow">${a.name} · ${post.format}</div>
      <div class="title">${post.title}</div>
    </div>
  </div>
</body>
</html>`;
}

await mkdir("/tmp/hero-previews", { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
const page = await context.newPage();
for (const a of algos) {
  const file = `/tmp/hero-previews/full-${a.key}.html`;
  await writeFile(file, pageHtml(a));
  await page.goto(`file://${file}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `/tmp/hero-previews/full-${a.key}.png`, type: "png", clip: { x: 0, y: 0, width: W, height: H } });
  console.log(`✓ /tmp/hero-previews/full-${a.key}.png`);
}
await browser.close();
