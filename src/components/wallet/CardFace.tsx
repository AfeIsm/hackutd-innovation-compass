import { CARDS, type CardId } from "./cards";

/** The visual face of a navigation object. Shared by the slot card, the flying card and page headers. */
export function CardFace({ id }: { id: CardId }) {
  const card = CARDS[id];
  if (id === "buy") {
    return (
      <div className={`card-face ${card.face}`}>
        <div className="note-border" aria-hidden />
        <span className="note-corner note-corner-l" aria-hidden>WW</span>
        <span className="card-title font-display">{card.title}</span>
        <span className="note-seal" aria-hidden />
        <span className="note-corner note-corner-r" aria-hidden>WW</span>
      </div>
    );
  }
  if (id === "household") {
    return (
      <div className={`card-face ${card.face}`}>
        <span className="card-title font-display">{card.title}</span>
        <span className="biz-org">HackUTD 2026 · Wallet Whisperer</span>
        <span className="biz-rule" aria-hidden />
        <span className="biz-line">Members · Sharing by consent</span>
      </div>
    );
  }
  return (
    <div className={`card-face ${card.face}`}>
      <span className="card-title font-display">{card.title}</span>
      <span className="card-brand">
        {id === "money" ? "PNC-inspired" : id === "friends" ? "Capital One-inspired" : "NVIDIA-inspired"}
      </span>
      <span className="card-chip" aria-hidden />
      <span className="card-number" aria-hidden>•••• •••• •••• 2026</span>
      <span className="card-swoosh" aria-hidden />
    </div>
  );
}
