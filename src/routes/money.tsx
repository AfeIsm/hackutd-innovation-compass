import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/wallet/PageShell";
import { SampleBadge, ScoreRing, StatusPill } from "@/components/ui-bits";
import { useAuth } from "@/lib/auth";
import {
  COACH_PROMPTS,
  SAMPLE_ACCOUNTS,
  SAMPLE_BILLS,
  SAMPLE_FIX_PLAN,
  SAMPLE_FORECAST,
  SAMPLE_GOAL,
  SAMPLE_HEALTH,
  SAMPLE_INDICATORS,
  SAMPLE_PAYCHECK,
  SAMPLE_RECENT_CHECKS,
} from "@/lib/demo-data";
import { formatCents, formatScore, parseDollarsToCents } from "@/lib/money";

export const Route = createFileRoute("/money")({
  head: () => ({
    meta: [
      { title: "My Money — Wallet Whisperer" },
      { name: "description", content: "Your health score, accounts, 30-day checking forecast and bills in one place." },
      { property: "og:title", content: "My Money — Wallet Whisperer" },
      { property: "og:description", content: "Your health score, accounts, 30-day checking forecast and bills in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MoneyPage,
});

const notConnected = (what: string) =>
  toast(`${what} runs on the team's scoring engine`, { description: "This preview isn't connected to it yet, so nothing changed." });

function MoneyPage() {
  const { user } = useAuth();
  return (
    <PageShell
      id="money"
      eyebrow="My Money"
      title={<>Hi {user?.name ?? "there"}, here’s your money today</>}
      intro={
        <span className="flex flex-wrap items-center gap-3">
          <SampleBadge /> Synced with your bank · last sync 11:43 PM
        </span>
      }
      actions={
        <button type="button" className="btn-ghost" onClick={() => notConnected("Randomize demo finances")}>
          Randomize demo finances
        </button>
      }
    >
      <div className="grid gap-6">
        <HealthSection />
        <FixPlan />
        <Coach />
        <Accounts />
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Forecast />
          <Bills />
        </div>
        <PurchasesAndChecks />
      </div>
    </PageShell>
  );
}

function HealthSection() {
  const h = SAMPLE_HEALTH;
  return (
    <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="paper-card flex flex-col items-center text-center">
        <p className="eyebrow self-start">Health score</p>
        <div className="mt-4">
          <ScoreRing score={h.score} status={h.status} />
        </div>
        <div className="mt-4">
          <StatusPill status={h.status} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Score {formatScore(h.score)} · checked {h.checkedAt} · after: {h.trigger}
        </p>
        <button type="button" className="btn-ghost mt-auto w-full" style={{ marginTop: 24 }} onClick={() => notConnected("Re-running the health check")}>
          Re-run health check
        </button>
        <p className="mt-2 text-xs text-muted-foreground">Every check is saved to your history.</p>
      </div>

      <div className="paper-card min-w-0">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="section-title font-display">What makes up your score</h2>
          <span className="text-sm text-muted-foreground">points × weight</span>
        </div>
        <ul className="mt-2 divide-y divide-border">
          {SAMPLE_INDICATORS.map((ind) => (
            <li key={ind.key} className="grid gap-2 py-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-5">
              <div>
                <p className="font-semibold">
                  {ind.name} <span className="ml-1 text-sm font-normal text-muted-foreground">{ind.weight}% of score</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{ind.detail}</p>
              </div>
              <span className="font-display text-2xl tabular-nums">{ind.value}</span>
              <StatusPill status={ind.status} />
              <span className="text-sm tabular-nums text-muted-foreground">+{ind.points} pts</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          Healthy 75–100 · Watch 50–74 · At risk 0–49. If essential bills aren’t covered, the score is At risk no matter what.
        </p>
      </div>
    </section>
  );
}

function FixPlan() {
  const p = SAMPLE_FIX_PLAN;
  return (
    <section className="paper-card accent-edge">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Your fix plan</p>
          <h2 className="section-title font-display mt-1">{p.headline}</h2>
        </div>
        <div className="flex items-center gap-2 text-lg font-semibold">
          {p.from.score} <StatusPill status={p.from.status} /> → {p.to.score} <StatusPill status={p.to.status} />
        </div>
      </div>
      <ol className="mt-5 grid gap-3">
        {p.steps.map((s, i) => (
          <li key={s.title} className="step-row">
            <span className="step-num">{i + 1}</span>
            <div>
              <p className="font-semibold">{s.title}</p>
              <p className="mt-1 text-muted-foreground">{s.body}</p>
              {s.note && <p className="mt-1 text-sm text-muted-foreground">{s.note}</p>}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button type="button" className="btn-primary" onClick={() => notConnected("Applying the plan")}>
          Apply this plan
        </button>
        <span className="text-sm text-muted-foreground">
          Nothing happens until you click. Savings moves are sent to the bank (Nessie) as a real transfer.
        </span>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{p.footnote}</p>
    </section>
  );
}

function Coach() {
  const [q, setQ] = useState("");
  return (
    <section className="paper-card">
      <p className="eyebrow">Ask the coach · Nemotron agent</p>
      <h2 className="section-title font-display mt-1">Tell it your goal in your own words</h2>
      <p className="mt-2 text-muted-foreground">
        It checks your real accounts, tests options with our scoring engine, and proposes a plan. Every number is calculated by the
        engine, not the AI.
      </p>
      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) toast("The coach isn't connected in this preview", { description: `Your question: “${q.trim()}”` });
        }}
      >
        <label className="sr-only" htmlFor="coach-q">Your question</label>
        <input id="coach-q" className="field-input flex-1" placeholder="e.g. Can we do Orlando in March if I drop the gym but keep Spotify?" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="submit" className="btn-primary" disabled={!q.trim()}>Ask</button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {COACH_PROMPTS.map((p) => (
          <button key={p} type="button" className="chip" onClick={() => setQ(p)}>{p}</button>
        ))}
      </div>
    </section>
  );
}

function Accounts() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {SAMPLE_ACCOUNTS.map((a) => (
        <div key={a.accountId} className="paper-card compact">
          <p className="eyebrow">{a.label}</p>
          <p className="mt-2 font-display text-3xl tabular-nums">{formatCents(a.balanceCents)}</p>
          <p className="mt-2 text-sm text-muted-foreground">{a.note}</p>
        </div>
      ))}
      <div className="paper-card compact">
        <p className="eyebrow">Paycheck · detected</p>
        <p className="mt-2 font-display text-3xl tabular-nums">{formatCents(SAMPLE_PAYCHECK.amountCents, { whole: true })}</p>
        <p className="mt-2 text-sm text-muted-foreground">{SAMPLE_PAYCHECK.cadence} · next {SAMPLE_PAYCHECK.next}</p>
      </div>
      <div className="paper-card compact">
        <p className="eyebrow">Savings goals</p>
        <p className="mt-2 font-display text-xl">{SAMPLE_GOAL.name} · {formatCents(SAMPLE_GOAL.amountCents, { whole: true })}</p>
        <p className="mt-2 text-sm text-muted-foreground">Set aside in savings</p>
      </div>
    </section>
  );
}

function Forecast() {
  const pts = SAMPLE_FORECAST as { label: string; cents: number }[];
  const at = (i: number) => pts[i]!;
  const W = 600, Hh = 220, pad = 10;
  const max = Math.max(...pts.map((p) => p.cents), 20000);
  const min = Math.min(0, ...pts.map((p) => p.cents));
  const y = (c: number) => pad + (Hh - pad * 2) * (1 - (c - min) / (max - min));
  const x = (i: number) => (i / (pts.length - 1)) * W;
  let d = `M0 ${y(at(0).cents)}`;
  pts.forEach((p, i) => { if (i) d += ` H${x(i)} V${y(p.cents)}`; });
  const lowIdx = pts.reduce((lo, p, i) => (p.cents < at(lo).cents ? i : lo), 0);
  return (
    <section className="paper-card">
      <div className="flex items-baseline justify-between">
        <h2 className="section-title font-display">Next 30 days in checking</h2>
        <span className="text-sm text-muted-foreground">paychecks minus bills</span>
      </div>
      <svg viewBox={`0 0 ${W} ${Hh}`} className="mt-4 w-full" role="img" aria-label={`Checking forecast. Lowest ${formatCents(at(lowIdx).cents)} on ${at(lowIdx).label}.`}>
        <line x1="0" x2={W} y1={y(20000)} y2={y(20000)} className="chart-buffer" />
        <line x1="0" x2={W} y1={y(0)} y2={y(0)} className="chart-zero" />
        <path d={d} className="chart-line" />
        <circle cx={x(lowIdx)} cy={y(at(lowIdx).cents)} r="6" className="chart-dot" />
      </svg>
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <span>Lowest: <b>{formatCents(at(lowIdx).cents)} on {at(lowIdx).label}</b></span>
        <span className="text-watch">- - $200 buffer</span>
        <span className="text-risk">— $0</span>
      </p>
    </section>
  );
}

function Bills() {
  const [bills, setBills] = useState(SAMPLE_BILLS);
  const essentialMonthly = bills.filter((b) => b.essential).reduce((s, b) => s + b.amountCents, 0);
  return (
    <section className="paper-card">
      <div className="flex items-baseline justify-between">
        <h2 className="section-title font-display">Bills & subscriptions</h2>
        <span className="text-sm text-muted-foreground">{formatCents(essentialMonthly, { whole: true })}/mo essential</span>
      </div>
      <ul className="mt-2 divide-y divide-border">
        {bills.map((b) => (
          <li key={b.id} className="flex items-center justify-between gap-3 py-3">
            <div>
              <p className="font-semibold">{b.name}</p>
              <p className="text-sm text-muted-foreground">{b.cadence} · {b.nextDate} · {b.source}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold tabular-nums">{formatCents(b.amountCents)}</span>
              <button
                type="button"
                aria-pressed={b.essential}
                className={`tag-toggle ${b.essential ? "is-on" : ""}`}
                onClick={() => setBills(bills.map((x) => (x.id === b.id ? { ...x, essential: !x.essential } : x)))}
                aria-label={`${b.name}: ${b.essential ? "Essential" : "Non-essential"}. Click to change.`}
              >
                {b.essential ? "Essential" : "Non-essential"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PurchasesAndChecks() {
  const [where, setWhere] = useState("");
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState(SAMPLE_ACCOUNTS[1]!.accountId);
  const [err, setErr] = useState<string | null>(null);
  const cash = SAMPLE_ACCOUNTS.filter((a) => a.type !== "credit");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const cents = parseDollarsToCents(amount);
    if (!where.trim()) return setErr("Enter where you bought it.");
    if (cents === null) return setErr("Enter an amount like 180.00.");
    setErr(null);
    notConnected(`Adding ${formatCents(cents)} at ${where.trim()}`);
  };
  return (
    <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <form className="paper-card" onSubmit={submit} noValidate>
        <h2 className="section-title font-display">Add a purchase</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1.2fr_0.8fr_1.4fr_auto] sm:items-end">
          <label className="grid gap-1 text-sm font-semibold">Where<input className="field-input font-normal" placeholder="Best Buy" value={where} onChange={(e) => setWhere(e.target.value)} /></label>
          <label className="grid gap-1 text-sm font-semibold">Amount<input className="field-input font-normal" inputMode="decimal" placeholder="180.00" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
          <label className="grid gap-1 text-sm font-semibold">Paid from
            <select className="field-input font-normal" value={from} onChange={(e) => setFrom(e.target.value)}>
              {cash.map((a) => (
                <option key={a.accountId} value={a.accountId}>{a.label} · {formatCents(a.type === "savings" ? 60000 : a.balanceCents)}{a.type === "savings" ? " free" : ""}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn-primary" disabled={!where.trim() || !amount.trim()}>Add purchase</button>
        </div>
        {err && <p role="alert" className="mt-2 text-sm text-risk">{err}</p>}
        <p className="mt-3 text-sm text-muted-foreground">Your health check re-runs automatically.</p>
      </form>
      <div className="paper-card">
        <h2 className="section-title font-display">Recent checks</h2>
        <ul className="mt-2 divide-y divide-border">
          {SAMPLE_RECENT_CHECKS.map((c, i) => (
            <li key={i} className="flex items-center gap-3 py-3">
              <span className={`w-10 font-display text-xl text-${c.status}`}>{formatScore(c.score)}</span>
              <span className="flex-1 truncate">{c.label}</span>
              <span className="text-sm text-muted-foreground">{c.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
