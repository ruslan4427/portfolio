export const EU_COUNTRIES: ReadonlySet<string> = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  "GB",
  "NO", "IS", "LI",
  "CH",
]);

export function isEuCountry(code: string | null | undefined): boolean {
  if (!code) return false;
  return EU_COUNTRIES.has(code.toUpperCase());
}
