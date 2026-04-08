# backend/scraper/ebay.py
from playwright.async_api import async_playwright
import re
import asyncio

async def scrape_ebay(url: str) -> dict:
    """
    Scrape product details from eBay.
    eBay is more scraping-friendly than Amazon.
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
            await page.wait_for_timeout(2000)
            
            # Extract name
            name = None
            for selector in [
                "h1.x-item-title__mainTitle",
                ".x-item-title span",
                "h1[class*='title']",
            ]:
                try:
                    name = await page.locator(selector).first.inner_text()
                    if name:
                        break
                except:
                    pass
            
            if not name:
                raise ValueError("Product name not found")
            
            # Extract price
            price_text = None
            for selector in [
                ".x-price-primary span",
                ".x-price-approx",
                "[class*='display-price']",
            ]:
                try:
                    price_text = await page.locator(selector).first.inner_text()
                    if price_text:
                        break
                except:
                    pass
            
            if not price_text:
                raise ValueError("Price not found")
            
            # Extract image
            image_url = None
            try:
                image_url = await page.locator("img[class*='image']").first.get_attribute("src")
            except:
                pass
            
            await browser.close()
            
            # Clean price
            price_clean = re.sub(r"[^\d.]", "", price_text)
            price = float(price_clean)
            
            currency = "USD"
            if "$" in price_text:
                currency = "USD"
            elif "£" in price_text:
                currency = "GBP"
            elif "€" in price_text:
                currency = "EUR"
            
            return {
                "name": name.strip(),
                "price": price,
                "currency": currency,
                "image_url": image_url or "https://via.placeholder.com/300",
                "platform": "eBay"
            }
            
        except Exception as e:
            await browser.close()
            raise ValueError(f"Failed to scrape eBay: {str(e)}")