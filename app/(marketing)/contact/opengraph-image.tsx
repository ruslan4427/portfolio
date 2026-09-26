import { ImageResponse } from "next/og";
import { playfairFonts } from "@/lib/og-fonts";
import { OG_SIZE, OgLayout } from "@/lib/og-template";

export const alt = "Contact — Ruslan Hrekov";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await playfairFonts();
  return new ImageResponse(
    (
      <OgLayout
        eyebrow="Ruslan Hrekov · Contact"
        title="Let's talk."
        subtitle="Tell me what you're building. I reply within two business days, and I'll tell you fast if I'm the wrong fit."
        footerRight="hrekov.dev/contact"
      />
    ),
    { ...OG_SIZE, fonts },
  );
}
