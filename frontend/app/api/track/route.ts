import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Generate product ID from URL
    const productId = Buffer.from(url).toString("base64").slice(0, 20);

    console.log("🔍 Scraping URL:", url);

    // Call FastAPI scraper
    const scrapeResponse = await axios.post(
      `${process.env.FASTAPI_URL}/scrape`,
      {
        url,
        product_id: productId,
      },
      {
        timeout: 30000, // 30 second timeout
      }
    );

    const scraped = scrapeResponse.data;
    console.log("✅ Scraped data:", scraped);

    // Upsert product in database (do NOT overwrite lowestPrice here)
    const product = await prisma.product.upsert({
      where: { url },
      update: {
        currentPrice: scraped.price,
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

    // Update lowest price only if current price is lower
    if (scraped.price < product.lowestPrice) {
      await prisma.product.update({
        where: { id: product.id },
        data: { lowestPrice: scraped.price },
      });
    }

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
  } catch (error: any) {
    console.error("❌ Error in /api/track:", error);

    // Check if it's an axios error
    if (axios.isAxiosError(error)) {
      const backendError = error.response?.data;
      console.error("Backend error:", backendError);

      return NextResponse.json(
        {
          error: backendError?.detail || "Backend scraping failed",
          details: backendError,
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
