import type { BlogFormat } from "@/content/blog";

export const formatLabel: Record<BlogFormat, string> = {
  "case-study": "Case study",
  "build-log": "Build log",
  skeptic: "Field note",
  pattern: "Pattern",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${MONTHS[Number(month) - 1]} ${Number(day)}, ${year}`;
}
