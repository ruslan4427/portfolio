type FontWeight = 400 | 700 | 900;

const cache = new Map<FontWeight, ArrayBuffer>();

async function fetchGoogleFont(weight: FontWeight): Promise<ArrayBuffer> {
  const cssRes = await fetch(
    `https://fonts.googleapis.com/css?family=Playfair+Display:${weight}`,
    { headers: { "User-Agent": "Mozilla/4.0" } },
  );
  if (!cssRes.ok) throw new Error(`Playfair CSS fetch failed: ${cssRes.status}`);
  const css = await cssRes.text();
  const match = css.match(/src:\s*url\((.+?)\)\s*format\(['"]?truetype['"]?\)/);
  if (!match) throw new Error(`Playfair ${weight} TTF URL not found`);
  const fontRes = await fetch(match[1]);
  if (!fontRes.ok) throw new Error(`Playfair TTF fetch failed: ${fontRes.status}`);
  return fontRes.arrayBuffer();
}

export async function getPlayfair(weight: FontWeight = 700): Promise<ArrayBuffer> {
  const cached = cache.get(weight);
  if (cached) return cached;
  const data = await fetchGoogleFont(weight);
  cache.set(weight, data);
  return data;
}

export type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight;
  style: "normal";
};

export async function playfairFonts(): Promise<OgFont[]> {
  const [w700] = await Promise.all([getPlayfair(700)]);
  return [
    { name: "Playfair Display", data: w700, weight: 700, style: "normal" },
  ];
}
