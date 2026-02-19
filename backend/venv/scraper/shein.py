# backend/scraper/shein.py
from playwright.async_api import async_playwright
import re
import asyncio

async def scrape_shein(url: str) -> dict:
    """
    Scrape product details from Shein using Playwright.
    Shein is easier to scrape than Amazon.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-setuid-sandbox"]
        )
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                       "AppleWebKit/537.36 (KHTML, like Gecko) "
                       "Chrome/120.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(3000)
            
            # Extract product name
            name = None
            for selector in [
                "h1.product-intro__head-name",
                ".product-intro__head-name",
                "h1[class*='product']",
            ]:
                try:
                    name = await page.locator(selector).first.inner_text()
                    if name:
                        name = name.strip()
                        break
                except:
                    pass
            
            if not name:
                raise ValueError("Product name not found")
            
            # Extract price
            price_text = None
            for selector in [
                ".product-intro__head-price span[class*='price']",
                ".she-price",
                "span.original-price",
                "[class*='price-sale']",
            ]:
                try:
                    price_text = await page.locator(selector).first.inner_text()
                    if price_text:
                        print(f"💰 Found price: {price_text}")
                        break
                except:
                    pass
            
            if not price_text:
                raise ValueError("Price not found")
            
            # Extract image
            image_url = None
            for selector in [
                ".product-intro__main-img img",
                ".crop-image-container img",
                "img[class*='product']",
            ]:
                try:
                    image_url = await page.locator(selector).first.get_attribute("src")
                    if image_url and not image_url.startswith("data:"):
                        break
                except:
                    pass
            
            await browser.close()
            
            # Clean price: "$14.99" or "₹1,499" -> 14.99 or 1499
            price_clean = re.sub(r"[^\d.]", "", price_text)
            price = float(price_clean)
            
            # Detect currency
            currency = "USD"
            if "$" in price_text:
                currency = "USD"
            elif "₹" in price_text:
                currency = "INR"
            elif "€" in price_text:
                currency = "EUR"
            
            return {
                "name": name,
                "price": price,
                "currency": currency,
                "image_url": image_url or "https://via.placeholder.com/300",
                "platform": "Shein"
            }
            
        except Exception as e:
            await browser.close()
            raise ValueError(f"Failed to scrape Shein: {str(e)}")


async def test_shein():
    # Test with a real Shein URL
    test_url = "https://us.shein.com/SHEIN-Women-s-Casual-Dress-p-12345.html"
    result = await scrape_shein(test_url)
    print("Shein Result:", result)

if __name__ == "__main__":
    asyncio.run(test_shein())