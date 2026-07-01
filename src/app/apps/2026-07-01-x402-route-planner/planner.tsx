"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./planner.module.css";

type Scheme = "exact" | "upto" | "batch-settlement";
type NetworkKey = "base" | "solana" | "tempo" | "base-sepolia";

type Guardrail = {
  key: string;
  label: string;
  value: boolean;
  weight: number;
};

const networks: Record<NetworkKey, { label: string; caip: string; asset: string; note: string }> = {
  base: {
    label: "Base mainnet",
    caip: "eip155:8453",
    asset: "USDC",
    note: "Mainnet path for real stablecoin settlement. Do not test this with pocket lint.",
  },
  solana: {
    label: "Solana mainnet",
    caip: "solana:mainnet",
    asset: "USDC",
    note: "Useful for low fees, but your facilitator/client support has to be real.",
  },
  tempo: {
    label: "Tempo",
    caip: "tempo:mainnet",
    asset: "USDC",
    note: "Emerging stablecoin rail; verify provider support before promising it.",
  },
  "base-sepolia": {
    label: "Base Sepolia",
    caip: "eip155:84532",
    asset: "test USDC",
    note: "Good for demos and header-shape tests. Stripe sandbox does not monitor crypto testnets.",
  },
};

const schemeNotes: Record<Scheme, string> = {
  exact: "Best for fixed-price calls: one endpoint, one price, immediate settlement attempt.",
  upto: "Best when final price can vary inside a user-approved ceiling.",
  "batch-settlement": "Best for high-volume tiny calls when authorization is immediate but onchain redemption can happen later.",
};

function centsToDollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function clampCents(raw: string) {
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(5000, Math.max(1, parsed));
}

export function X402RoutePlanner() {
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/api/research-brief");
  const [priceCents, setPriceCents] = useState(5);
  const [network, setNetwork] = useState<NetworkKey>("base-sepolia");
  const [scheme, setScheme] = useState<Scheme>("exact");
  const [payTo, setPayTo] = useState("0xYourTreasuryAddress");
  const [description, setDescription] = useState("One compact research brief with cited sources");
  const [idempotency, setIdempotency] = useState(true);
  const [preview, setPreview] = useState(true);
  const [refund, setRefund] = useState(false);
  const [rateLimit, setRateLimit] = useState(true);

  const selected = networks[network];
  const routeLabel = `${method} ${path || "/api/paid"}`;
  const price = centsToDollars(priceCents);

  const guardrails: Guardrail[] = [
    { key: "idempotency", label: "Requires an idempotency key on paid retries", value: idempotency, weight: 25 },
    { key: "preview", label: "Has a free preview or metadata route", value: preview, weight: 15 },
    { key: "refund", label: "Documents failed-settlement/refund handling", value: refund, weight: 25 },
    { key: "rateLimit", label: "Rate-limits unpaid 402 probes", value: rateLimit, weight: 20 },
  ];

  const score = guardrails.reduce((total, item) => total + (item.value ? item.weight : 0), 15);
  const readiness = score >= 85 ? "ship a private beta" : score >= 65 ? "test with friendly agents" : "harden before money moves";

  const paymentRequired = useMemo(
    () => ({
      x402Version: 2,
      route: routeLabel,
      accepts: [
        {
          scheme,
          network: selected.caip,
          asset: selected.asset,
          price,
          payTo,
        },
      ],
      description,
      mimeType: "application/json",
      maxTimeoutSeconds: scheme === "batch-settlement" ? 90 : 30,
    }),
    [description, payTo, price, routeLabel, scheme, selected.asset, selected.caip],
  );

  const middlewareSketch = `paymentMiddleware({\n  "${routeLabel}": {\n    accepts: [{\n      scheme: "${scheme}",\n      price: "${price}",\n      network: "${selected.caip}",\n      asset: "${selected.asset}",\n      payTo: "${payTo || "0x..."}"\n    }],\n    description: "${description || "Paid resource"}",\n    mimeType: "application/json"\n  }\n})`;

  return (
    <main className={styles.shell}>
      <nav className={styles.nav} aria-label="App navigation">
        <Link href="/" className={styles.back}>← Daily Arca Lab</Link>
        <span>2026-07-01</span>
      </nav>

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>agent payments / x402</p>
          <h1>x402 Route Planner</h1>
          <p className={styles.lede}>
            Sketch a paid API route that speaks HTTP 402 cleanly: challenge header, retry header,
            settlement response, and the boring production checks that stop tiny payments from becoming tiny fires.
          </p>
        </div>
        <aside className={styles.scoreCard} aria-label="Readiness score">
          <span className={styles.score}>{score}</span>
          <span className={styles.scoreLabel}>readiness score</span>
          <strong>{readiness}</strong>
        </aside>
      </section>

      <section className={styles.workspace} aria-label="Route planner workspace">
        <form className={styles.form}>
          <h2>Route shape</h2>
          <label>
            Method
            <select value={method} onChange={(event) => setMethod(event.target.value)}>
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
            </select>
          </label>
          <label>
            Paid path
            <input value={path} onChange={(event) => setPath(event.target.value)} aria-describedby="path-help" />
            <span id="path-help" className={styles.help}>Use the actual resource path, not a marketing page.</span>
          </label>
          <label>
            Price in cents
            <input
              type="number"
              min="1"
              max="5000"
              value={priceCents}
              onChange={(event) => setPriceCents(clampCents(event.target.value))}
            />
          </label>
          <label>
            Payment scheme
            <select value={scheme} onChange={(event) => setScheme(event.target.value as Scheme)}>
              <option value="exact">exact</option>
              <option value="upto">upto</option>
              <option value="batch-settlement">batch-settlement</option>
            </select>
            <span className={styles.help}>{schemeNotes[scheme]}</span>
          </label>
          <label>
            Network
            <select value={network} onChange={(event) => setNetwork(event.target.value as NetworkKey)}>
              {Object.entries(networks).map(([key, item]) => (
                <option key={key} value={key}>{item.label}</option>
              ))}
            </select>
            <span className={styles.help}>{selected.note}</span>
          </label>
          <label>
            Pay-to address
            <input value={payTo} onChange={(event) => setPayTo(event.target.value)} />
          </label>
          <label>
            Resource description
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} />
          </label>
        </form>

        <div className={styles.output}>
          <div className={styles.summary}>
            <span className={styles.route}>{routeLabel}</span>
            <strong>{price} · {selected.asset} · {scheme}</strong>
          </div>

          <section className={styles.panel} aria-labelledby="headers-title">
            <h2 id="headers-title">Headers to implement</h2>
            <div className={styles.headerGrid}>
              <div><b>PAYMENT-REQUIRED</b><span>Server → client with Base64 JSON requirements on 402.</span></div>
              <div><b>PAYMENT-SIGNATURE</b><span>Client → server on retry after authorizing payment.</span></div>
              <div><b>PAYMENT-RESPONSE</b><span>Server → client with structured settlement result.</span></div>
            </div>
          </section>

          <section className={styles.panel} aria-labelledby="payload-title">
            <h2 id="payload-title">PaymentRequired payload before Base64</h2>
            <pre tabIndex={0}>{JSON.stringify(paymentRequired, null, 2)}</pre>
          </section>

          <section className={styles.panel} aria-labelledby="middleware-title">
            <h2 id="middleware-title">Middleware sketch</h2>
            <pre tabIndex={0}>{middlewareSketch}</pre>
          </section>
        </div>
      </section>

      <section className={styles.checks} aria-labelledby="checks-title">
        <div>
          <p className={styles.kicker}>before launch</p>
          <h2 id="checks-title">Production gut check</h2>
          <p>
            x402 removes account setup. It does not remove product judgment. If this route cannot survive duplicate retries,
            failed settlements, or hostile unpaid probes, it is not ready for agents with wallets.
          </p>
        </div>
        <fieldset className={styles.guardrails}>
          <legend>Toggle the guardrails you actually have</legend>
          {guardrails.map((item) => (
            <label key={item.key} className={styles.checkRow}>
              <input
                type="checkbox"
                checked={item.value}
                onChange={(event) => {
                  if (item.key === "idempotency") setIdempotency(event.target.checked);
                  if (item.key === "preview") setPreview(event.target.checked);
                  if (item.key === "refund") setRefund(event.target.checked);
                  if (item.key === "rateLimit") setRateLimit(event.target.checked);
                }}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </fieldset>
      </section>

      <section className={styles.runbook} aria-labelledby="runbook-title">
        <h2 id="runbook-title">Minimum test runbook</h2>
        <ol>
          <li>Unauthenticated request returns <code>402 Payment Required</code>, not a generic 401 or HTML paywall.</li>
          <li>The 402 includes <code>PAYMENT-REQUIRED</code> with price, scheme, network, asset, destination, and description.</li>
          <li>Paid retry includes <code>PAYMENT-SIGNATURE</code> and never executes the expensive job twice for the same idempotency key.</li>
          <li>Server returns <code>PAYMENT-RESPONSE</code> with success or failure details, then serves the resource only after validation.</li>
          <li>Logs record route, amount, facilitator response, and customer-safe correlation ID. No private keys. Obviously.</li>
        </ol>
      </section>

      <section className={styles.sources} aria-labelledby="sources-title">
        <h2 id="sources-title">Sources used today</h2>
        <a href="https://docs.x402.org/core-concepts/http-402" target="_blank" rel="noreferrer">x402 docs: HTTP 402 and V2 payment headers</a>
        <a href="https://www.x402.org/" target="_blank" rel="noreferrer">x402.org: standard overview and seller middleware shape</a>
        <a href="https://docs.stripe.com/payments/machine/x402" target="_blank" rel="noreferrer">Stripe docs: x402 lifecycle, testing notes, supported stablecoin rails</a>
      </section>
    </main>
  );
}
