import { createFileRoute } from "@tanstack/react-router";
import capturedCSS from "../styles/site.css?raw";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Wallet Whisperer — Can we afford it?" },
    { name: "description", content: "See your financial picture, track your health score, and plan big purchases with family and friends while keeping your finances private." },
    { property: "og:title", content: "Wallet Whisperer — Can we afford it?" },
    { property: "og:description", content: "See your financial picture, track your health score, and plan big purchases with family and friends while keeping your finances private." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  staticData: { importedDocument: { html: { "className": "LINzvG_variable qeW00a_variable \x68-full \x61ntialiased", "lang": "en" }, body: { "className": "\x6din-h-full \x66ont-sans" } } },
  component: Index,
});

function Index() {
  return (
    <>
      <style>{capturedCSS}</style>
      <div hidden />
      <div className="mx-auto box-border flex min-h-screen max-w-[1160px] flex-col px-6">
        <header className="flex items-center justify-between gap-4 py-5">
          <a className="font-display text-2xl font-bold text-ink no-underline" href="/">Wallet Whisperer</a>
          <nav className="flex items-center gap-2" aria-label="Account">
            <a className="px-2 py-3 font-semibold text-ink no-underline hover:text-accent" href="/login">Log in</a>
            <a className={"inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] \x62order \x62order-accent bg-accent px-[18px] text-[15px] font-semibold text-white no-underline hover:bg-accent-dark disabled:opacity-50 cursor-pointer"} href="/signup">Get started</a>
          </nav>
        </header>
        <main className="flex flex-1 flex-wrap items-center gap-14 pb-[72px] pt-12">
          <div className="flex min-w-0 flex-[999_1_460px] flex-col gap-6">
            <h1 className="m-0 text-[clamp(44px,6.5vw,76px)] leading-[1.02] tracking-[-0.02em]">Can we afford it?</h1>
            <p className="m-0 max-w-[500px] text-xl leading-normal text-ink-2">See your whole financial picture, get a health score that updates itself, and plan big purchases with family and friends without sharing your finances.</p>
            <div className="flex flex-wrap items-center gap-4">
              <a className={"inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] \x62order \x62order-accent bg-accent px-[18px] text-[15px] font-semibold text-white no-underline hover:bg-accent-dark disabled:opacity-50 cursor-pointer min-h-12 px-6 text-base"} href="/signup">Get started</a>
            </div>
          </div>
          <div className={"box-border flex flex-[1_1_340px] flex-col gap-[18px] rounded-2xl \x62order \x62order-line bg-surface p-6 \x73hadow-[\x30_20px_50px_rgba(\x322,\x324,\x329,\x30.\x310)]"} aria-label="Health score preview">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-muted">Your health score</span>
              <span className="rounded-full bg-good-bg px-2.5 py-1 text-[13px] font-semibold text-good">Healthy</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[72px] font-bold leading-none">82</span>
              <span className="text-muted">/ 100</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-1">
                <span className="text-[13px]">Bills covered</span>
                <div className="h-2 overflow-hidden rounded-full bg-soft">
                  <div className="h-2 bg-good-ring [width:100%]" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px]">Safety cushion</span>
                <div className="h-2 overflow-hidden rounded-full bg-soft">
                  <div className="h-2 bg-warn-ring [width:50%]" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px]">Savings protected</span>
                <div className="h-2 overflow-hidden rounded-full bg-soft">
                  <div className="h-2 bg-good-ring [width:100%]" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-[10px] bg-bg px-3.5 py-3 text-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F4FD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="8" cy="8" r="3" />
                <circle cx="17" cy="9" r="2.5" />
                <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
              </svg>
              <span>Orlando trip · 3 of 4 committed</span>
            </div>
          </div>
        </main>
        <footer className={"flex flex-wrap justify-between gap-3 \x62order-t \x62order-line py-6 text-sm text-muted"}>
          <span>© 2026 Wallet Whisperer</span>
          <span>Your finances stay private. Always.</span>
        </footer>
      </div>
    </>
  );
}
