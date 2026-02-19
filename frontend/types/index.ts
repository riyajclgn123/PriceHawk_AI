export interface Product {
id: string;
url: string;
name: string;
imageUrl?: string;
platform: "amazon" | "flipkart";
currentPrice: number;
lowestPrice: number;
highestPrice: number;
createdAt: string;
updatedAt: string;
priceHistory?: PricePoint[];
alerts?: Alert[];
}
export interface PricePoint {
id: string;
productId: string;
price: number;
currency: string;
scrapedAt: string;
}
export interface Alert {
id: string;
userId: string;
productId: string;
targetPrice: number;
triggered: boolean;
triggeredAt?: string;
createdAt: string;
}
export interface Prediction {
current_price: number;
predicted_price: number;
will_drop: boolean;
drop_percentage: number;
confidence: "high" | "low";
error?: string;
}
export interface ScrapedProduct {
name: string;
price: number;
currency: string;
image_url?: string;
platform: string;
}