export type ConsentState = "accepted" | "rejected" | "unset";

export const CONSENT_COOKIE = "consent";
export const GEO_COOKIE = "geo-eu";

const YEAR_SECONDS = 60 * 60 * 24 * 365;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

export function getConsentState(): ConsentState {
  const raw = readCookie(CONSENT_COOKIE);
  if (raw === "accepted") return "accepted";
  if (raw === "rejected") return "rejected";
  return "unset";
}

export function setConsent(state: "accepted" | "rejected") {
  writeCookie(CONSENT_COOKIE, state, YEAR_SECONDS);
}

export function resetConsent() {
  deleteCookie(CONSENT_COOKIE);
}

export function isEuVisitor(): boolean {
  return readCookie(GEO_COOKIE) === "1";
}
