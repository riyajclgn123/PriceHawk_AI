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
      </section>

      {/* ── FEATURES ── */}
      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "60px 32px 100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              icon: "📡",
              title: "Real-Time Tracking",
              desc: "Prices scraped directly from Amazon, Flipkart, Shein & eBay. Always fresh, never stale.",
            },
            {
              icon: "🤖",
              title: "ML Price Prediction",
              desc: "Gradient Boosting model forecasts price drops 7 days ahead with high accuracy.",
            },
            {
              icon: "🔔",
              title: "Instant Alerts",
              desc: "Set a target price and get notified the moment your product hits it.",
            },
          ].map((f) => (
            <div key={f.title} className="ph-feat-card">
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#E8F1F8",
                  marginBottom: 8,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#8BA3B8",
                  lineHeight: 1.65,
                  fontFamily: "'Instrument Sans', sans-serif",
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
