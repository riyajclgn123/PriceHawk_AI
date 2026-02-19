# 🛒 PriceHawk AI
### AI-Powered Price Tracking & 7-Day Forecasting Platform

PriceHawk is a full-stack AI-powered price intelligence system that tracks Amazon & Flipkart products, stores historical pricing data, predicts 7-day future price trends using machine learning, and notifies users when their target price is reached.

Unlike traditional price trackers, PriceHawk predicts future prices using engineered time-series features and Gradient Boosting regression.

---

## 🚀 Live Architecture Overview

Frontend (Next.js 15)  
↕ REST API  
Backend (FastAPI + ML Inference)  
↕  
Redis (Caching + Job Queue)  
↕  
PostgreSQL (Persistent Data Storage)

---

# ✨ Core Features

## 🔎 Product Tracking
- Paste Amazon or Flipkart product URL
- Playwright-based scraping for JS-rendered pages
- Automatic price normalization and storage
- Historical price recording

## 📊 Interactive Dashboard
- Real-time price history chart (Recharts)
- Lowest price tracking
- Trend visualization
- Product performance overview

## 🤖 AI Price Prediction
- 7-day future price prediction
- Drop percentage estimation
- High/Low confidence scoring
- Feature-engineered regression model

## 🔔 Smart Alerts
- Target price alerts
- Email notifications (Resend)
- Background worker price checks
- Redis-based job queue processing

## ⚡ Performance Optimization
- Redis caching (1-hour TTL)
- Background scraping every 6 hours
- Non-blocking API architecture
- Scalable microservices design

---

# 🧠 Machine Learning System

The ML pipeline uses:

- Day of week
- Day of month
- Week of year
- Rolling 3-day average
- Rolling 7-day average
- 1-day lag
- 7-day lag
- Price velocity (difference)
- Current price

Model:
- GradientBoostingRegressor (scikit-learn)
- StandardScaler preprocessing
- Mean Absolute Error evaluation
- Model serialized with joblib

Prediction Output:
- Current price
- Predicted 7-day price
- Drop percentage
- Confidence level

---

# 🏗 Tech Stack

## Frontend
- Next.js 15 (App Router)
- TypeScript
- Plain CSS
- Prisma ORM
- Axios
- Recharts
- ioredis

## Backend
- FastAPI
- Playwright
- scikit-learn
- pandas
- numpy
- RQ (Redis Queue)
- BeautifulSoup
- Resend Email API

## Database & Infrastructure
- PostgreSQL
- Redis
- Docker
- Neon (Production DB)
- Upstash (Production Redis)

---

# 📂 Project Structure

pricehawk-ai/
│
├── frontend/              # Next.js Application
│   ├── app/
│   ├── components/
│   ├── prisma/
│   └── lib/
│
├── backend/               # FastAPI + ML Service
│   ├── scraper/
│   ├── ml/
│   ├── jobs/
│   └── main.py
│
└── docker-compose.yml

---

# ⚙ Local Development Setup

## 1. Clone Repository

git clone https://github.com/yourusername/pricehawk-ai.git  
cd pricehawk-ai

---

## 2. Start Infrastructure

docker compose up -d

This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)

---

## 3. Setup Frontend

cd frontend  
npm install  
npx prisma migrate dev  
npm run dev  

Frontend runs at:
http://localhost:3000

---

## 4. Setup Backend

cd backend  
python -m venv venv  
source venv/bin/activate  
pip install -r requirements.txt  
uvicorn main:app --reload --port 8000  

Backend runs at:
http://localhost:8000

---

## 5. Start Background Worker

cd backend  
rq worker scraping  

---

# 🔐 Environment Variables

## Frontend (.env.local)

DATABASE_URL=  
REDIS_URL=  
FASTAPI_URL=  
NEXTAUTH_SECRET=  
RESEND_API_KEY=

## Backend (.env)

REDIS_URL=  
DATABASE_URL=  
RESEND_API_KEY=  
FROM_EMAIL=

---

# 🧩 System Design Highlights

- Microservices architecture (Next.js + FastAPI)
- REST-based communication
- Shared Redis instance
- Background job processing
- Feature-engineered ML pipeline
- Cache-first scraping logic
- Clean database normalization via Prisma

---

# 📈 Resume-Ready Summary

Built a full-stack AI-powered price intelligence platform using Next.js and FastAPI that scrapes e-commerce platforms and predicts 7-day price movements using a Gradient Boosting regression model. Designed a scalable microservices architecture with Redis caching, PostgreSQL persistence, and background job workers.

---

# 🚀 Deployment Strategy

Frontend → Vercel  
Backend → Railway / Render  
Database → Neon  
Redis → Upstash  

---

# 🔮 Future Improvements

- Browser extension for 1-click tracking
- Push notifications (VAPID)
- Cross-platform price comparison
- Public shareable price pages
- LLM-based price explanation engine
- PDF export reports
- Multi-region scraping support

---

# 👨‍💻 Author

Riyaj Chaulagain  
Computer Science Student  
Full-Stack & Machine Learning Developer  

---


