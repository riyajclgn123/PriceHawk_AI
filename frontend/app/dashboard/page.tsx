import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const products = await prisma.product.findMany({
    include: {
      priceHistory: {
        orderBy: { scrapedAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  if (products.length === 0) {
    return (
      <>
        <style>{`
          .ph-empty-btn {
            display: inline-block;
            background: #00E5A0;
            color: #050A0F;
            padding: 14px 32px;
            border-radius: 12px;
            font-family: 'Syne', sans-serif;
            font-weight: 700;
            font-size: 15px;
            text-decoration: none;
            transition: all 0.2s;
          }
          .ph-empty-btn:hover { background: #00ffc8; transform: translateY(-2px); }
        `}</style>
        <div
          style={{
            minHeight: "calc(100vh - 60px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 420, padding: "0 24px" }}>
            <div style={{ fontSize: 72, marginBottom: 24, opacity: 0.4 }}>📦</div>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 32,
                fontWeight: 800,
                color: "#E8F1F8",
                marginBottom: 12,
                letterSpacing: "-0.5px",
              }}
            >
              No Products Yet
            </h1>
            <p
              style={{
                color: "#8BA3B8",
                fontSize: 15,
                marginBottom: 32,
                lineHeight: 1.6,
              }}
            >
              Start tracking products to see price history, predictions, and
              alerts all in one place.
            </p>
            <Link href="/" className="ph-empty-btn">
              🦅 Track Your First Product
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .ph-product-card {
          background: #0D1720;
          border: 1px solid #1A2D3D;
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: block;
          transition: all 0.25s;
          cursor: pointer;
        }
        .ph-product-card:hover {
          border-color: #1F3347;
          transform: translateY(-4px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.5);
        }
        .ph-product-card:hover .ph-card-name {
          color: #00E5A0;
        }
        .ph-product-img {
          background: #111E2A;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #1A2D3D;
          overflow: hidden;
          position: relative;
        }
        .ph-product-img img {
          width: 100%; height: 100%;
          object-fit: contain;
          padding: 16px;
          transition: transform 0.3s;
        }
        .ph-product-card:hover .ph-product-img img {
          transform: scale(1.06);
        }
        .ph-action-btn {
          flex: 1;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #1A2D3D;
          background: transparent;
          color: #8BA3B8;
          font-size: 12px;
          font-family: 'Instrument Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          text-decoration: none;
        }
        .ph-action-btn:hover {
          border-color: #00E5A0;
          color: #00E5A0;
          background: rgba(0,229,160,0.05);
        }
        .ph-action-btn.primary {
          background: #00E5A0;
          color: #050A0F;
          border-color: #00E5A0;
          font-weight: 600;
        }
        .ph-action-btn.primary:hover { background: #00ffc8; }
        .ph-add-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #00E5A0;
          color: #050A0F;
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }
        .ph-add-btn:hover { background: #00ffc8; transform: translateY(-1px); }
        .ph-sidebar-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s;
          font-size: 14px;
          font-weight: 500;
          color: #8BA3B8;
          margin-bottom: 2px;
          text-decoration: none;
        }
        .ph-sidebar-item:hover { background: #111E2A; color: #E8F1F8; }
        .ph-sidebar-item.active { background: rgba(0,229,160,0.1); color: #00E5A0; }
      `}</style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          minHeight: "calc(100vh - 60px)",
        }}
      >
        {/* ── SIDEBAR ── */}
        <aside
          style={{
            background: "#0D1720",
            borderRight: "1px solid #1A2D3D",
            padding: "24px 16px",
            position: "sticky",
            top: 60,
            height: "calc(100vh - 60px)",
            overflowY: "auto" as const,
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
              color: "#4D6677",
              letterSpacing: "0.1em",
              padding: "0 12px",
              marginBottom: 8,
            }}
          >
            NAVIGATION
          </p>

          <Link href="/dashboard" className="ph-sidebar-item active">
            <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>📦</span>
            All Products
            <span
              style={{
                marginLeft: "auto",
                background: "rgba(0,229,160,0.12)",
                color: "#00E5A0",
                fontSize: 10,
                padding: "2px 7px",
                borderRadius: 100,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {products.length}
            </span>
          </Link>

          <Link href="/dashboard" className="ph-sidebar-item">
            <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>📉</span>
            Price Drops
          </Link>

          <Link href="/dashboard" className="ph-sidebar-item">
            <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>🔔</span>
            My Alerts
          </Link>

          <Link href="/" className="ph-sidebar-item" style={{ marginTop: 8 }}>
            <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>+</span>
            Track New
          </Link>

          <div style={{ marginTop: 32 }}>
            <p
              style={{
                fontSize: 10,
                fontFamily: "'DM Mono', monospace",
                color: "#4D6677",
                letterSpacing: "0.1em",
                padding: "0 12px",
                marginBottom: 8,
              }}
            >
              PLATFORMS
            </p>
            <Link href="/dashboard" className="ph-sidebar-item">
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>🛒</span>
              Amazon
            </Link>
            <Link href="/dashboard" className="ph-sidebar-item">
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>🛍️</span>
              Flipkart
            </Link>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={{ padding: 32 }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 28,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  color: "#E8F1F8",
                }}
              >
                Tracked Products
              </h1>
              <p
                style={{
                  fontSize: 13,
                  color: "#4D6677",
                  marginTop: 4,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                Monitoring {products.length} product
                {products.length !== 1 ? "s" : ""} for price drops
              </p>
            </div>
            <Link href="/" className="ph-add-btn">
              + Track Product
            </Link>
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: 16,
            }}
          >
            {products.map((product) => {
              const priceDiff = product.currentPrice - product.lowestPrice;
              const savingsPct = ((priceDiff / product.lowestPrice) * 100).toFixed(1);
              const isAtLowest = product.currentPrice <= product.lowestPrice;

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="ph-product-card"
                >
                  {/* Image */}
                  <div className="ph-product-img">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} />
                    ) : (
                      <span style={{ fontSize: 56 }}>📦</span>
                    )}

                    {/* Platform badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        background: "rgba(13,23,32,0.9)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid #1F3347",
                        padding: "3px 10px",
                        borderRadius: 100,
                        fontSize: 10,
                        fontFamily: "'DM Mono', monospace",
                        color: "#8BA3B8",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {product.platform}
                    </div>

                    {/* At lowest badge */}
                    {isAtLowest && (
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          background: "#00E5A0",
                          color: "#050A0F",
                          padding: "3px 10px",
                          borderRadius: 100,
                          fontSize: 10,
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 700,
                          animation: "pulse 2s infinite",
                        }}
                      >
                        🎯 LOWEST!
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: 20 }}>
                    <h3
                      className="ph-card-name"
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 14,
                        fontWeight: 700,
                        lineHeight: 1.35,
                        marginBottom: 14,
                        color: "#E8F1F8",
                        transition: "color 0.2s",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as const,
                        overflow: "hidden",
                        minHeight: 38,
                      }}
                    >
                      {product.name}
                    </h3>

                    {/* Prices */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: 10,
                            fontFamily: "'DM Mono', monospace",
                            color: "#4D6677",
                            marginBottom: 3,
                            letterSpacing: "0.06em",
                          }}
                        >
                          CURRENT
                        </p>
                        <p
                          style={{
                            fontFamily: "'Syne', sans-serif",
                            fontSize: 22,
                            fontWeight: 800,
                            letterSpacing: "-0.5px",
                            color: "#E8F1F8",
                          }}
                        >
                          ${product.currentPrice.toFixed(2)}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            fontSize: 10,
                            fontFamily: "'DM Mono', monospace",
                            color: "#4D6677",
                            marginBottom: 3,
                            letterSpacing: "0.06em",
                          }}
                        >
                          LOWEST
                        </p>
                        <p
                          style={{
                            fontFamily: "'Syne', sans-serif",
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#00E5A0",
                          }}
                        >
                          ${product.lowestPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Status pill */}
                    {isAtLowest ? (
                      <div
                        style={{
                          background: "rgba(0,229,160,0.08)",
                          border: "1px solid rgba(0,229,160,0.2)",
                          borderRadius: 10,
                          padding: "10px 14px",
                          marginBottom: 14,
                        }}
                      >
                        <p
                          style={{
                            color: "#00E5A0",
                            fontSize: 12,
                            fontWeight: 600,
                            fontFamily: "'Instrument Sans', sans-serif",
                          }}
                        >
                          ✨ Best price ever recorded!
                        </p>
                      </div>
                    ) : priceDiff > 0 ? (
                      <div
                        style={{
                          background: "rgba(245,158,11,0.08)",
                          border: "1px solid rgba(245,158,11,0.2)",
                          borderRadius: 10,
                          padding: "10px 14px",
                          marginBottom: 14,
                        }}
                      >
                        <p
                          style={{
                            color: "#F59E0B",
                            fontSize: 12,
                            fontWeight: 600,
                            fontFamily: "'Instrument Sans', sans-serif",
                          }}
                        >
                          💰 Save ${priceDiff.toFixed(2)} ({savingsPct}%)
                        </p>
                        <p
                          style={{
                            color: "#8BA3B8",
                            fontSize: 11,
                            marginTop: 2,
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          Wait for a drop
                        </p>
                      </div>
                    ) : (
                      <div
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid #1A2D3D",
                          borderRadius: 10,
                          padding: "10px 14px",
                          marginBottom: 14,
                        }}
                      >
                        <p
                          style={{
                            color: "#4D6677",
                            fontSize: 12,
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          📊 Monitoring prices...
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <span className="ph-action-btn">🔔 Alert</span>
                      <span className="ph-action-btn primary">
                        View Details →
                      </span>
                    </div>

                    {/* Updated */}
                    <p
                      style={{
                        fontSize: 11,
                        color: "#4D6677",
                        marginTop: 12,
                        fontFamily: "'DM Mono', monospace",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      🕐 Updated{" "}
                      {new Date(product.updatedAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div style={{ marginTop: 40, textAlign: "center" }}>
            <Link href="/" className="ph-add-btn" style={{ display: "inline-flex" }}>
              + Track Another Product
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
