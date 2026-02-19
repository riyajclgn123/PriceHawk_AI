"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type PricePoint = {
  price: number;
  scrapedAt: string | Date;
};

interface Props {
  history: PricePoint[];
  predictedPrice?: number;
}

export function PriceChart({ history, predictedPrice }: Props) {
  const data = history.map((h) => ({
    date: new Date(h.scrapedAt).toLocaleDateString(),
    price: h.price,
  }));

  return (
    <div className="w-full h-80 mt-8 bg-white p-4 rounded-xl shadow">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `₹${v}`} />
          <Tooltip
            formatter={(value) => {
              if (value === undefined) return "";
              return [`₹${value}`, "Price"];
            }}
          />

          {predictedPrice && (
            <ReferenceLine
              y={predictedPrice}
              stroke="#22c55e"
              strokeDasharray="5 5"
              label="Predicted"
            />
          )}

          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
