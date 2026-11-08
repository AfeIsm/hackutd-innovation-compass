// PREVIEW SIGN-IN. The production app uses server sessions (httpOnly cookie, MongoDB).
// This stand-in keeps the same fields and rules so the wallet flow can be reviewed;
// swap these functions for calls to the existing /api auth routes when connecting.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type User = { name: string; username: string; email: string };
type StoredAccount = User & { password: string };

const SEEDED: StoredAccount[] = ["Alex", "Jordan", "Maya", "Sam"].map((name) => ({
  name,
  username: name.toLowerCase(),
  email: `${name.toLowerCase()}@demo.walletwhisperer`,
  password: "demo1234",
}));

const ACCOUNTS_KEY = "ww-preview-accounts";
const SESSION_KEY = "ww-preview-session";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
export const USERNAME_RULE = /^[a-z0-9_.]{3,20}$/i;

function readAccounts(): StoredAccount[] {
  try {
    const extra = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]") as StoredAccount[];
    return [...SEEDED, ...extra];
  } catch {
    return SEEDED;
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

type AuthCtx = {
  user: User | null;
  ready: boolean;
  login: (identifier: string, password: string) => Promise<string | null>;
  signup: (input: StoredAccount) => Promise<string | null>;
  logout: () => void;
  isUsernameTaken: (username: string) => boolean;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null") as { username: string; expires: number } | null;
      if (s && s.expires > Date.now()) {
        const acc = readAccounts().find((a) => a.username === s.username);
        if (acc) setUser({ name: acc.name, username: acc.username, email: acc.email });
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const startSession = (acc: StoredAccount) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username: acc.username, expires: Date.now() + SESSION_MS }));
    setUser({ name: acc.name, username: acc.username, email: acc.email });
  };

  const login = useCallback(async (identifier: string, password: string) => {
    await wait(650);
    const id = identifier.trim().toLowerCase().replace(/^@/, "");
    const acc = readAccounts().find((a) => a.username === id || a.email.toLowerCase() === id);
    if (!acc || acc.password !== password) return "That username or password doesn't match.";
    startSession(acc);
    return null;
  }, []);

  const isUsernameTaken = useCallback(
    (username: string) => readAccounts().some((a) => a.username === username.trim().toLowerCase()),
    [],
  );

  const signup = useCallback(async (input: StoredAccount) => {
    await wait(750);
    const username = input.username.trim().toLowerCase();
    if (!input.name.trim()) return "Enter your name.";
    if (!USERNAME_RULE.test(username)) return "Usernames are 3–20 letters, numbers, _ or .";
    if (!/^\S+@\S+\.\S+$/.test(input.email)) return "Enter a valid email.";
    if (input.password.length < 8) return "Use at least 8 characters for your password.";
    const all = readAccounts();
    if (all.some((a) => a.username === username)) return "That username is taken.";
    if (all.some((a) => a.email.toLowerCase() === input.email.toLowerCase())) return "That email already has an account.";
    const acc = { ...input, name: input.name.trim(), username };
    const extra = all.filter((a) => !SEEDED.includes(a));
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...extra, acc]));
    startSession(acc);
    return null;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, ready, login, signup, logout, isUsernameTaken }), [user, ready, login, signup, logout, isUsernameTaken]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth outside AuthProvider");
  return v;
}
