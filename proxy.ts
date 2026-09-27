import { NextResponse, type NextRequest } from "next/server";
import { isEuCountry } from "@/lib/consent-geo";

const DAY_SECONDS = 60 * 60 * 24;

export function proxy(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country");
  const res = NextResponse.next();
  res.cookies.set("geo-eu", isEuCountry(country) ? "1" : "0", {
    maxAge: DAY_SECONDS,
    sameSite: "lax",
    path: "/",
  });
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|rss.xml|sitemap.xml|robots.txt|.*\\.[a-z0-9]+$).*)",
  ],
};
