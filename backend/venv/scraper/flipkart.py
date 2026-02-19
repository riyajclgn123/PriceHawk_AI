# backend/scraper/flipkart.py
from playwright.async_api import async_playwright
import re
import asyncio

async def scrape_flipkart(url: str) -> dict:
    """
    Scrape product details from Flipkart using Playwright.
    Returns: dict with name, price, currency, image_url, platform
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
            await page.wait_for_timeout(2000)  # Wait for JS to render
            
            # Extract product name
            name = None
            for selector in [
                "span.VU-ZEz",
                "span.B_NuCI",
                "h1.yhB1nd",
                "h1 span"
            ]:
                try:
                    name = await page.locator(selector).first.inner_text()
                    if name:
                        break
                except:
                    pass
            
            if not name:
                raise ValueError("Product name not found")
            
            # Extract price - try multiple selectors (Flipkart changes these)
            price_text = None
            for selector in [
                "div.Nx9bqj.CxhGGd",
                "div._30jeq3._16Jk6d",
                "div._30jeq3",
                "div._25b18c div._30jeq3",
            ]:
                try:
                    price_text = await page.locator(selector).first.inner_text()
                    if price_text:
                        break
                except:
                    pass
            
            if not price_text:
                raise ValueError("Price not found - Flipkart may have blocked the request")
            
            # Extract image
            image_url = None
            for selector in [
                "img._53J4C-",
                "div._1BweB8 img",
                "img.CXW8mj"
            ]:
                try:
                    image_url = await page.locator(selector).first.get_attribute("src")
                    if image_url:
                        break
                except:
                    pass
            
            await browser.close()
            
            # Clean price string: "₹1,499" or "₹14,999" -> 1499.0 or 14999.0
            price_clean = re.sub(r"[^\d.]", "", price_text)
            price = float(price_clean)
            
            return {
                "name": name.strip(),
                "price": price,
                "currency": "INR",  # Flipkart is India-only
                "image_url": image_url or "https://via.placeholder.com/300",
                "platform": "Flipkart"
            }
            
        except Exception as e:
            await browser.close()
            raise ValueError(f"Failed to scrape Flipkart: {str(e)}")


# Test function
async def test_flipkart():
    test_url = "https://www.flipkart.com/apple-iphone-13-blue-128-gb/p/itm6c6793e0cbda8"
    result = await scrape_flipkart(test_url)
    print("Flipkart Scrape Result:", result)

if __name__ == "__main__":
    asyncio.run(test_flipkart())
