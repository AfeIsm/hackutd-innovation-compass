import { useLocation, useNavigate } from "@tanstack/react-router";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { CARDS, cardForPath, type CardId } from "./cards";

export type FlightPhase = "start" | "lift" | "expand" | "settle" | "full" | "shrink" | "insert";
export type Flight = { id: CardId; phase: FlightPhase; slot: DOMRect | null };

export const MOTION = { unfold: 900, lift: 260, expand: 520, settle: 220, shrink: 420, insert: 260 };

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type WalletCtx = {
  open: boolean;
  instant: boolean;
  openWallet: () => void;
  closeWallet: () => void;
  loginOpen: boolean;
  openLogin: (then?: CardId | null) => void;
  closeLogin: () => void;
  onLoggedIn: () => void;
  side: "left" | "right";
  setSide: (s: "left" | "right") => void;
  flight: Flight | null;
  openCard: (id: CardId) => void;
  backToWallet: () => void;
  registerSlot: (id: CardId, el: HTMLElement | null) => void;
  reduced: boolean;
  activeCard: CardId | null;
};

const Ctx = createContext<WalletCtx | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const pathname = useLocation({ select: (l) => l.pathname });
  const activeCard = cardForPath(pathname);

  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [side, setSide] = useState<"left" | "right">("left");
  const [flight, setFlight] = useState<Flight | null>(null);
  const [reduced, setReduced] = useState(false);
  const pending = useRef<CardId | null>(null);
  const slots = useRef(new Map<CardId, HTMLElement>());
  const busy = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => setReduced(prefersReducedMotion()), []);

  // A valid session (or a direct page link) skips the opening ceremony.
  useEffect(() => {
    if (!ready) return;
    if (user || activeCard) {
      setOpen(true);
      setSide("right");
    }
    const t = window.setTimeout(() => setInstant(false), 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, reduced ? Math.min(ms, 60) : ms));
  };

  const registerSlot = useCallback((id: CardId, el: HTMLElement | null) => {
    if (el) slots.current.set(id, el);
    else slots.current.delete(id);
  }, []);

  const openCard = useCallback(
    (id: CardId) => {
      if (busy.current) return;
      if (!user) {
        pending.current = id;
        setLoginOpen(true);
        return;
      }
      const el = slots.current.get(id);
      if (!el) {
        navigate({ to: CARDS[id].to });
        return;
      }
      busy.current = true;
      setFlight({ id, phase: "start", slot: el.getBoundingClientRect() });
      requestAnimationFrame(() => requestAnimationFrame(() => setFlight((f) => f && { ...f, phase: "lift" })));
      later(() => setFlight((f) => f && { ...f, phase: "expand" }), MOTION.lift);
      later(() => {
        window.scrollTo(0, 0);
        navigate({ to: CARDS[id].to });
        setFlight((f) => f && { ...f, phase: "settle" });
      }, MOTION.lift + MOTION.expand);
      later(() => {
        setFlight(null);
        busy.current = false;
      }, MOTION.lift + MOTION.expand + MOTION.settle);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, navigate, reduced],
  );

  const backToWallet = useCallback(() => {
    if (busy.current) return;
    const id = activeCard;
    if (!id) {
      setOpen(true);
      return;
    }
    busy.current = true;
    window.scrollTo(0, 0);
    setOpen(true);
    setFlight({ id, phase: "full", slot: null });
    navigate({ to: "/" });
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const el = slots.current.get(id);
        const slot = el?.getBoundingClientRect() ?? null;
        setFlight({ id, phase: "shrink", slot });
      }),
    );
    later(() => setFlight((f) => f && { ...f, phase: "insert" }), MOTION.shrink + 30);
    later(() => {
      setFlight(null);
      busy.current = false;
    }, MOTION.shrink + MOTION.insert + 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCard, navigate, reduced]);

  const onLoggedIn = useCallback(() => {
    setLoginOpen(false);
    const next = pending.current;
    pending.current = null;
    // Let the ID card fill and slide back, then shift focus to the navigation pockets.
    later(() => setSide("right"), 650);
    if (next) later(() => openCard(next), 1150);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCard]);

  const value = useMemo<WalletCtx>(
    () => ({
      open,
      instant,
      openWallet: () => setOpen(true),
      closeWallet: () => {
        setLoginOpen(false);
        setSide("left");
        setOpen(false);
      },
      loginOpen,
      openLogin: (then = null) => {
        pending.current = then;
        setLoginOpen(true);
      },
      closeLogin: () => {
        pending.current = null;
        setLoginOpen(false);
      },
      onLoggedIn,
      side,
      setSide,
      flight,
      openCard,
      backToWallet,
      registerSlot,
      reduced,
      activeCard,
    }),
    [open, instant, loginOpen, onLoggedIn, side, flight, openCard, backToWallet, registerSlot, reduced, activeCard],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWallet() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWallet outside WalletProvider");
  return v;
}
