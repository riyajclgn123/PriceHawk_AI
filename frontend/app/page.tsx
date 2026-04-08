import URLSubmitForm from "@/components/URLSubmitForm";

export const metadata = {
  title: "PriceHawk — Track Any Product Price",
  description: "AI Powered Shopping Intelligence. Paste a product URL and track prices, predict drops, and get alerts.",
};

export default function HomePage() {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .ph-feature-card {
          background: #0D1720;
          border: 1px solid #1A2D3D;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.25s;
        }
        .ph-feature-card:hover {
          border-color: rgba(0, 229, 160, 0.3);
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
        }
        .ph-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
      `}</style>

      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          padding: "80px 24px 80px",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(0,229,160,0.08)",
            border: "1px solid rgba(0,229,160,0.2)",
            borderRadius: 100,
            padding: "6px 18px",
            marginBottom: 36,
          }}
        >
          <span style={{ fontSize: 13 }}>🤖</span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: "#00E5A0",
              letterSpacing: "0.08em",
            }}
          >
            AI-POWERED PRICE INTELLIGENCE
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-1.5px",
            color: "#E8F1F8",
            marginBottom: 20,
          }}
        >
          Never Overpay Again.
          <br />
          <span style={{ color: "#00E5A0" }}>Track. Predict. Save.</span>
        </h1>

        <p
          style={{
            fontSize: 17,
            color: "#8BA3B8",
            lineHeight: 1.7,
            maxWidth: 540,
            margin: "0 auto 52px",
            fontFamily: "'Instrument Sans', sans-serif",
          }}
        >
          Paste any product link and PriceHawk monitors the price 24/7,
          predicts future drops with ML, and alerts you at the perfect moment
          to buy.
        </p>

        {/* URL Form */}
        <div style={{ maxWidth: 680, margin: "0 auto 64px" }}>
          <URLSubmitForm />
        </div>

        {/* Social proof stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 48,
            marginBottom: 72,
          }}
        >
          {[
            { value: "24/7", label: "Monitoring" },
            { value: "7-day", label: "ML Forecast" },
            { value: "instant", label: "Alerts" },
          ].map((s) => (
            <div key={s.label} className="ph-stat">
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#00E5A0",
                  letterSpacing: "-0.5px",
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "#4D6677",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            textAlign: "left",
          }}
        >
          {[
            {
              icon: "📉",
              title: "Price History Charts",
              desc: "Every price change logged and visualized with beautiful interactive charts.",
            },
            {
              icon: "🤖",
              title: "ML Price Prediction",
              desc: "Gradient Boosting model forecasts price trends 7 days ahead with confidence scores.",
            },
            {
              icon: "🔔",
              title: "Smart Alerts",
              desc: "Set your target price and get notified the instant it drops to that level.",
            },
          ].map((f) => (
            <div key={f.title} className="ph-feature-card">
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <p
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#E8F1F8",
                  marginBottom: 8,
                }}
              >
                {f.title}
              </p>
              <p
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: 13,
                  color: "#8BA3B8",
                  lineHeight: 1.55,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
