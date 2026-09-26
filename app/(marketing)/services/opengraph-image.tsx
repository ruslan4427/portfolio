import { ImageResponse } from "next/og";
import { playfairFonts } from "@/lib/og-fonts";
import { OG_SIZE, OgLayout } from "@/lib/og-template";

export const alt = "Services — Ruslan Hrekov";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await playfairFonts();
  return new ImageResponse(
    (
      <OgLayout
        eyebrow="Ruslan Hrekov · Services"
        title="How I engage."
        subtitle="Five formats for teams that need senior AI-collaboration output without a full-time hire — Discovery, Fractional CTO, Build Partner, Rescue Audit, Advisory."
        footerRight="hrekov.dev/services"
      />
    ),
    { ...OG_SIZE, fonts },
  );
}
