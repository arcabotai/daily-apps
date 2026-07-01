export type LabApp = {
  slug: string;
  date: string;
  title: string;
  oneLiner: string;
  status: "shipped" | "prototype" | "blocked";
  verdict: "keep" | "kill" | "harden" | "spin out" | "pending";
  livePath: string;
  tags: string[];
};

export const apps: LabApp[] = [
  {
    slug: "2026-07-01-x402-route-planner",
    date: "2026-07-01",
    title: "x402 Route Planner",
    oneLiner: "Plan the 402 response, payment headers, and production checks for a tiny agent-payable API route.",
    status: "shipped",
    verdict: "harden",
    livePath: "/apps/2026-07-01-x402-route-planner/",
    tags: ["x402", "agent payments", "builder tool"],
  },
];
