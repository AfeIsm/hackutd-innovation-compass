// SAMPLE DATA ONLY. Mirrors the shapes shown in the live app (integer cents, exact accounts)
// so the presentation can be reviewed. Replace with the team's API responses when connected.
import type { HealthStatus } from "./money";

export type Indicator = {
  key: string;
  name: string;
  weight: number;
  value: string;
  status: HealthStatus;
  points: number;
  detail: string;
};

export type Account = {
  accountId: string;
  label: string;
  type: "checking" | "savings" | "credit";
  balanceCents: number;
  note: string;
};

export type Bill = {
  id: string;
  name: string;
  amountCents: number;
  cadence: string;
  nextDate: string;
  source: "bill" | "loan" | "detected";
  essential: boolean;
};

export const SAMPLE_HEALTH = {
  score: 60 as number | null,
  status: "watch" as HealthStatus,
  checkedAt: "11:43 PM",
  trigger: "added purchases cleared",
};

export const SAMPLE_INDICATORS: Indicator[] = [
  { key: "bills", name: "Essential bills covered", weight: 40, value: "$106", status: "watch", points: 20, detail: "Lowest individual checking account: $106.00 on Nov 12. Includes every scheduled expense and reservation. Goal: $200+ buffer." },
  { key: "cushion", name: "Safety cushion", weight: 20, value: "0.3 mo", status: "risk", points: 0, detail: "$600 of unallocated savings ÷ $1,817/mo essential costs. Goal: 3 months." },
  { key: "debt", name: "Debt load", weight: 15, value: "8.4%", status: "healthy", points: 15, detail: "$310 loans + $27 confirmed card minimums per month. Income $4,008/mo." },
  { key: "savings", name: "Savings protection", weight: 15, value: "$0", status: "healthy", points: 15, detail: "No unallocated savings used for spending in the 30-day lookback." },
  { key: "subs", name: "Nonessential subscriptions", weight: 10, value: "2.1%", status: "healthy", points: 10, detail: "$83/mo in detected nonessential subscriptions. Goal: under 5% of confirmed income." },
];

export const SAMPLE_ACCOUNTS: Account[] = [
  { accountId: "acc_chk_alex", label: "Checking", type: "checking", balanceCents: 38600, note: "Everyday spending" },
  { accountId: "acc_sav_alex", label: "Savings", type: "savings", balanceCents: 90000, note: "$300 set aside · $600 free" },
  { accountId: "acc_cc_alex", label: "Credit card", type: "credit", balanceCents: 90000, note: "Owed · 45% of $2,000 limit" },
];

export const SAMPLE_PAYCHECK = { amountCents: 185000, cadence: "Every 14 days", next: "Fri, Nov 13" };
export const SAMPLE_GOAL = { name: "Orlando fund", amountCents: 30000, accountId: "acc_sav_alex" };

export const SAMPLE_BILLS: Bill[] = [
  { id: "b1", name: "Electric", amountCents: 12000, cadence: "Monthly", nextDate: "Nov 10", source: "bill", essential: true },
  { id: "b2", name: "T-Mobile", amountCents: 6500, cadence: "Monthly", nextDate: "Nov 12", source: "bill", essential: true },
  { id: "b3", name: "Car insurance", amountCents: 9500, cadence: "Monthly", nextDate: "Nov 12", source: "bill", essential: true },
  { id: "b4", name: "Netflix", amountCents: 1500, cadence: "Monthly", nextDate: "Nov 14", source: "detected", essential: false },
  { id: "b5", name: "Spotify", amountCents: 1100, cadence: "Monthly", nextDate: "Nov 16", source: "detected", essential: false },
  { id: "b6", name: "Car loan", amountCents: 31000, cadence: "Monthly", nextDate: "Nov 20", source: "loan", essential: true },
  { id: "b7", name: "Hulu", amountCents: 1700, cadence: "Monthly", nextDate: "Nov 21", source: "detected", essential: false },
  { id: "b8", name: "Planet Fitness", amountCents: 4000, cadence: "Monthly", nextDate: "Nov 28", source: "detected", essential: false },
  { id: "b9", name: "Rent", amountCents: 120000, cadence: "Monthly", nextDate: "Dec 1", source: "bill", essential: true },
];

/** Daily checking balance for the next 30 days (cents), starting Nov 8. */
export const SAMPLE_FORECAST: { label: string; cents: number }[] = (() => {
  const events: Record<number, number> = { 2: -12000, 4: -16000, 5: 185000, 6: -1500, 8: -1100, 12: -31000, 13: -1700, 19: 185000, 20: -4000, 23: -120000 };
  const out: { label: string; cents: number }[] = [];
  let bal = 38600;
  for (let d = 0; d < 30; d++) {
    bal += events[d] ?? 0;
    const date = new Date(2026, 10, 8 + d);
    out.push({ label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }), cents: bal });
  }
  return out;
})();

export const SAMPLE_FIX_PLAN = {
  headline: "Move $100 from Savings to Checking: score 60 → 80 (green).",
  from: { score: 60, status: "watch" as HealthStatus },
  to: { score: 80, status: "healthy" as HealthStatus },
  steps: [
    { title: "Move $100 from Savings to Checking", body: "Your checking would dip to $106 on Nov 12. This keeps it $200+ above your bills. Uses free savings only, never money set aside for a goal.", note: "" },
    { title: "Save $200 a week", body: "Builds a 3-month safety cushion ($5,451 of essential costs) in about 25 weeks, while your bills stay covered.", note: "Long-term goal, not counted in the score change above." },
  ],
  footnote: "Calculated by our scoring engine, not guessed: each step was re-scored before it was suggested. Same data, same plan. Still not green after this: Safety cushion.",
};

export const SAMPLE_RECENT_CHECKS = [
  { score: 60, status: "watch" as HealthStatus, label: "added purchases cleared", time: "11:43 PM" },
  { score: 45, status: "risk" as HealthStatus, label: "$180 purchase at Best Buy", time: "11:43 PM" },
  { score: 60, status: "watch" as HealthStatus, label: "you re-ran the check", time: "11:42 PM" },
];

export const COACH_PROMPTS = [
  "Get me to green. I won't cancel Spotify.",
  "Can we afford a $1,200 Orlando trip on March 1?",
  "Which subscriptions should I cut first?",
];

export const HOUSEHOLD_MEMBERS = [
  { username: "alex", name: "Alex", role: "Household owner", color: "pnc" },
  { username: "jordan", name: "Jordan", role: "Spouse", color: "cap" },
  { username: "maya", name: "Maya", role: "Dependent · 16", color: "nv" },
];
