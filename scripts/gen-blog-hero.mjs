#!/usr/bin/env node
// Generate an editorial hero image for a blog post via Gemini (nano-banana).
//
// Usage:
//   node scripts/gen-blog-hero.mjs <slug> "<subject>" [--model=<name>] [--out=<path>]
//
// Example:
//   node scripts/gen-blog-hero.mjs no-company-no-api \
//     "a tall closed metal gate seen from the outside, with a slot in the lock bearing an empty ID-badge placeholder; a solo developer stands small to the left holding a laptop"
//
// Default model: gemini-3.1-flash-image (Nano Banana 2 GA).
// Output lands in public/blog/<slug>/hero.<ext> where ext matches Gemini's
// returned mimeType (jpg or png). Prints the path so you can paste it into
// the post's frontmatter heroImage.src.

import { GoogleGenAI } from "@google/genai";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { config } from "dotenv";

config({ path: ".env.local" });

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("usage: gen-blog-hero.mjs <slug> \"<subject>\" [--model=<name>]");
  process.exit(2);
}

const slug = args[0];
const subject = args[1];
const flags = Object.fromEntries(
  args
    .slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [k, v] = a.slice(2).split("=");
      return [k, v ?? true];
    }),
);
const model = flags.model ?? "gemini-3.1-flash-image";

const STYLE = [
  "Editorial black-and-white illustration",
  "high-contrast ink on warm paper (#F5F4EF)",
  "minimal line art with occasional cross-hatching",
  "abstract conceptual composition favoring generous negative space",
  "16:7 horizontal banner",
  "no text, no logos, no watermarks",
  "cinematic composition in the vein of a New Yorker illustration meets Linear changelog",
].join(". ");

const prompt = `${STYLE}. Subject: ${subject}.`;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

console.log(`model=${model}`);
console.log(`prompt: ${prompt.slice(0, 160)}...`);

async function generateWithRetry(attempts = 4) {
  for (let i = 1; i <= attempts; i++) {
    try {
      const t0 = Date.now();
      const response = await ai.models.generateContent({ model, contents: prompt });
      return { response, ms: Date.now() - t0 };
    } catch (err) {
      const status = err.status ?? 0;
      const code = err.cause?.code ?? err.code;
      const transient =
        status === 429 || status === 500 || status === 503 || status === 504 ||
        code === "ECONNRESET" || code === "ETIMEDOUT" || code === "UND_ERR_SOCKET";
      if (!transient || i === attempts) throw err;
      const backoff = 2000 * 2 ** (i - 1);
      console.error(`  attempt ${i} ${status} — retrying in ${backoff}ms`);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
  throw new Error("unreachable");
}

const { response, ms } = await generateWithRetry();

const parts = response.candidates?.[0]?.content?.parts ?? [];
const imagePart = parts.find((p) => p.inlineData?.data);
if (!imagePart) {
  console.error("no image in response");
  console.error(JSON.stringify(response, null, 2).slice(0, 1500));
  process.exit(3);
}

const mime = imagePart.inlineData.mimeType ?? "image/jpeg";
const ext = mime === "image/png" ? "png" : "jpg";

const outDir = path.resolve(`public/blog/${slug}`);
await mkdir(outDir, { recursive: true });
const outPath = flags.out
  ? path.resolve(flags.out)
  : path.join(outDir, `hero.${ext}`);

await writeFile(outPath, Buffer.from(imagePart.inlineData.data, "base64"));

const sizeKb = Math.round(Buffer.byteLength(imagePart.inlineData.data, "base64") / 1024);
console.log(`✓ ${path.relative(process.cwd(), outPath)}  (${sizeKb} KB, ${ms}ms)`);
if (response.usageMetadata) {
  const u = response.usageMetadata;
  console.log(
    `  tokens: prompt=${u.promptTokenCount} image=${u.candidatesTokenCount} tier=${u.serviceTier ?? "?"}`,
  );
}
