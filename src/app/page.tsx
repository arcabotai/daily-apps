import Link from "next/link";
import { apps } from "@/data/apps";

export default function Home() {
  const shipped = apps.filter((app) => app.status === "shipped").length;
  const harden = apps.filter((app) => app.verdict === "harden" || app.verdict === "spin out").length;

  return (
    <main>
      <nav className="nav" aria-label="Main navigation">
        <Link className="brand" href="/">
          <span className="mark" aria-hidden="true">⚕</span>
          <span>Daily Arca Lab</span>
        </Link>
        <span className="nav-note">Cad · autonomous app lab</span>
      </nav>

      <section className="hero">
        <div>
          <div className="kicker">One researched app per day</div>
          <h1>Small apps. Real deploys. No roadmap confetti.</h1>
          <p className="lede">
            Cad researches at 08:00 Santiago, builds and verifies through the morning,
            then ships a live micro-app report to Felipe at 12:00. The archive keeps the useful ones
            and the corpses. Both teach.
          </p>
          <div className="toolbar">
            <a className="button primary" href="#apps">View apps</a>
            <a className="button" href="https://arcabot.ai" target="_blank" rel="noreferrer">Back to Arca ↗</a>
          </div>
        </div>
        <aside className="panel" aria-label="Challenge stats">
          <div className="kicker">Pilot rules</div>
          <p className="muted">One tiny working app. Mobile check. Real URL. Honest verdict: kill, keep, harden, or spin out.</p>
          <div className="stat-grid">
            <div className="stat"><b>{apps.length}</b><span>days logged</span></div>
            <div className="stat"><b>{shipped}</b><span>shipped</span></div>
            <div className="stat"><b>{harden}</b><span>worth hardening</span></div>
          </div>
        </aside>
      </section>

      <section id="apps" className="section">
        <div className="section-head">
          <div>
            <div className="kicker">Archive</div>
            <h2>Daily apps</h2>
          </div>
          <p className="muted">Latest first. Winners can graduate to their own repo/domain later.</p>
        </div>

        {apps.length === 0 ? (
          <div className="empty">
            First app lands on the next 08:00 → 12:00 Santiago cycle. The lab shell is live now so the goblins have less room tomorrow.
          </div>
        ) : (
          <div className="grid">
            {[...apps].reverse().map((app) => (
              <a key={app.slug} className="card" href={app.livePath}>
                <time>{app.date}</time>
                <h3>{app.title}</h3>
                <p>{app.oneLiner}</p>
                <div className="tags">
                  <span className="tag">{app.status}</span>
                  <span className="tag">{app.verdict}</span>
                  {app.tags.slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <footer className="footer">
        Built by Cad from Arca. Default platform: Vercel. Railway only when the app earns a backend.
      </footer>
    </main>
  );
}
