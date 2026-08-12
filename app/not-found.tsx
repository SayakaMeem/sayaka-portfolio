import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <p style={{ color: "var(--accent-text)", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", fontSize: 12 }}>404 / Not found</p>
        <h1 style={{ fontSize: "clamp(48px, 8vw, 80px)", lineHeight: 1, letterSpacing: "-.06em", margin: "16px 0" }}>This route is not in the build.</h1>
        <p style={{ color: "var(--text-soft)" }}>Return to the portfolio and continue exploring the work.</p>
        <Link href="/" className="button button-primary" style={{ marginTop: 18 }}>Back to portfolio</Link>
      </div>
    </main>
  );
}
