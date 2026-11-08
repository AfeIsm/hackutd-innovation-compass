import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { CardFace } from "./CardFace";
import { CARDS, type CardId } from "./cards";
import { useWallet } from "./WalletContext";

/** An expanded card: keeps the card's identity in the header, then a normal scrolling page. */
export function PageShell({
  id,
  eyebrow,
  title,
  intro,
  actions,
  children,
}: {
  id: CardId;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { user, ready } = useAuth();
  const w = useWallet();

  return (
    <div className="page-wrap">
      <article className={`page-sheet page-${id}`}>
        <header className="page-header">
          <div className="page-header-face" aria-hidden>
            <CardFace id={id} />
          </div>
          <div className="page-header-inner">
            <button type="button" className="back-btn" onClick={w.backToWallet}>
              ← Back to wallet
            </button>
            {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
            {title && <h1 className="page-title font-display">{user || !ready ? title : CARDS[id].title}</h1>}
            {user && intro && <div className="page-intro">{intro}</div>}
            {user && actions && <div className="mt-4 flex flex-wrap gap-3">{actions}</div>}
          </div>
        </header>
        <div className="page-body">
          {!ready ? (
            <div className="grid gap-4" aria-busy="true">
              <div className="skeleton h-40" />
              <div className="skeleton h-64" />
            </div>
          ) : !user ? (
            <div className="paper-card mx-auto max-w-md text-center">
              <h2 className="font-display text-2xl">Log in to open {CARDS[id].title}</h2>
              <p className="mt-2 text-muted-foreground">This card holds private information. Show your member ID first.</p>
              <button type="button" className="btn-primary mt-5" onClick={() => w.openLogin()}>
                Log in
              </button>
            </div>
          ) : (
            children
          )}
        </div>
      </article>
    </div>
  );
}
