import { ImageResponse } from "next/og";
import { playfairFonts } from "@/lib/og-fonts";
import { OG_SIZE, OgLayout } from "@/lib/og-template";

export const alt = "About — Ruslan Hrekov";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await playfairFonts();
  return new ImageResponse(
    (
      <OgLayout
        eyebrow="Ruslan Hrekov · About"
        title="A studio of one."
        subtitle="Solo AI-collaboration studio running with the model. Kyiv → Ohio, two years shipping production software with Claude at the keyboard."
        footerRight="hrekov.dev/about"
      />
    ),
    { ...OG_SIZE, fonts },
  );
}
