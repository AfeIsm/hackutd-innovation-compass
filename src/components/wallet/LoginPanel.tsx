import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState, type FormEvent } from "react";
import { USERNAME_RULE, useAuth } from "@/lib/auth";
import { useWallet } from "./WalletContext";

export function LoginPanel() {
  const w = useWallet();
  const { login, signup, isUsernameTaken } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ identifier: "", password: "", name: "", username: "", email: "" });

  useEffect(() => {
    if (w.loginOpen) {
      setError(null);
      setLoading(false);
    }
  }, [w.loginOpen]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const uname = f.username.trim();
  const unameMsg = !uname
    ? null
    : !USERNAME_RULE.test(uname)
      ? { ok: false, text: "3–20 letters, numbers, _ or ." }
      : isUsernameTaken(uname)
        ? { ok: false, text: `@${uname.toLowerCase()} is taken` }
        : { ok: true, text: `@${uname.toLowerCase()} is available` };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    const err =
      mode === "login"
        ? await login(f.identifier, f.password)
        : await signup({ name: f.name, username: f.username, email: f.email, password: f.password });
    setLoading(false);
    if (err) setError(err);
    else {
      setF({ identifier: "", password: "", name: "", username: "", email: "" });
      w.onLoggedIn();
    }
  };

  return (
    <Dialog.Root open={w.loginOpen} onOpenChange={(o) => !o && w.closeLogin()}>
      <Dialog.Portal>
        <Dialog.Overlay className="login-overlay" />
        <Dialog.Content className="login-panel" aria-describedby="login-desc">
          <div className="login-tab" aria-hidden />
          <Dialog.Title className="font-display text-2xl">{mode === "login" ? "Welcome back" : "Create your account"}</Dialog.Title>
          <p id="login-desc" className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Show your member ID to open the wallet." : "Pick a unique username — friends add you by it."}
          </p>

          <form onSubmit={submit} className="mt-5 grid gap-3" noValidate>
            {mode === "signup" && (
              <>
                <Field label="Name" value={f.name} onChange={set("name")} autoComplete="name" required />
                <Field label="Username" value={f.username} onChange={set("username")} autoComplete="username" prefix="@" required />
                {unameMsg && (
                  <p className={`-mt-1 text-xs ${unameMsg.ok ? "text-good" : "text-risk"}`} aria-live="polite">
                    {unameMsg.text}
                  </p>
                )}
                <Field label="Email" type="email" value={f.email} onChange={set("email")} autoComplete="email" required />
              </>
            )}
            {mode === "login" && (
              <Field label="Username or email" value={f.identifier} onChange={set("identifier")} autoComplete="username" required />
            )}
            <Field
              label="Password"
              type="password"
              value={f.password}
              onChange={set("password")}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />
            {error && (
              <p role="alert" className="rounded-lg bg-risk-bg px-3 py-2 text-sm text-risk">
                {error}
              </p>
            )}
            <button type="submit" className="btn-primary mt-1" disabled={loading}>
              {loading ? (mode === "login" ? "Checking your ID…" : "Creating account…") : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <button
            type="button"
            className="mt-4 w-full text-center text-sm font-semibold text-foreground underline-offset-4 hover:underline"
            onClick={() => {
              setError(null);
              setMode(mode === "login" ? "signup" : "login");
            }}
          >
            {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
          </button>

          <p className="mt-4 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
            Preview sign-in, not yet connected to the live app. Try <b>alex</b>, <b>jordan</b>, <b>maya</b> or <b>sam</b> with
            password <b>demo1234</b>.
          </p>
          <Dialog.Close className="login-close" aria-label="Close">
            ×
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Field({
  label,
  prefix,
  ...props
}: { label: string; prefix?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-1 text-sm font-semibold">
      {label}
      <span className="field">
        {prefix && <span className="text-muted-foreground">{prefix}</span>}
        <input {...props} className="w-full bg-transparent font-normal outline-none" />
      </span>
    </label>
  );
}
