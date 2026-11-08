import { describe, expect, it } from "vitest";
import { formatCents, formatScore, parseDollarsToCents } from "@/lib/money";

describe("money display rules", () => {
  it("shows a missing score as Needs input, never zero", () => {
    expect(formatScore(null)).toBe("Needs input");
    expect(formatScore(0)).toBe("0");
  });

  it("formats integer cents as dollars", () => {
    expect(formatCents(10600)).toBe("$106.00");
    expect(formatCents(185000, { whole: true })).toBe("$1,850");
  });

  it("converts dollar input to integer cents", () => {
    expect(parseDollarsToCents("180")).toBe(18000);
    expect(parseDollarsToCents("$1,200.5")).toBe(120050);
    expect(parseDollarsToCents("abc")).toBeNull();
    expect(parseDollarsToCents("0")).toBeNull();
  });
});
