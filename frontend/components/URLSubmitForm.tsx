'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function URLSubmitForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Basic URL validation
      new URL(url);

      const response = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to track product');
      }

      // Redirect to product page
      if (data.redirect) {
        router.push(data.redirect);
      }
    } catch (err: any) {
      if (err.message.includes('Invalid URL')) {
        setError('Please enter a valid URL');
      } else {
        setError(err.message || 'Failed to track product');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-4">
        {/* Input and Button */}
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste any product URL from Amazon, Shein, eBay..."
            className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !url}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl disabled:shadow-none hover:scale-105 disabled:scale-100 whitespace-nowrap"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Tracking...
              </span>
            ) : (
              '🦅 Track Price'
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <span className="text-red-500 text-xl">⚠️</span>
            <div>
              <p className="text-red-700 font-semibold">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Supported Platforms */}
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <span>Supports:</span>
          <div className="flex gap-3">
            <span className="px-3 py-1 bg-gray-100 rounded-full">Amazon</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">Shein</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">eBay</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">Flipkart</span>
          </div>
        </div>
      </div>
    </form>
  );
}