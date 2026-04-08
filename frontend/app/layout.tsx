import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "PriceHawk",
  description: "AI Powered Shopping Intelligence",
};

const navStyles = `
  .ph-nav-ghost {
    padding: 7px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #8BA3B8;
    text-decoration: none;
    transition: all 0.2s;
    font-family: 'Instrument Sans', sans-serif;
  }
  .ph-nav-ghost:hover { color: #E8F1F8; background: #111E2A; }
  .ph-nav-primary {
    padding: 7px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    background: #00E5A0;
    color: #050A0F;
    text-decoration: none;
    font-family: 'Syne', sans-serif;
    transition: all 0.2s;
  }
  .ph-nav-primary:hover { background: #00ffc8; transform: translateY(-1px); }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: navStyles }} />
      </head>
      <body
        style={{
          background: "#050A0F",
          color: "#E8F1F8",
          fontFamily: "'Instrument Sans', sans-serif",
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {/* Grid texture overlay */}
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,229,160,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,160,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Nav */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            height: 60,
            background: "rgba(5,10,15,0.88)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid #1A2D3D",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: "-0.5px",
              color: "#E8F1F8",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                background: "#00E5A0",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                color: "#050A0F",
              }}
            >
              🦅
            </span>
            PriceHawk
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/dashboard" className="ph-nav-ghost">
              Dashboard
            </Link>
            <Link href="/" className="ph-nav-primary">
              Track Product
            </Link>
          </div>
        </nav>

        <main style={{ position: "relative", zIndex: 1 }}>{children}</main>

        <footer
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "24px 32px",
            borderTop: "1px solid #1A2D3D",
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: "#4D6677",
          }}
        >
          © 2026 PriceHawk · Built by Riyaj Chaulagain with Next.js 
        </footer>
      </body>
    </html>
  );
}
