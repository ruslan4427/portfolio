import { ImageResponse } from "next/og";
import { playfairFonts } from "@/lib/og-fonts";
import { OG_SIZE, OgLayout } from "@/lib/og-template";

export const alt = "Journal — Ruslan Hrekov";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await playfairFonts();
  return new ImageResponse(
    (
      <OgLayout
        eyebrow="Ruslan Hrekov · Journal"
        title="Working notes."
        subtitle="Case studies, build logs, and field notes on shipping software with AI as a collaborator — for people who read commit histories."
        footerRight="hrekov.dev/blog"
      />
    ),
    { ...OG_SIZE, fonts },
  );
}
