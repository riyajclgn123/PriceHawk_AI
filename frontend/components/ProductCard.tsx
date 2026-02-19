"use client";

import Link from "next/link";

export function ProductCard({ product }: any) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="border rounded-xl p-4 bg-white hover:shadow-lg transition">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            className="h-40 object-contain mx-auto"
          />
        )}

        <h3 className="mt-4 font-semibold line-clamp-2">
          {product.name}
        </h3>

        <p className="text-blue-600 font-bold mt-2">
          ₹{product.currentPrice.toLocaleString()}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          {product.platform}
        </p>
      </div>
    </Link>
  );
}
