import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const fastApiUrl = process.env.FASTAPI_URL;
    if (!fastApiUrl) {
      return NextResponse.json(
        { error: "FASTAPI_URL is not configured on the server." },
        { status: 500 }
      );
    }

    console.log("🔍 Scraping URL:", url);

    const scrapeResponse = await axios.post(
      `${fastApiUrl}/scrape`,
      { url },
      { timeout: 30000 }
    );

    const scraped = scrapeResponse.data;
    console.log("✅ Scraped data:", scraped);

    // Check if the product already exists to preserve lowestPrice correctly
    const existing = await prisma.product.findUnique({ where: { url } });

    const newLowest =
      existing && existing.lowestPrice < scraped.price
        ? existing.lowestPrice
        : scraped.price;

    const product = await prisma.product.upsert({
      where: { url },
      update: {
        currentPrice: scraped.price,
        lowestPrice: newLowest,
        updatedAt: new Date(),
      },
      create: {
        url,
        name: scraped.name,
        imageUrl: scraped.image_url,
        platform: scraped.platform,
        currentPrice: scraped.price,
        lowestPrice: scraped.price,
      },
    });

    // Record price history
    await prisma.priceHistory.create({
      data: {
        productId: product.id,
        price: scraped.price,
      },
    });

    console.log("✅ Product saved:", product.id);

    return NextResponse.json({
      success: true,
      product,
      redirect: `/product/${product.id}`,
    });
  } catch (error: unknown) {
    console.error("❌ Error in /api/track:", error);

    if (axios.isAxiosError(error)) {
      const detail = error.response?.data?.detail || error.message;
      return NextResponse.json(
        { error: "Failed to scrape product", details: detail },
        { status: 500 }
      );
    }

    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to track product", details: msg },
      { status: 500 }
    );
  }
}
