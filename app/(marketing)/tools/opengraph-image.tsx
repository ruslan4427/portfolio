import { ImageResponse } from "next/og";
import { playfairFonts } from "@/lib/og-fonts";
import { OG_SIZE, OgLayout } from "@/lib/og-template";

export const alt = "Tools — Ruslan Hrekov";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await playfairFonts();
  return new ImageResponse(
    (
      <OgLayout
        eyebrow="Ruslan Hrekov · Tools"
        title="ShipLoop ecosystem."
        subtitle="Seven open-source Claude Code skills, one domain-expert agent, and a scorecard that measures the discipline cost of shipping without them."
        footerRight="hrekov.dev/tools"
      />
    ),
    { ...OG_SIZE, fonts },
  );
}
