import { STATUS_LABEL, formatScore, type HealthStatus } from "@/lib/money";

export function StatusPill({ status }: { status: HealthStatus }) {
  return <span className={`pill pill-${status}`}>{STATUS_LABEL[status]}</span>;
}

export function ScoreRing({ score, status }: { score: number | null; status: HealthStatus }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const pct = score === null ? 0 : Math.max(0, Math.min(100, score)) / 100;
  return (
    <div className="relative mx-auto grid size-48 place-items-center">
      <svg viewBox="0 0 180 180" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="90" cy="90" r={r} className="ring-track" />
        <circle cx="90" cy="90" r={r} className={`ring-value ring-${status}`} strokeDasharray={`${c * pct} ${c}`} />
      </svg>
      <div className="text-center">
        <div className={`font-display ${score === null ? "text-2xl" : "text-6xl"} leading-none`}>{formatScore(score)}</div>
        {score !== null && <div className="mt-1 text-sm text-muted-foreground">out of 100</div>}
      </div>
    </div>
  );
}

export function SampleBadge() {
  return (
    <span className="sample-badge" title="Sample data mirroring the live app — not connected">
      Sample data
    </span>
  );
}
