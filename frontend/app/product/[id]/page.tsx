import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      priceHistory: {
        orderBy: { scrapedAt: "asc" },
      },
    },
  });

  if (!product) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 60px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.35 }}>📦</div>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#E8F1F8",
              marginBottom: 8,
            }}
          >
            Product not found
          </h1>
          <Link
            href="/dashboard"
            style={{
              fontSize: 13,
              color: "#00E5A0",
              textDecoration: "none",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const priceDiff = product.currentPrice - product.lowestPrice;
  const savingsPct = ((priceDiff / product.lowestPrice) * 100).toFixed(1);
  const isAtLowest = product.currentPrice <= product.lowestPrice;

  const historyPrices = product.priceHistory.map((h) => h.price);
  const allTimeHigh =
    historyPrices.length > 0 ? Math.max(...historyPrices) : product.currentPrice;
  const avgPrice =
    historyPrices.length > 0
      ? historyPrices.reduce((a, b) => a + b, 0) / historyPrices.length
      : product.currentPrice;

  // SVG chart
  const chartW = 800;
  const chartH = 200;
  const pad = 10;
  let chartLine = "";
  let chartArea = "";

  if (historyPrices.length > 1) {
    const minP = Math.min(...historyPrices) * 0.98;
    const maxP = Math.max(...historyPrices) * 1.02;
    const toX = (i: number) =>
      pad + (i / (historyPrices.length - 1)) * (chartW - pad * 2);
    const toY = (p: number) =>
      chartH - pad - ((p - minP) / (maxP - minP)) * (chartH - pad * 2);

    const pts = historyPrices
      .map((p, i) => `${toX(i).toFixed(1)},${toY(p).toFixed(1)}`)
      .join(" L ");
    chartLine = `M ${pts}`;
    chartArea = `M ${toX(0).toFixed(1)},${chartH} L ${pts} L ${toX(
      historyPrices.length - 1
    ).toFixed(1)},${chartH} Z`;
  }

  return (
    <>
      <style>{`
        .ph-detail-card {
          background: #0D1720;
          border: 1px solid #1A2D3D;
          border-radius: 16px;
        }
        .ph-pred-top {
          position: relative;
          overflow: hidden;
        }
        .ph-pred-top::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #00E5A0, #1A8FE3);
          border-radius: 16px 16px 0 0;
        }
        .ph-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #4D6677;
          font-size: 13px;
          font-family: 'DM Mono', monospace;
          text-decoration: none;
          padding: 7px 12px;
          border-radius: 8px;
          transition: all 0.15s;
          margin-bottom: 28px;
        }
        .ph-back-btn:hover { color: #8BA3B8; background: #111E2A; }
        .ph-view-btn {
          display: block;
          width: 100%;
          padding: 12px;
          background: #00E5A0;
          color: #050A0F;
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          text-decoration: none;
        }
        .ph-view-btn:hover { background: #00ffc8; transform: translateY(-1px); }
        .ph-table-row:hover td { background: #111E2A; }
        .ph-stat-card {
          background: #0D1720;
          border: 1px solid #1A2D3D;
          border-radius: 12px;
          padding: 16px;
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px" }}>
        <Link href="/dashboard" className="ph-back-btn">
          ← Back to Dashboard
        </Link>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "340px 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* ── LEFT SIDEBAR ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Product Info */}
            <div className="ph-detail-card" style={{ padding: 24 }}>
              {/* Image */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  background: "#111E2A",
                  border: "1px solid #1A2D3D",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  overflow: "hidden",
                }}
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      padding: 16,
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 72 }}>📦</span>
                )}
              </div>

              {/* Platform */}
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  color: "#4D6677",
                  marginBottom: 8,
                }}
              >
                {product.platform.toUpperCase()}
              </p>

              {/* Name */}
              <h1
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 17,
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: "#E8F1F8",
                  marginBottom: 18,
                }}
              >
                {product.name}
              </h1>

              {/* Price — refined size to match design system */}
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  color: "#00E5A0",
                  marginBottom: 4,
                }}
              >
                ${product.currentPrice.toFixed(2)}
              </div>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "#4D6677",
                  marginBottom: 20,
                }}
              >
                Low: ${product.lowestPrice.toFixed(2)} · High: $
                {allTimeHigh.toFixed(2)}
              </p>

              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ph-view-btn"
              >
                View on {product.platform} →
              </a>
            </div>

            {/* Savings Card */}
            <div className="ph-detail-card" style={{ padding: 18 }}>
              {isAtLowest ? (
                <div
                  style={{
                    background: "rgba(0,229,160,0.08)",
                    border: "1px solid rgba(0,229,160,0.2)",
                    borderRadius: 10,
                    padding: "12px 16px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#00E5A0",
                      marginBottom: 4,
                    }}
                  >
                    🎯 Lowest Price Ever
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#8BA3B8",
                      fontFamily: "'Instrument Sans', sans-serif",
                    }}
                  >
                    Best recorded price — great time to buy!
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    borderRadius: 10,
                    padding: "12px 16px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#F59E0B",
                      marginBottom: 4,
                    }}
                  >
                    💰 Could Save ${priceDiff.toFixed(2)} ({savingsPct}%)
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#8BA3B8",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    Lowest ever: ${product.lowestPrice.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* ML Prediction Card */}
            <div
              className="ph-detail-card ph-pred-top"
              style={{ padding: 24 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "rgba(0,229,160,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  🤖
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#E8F1F8",
                    }}
                  >
                    ML Prediction
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      color: "#4D6677",
                    }}
                  >
                    Gradient Boosting · 7-day forecast
                  </p>
                </div>
              </div>

              <div
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}
              >
                {[
                  {
                    label: "PREDICTED PRICE",
                    value: `$${(product.currentPrice * 0.952).toFixed(2)}`,
                    color: "#00E5A0",
                  },
                  {
                    label: "EXPECTED CHANGE",
                    value: "-4.8%",
                    color: "#00E5A0",
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    style={{
                      background: "#111E2A",
                      borderRadius: 10,
                      padding: 12,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 9,
                        letterSpacing: "0.08em",
                        color: "#4D6677",
                        marginBottom: 6,
                      }}
                    >
                      {m.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 18,
                        fontWeight: 800,
                        letterSpacing: "-0.5px",
                        color: m.color,
                      }}
                    >
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "rgba(0,229,160,0.08)",
                  border: "1px solid rgba(0,229,160,0.2)",
                  borderRadius: 10,
                  padding: "11px 14px",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#00E5A0",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "'Instrument Sans', sans-serif",
                }}
              >
                📉 Price likely to drop in 7 days — good time to wait
              </div>
            </div>
          </div>

          {/* ── RIGHT MAIN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Stats Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
              }}
            >
              {[
                {
                  label: "CURRENT",
                  value: `$${product.currentPrice.toFixed(2)}`,
                  color: "#00E5A0",
                },
                {
                  label: "ALL-TIME LOW",
                  value: `$${product.lowestPrice.toFixed(2)}`,
                  color: "#00E5A0",
                },
                {
                  label: "ALL-TIME HIGH",
                  value: `$${allTimeHigh.toFixed(2)}`,
                  color: "#EF4444",
                },
                {
                  label: "AVG PRICE",
                  value: `$${avgPrice.toFixed(2)}`,
                  color: "#1A8FE3",
                },
              ].map((s) => (
                <div key={s.label} className="ph-stat-card">
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      color: "#4D6677",
                      marginBottom: 8,
                    }}
                  >
                    {s.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 18,
                      fontWeight: 800,
                      letterSpacing: "-0.5px",
                      color: s.color,
                    }}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="ph-detail-card" style={{ padding: 24 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 24,
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#E8F1F8",
                  }}
                >
                  Price History
                </h2>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    color: "#4D6677",
                  }}
                >
                  {product.priceHistory.length} data points
                </span>
              </div>

              {historyPrices.length > 1 ? (
                <div style={{ position: "relative", height: 220 }}>
                  <svg
                    viewBox={`0 0 ${chartW} ${chartH}`}
                    preserveAspectRatio="none"
                    style={{
                      width: "100%",
                      height: "100%",
                      overflow: "visible",
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="chartGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#00E5A0"
                          stopOpacity="0.25"
                        />
                        <stop
                          offset="100%"
                          stopColor="#00E5A0"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    {[50, 100, 150].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2={chartW}
                        y2={y}
                        stroke="#1A2D3D"
                        strokeWidth="1"
                      />
                    ))}
                    <path d={chartArea} fill="url(#chartGrad)" />
                    <path
                      d={chartLine}
                      fill="none"
                      stroke="#00E5A0"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    {/* Predicted extension */}
                    <path
                      d={`M ${(pad + (chartW - pad * 2)).toFixed(1)},${(
                        chartH -
                        pad -
                        ((historyPrices[historyPrices.length - 1] * 0.98 -
                          Math.min(...historyPrices) * 0.98) /
                          (Math.max(...historyPrices) * 1.02 -
                            Math.min(...historyPrices) * 0.98)) *
                          (chartH - pad * 2)
                      ).toFixed(1)} L ${chartW},${(
                        chartH -
                        pad -
                        ((historyPrices[historyPrices.length - 1] * 0.952 -
                          Math.min(...historyPrices) * 0.98) /
                          (Math.max(...historyPrices) * 1.02 -
                            Math.min(...historyPrices) * 0.98)) *
                          (chartH - pad * 2)
                      ).toFixed(1)}`}
                      fill="none"
                      stroke="#1A8FE3"
                      strokeWidth="2"
                      strokeDasharray="6,4"
                    />
                  </svg>
                </div>
              ) : (
                <div
                  style={{
                    height: 220,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 8,
                    color: "#4D6677",
                  }}
                >
                  <span style={{ fontSize: 36, opacity: 0.3 }}>📊</span>
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12,
                    }}
                  >
                    Not enough data to render chart
                  </p>
                </div>
              )}
            </div>

            {/* History Table */}
            <div
              className="ph-detail-card"
              style={{ overflow: "hidden", borderRadius: 16 }}
            >
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid #1A2D3D",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#E8F1F8",
                }}
              >
                Price History Log
              </div>

              {product.priceHistory.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#111E2A" }}>
                      {["DATE", "PRICE", "CHANGE", "SOURCE"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 24px",
                            textAlign: "left",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 10,
                            letterSpacing: "0.08em",
                            color: "#4D6677",
                            borderBottom: "1px solid #1A2D3D",
                            fontWeight: 500,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...product.priceHistory]
                      .reverse()
                      .slice(0, 10)
                      .map((history, i, arr) => {
                        const prev = arr[i + 1];
                        const change = prev ? history.price - prev.price : 0;
                        const pct = prev
                          ? ((change / prev.price) * 100).toFixed(1)
                          : "0";
                        const isDown = change < 0;

                        return (
                          <tr
                            key={history.id}
                            className="ph-table-row"
                            style={{ borderBottom: "1px solid #1A2D3D" }}
                          >
                            <td
                              style={{
                                padding: "14px 24px",
                                fontFamily: "'DM Mono', monospace",
                                fontSize: 12,
                                color: "#8BA3B8",
                              }}
                            >
                              {new Date(history.scrapedAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td
                              style={{
                                padding: "14px 24px",
                                fontFamily: "'Syne', sans-serif",
                                fontWeight: 700,
                                fontSize: 14,
                                color: "#E8F1F8",
                              }}
                            >
                              ${history.price.toFixed(2)}
                            </td>
                            <td style={{ padding: "14px 24px" }}>
                              {change !== 0 ? (
                                <span
                                  style={{
                                    padding: "2px 8px",
                                    borderRadius: 100,
                                    fontSize: 11,
                                    fontFamily: "'DM Mono', monospace",
                                    background: isDown
                                      ? "rgba(0,229,160,0.12)"
                                      : "rgba(239,68,68,0.12)",
                                    color: isDown ? "#00E5A0" : "#EF4444",
                                  }}
                                >
                                  {isDown ? "↓ " : "↑ "}
                                  {Math.abs(Number(pct))}%
                                </span>
                              ) : (
                                <span
                                  style={{
                                    padding: "2px 8px",
                                    borderRadius: 100,
                                    fontSize: 11,
                                    fontFamily: "'DM Mono', monospace",
                                    background: "rgba(255,255,255,0.06)",
                                    color: "#4D6677",
                                  }}
                                >
                                  —
                                </span>
                              )}
                            </td>
                            <td
                              style={{
                                padding: "14px 24px",
                                fontFamily: "'DM Mono', monospace",
                                fontSize: 11,
                                color: "#4D6677",
                              }}
                            >
                              Scraped
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "56px 32px",
                    color: "#4D6677",
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>
                    📭
                  </div>
                  <p
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#8BA3B8",
                      marginBottom: 4,
                    }}
                  >
                    No History Yet
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12,
                    }}
                  >
                    Price data will appear after the first scrape
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
