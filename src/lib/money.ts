// Display helpers. All money is integer cents; conversion happens only at these boundaries.

export function formatCents(cents: number, opts: { whole?: boolean } = {}): string {
  const dollars = cents / 100;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts.whole ? 0 : 2,
    maximumFractionDigits: opts.whole ? 0 : 2,
  });
}

/** Parses dollar form input ("180", "180.5", "$1,200.00") to integer cents, or null if invalid. */
export function parseDollarsToCents(input: string): number | null {
  const cleaned = input.replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return null;
  const [whole, frac = ""] = cleaned.split(".");
  const cents = Number(whole) * 100 + Number(frac.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}

/** A null score means the assessment is incomplete — never show it as zero. */
export function formatScore(score: number | null): string {
  if (score === null) return "Needs input";
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

export type HealthStatus = "healthy" | "watch" | "risk" | "needsInput";

export const STATUS_LABEL: Record<HealthStatus, string> = {
  healthy: "Healthy",
  watch: "Watch",
  risk: "At risk",
  needsInput: "Needs input",
};
