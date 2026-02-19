import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatPrice(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
export function getPlatformLabel(url: string): "amazon" | "flipkart" {
  if (url.includes("amazon")) return "amazon";
  if (url.includes("flipkart")) return "flipkart";
  throw new Error("Unsupported platform");
}
export function getPriceChange(history: { price: number }[]) {
  if (history.length < 2) return { amount: 0, percent: 0 };
  const latest = history[history.length - 1].price;
  const prev = history[history.length - 2].price;
  const amount = latest - prev;
  const percent = (amount / prev) * 100;
  return { amount, percent: parseFloat(percent.toFixed(2)) };
}
