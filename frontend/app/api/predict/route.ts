import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { PriceHistory } from "@prisma/client";


export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "Missing productId" },
      { status: 400 }
    );
  }

  const history: PriceHistory[] =
  await prisma.priceHistory.findMany({
    where: { productId },
    orderBy: { scrapedAt: "asc" },
  });


  if (history.length < 7) {
    return NextResponse.json({
      predicted_price: null,
    });
  }

  const { data } = await axios.post(
    `${process.env.FASTAPI_URL}/predict`,
    {
      price_history: history.map((h) => ({
        price: h.price,
        scraped_at: h.scrapedAt,
      })),
    }
  );

  return NextResponse.json(data);
}
