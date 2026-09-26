import { ImageResponse } from "next/og";
import { playfairFonts } from "@/lib/og-fonts";
import { OG_SIZE, OgLayout } from "@/lib/og-template";

export const alt = "Work — Ruslan Hrekov";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await playfairFonts();
  return new ImageResponse(
    (
      <OgLayout
        eyebrow="Ruslan Hrekov · Work"
        title="Selected projects."
        subtitle="Five case studies of AI-collaboration in production. Each ships with commit hashes, receipts, and the specific decisions that made or broke the build."
        footerRight="hrekov.dev/work"
      />
    ),
    { ...OG_SIZE, fonts },
  );
}
