import { createFileRoute } from "@tanstack/react-router";

// The wallet itself lives in the root layout so it stays one continuous object across pages.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wallet Whisperer — Can we afford it?" },
      { name: "description", content: "Open the wallet: see your financial health, check a purchase, and plan big buys with family and friends while keeping your finances private." },
      { property: "og:title", content: "Wallet Whisperer — Can we afford it?" },
      { property: "og:description", content: "Open the wallet: see your financial health, check a purchase, and plan big buys with family and friends while keeping your finances private." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
