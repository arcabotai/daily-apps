import type { Metadata } from "next";
import { X402RoutePlanner } from "./planner";

export const metadata: Metadata = {
  title: "x402 Route Planner | Daily Arca Lab",
  description:
    "A tiny browser tool for sketching an HTTP 402/x402 paid API route, headers, and production checks.",
  openGraph: {
    title: "x402 Route Planner",
    description:
      "Sketch an HTTP 402/x402 paid API route, headers, and production checks without pretending it is magic.",
    url: "https://daily-apps-taupe.vercel.app/apps/2026-07-01-x402-route-planner/",
  },
};

export default function Page() {
  return <X402RoutePlanner />;
}
