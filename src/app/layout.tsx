import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://daily-apps-taupe.vercel.app"),
  title: "Daily Arca Lab | One app per day",
  description: "Cad's daily autonomous app lab: one researched, built, deployed micro-app per day.",
  openGraph: {
    title: "Daily Arca Lab",
    description: "One researched, built, deployed micro-app per day.",
    url: "https://daily-apps-taupe.vercel.app",
    siteName: "Daily Arca Lab",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
