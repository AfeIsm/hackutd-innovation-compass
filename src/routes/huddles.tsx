import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageShell } from "@/components/wallet/PageShell";
import { HOUSEHOLD_MEMBERS } from "@/lib/demo-data";
import { formatCents, parseDollarsToCents } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Flag, Plus, Users } from "lucide-react";

export const Route = createFileRoute("/huddles")({
  head: () => ({
    meta: [
      { title: "Huddles — Wallet Whisperer" },
      { name: "description", content: "Plan a shared purchase. Each payer pledges privately; amounts are revealed only after everyone commits." },
      { property: "og:title", content: "Huddles — Wallet Whisperer" },
      { property: "og:description", content: "Plan a shared purchase. Each payer pledges privately; amounts are revealed only after everyone commits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HuddlesPage,
});

type Huddle = { name: string; cents: number; date: string; payers: number };

function HuddlesPage() {
  const [huddles, setHuddles] = useState<Huddle[]>([]);
  const [f, setF] = useState({ name: "", cost: "", date: "" });
  const [paying, setPaying] = useState<Record<string, boolean>>({ alex: true, jordan: true, maya: true });
  const [err, setErr] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const cents = parseDollarsToCents(f.cost);
    if (!f.name.trim()) return setErr("Name what you’re planning.");
    if (cents === null) return setErr("Enter a total cost like 1200.");
    if (!f.date) return setErr("Pick a pay-by date.");
    const payers = Object.values(paying).filter(Boolean).length;
    if (!payers) return setErr("At least one person needs to be paying.");
    setErr(null);
    setHuddles([{ name: f.name.trim(), cents, date: f.date, payers }, ...huddles]);
    setF({ name: "", cost: "", date: "" });
  };

  return (
    <PageShell id="huddles" eyebrow="HackUTD 2026 · Group purchases" title="Huddles" intro="Big plans. One team.">
      <div className="huddles-layout">
        <section className="huddles-plans">
          <div className="huddles-section-heading"><Flag aria-hidden="true" /><h2 className="section-title font-display">Your huddles</h2></div>
          {huddles.length === 0 ? (
            <div className="huddles-empty"><Users aria-hidden="true" /><h3 className="font-display text-xl">The next big plan starts here.</h3><p className="mt-2 text-sm text-muted-foreground">No huddles yet.</p></div>
          ) : (
            <ul className="divide-y divide-border">
              {huddles.map((h, i) => (
                <li key={i} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div><p className="font-semibold">{h.name}</p><p className="text-sm text-muted-foreground">{formatCents(h.cents)} · pay by {h.date}</p></div>
                  <span className="pill pill-needsInput">Pledging · 0 of {h.payers} committed</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <form className="huddles-form" onSubmit={submit} noValidate>
          <div className="huddles-section-heading"><Plus aria-hidden="true" /><h2 className="section-title font-display">Start a huddle</h2></div>
          <div className="mt-4 grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr]">
            <label className="grid gap-1 text-sm font-semibold">What are you planning?<input className="field-input font-normal" placeholder="Beach weekend" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold">Total cost<input className="field-input font-normal" inputMode="decimal" placeholder="1200" value={f.cost} onChange={(e) => setF({ ...f, cost: e.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold">Pay by<input type="date" className="field-input font-normal" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></label>
          </div>
          <h3 className="mt-6 font-display text-xl">Who’s coming</h3>
          <ul className="mt-2 divide-y divide-border">
            {HOUSEHOLD_MEMBERS.map((m, i) => (
              <li key={m.username} className="flex items-center gap-3 py-3">
                <span className={`avatar avatar-${m.color}`}>{m.name[0]}</span>
                <div className="flex-1"><p className="font-semibold">{m.name}{i === 0 ? " (you)" : ""}</p><p className="text-sm text-muted-foreground">{m.role}</p></div>
                <label className="flex items-center gap-2 text-sm">
                  Paying
                  <input type="checkbox" className="switch" checked={paying[m.username]} onChange={(e) => setPaying({ ...paying, [m.username]: e.target.checked })} />
                </label>
              </li>
            ))}
          </ul>
          {err && <p role="alert" className="mt-3 text-sm text-risk">{err}</p>}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Each payer pledges privately. Nobody sees amounts until everyone has committed.</p>
            <Button type="submit" className="huddles-create"><Plus aria-hidden="true" />Create huddle</Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
