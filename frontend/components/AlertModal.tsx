"use client";

import { useState } from "react";

export function AlertModal({ productId }: any) {
  const [price, setPrice] = useState("");
  const [open, setOpen] = useState(false);

  const submitAlert = async () => {
    await fetch("/api/alerts", {
      method: "POST",
      body: JSON.stringify({
        productId,
        targetPrice: parseFloat(price),
      }),
    });

    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Set Price Alert
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h3 className="font-bold mb-4">
              Set Target Price
            </h3>

            <input
              type="number"
              placeholder="Enter target price"
              className="w-full border px-3 py-2 rounded mb-4"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button
                onClick={submitAlert}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
