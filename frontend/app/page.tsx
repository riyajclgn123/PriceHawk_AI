import URLSubmitForm from "@/components/URLSubmitForm";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <style>{`
        .ph-hero-tag::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #00E5A0;
          display: inline-block;
          margin-right: 8px;
          animation: ph-dot-pulse 2s infinite;
        }
        @keyframes ph-dot-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0,229,160,0.4); }
          50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(0,229,160,0); }
        }
        .ph-feat-card {
          background: #0D1720;
          border: 1px solid #1A2D3D;
          border-radius: 16px;
          padding: 28px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .ph-feat-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #00E5A0, transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .ph-feat-card:hover {
          border-color: #1F3347;
          transform: translateY(-3px);
          background: #111E2A;
        }
        .ph-feat-card:hover::before { opacity: 1; }
        .ph-pbadge {
          padding: 4px 12px;
          border: 1px solid #1A2D3D;
          border-radius: 6px;
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          color: #4D6677;
          cursor: pointer;
          transition: all 0.15s;
          background: transparent;
        }
        .ph-pbadge:hover { border-color: #00E5A0; color: #00E5A0; }
        .ph-url-input {
          flex: 1;
          background: #111E2A;
          border: 1px solid #1F3347;
          border-radius: 10px;
          padding: 12px 16px;
          color: #E8F1F8;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }
        .ph-url-input::placeholder { color: #4D6677; }
        .ph-url-input:focus { border-color: #00E5A0; }
        .ph-track-btn {
          padding: 12px 24px;
          background: #00E5A0;
          color: #050A0F;
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .ph-track-btn:hover { background: #00ffc8; transform: translateY(-1px); }
      `}</style>

      {/* ── HERO ── */}
      <section
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "100px 32px 60px",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <div
          className="ph-hero-tag"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "6px 14px",
            border: "1px solid #1F3347",
            borderRadius: 100,
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
            color: "#00E5A0",
            letterSpacing: "0.05em",
            marginBottom: 32,
            background: "rgba(0,229,160,0.05)",
          }}
        >
          AI-Powered Price Intelligence
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(42px, 7vw, 68px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-2px",
            marginBottom: 24,
            color: "#E8F1F8",
          }}
        >
          Never Overpay for{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #00E5A0, #1A8FE3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Anything
          </span>{" "}
          Again
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "#8BA3B8",
            maxWidth: 540,
            margin: "0 auto 48px",
            lineHeight: 1.7,
          }}
        >
          Paste any Amazon or Flipkart URL. Our ML model tracks prices, predicts
          drops, and alerts you at the perfect moment to buy.
        </p>

        {/* URL Form */}
        <div
          style={{
            maxWidth: 620,
            margin: "0 auto",
            background: "#0D1720",
            border: "1px solid #1F3347",
            borderRadius: 16,
            padding: 28,
            boxShadow: "0 0 60px rgba(0,229,160,0.06)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
              color: "#4D6677",
              letterSpacing: "0.08em",
              marginBottom: 10,
              textAlign: "left",
            }}
          >
            PASTE PRODUCT URL
          </div>

          {/* URLSubmitForm replaces the input row */}
          <URLSubmitForm />

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap" as const,
              marginTop: 14,
            }}
          >
            {["🛒 Amazon.in", "🛍️ Flipkart", "🌐 Amazon.com"].map((p) => (
              <span key={p} className="ph-pbadge">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Trust row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            marginTop: 28,
            fontSize: 13,
            color: "#4D6677",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {["Free Forever", "No Credit Card", "Instant Alerts"].map((t) => (
            <span key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#00E5A0" }}>✓</span> {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 48,
          padding: "20px 32px 60px",
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        {[
          { num: "12K+", label: "Products Tracked" },
          { num: "$2M+", label: "Saved by Users" },
          { num: "91%", label: "Prediction Accuracy" },
          { num: "6hr", label: "Refresh Interval" },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 30,
                fontWeight: 800,
                color: "#00E5A0",
                letterSpacing: "-1px",
              }}
            >
              {s.num}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#4D6677",
                marginTop: 4,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section
        style={{ padding: "60px 32px 80px", maxWidth: 1100, margin: "0 auto" }}
      >
        <div
          style={{
            fontSize: 11,
            fontFamily: "'DM Mono', monospace",
            color: "#00E5A0",
            letterSpacing: "0.1em",
            marginBottom: 14,
          }}
        >
          FEATURES
        </div>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: "-1px",
            marginBottom: 40,
            color: "#E8F1F8",
          }}
        >
          Built Different.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              icon: "📉",
              iconBg: "rgba(0,229,160,0.12)",
              title: "AI Price Prediction",
              desc: "Our Gradient Boosting model analyzes 9 time-series features to predict if a price will drop in the next 7 days — before it happens.",
            },
            {
              icon: "⚡",
              iconBg: "rgba(26,143,227,0.12)",
              title: "Real-Time Scraping",
              desc: "Playwright-based scrapers handle JS-rendered prices on Amazon and Flipkart, refreshing every 6 hours via background job queues.",
            },
            {
              icon: "🔔",
              iconBg: "rgba(245,158,11,0.12)",
              title: "Smart Alerts",
              desc: "Set your target price and get instant email notifications the moment a product crosses your threshold. Never miss a deal.",
            },
            {
              icon: "📊",
              iconBg: "rgba(239,68,68,0.12)",
              title: "Full Price History",
              desc: "Interactive charts show the complete pricing timeline so you can spot seasonal patterns and know when a \"sale\" isn't really a sale.",
            },
            {
              icon: "🔁",
              iconBg: "rgba(139,91,246,0.12)",
              title: "Background Jobs",
              desc: "Redis Queue workers run silently in the background, processing hundreds of product refreshes without ever blocking the UI.",
            },
            {
              icon: "🌗",
              iconBg: "rgba(0,229,160,0.12)",
              title: "Multi-Platform",
              desc: "Track the same product across Amazon and Flipkart simultaneously to ensure you always buy from the cheapest source.",
            },
          ].map((f) => (
            <div key={f.title} className="ph-feat-card">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: f.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  marginBottom: 16,
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 17,
                  fontWeight: 700,
                  marginBottom: 8,
                  color: "#E8F1F8",
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: "#8BA3B8", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
