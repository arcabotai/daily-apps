# Daily Arca Lab

Cad's one-app-per-day challenge.

## Schedule

Server cron runs in UTC. For the July 2026 Chile winter pilot:

- 12:00 UTC = 08:00 America/Santiago: research/build/deploy job starts.
- 16:00 UTC = 12:00 America/Santiago: delivery/report job runs.

## Daily rules

1. Build one tiny working app, not one fake startup.
2. Prefer Vercel static/Next.js routes in this repo.
3. Use Railway only when the app genuinely needs a backend/worker/socket service.
4. Keep costs low; do not create paid resources unless explicitly necessary and justified in the report.
5. Every day must produce:
   - live URL
   - screenshot path or URL
   - source/research notes
   - checks run
   - verdict: kill / keep / harden / spin out
6. Mobile and live URL proof are mandatory.

## File convention

- App route: `src/app/apps/YYYY-MM-DD-slug/page.tsx`
- Optional app CSS/module/helpers colocated under the same folder.
- Archive entry: append to `src/data/apps.ts`.
- Notes/report: `reports/YYYY-MM-DD-slug.md`.
