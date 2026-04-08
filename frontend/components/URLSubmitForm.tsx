"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function URLSubmitForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      new URL(url); // validate format

      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to track product");
      }

      if (data.redirect) {
        router.push(data.redirect);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to track product";
      setError(msg.includes("Invalid URL") ? "Please enter a valid product URL" : msg);
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !url.trim();

  return (
    <>
      <style>{`
        @keyframes ph-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .ph-url-input {
          flex: 1;
          padding: 14px 20px;
          background: #0D1720;
          border: 1.5px solid #1A2D3D;
          border-radius: 12px;
          color: #E8F1F8;
          font-size: 14px;
          font-family: 'Instrument Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
          min-width: 0;
        }
        .ph-url-input::placeholder { color: #4D6677; }
        .ph-url-input:focus { border-color: #00E5A0; }
        .ph-url-input:disabled { opacity: 0.5; cursor: not-allowed; }
        .ph-track-btn {
          padding: 14px 28px;
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ph-track-btn:not(:disabled) {
          background: #00E5A0;
          color: #050A0F;
        }
        .ph-track-btn:not(:disabled):hover {
          background: #00ffc8;
          transform: translateY(-1px);
        }
        .ph-track-btn:disabled {
          background: #1A2D3D;
          color: #4D6677;
          cursor: not-allowed;
        }
      `}</style>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Input + Button row */}
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste any Amazon, Flipkart or eBay product URL..."
              disabled={loading}
              className="ph-url-input"
            />
            <button type="submit" disabled={disabled} className="ph-track-btn">
              {loading ? (
                <>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    style={{ animation: "ph-spin 0.8s linear infinite" }}
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Tracking...
                </>
              ) : (
                "🦅 Track Price"
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 10,
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#EF4444",
                fontSize: 13,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Platform pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              flexWrap: "wrap" as const,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: "#4D6677",
                letterSpacing: "0.06em",
              }}
            >
              SUPPORTS:
            </span>
            {["🛒 Amazon", "🛍️ Flipkart", "🏷️ eBay", "👗 Shein"].map((p) => (
              <span
                key={p}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: "#8BA3B8",
                  background: "#0D1720",
                  border: "1px solid #1A2D3D",
                  borderRadius: 100,
                  padding: "3px 10px",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </form>
    </>
  );
}
