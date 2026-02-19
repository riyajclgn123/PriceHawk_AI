🛒 PriceHawk AI
AI-Powered Price Tracking & Forecasting Platform

PriceHawk is a full-stack AI-powered price tracking application that scrapes Amazon & Flipkart product data, predicts future price movements using machine learning, and notifies users when their target price is reached.

Unlike traditional price trackers, PriceHawk predicts 7-day future price trends using a trained regression model.

🚀 Why This Project Stands Out

Real-world scraping using Playwright

ML-based price prediction (not just alerts)

Microservices architecture

Redis caching + background workers

Production-ready deployment design

This project demonstrates:

Full-stack engineering

ML model training & inference

System design

Distributed job processing

Real-world problem solving

🏗 Architecture

PriceHawk uses a microservices architecture:

🖥 Frontend

Next.js 15 (App Router)

TypeScript

Plain CSS

Prisma ORM

ioredis

⚙ Backend

FastAPI (Python)

Playwright (scraping)

scikit-learn (ML model)

RQ (Redis Queue)

Resend (email alerts)

🗄 Infrastructure

PostgreSQL

Redis

Docker

🧠 Machine Learning Model

The system trains a Gradient Boosting Regression model using:

Day of week

Day of month

Rolling 3-day average

Rolling 7-day average

Price lag features

Price velocity

It predicts:

Future 7-day average price

Price drop percentage

Drop confidence level

✨ Features
🔎 Product Tracking

Paste Amazon or Flipkart URL

Auto scrape product data

Store historical prices

📊 Interactive Dashboard

Price history chart

Lowest price tracking

Trend indicators

🤖 AI Price Prediction

7-day forecast

Drop likelihood

Confidence estimation

🔔 Smart Alerts

Email notifications

Target price triggers

Background worker checks

⚡ Performance Optimization

Redis caching (1-hour TTL)

Background scraping queue

Scalable job workers

📂 Folder Structure
pricehawk-ai/
│
├── frontend/         # Next.js 15 App Router
│   ├── app/
│   ├── components/
│   ├── prisma/
│   └── lib/
│
├── backend/          # FastAPI + ML
│   ├── scraper/
│   ├── ml/
│   ├── jobs/
│   └── main.py
│
└── docker-compose.yml

🛠 Tech Stack
Frontend

Next.js 15

TypeScript

Plain CSS

Prisma ORM

Axios

Recharts

Backend

FastAPI

Playwright

scikit-learn

pandas

numpy

RQ

Redis

Database

PostgreSQL

Infrastructure

Docker

Redis

Neon (production)

Upstash (production)

⚙ Installation Guide
1️⃣ Clone Repository
git clone https://github.com/yourusername/pricehawk-ai.git
cd pricehawk-ai

2️⃣ Start Infrastructure
docker compose up -d

3️⃣ Setup Frontend
cd frontend
npm install
npx prisma migrate dev
npm run dev


Runs at:

http://localhost:3000

4️⃣ Setup Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000


Runs at:

http://localhost:8000

5️⃣ Run Worker
rq worker scraping

🔐 Environment Variables
Frontend .env.local
DATABASE_URL=
REDIS_URL=
FASTAPI_URL=
NEXTAUTH_SECRET=
RESEND_API_KEY=

Backend .env
REDIS_URL=
DATABASE_URL=
RESEND_API_KEY=
FROM_EMAIL=

🚀 Deployment Strategy
Service	Platform
Frontend	Vercel
Backend	Railway / Render
Database	Neon
Redis	Upstash
📈 Resume-Ready Description

Built an AI-powered price tracking platform using Next.js and FastAPI that scrapes e-commerce websites and predicts 7-day price trends using Gradient Boosting regression. Designed a microservices architecture with Redis caching, background job processing, and PostgreSQL data persistence.

🧩 Future Improvements

Browser extension

Push notifications

Multi-platform comparison mode

LLM-based price explanation

Public shareable price pages

PDF export reports

🧑‍💻 Author

Riyaj Chaulagain
Computer Science Student
Full-Stack & ML Enthusiast
