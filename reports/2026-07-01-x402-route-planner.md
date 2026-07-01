# x402 Route Planner

- **Date:** 2026-07-01 America/Santiago
- **Slug:** `2026-07-01-x402-route-planner`
- **Live URL:** https://daily-apps-taupe.vercel.app/apps/2026-07-01-x402-route-planner
- **Vercel deployment:** https://daily-apps-696eggqps-arcas-projects-d844d101.vercel.app
- **Vercel deployment id:** `dpl_7F4mqR27ZZ4UHAhEUm6JG9gNWRMb`
- **Verdict:** harden

## Problem

Agent-payable APIs are getting real enough that builders need to reason about the dull parts before wiring money into endpoints: which HTTP 402 headers exist, what the paid route should say, what network/scheme is being promised, and what operational checks are missing.

Today’s app is a small browser planner for an x402-style paid route. It does not move money. It helps a builder sketch the `PAYMENT-REQUIRED`, `PAYMENT-SIGNATURE`, and `PAYMENT-RESPONSE` contract before they start shipping wallet-powered chaos.

## Sources

- https://docs.x402.org/core-concepts/http-402 — HTTP 402 role in x402 and V2 payment headers.
- https://www.x402.org/ — protocol overview and seller middleware shape.
- https://docs.stripe.com/payments/machine/x402 — lifecycle, sandbox/testing notes, and supported stablecoin rails.

## Implementation notes

- Added static App Router route: `src/app/apps/2026-07-01-x402-route-planner/page.tsx`.
- Added colocated client planner: `planner.tsx` plus `planner.module.css`.
- Updated archive: `src/data/apps.ts`.
- Planner supports method/path/price/scheme/network/pay-to/description edits, renders a PaymentRequired JSON preview, middleware sketch, header checklist, readiness score, and minimum test runbook.
- Static export compatible. No backend, no paid infra, no new runtime dependency.

## Checks

| Check | Result | Evidence |
| --- | --- | --- |
| `npm audit --omit=dev` | pass | `found 0 vulnerabilities` |
| `npm run lint` | pass | ESLint completed with no errors |
| `npm run build` | pass | Next.js generated `/` and `/apps/2026-07-01-x402-route-planner` as static routes |
| local HTTP exact text | pass | `x402 Route Planner`, `PAYMENT-REQUIRED`, and `Minimum test runbook` present; 15,430 bytes |
| local axe desktop/mobile | pass | custom Playwright + axe-core runner: desktop `0`, mobile `0` violations |
| local browser console | pass | no console messages or JS errors |
| live stable URL exact text | pass | stable URL returned HTTP 200 and contained required text; 16,740 bytes |
| live axe desktop/mobile | pass | stable URL axe: desktop `0`, mobile `0` violations |
| live browser console | pass | no console messages or JS errors |
| Vercel deployment status | pass | `dpl_7F4mqR27ZZ4UHAhEUm6JG9gNWRMb` status `Ready`, aliased to stable URL |

## Screenshots

- Desktop: `reports/2026-07-01-x402-route-planner/desktop.png`
- Mobile: `reports/2026-07-01-x402-route-planner/mobile.png`

## Deploy notes

- Stable alias is public and verified: https://daily-apps-taupe.vercel.app/apps/2026-07-01-x402-route-planner
- Direct generated Vercel deployment URL is Ready and aliased, but direct access redirects through Vercel SSO protection. The stable alias is the public surface.

## Risks / next hardening

- This is a planner, not a facilitator integration. A production x402 service still needs a real server, facilitator/client support, idempotency storage, and settlement/refund handling.
- x402 headers and supported networks are evolving; keep source links fresh before turning this into docs or a library.
- If this gets used often, add copy-to-clipboard buttons and exportable route specs.
