import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/wallet/PageShell";
import { StatusPill } from "@/components/ui-bits";
import { HOUSEHOLD_MEMBERS, SAMPLE_ACCOUNTS, SAMPLE_HEALTH, SAMPLE_PAYCHECK } from "@/lib/demo-data";
import { formatCents, formatScore } from "@/lib/money";
import { USERNAME_RULE } from "@/lib/auth";

export const Route = createFileRoute("/household")({
  head: () => ({
    meta: [
      { title: "Household — Wallet Whisperer" },
      { name: "description", content: "Each person controls what they share. Joining a household never shares finances automatically." },
      { property: "og:title", content: "Household — Wallet Whisperer" },
      { property: "og:description", content: "Each person controls what they share. Joining a household never shares finances automatically." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HouseholdPage,
});

const SHARE = [
  ["balances", "Account balances", "Account names, types and current balances."],
  ["income", "Income and payday", "Detected paycheck amount, cadence and next payday."],
  ["bills", "Bills and loans", "Scheduled payment names, amounts, dates and essential tags."],
  ["goals", "Savings goals", "Goal names and amounts set aside."],
  ["tx", "Recent transactions", "The most recent 20 transaction descriptions, amounts and dates."],
  ["score", "Health score", "Overall score and status only. Indicator details remain private."],
] as const;

function HouseholdPage() {
  const [idx, setIdx] = useState(0);
  const [share, setShare] = useState<Record<string, boolean>>({});
  const [invite, setInvite] = useState({ username: "", role: "Dependent" });
  const m = HOUSEHOLD_MEMBERS[idx]!;
  const isMe = idx === 0;

  return (
    <PageShell
      id="household"
      eyebrow="Your household"
      title="Household"
      intro="Each person controls what they share. Joining a household never shares finances automatically."
      actions={<button type="button" className="btn-ghost" onClick={() => toast("Leaving isn't connected in this preview")}>Leave household</button>}
    >
      <div className="grid gap-6">
        <section className="paper-card">
          <div className="flex items-center justify-between">
            <div><p className="eyebrow">Household at a glance</p><p className="text-muted-foreground">{m.name}{isMe ? " (you)" : ""} · {idx + 1} of {HOUSEHOLD_MEMBERS.length}</p></div>
            <div className="flex gap-2">
              <button type="button" className="icon-btn" aria-label="Previous member" onClick={() => setIdx((idx + 2) % 3)}>‹</button>
              <button type="button" className="icon-btn" aria-label="Next member" onClick={() => setIdx((idx + 1) % 3)}>›</button>
            </div>
          </div>
          <div className="member-card mt-5">
            <div className="flex items-center gap-3">
              <span className={`avatar avatar-${m.color} size-12 text-lg`}>{m.name[0]}</span>
              <div><p className="font-display text-2xl">{m.name}{isMe ? " (you)" : ""}</p><p className="text-sm text-muted-foreground">{m.role}</p></div>
            </div>
            {isMe ? (
              <>
                <div className="mt-4 flex items-center gap-3"><span className="font-display text-5xl">{formatScore(SAMPLE_HEALTH.score)}</span><StatusPill status={SAMPLE_HEALTH.status} /></div>
                <dl className="mt-4 grid gap-2">
                  <Row k="Checking" v={formatCents(SAMPLE_ACCOUNTS[0]!.balanceCents)} />
                  <Row k="Savings" v={formatCents(SAMPLE_ACCOUNTS[1]!.balanceCents)} />
                  <Row k="Next payday" v={`${SAMPLE_PAYCHECK.next} · ${formatCents(SAMPLE_PAYCHECK.amountCents)}`} />
                </dl>
              </>
            ) : (
              <p className="mt-4 text-muted-foreground">{m.name} hasn’t shared anything with you. Their finances stay private until they choose to share.</p>
            )}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {HOUSEHOLD_MEMBERS.map((x, i) => (
              <button key={x.username} type="button" onClick={() => setIdx(i)} className={`member-tab ${i === idx ? "is-active" : ""}`}>
                <span className={`avatar avatar-${x.color}`}>{x.name[0]}</span>
                <span className="flex-1 text-left font-semibold">{x.name}{i === 0 ? " (you)" : ""}</span>
                <span className="text-muted-foreground">{i === 0 ? formatScore(SAMPLE_HEALTH.score) : "—"}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="paper-card">
          <h2 className="section-title font-display">What I share with my household</h2>
          <p className="mt-2 text-muted-foreground">Only selected categories are visible to other accepted members, including the owner. Changes save automatically. Your own view always shows your data.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {SHARE.map(([k, title, desc]) => (
              <label key={k} className="share-option">
                <input type="checkbox" checked={!!share[k]} onChange={(e) => setShare({ ...share, [k]: e.target.checked })} />
                <span><span className="block font-semibold">{title}</span><span className="text-sm text-muted-foreground">{desc}</span></span>
              </label>
            ))}
          </div>
        </section>

        <form
          className="paper-card"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const u = invite.username.trim().replace(/^@/, "").toLowerCase();
            if (!USERNAME_RULE.test(u)) {
              toast.error("Usernames are 3–20 letters, numbers, _ or .");
              return;
            }
            toast(`Invite sent to @${u} as ${invite.role}`, { description: "Preview only — they'd accept on their own device." });
            setInvite({ ...invite, username: "" });
          }}
        >
          <h2 className="section-title font-display">Invite to your household</h2>
          <label className="mt-4 grid gap-1 text-sm font-semibold">Username
            <span className="field"><span className="text-muted-foreground">@</span><input className="w-full bg-transparent font-normal outline-none" placeholder="sam" value={invite.username} onChange={(e) => setInvite({ ...invite, username: e.target.value })} /></span>
          </label>
          <label className="mt-3 grid gap-1 text-sm font-semibold">Role
            <select className="field-input font-normal" value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value })}>
              <option>Dependent</option><option>Spouse</option>
            </select>
          </label>
          <button type="submit" className="btn-primary mt-4 w-full" disabled={!invite.username.trim()}>Send request</button>
        </form>
      </div>
    </PageShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-3"><dt>{k}</dt><dd className="font-semibold tabular-nums">{v}</dd></div>;
}
