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

export const apps: LabApp[] = [];
