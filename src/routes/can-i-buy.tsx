import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageShell } from "@/components/wallet/PageShell";
import { SampleBadge } from "@/components/ui-bits";
import { SAMPLE_ACCOUNTS, SAMPLE_HEALTH } from "@/lib/demo-data";
import { formatCents, formatScore, parseDollarsToCents } from "@/lib/money";

export const Route = createFileRoute("/can-i-buy")({
  head: () => ({
    meta: [
      { title: "Can I Buy? — Wallet Whisperer" },
      { name: "description", content: "Re-score your money as if you already bought it, from an exact account on an exact date." },
      { property: "og:title", content: "Can I Buy? — Wallet Whisperer" },
      { property: "og:description", content: "Re-score your money as if you already bought it, from an exact account on an exact date." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BuyPage,
});

const EXAMPLES = [
  { label: "$900 PS6 today", name: "PlayStation 6", amount: "900", account: "acc_sav_alex" },
  { label: "$120 concert, Nov 21", name: "Concert", amount: "120", account: "acc_chk_alex" },
  { label: "$180 from savings", name: "Best Buy", amount: "180", account: "acc_sav_alex" },
];
const AVAILABLE: Record<string, number> = { acc_chk_alex: 38600, acc_sav_alex: 60000 };

function BuyPage() {
  const [f, setF] = useState({ name: "", amount: "", date: "2026-11-08", account: "acc_sav_alex" });
  const [result, setResult] = useState<null | { kind: "no" | "engine"; cents: number }>(null);
  const [err, setErr] = useState<string | null>(null);
  const cash = SAMPLE_ACCOUNTS.filter((a) => a.type !== "credit");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const cents = parseDollarsToCents(f.amount);
    if (!f.name.trim()) return setErr("Tell us what it is.");
    if (cents === null) return setErr("Enter a cost like 900.");
    setErr(null);
    setResult({ kind: cents > (AVAILABLE[f.account] ?? 0) ? "no" : "engine", cents });
  };

  return (
    <PageShell id="buy" eyebrow="What if" title="Can I buy it?" intro={<span className="flex flex-wrap items-center gap-3"><SampleBadge /> We re-score your money as if you already bought it.</span>}>
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        <form className="paper-card grid gap-4" onSubmit={submit} noValidate>
          <div>
            <p className="text-sm text-muted-foreground">Try an example</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {EXAMPLES.map((x) => (
                <button key={x.label} type="button" className="chip" onClick={() => setF({ ...f, name: x.name, amount: x.amount, account: x.account })}>{x.label}</button>
              ))}
            </div>
          </div>
          <label className="grid gap-1 text-sm font-semibold">What is it?<input className="field-input font-normal" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="PlayStation 6" /></label>
          <label className="grid gap-1 text-sm font-semibold">Cost<input className="field-input font-normal" inputMode="decimal" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} placeholder="900" /></label>
          <label className="grid gap-1 text-sm font-semibold">When<input type="date" className="field-input font-normal" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></label>
          <label className="grid gap-1 text-sm font-semibold">Pay from
            <select className="field-input font-normal" value={f.account} onChange={(e) => setF({ ...f, account: e.target.value })}>
              {cash.map((a) => <option key={a.accountId} value={a.accountId}>{a.label} · {formatCents(AVAILABLE[a.accountId] ?? 0)}{a.type === "savings" ? " unallocated" : ""}</option>)}
            </select>
          </label>
          {err && <p role="alert" className="text-sm text-risk">{err}</p>}
          <button type="submit" className="btn-primary">Check it</button>
        </form>

        <div className="paper-card">
          {!result ? (
            <div className="grid h-full place-items-center py-16 text-center text-muted-foreground">
              <p>Pick an example or describe a purchase.<br />We’ll show your score before and after.</p>
            </div>
          ) : result.kind === "no" ? (
            <div>
              <div className="flex flex-wrap items-center gap-3"><span className="pill pill-risk">Not right now</span><span className="text-sm text-muted-foreground">Same question + same data = same answer</span></div>
              <h2 className="mt-4 font-display text-4xl">Not right now.</h2>
              <p className="mt-3 text-lg">This would spend money protected for another savings goal or exceed this account balance.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="score-tile"><p className="text-sm text-muted-foreground">Score now</p><p className="font-display text-5xl">{formatScore(SAMPLE_HEALTH.score)}</p></div>
                <div className="score-tile is-watch"><p className="text-sm">If you bought it now</p><p className="font-display text-5xl text-watch">{formatScore(SAMPLE_HEALTH.score)}</p></div>
              </div>
              <details className="mt-5"><summary className="cursor-pointer font-semibold">Before: indicators</summary><p className="mt-2 text-muted-foreground">See My Money for the full breakdown.</p></details>
              <details className="mt-3"><summary className="cursor-pointer font-semibold">After: indicators</summary><p className="mt-2 text-muted-foreground">Unchanged — the purchase was blocked before scoring.</p></details>
            </div>
          ) : (
            <div className="py-6">
              <span className="pill pill-needsInput">Needs the scoring engine</span>
              <h2 className="mt-4 font-display text-3xl">We can’t answer this one in the preview.</h2>
              <p className="mt-3 text-muted-foreground">
                {formatCents(result.cents)} fits in the selected account, so the real answer (Yes, Yes if…, or Not right now) comes from the
                team’s engine, which isn’t connected here. We won’t guess.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
