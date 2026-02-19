"use client";

interface Props {
  willDrop: boolean;
  dropPercentage: number;
  predictedPrice: number;
  confidence: "high" | "low";
}

export function PredictionBadge({
  willDrop,
  dropPercentage,
  predictedPrice,
  confidence,
}: Props) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        willDrop
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">
          {willDrop ? "📉" : "📈"}
        </span>

        <div>
          <p className="font-semibold">
            {willDrop
              ? `Price may drop ${Math.abs(dropPercentage).toFixed(1)}%`
              : `Price may rise`}
          </p>

          <p className="text-sm text-gray-500">
            Predicted: ₹{predictedPrice} · {confidence} confidence
          </p>
        </div>
      </div>
    </div>
  );
}
