import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/wallet/PageShell";
import { USERNAME_RULE } from "@/lib/auth";

export const Route = createFileRoute("/friends")({
  head: () => ({
    meta: [
      { title: "Friends — Wallet Whisperer" },
      { name: "description", content: "Add friends by exact username. They see your pledge only after everyone commits." },
      { property: "og:title", content: "Friends — Wallet Whisperer" },
      { property: "og:description", content: "Add friends by exact username. They see your pledge only after everyone commits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FriendsPage,
});

type Friend = { username: string; status: "Pending" | "Accepted" | "Declined" };

function FriendsPage() {
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([{ username: "sam", status: "Declined" }]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const u = name.trim().replace(/^@/, "").toLowerCase();
    if (!USERNAME_RULE.test(u)) return setErr("Usernames are 3–20 letters, numbers, _ or .");
    if (friends.some((f) => f.username === u && f.status !== "Declined")) return setErr(`You already sent @${u} a request.`);
    setErr(null);
    setFriends([{ username: u, status: "Pending" }, ...friends.filter((f) => f.username !== u)]);
    setName("");
    toast(`Request sent to @${u}`, { description: "Preview only — they'd accept on their own device." });
  };

  return (
    <PageShell id="friends" eyebrow="People outside your household" title="Friends" intro="Friends see your pledge amount only after everyone commits. Never your balances, bills or score.">
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        <form className="paper-card" onSubmit={submit} noValidate>
          <h2 className="section-title font-display">Add a friend by username</h2>
          <label className="mt-4 grid gap-1 text-sm font-semibold">Username
            <span className="field"><span className="text-muted-foreground">@</span><input className="w-full bg-transparent font-normal outline-none" placeholder="sam" value={name} onChange={(e) => setName(e.target.value)} /></span>
          </label>
          {err && <p role="alert" className="mt-2 text-sm text-risk">{err}</p>}
          <button type="submit" className="btn-primary mt-4 w-full" disabled={!name.trim()}>Send request</button>
          <p className="mt-3 text-sm text-muted-foreground">Type their exact username. They get the request on their own device and have to accept.</p>
        </form>
        <div className="paper-card">
          <h2 className="section-title font-display">Your friends</h2>
          <ul className="mt-2 divide-y divide-border">
            {friends.map((f) => (
              <li key={f.username} className="flex items-center gap-3 py-3">
                <span className="avatar avatar-cap">{f.username.charAt(0).toUpperCase()}</span>
                <div className="flex-1"><p className="font-semibold capitalize">{f.username}</p><p className="text-sm text-muted-foreground">@{f.username}</p></div>
                <span className={`pill ${f.status === "Accepted" ? "pill-healthy" : "pill-needsInput"}`}>{f.status}</span>
              </li>
            ))}
          </ul>
          <Link to="/huddles" className="mt-4 inline-block font-semibold hover:underline">Plan something together →</Link>
        </div>
      </div>
    </PageShell>
  );
}
