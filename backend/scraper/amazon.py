# backend/scraper/amazon.py
from playwright.async_api import async_playwright
import re
import asyncio

async def scrape_amazon(url: str) -> dict:
    """
    Scrape product details from Amazon using Playwright.
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
            # Navigate and let redirects happen (a.co links redirect to full amazon.com)
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(3000)  # Wait for JS to render and redirects
            
            # Get the final URL after redirects
            final_url = page.url
            print(f"📍 Final URL after redirect: {final_url}")
            
            # Extract product name
            name = None
            for selector in ["#productTitle", "span#productTitle", "h1.product-title", "span.product-title-word-break"]:
                try:
                    name = await page.locator(selector).first.inner_text()
                    if name:
                        name = name.strip()
                        break
                except:
                    pass
            
            if not name:
                raise ValueError("Product name not found")
            
            # Extract price - try multiple selectors (Amazon changes these)
            price_text = None
            for selector in [
                ".a-price .a-offscreen",
                "#priceblock_ourprice",
                "#priceblock_dealprice",
                ".a-price-whole",
                "span.a-price-whole",
                "#corePriceDisplay_desktop_feature_div .a-price .a-offscreen",
                ".priceToPay .a-offscreen",
                "#corePrice_feature_div .a-offscreen",
            ]:
                try:
                    price_text = await page.locator(selector).first.inner_text()
                    if price_text:
                        print(f"💰 Found price with selector: {selector} = {price_text}")
                        break
                except:
                    pass
            
            if not price_text:
                # Try to get any text that looks like a price
                try:
                    price_text = await page.evaluate("""
                        () => {
                            const priceElements = document.querySelectorAll('[class*="price"]');
                            for (let el of priceElements) {
                                const text = el.textContent;
                                if (text && /[\$₹€£]\s*[\d,]+/.test(text)) {
                                    return text;
                                }
                            }
                            return null;
                        }
                    """)
                except:
                    pass
            
            if not price_text:
                await browser.close()
                raise ValueError("Price not found - Amazon may have blocked the request or page structure changed")
            
            # Extract image
            image_url = None
            for selector in ["#landingImage", "#imgBlkFront", "img.a-dynamic-image", "#imageBlock img"]:
                try:
                    image_url = await page.locator(selector).first.get_attribute("src")
                    if image_url:
                        break
                except:
                    pass
            
            await browser.close()
            
            # Clean price string: "₹1,499.00" or "$14.99" -> 1499.0 or 14.99
            price_clean = re.sub(r"[^\d.]", "", price_text)
            if not price_clean or price_clean == ".":
                raise ValueError(f"Could not parse price from: {price_text}")
            
            price = float(price_clean)
            
            # Detect currency
            currency = "USD"
            if "₹" in price_text or "Rs" in price_text:
                currency = "INR"
            elif "$" in price_text:
                currency = "USD"
            elif "€" in price_text:
                currency = "EUR"
            elif "£" in price_text:
                currency = "GBP"
            
            return {
                "name": name,
                "price": price,
                "currency": currency,
                "image_url": image_url or "https://via.placeholder.com/300",
                "platform": "Amazon"
            }
            
        except Exception as e:
            await browser.close()
            raise ValueError(f"Failed to scrape Amazon: {str(e)}")


# Test function
async def test_amazon():
    test_urls = [
        "https://www.amazon.com/dp/B08N5WRWNW",
        "https://a.co/d/0hBsOaTn"  # Shortened link
    ]
    
    for url in test_urls:
        print(f"\n🧪 Testing: {url}")
        try:
            result = await scrape_amazon(url)
            print("✅ Success:", result)
        except Exception as e:
            print(f"❌ Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_amazon())