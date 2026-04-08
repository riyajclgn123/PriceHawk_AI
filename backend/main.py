# # backend/main.py
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from scraper.amazon import scrape_amazon
# from scraper.flipkart import scrape_flipkart
# import redis
# import json
# import os
# from typing import Optional

# app = FastAPI(title="PriceHawk API", version="1.0.0")

# # CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000", "http://localhost:3001"],
#     allow_methods=["*"],
#     allow_headers=["*"],
#     allow_credentials=True,
# )

# # Redis connection
# REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
# try:
#     r = redis.from_url(REDIS_URL, decode_responses=True)
#     r.ping()
#     print("✅ Connected to Redis")
# except Exception as e:
#     print(f"⚠️  Redis connection failed: {e}")
#     r = None


# # ─── Request Models ─────────────────────────────────────────────────────
# class ScrapeRequest(BaseModel):
#     url: str
#     product_id: str


# class PredictRequest(BaseModel):
#     price_history: list[dict]


# class NotifyRequest(BaseModel):
#     product_name: str
#     email: str
#     price: float


# # ─── Endpoints ──────────────────────────────────────────────────────────
# @app.get("/")
# async def root():
#     return {
#         "app": "PriceHawk API",
#         "version": "1.0.0",
#         "status": "running"
#     }


# @app.get("/health")
# async def health():
#     redis_status = "connected" if r and r.ping() else "disconnected"
#     return {
#         "status": "ok",
#         "redis": redis_status
#     }


# @app.post("/scrape")
# async def scrape(req: ScrapeRequest):
#     """
#     Scrape current price from URL and cache it.
#     Supports: Amazon, Flipkart, Shein, eBay
#     """
#     # Check cache first
#     if r:
#         cache_key = f"price:{req.product_id}"
#         cached = r.get(cache_key)
#         if cached:
#             print(f"✅ Cache hit for {req.product_id}")
#             return json.loads(cached)
    
#     url_lower = req.url.lower()
    
#     try:
#         # Import scrapers
#         from scraper.shein import scrape_shein
#         from scraper.ebay import scrape_ebay
        
#         # Determine platform
#         if any(domain in url_lower for domain in ["amazon.", "amzn.", "a.co"]):
#             print(f"🛒 Amazon URL: {req.url}")
#             data = await scrape_amazon(req.url)
#         elif "flipkart" in url_lower:
#             print(f"🛒 Flipkart URL: {req.url}")
#             data = await scrape_flipkart(req.url)
#         elif "shein" in url_lower:
#             print(f"👗 Shein URL: {req.url}")
#             data = await scrape_shein(req.url)
#         elif "ebay" in url_lower:
#             print(f"🏷️ eBay URL: {req.url}")
#             data = await scrape_ebay(req.url)
#         else:
#             raise HTTPException(
#                 status_code=400,
#                 detail=f"Supported platforms: Amazon, Flipkart, Shein, eBay. Got: {req.url}"
#             )
        
#         # Cache result
#         if r:
#             cache_key = f"price:{req.product_id}"
#             r.setex(cache_key, 3600, json.dumps(data))
#             print(f"✅ Cached: {req.product_id}")
        
#         return data
        
#     except ValueError as e:
#         raise HTTPException(status_code=400, detail=str(e))
#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")


# @app.post("/predict")
# async def predict(req: PredictRequest):
#     """
#     Run ML model to predict future price.
#     Returns prediction or error if insufficient data.
#     """
#     if len(req.price_history) < 7:
#         return {
#             "error": "Need at least 7 days of history for prediction",
#             "current_count": len(req.price_history)
#         }
    
#     # Import ML prediction (we'll create this next)
#     try:
#         from ml.predict import predict_price_drop
#         result = predict_price_drop(req.price_history)
#         return result
#     except ImportError:
#         return {
#             "error": "ML model not yet trained",
#             "message": "Please train the model first using ml/train.py"
#         }
#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=f"Prediction failed: {str(e)}"
#         )


# @app.post("/notify")
# async def notify(req: NotifyRequest):
#     """
#     Send alert email when target price is reached.
#     """
#     try:
#         from email_service import send_alert_email
#         await send_alert_email(
#             to=req.email,
#             product_name=req.product_name,
#             current_price=req.price,
#             target_price=req.price
#         )
#         return {"sent": True}
#     except ImportError:
#         return {
#             "error": "Email service not configured",
#             "message": "Please set up Resend API key"
#         }
#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=f"Email notification failed: {str(e)}"
#         )


# # Run with: uvicorn main:app --reload --port 8000
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import redis
import json
import os
import random

app = FastAPI(title="PriceHawk API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
try:
    r = redis.from_url(REDIS_URL, decode_responses=True)
    r.ping()
    print("✅ Connected to Redis")
except Exception as e:
    print(f"⚠️  Redis connection failed: {e}")
    r = None

class ScrapeRequest(BaseModel):
    url: str
    product_id: str

class PredictRequest(BaseModel):
    price_history: list[dict]

class NotifyRequest(BaseModel):
    product_name: str
    email: str
    price: float

@app.get("/")
async def root():
    return {
        "app": "PriceHawk API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    redis_status = "connected" if r and r.ping() else "disconnected"
    return {
        "status": "ok",
        "redis": redis_status
    }

def mock_scrape(url: str) -> dict:
    """
    Mock scraper - returns fake but realistic data.
    Use this while fixing real scrapers.
    """
    url_lower = url.lower()
    
    # Determine platform
    if any(d in url_lower for d in ["amazon", "amzn", "a.co"]):
        platform = "Amazon"
        base_price = random.uniform(20, 500)
    elif "shein" in url_lower:
        platform = "Shein"
        base_price = random.uniform(10, 80)
    elif "flipkart" in url_lower:
        platform = "Flipkart"
        base_price = random.uniform(500, 5000)
    elif "ebay" in url_lower:
        platform = "eBay"
        base_price = random.uniform(15, 300)
    else:
        platform = "Unknown Store"
        base_price = random.uniform(20, 200)
    
    # Generate mock data
    product_names = [
        "Wireless Bluetooth Headphones",
        "Smart Watch Series 5",
        "USB-C Fast Charging Cable",
        "Portable Power Bank 20000mAh",
        "Casual Cotton T-Shirt",
        "Running Shoes Lightweight",
        "Stainless Steel Water Bottle",
        "LED Desk Lamp with USB Port",
    ]
    
    return {
        "name": f"{platform} - {random.choice(product_names)}",
        "price": round(base_price, 2),
        "currency": "USD" if platform != "Flipkart" else "INR",
        "image_url": f"https://picsum.photos/400/400?random={random.randint(1,1000)}",
        "platform": platform
    }

@app.post("/scrape")
async def scrape(req: ScrapeRequest):
    """
    Scrape product - using MOCK data for now.
    Change USE_MOCK to False when real scrapers work.
    """
    USE_MOCK = True  # Set to False to use real scrapers
    
    # Check cache
    if r:
        cache_key = f"price:{req.product_id}"
        cached = r.get(cache_key)
        if cached:
            print(f"✅ Cache hit for {req.product_id}")
            return json.loads(cached)
    
    try:
        if USE_MOCK:
            print(f"🎭 MOCK: Scraping {req.url}")
            data = mock_scrape(req.url)
        else:
            # Real scraping (add when fixed)
            url_lower = req.url.lower()
            
            if any(d in url_lower for d in ["amazon", "amzn", "a.co"]):
                from scraper.amazon import scrape_amazon
                data = await scrape_amazon(req.url)
            elif "shein" in url_lower:
                from scraper.shein import scrape_shein
                data = await scrape_shein(req.url)
            elif "flipkart" in url_lower:
                from scraper.flipkart import scrape_flipkart
                data = await scrape_flipkart(req.url)
            elif "ebay" in url_lower:
                from scraper.ebay import scrape_ebay
                data = await scrape_ebay(req.url)
            else:
                raise HTTPException(400, "Unsupported platform")
        
        # Cache result
        if r:
            cache_key = f"price:{req.product_id}"
            r.setex(cache_key, 3600, json.dumps(data))
            print(f"✅ Cached: {req.product_id}")
        
        return data
        
    except Exception as e:
        print(f"❌ Scraping error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(500, f"Scraping failed: {str(e)}")

@app.post("/predict")
async def predict(req: PredictRequest):
    if len(req.price_history) < 7:
        return {
            "error": "Need at least 7 days of history for prediction",
            "current_count": len(req.price_history)
        }
    
    try:
        from ml.predict import predict_price_drop
        result = predict_price_drop(req.price_history)
        return result
    except ImportError:
        return {
            "error": "ML model not yet trained",
            "message": "Please train the model first"
        }
    except Exception as e:
        raise HTTPException(500, f"Prediction failed: {str(e)}")

@app.post("/notify")
async def notify(req: NotifyRequest):
    return {"sent": True, "message": "Email notifications not yet configured"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)