from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx
from bs4 import BeautifulSoup
import re
import numpy as np

app = FastAPI(title="PriceHawk Scraper API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Models ──────────────────────────────────────────────────────────────────

class ScrapeRequest(BaseModel):
    url: str
    product_id: Optional[str] = None

class PricePoint(BaseModel):
    price: float
    scraped_at: str

class PredictRequest(BaseModel):
    price_history: List[PricePoint]

# ── Helpers ──────────────────────────────────────────────────────────────────

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}


def detect_platform(url: str) -> str:
    u = url.lower()
    if "amazon" in u:
        return "Amazon"
    if "flipkart" in u:
        return "Flipkart"
    if "ebay" in u:
        return "eBay"
    if "shein" in u:
        return "Shein"
    return "Unknown"


def clean_price(text: str) -> float:
    """Strip currency symbols / commas and return a float."""
    cleaned = re.sub(r"[^\d.]", "", text.replace(",", ""))
    try:
        return float(cleaned)
    except ValueError:
        raise ValueError(f"Could not parse price from: '{text}'")


# ── Platform scrapers ─────────────────────────────────────────────────────────

async def scrape_amazon(url: str) -> dict:
    async with httpx.AsyncClient(follow_redirects=True, timeout=25, headers=HEADERS) as client:
        r = await client.get(url)
        soup = BeautifulSoup(r.text, "lxml")

    name_el = soup.select_one("#productTitle")
    name = name_el.get_text(strip=True) if name_el else "Unknown Product"

    price_el = (
        soup.select_one(".a-price .a-offscreen")
        or soup.select_one("#priceblock_ourprice")
        or soup.select_one("#priceblock_dealprice")
        or soup.select_one(".a-price-whole")
        or soup.select_one("span.priceToPay .a-offscreen")
    )
    price = clean_price(price_el.get_text(strip=True)) if price_el else 0.0

    img_el = soup.select_one("#landingImage") or soup.select_one("#imgBlkFront")
    image_url = None
    if img_el:
        image_url = img_el.get("src") or img_el.get("data-src") or img_el.get("data-old-hires")

    return {"name": name, "price": price, "image_url": image_url, "platform": "Amazon"}


async def scrape_flipkart(url: str) -> dict:
    async with httpx.AsyncClient(follow_redirects=True, timeout=25, headers=HEADERS) as client:
        r = await client.get(url)
        soup = BeautifulSoup(r.text, "lxml")

    name_el = (
        soup.select_one("span.VU-ZEz")
        or soup.select_one("span.B_NuCI")
        or soup.select_one("h1.yhB1nd")
        or soup.select_one("h1")
    )
    name = name_el.get_text(strip=True) if name_el else "Unknown Product"

    price_el = (
        soup.select_one("div.Nx9bqj")
        or soup.select_one("div._30jeq3")
        or soup.select_one("div._16Jk6d")
    )
    price = clean_price(price_el.get_text(strip=True)) if price_el else 0.0

    img_el = soup.select_one("img._396cs4") or soup.select_one("img.DByuf4") or soup.select_one("img._2r_T1I")
    image_url = img_el.get("src") if img_el else None

    return {"name": name, "price": price, "image_url": image_url, "platform": "Flipkart"}


async def scrape_ebay(url: str) -> dict:
    async with httpx.AsyncClient(follow_redirects=True, timeout=25, headers=HEADERS) as client:
        r = await client.get(url)
        soup = BeautifulSoup(r.text, "lxml")

    name_el = soup.select_one("h1.x-item-title__mainTitle span") or soup.select_one("h1#itemTitle")
    name = name_el.get_text(strip=True) if name_el else "Unknown Product"
    name = name.replace("Details about  \xa0", "")

    price_el = (
        soup.select_one(".x-price-primary span.ux-textspans")
        or soup.select_one("span#prcIsum")
        or soup.select_one("span#mm-saleDscPrc")
    )
    price = clean_price(price_el.get_text(strip=True)) if price_el else 0.0

    img_el = soup.select_one("div.ux-image-carousel-item.active img") or soup.select_one("img#icImg")
    image_url = None
    if img_el:
        image_url = img_el.get("src") or img_el.get("data-zoom-src")

    return {"name": name, "price": price, "image_url": image_url, "platform": "eBay"}


async def scrape_generic(url: str, platform: str) -> dict:
    async with httpx.AsyncClient(follow_redirects=True, timeout=25, headers=HEADERS) as client:
        r = await client.get(url)
        soup = BeautifulSoup(r.text, "lxml")

    og_title = soup.select_one('meta[property="og:title"]')
    og_image = soup.select_one('meta[property="og:image"]')
    og_price = soup.select_one('meta[property="product:price:amount"]')

    name = og_title.get("content", "Unknown Product") if og_title else "Unknown Product"
    image_url = og_image.get("content") if og_image else None
    price = float(og_price.get("content", 0)) if og_price else 0.0

    return {"name": name, "price": price, "image_url": image_url, "platform": platform}


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok", "service": "PriceHawk Scraper API v1"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/scrape")
async def scrape(req: ScrapeRequest):
    url = req.url
    platform = detect_platform(url)

    try:
        if platform == "Amazon":
            result = await scrape_amazon(url)
        elif platform == "Flipkart":
            result = await scrape_flipkart(url)
        elif platform == "eBay":
            result = await scrape_ebay(url)
        else:
            result = await scrape_generic(url, platform)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")

    if result["price"] <= 0:
        raise HTTPException(
            status_code=422,
            detail=(
                "Could not extract a valid price from this page. "
                "The page may require JavaScript rendering or the layout may have changed."
            ),
        )

    return result


@app.post("/predict")
def predict(req: PredictRequest):
    prices = [p.price for p in req.price_history]

    if len(prices) < 3:
        return {
            "predicted_price": None,
            "will_drop": False,
            "drop_percentage": 0,
            "confidence": "low",
        }

    n = len(prices)
    x = np.arange(n, dtype=float)
    coeffs = np.polyfit(x, prices, 1)
    predicted = float(np.polyval(coeffs, n + 6))  # 7 steps ahead

    current = prices[-1]
    # Cap the prediction — never predict more than 30% drop or 20% rise in 7 days
    predicted = max(predicted, current * 0.70)
    predicted = min(predicted, current * 1.20)
    predicted = round(predicted, 2)

    will_drop = predicted < current
    pct_change = abs((predicted - current) / current * 100)
    confidence: str = "high" if pct_change > 2 else "low"

    return {
        "predicted_price": predicted,
        "will_drop": will_drop,
        "drop_percentage": round(pct_change, 2),
        "confidence": confidence,
    }
