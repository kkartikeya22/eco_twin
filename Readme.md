<div align="center">

# 🌿 EcoTwin
### *Your Personal Carbon Footprint Workspace*

**Understand · Track · Reduce**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Gemini AI](https://img.shields.io/badge/Gemini_2.5_Flash-AI_Coach-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## 🎯 Problem Statement

> *Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.*

Most carbon footprint tools are either too abstract (country-level statistics) or too tedious (manual spreadsheet logging). EcoTwin bridges that gap — it meets people in their daily life by scanning the things they already do: buying groceries, paying electricity bills, eating meals, and commuting.

---

## ✨ What EcoTwin Does

EcoTwin is a full-stack web application that gives every user a **personal carbon workspace** built around three pillars:

| Pillar | How EcoTwin delivers it |
|---|---|
| **Understand** | Benchmark comparisons (your footprint vs India average, global average, and the 2030 Paris target), with category-level breakdowns |
| **Track** | AI-powered scanners for food, receipts, electricity bills, and travel — plus Google Timeline import for automatic trip logging |
| **Reduce** | Personalized, ranked reduction tips with estimated kg CO₂e savings per week, tied to the categories where *you* emit most |

---

## 🖼️ Feature Highlights

### 📊 Live Dashboard
The home screen shows your **today's footprint**, **weekly total vs. your personal goal**, a **benchmark bar chart**, and a **top personalised tip** — all loaded the moment you sign in, no extra clicks.

### 🎯 Insights & Goals
Set a weekly carbon reduction goal in kg CO₂e. The Insights page shows:
- **Week-over-week trend** — did your footprint go up or down vs. last week, and by how much?
- **Goal progress bar** — how much headroom you have left this week
- **Benchmark bars** — compare your daily average to 4 reference points
- **Ranked tips** — up to 4 personalised actions with estimated savings, ranked by your own highest-emitting categories

### 🤖 AI Scanners (Powered by Gemini 2.5 Flash)
| Scanner | What you do | What EcoTwin returns |
|---|---|---|
| **Food scanner** | Snap a photo of any meal | Dish name, CO₂e per ingredient, total, and lower-carbon swap suggestions |
| **Receipt scanner** | Upload a grocery receipt photo | Per-item CO₂e breakdown using OCR + Gemini analysis |
| **Electricity bill** | Upload a utility bill | Units (kWh), grid emission factor, monthly CO₂e |
| **Travel tracker** | Enter mode + distance, or upload a Google Timeline JSON | Per-trip CO₂e; timeline imports backdate to the actual trip day |

### 🤖 AI Climate Coach
After a day of logging, the coach reads your activity summary alongside your **weekly goal**, **streak**, and **week-to-date total** — then writes a warm, personalized ~120-word note with 3 concrete actions for tomorrow.

### 🏆 Gamification Layer
Every logged activity earns XP, builds streaks, and unlocks badges. The system runs entirely in the backend and updates the sidebar live after every scan.

| Badge | How to earn it |
|---|---|
| 🐾 First Step | Log your very first activity |
| 🔥 On a Roll | 3-day logging streak |
| 🔥 Week Warrior | 7-day logging streak |
| 🔥 Habit Builder | 30-day logging streak |
| 🪶 Light Footprint | Keep a day under 3 kg CO₂e |
| 🧭 Green Commuter | Log 5 low-carbon trips (walk / bike / bus / metro) |
| ✨ Full Toolkit | Use all four trackers at least once |
| 🎯 Goal Getter | Stay within your weekly carbon goal |
| 📉 Trend Setter | Cut your footprint by 10%+ vs. last week |

### 📅 Timeline Views
- **Daily timeline** — auto-loads today; shows total, category bar, and every entry with human-readable labels (e.g. "Car trip · 12.3 km")
- **Weekly timeline** — auto-loads the past 7 days; bar chart + goal progress in one view

---

## 🏗️ Architecture

```
ecotwin/
├── client/                  # React 18 + Vite + Tailwind CSS
│   └── src/
│       ├── pages/           # Dashboard, Insights, scanners, timelines, AI coach
│       ├── components/      # Layout, Sidebar, Gamification, Benchmarks, UI kit
│       ├── context/         # AuthContext (with updateUser for live XP sync)
│       ├── lib/             # categories.js, gamification.js (badges, formatters)
│       └── services/        # Axios API client
│
└── server/                  # Express 5 + MongoDB (Mongoose 8)
    ├── controllers/         # auth, dashboard, food, receipt, electricity, travel, coach, profile
    ├── models/              # User, CarbonEntry, DailySummary
    ├── routes/              # REST API routes
    └── services/
        ├── geminiService.js      # All Gemini prompts (food, receipt, bill, coach)
        ├── ocrService.js         # Tesseract OCR for receipt text extraction
        ├── gamificationService.js # XP, streaks, badge logic
        ├── activityService.js     # Ties daily summary + gamification together
        └── dailySummaryService.js # Per-day carbon aggregation
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Tailwind CSS 3, Vite 5 |
| Backend | Node.js 22, Express 5, ES Modules |
| Database | MongoDB Atlas via Mongoose 8 |
| AI | Google Gemini 2.5 Flash (food analysis, receipt parsing, bill reading, coaching) |
| OCR | Tesseract.js (receipt text extraction before Gemini analysis) |
| Storage | Cloudinary (uploaded images) |
| Auth | JWT (bcryptjs + jsonwebtoken) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- A MongoDB Atlas cluster (free tier works)
- A Google Gemini API key ([get one free](https://aistudio.google.com/app/apikey))
- A Cloudinary account ([free tier](https://cloudinary.com))

### 1. Clone & install

```bash
git clone <your-repo-url>
cd ecotwin

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure environment variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/ecotwin

JWT_SECRET=your_jwt_secret_here

GEMINI_API_KEY=your_gemini_api_key_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Run locally

```bash
# Terminal 1 — start the API server
cd server && npm run dev

# Terminal 2 — start the React dev server
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — register an account and start scanning.

---

## 🌐 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Log in, receive JWT |
| `GET` | `/api/profile` | Fetch current user (level, badges, streak, goal) |
| `PUT` | `/api/profile/goal` | Update weekly carbon goal |
| `GET` | `/api/dashboard/daily?date=YYYY-MM-DD` | Daily summary + entries |
| `GET` | `/api/dashboard/weekly` | Last 7 days of daily totals |
| `GET` | `/api/dashboard/insights` | Full insights payload (goal, benchmarks, tips, gamification) |
| `POST` | `/api/food/scan` | Analyse a meal photo |
| `POST` | `/api/receipts/scan` | OCR + analyse a receipt image |
| `POST` | `/api/electricity/scan` | Analyse an electricity bill image |
| `POST` | `/api/travel/manual` | Log a single trip manually |
| `POST` | `/api/travel/timeline` | Import a Google Timeline JSON |
| `POST` | `/api/coach/getCoachMessage` | Generate an AI coaching note |

All protected endpoints require `Authorization: Bearer <token>`.

---

## 🧠 How the AI Works

### Scanners
Each scanner sends the image buffer (base64) directly to `gemini-2.5-flash` with a structured prompt that requests a specific JSON schema. For receipts, Tesseract.js first extracts the text (OCR), then that text goes to Gemini for semantic analysis — which is more reliable than sending the image alone for text-heavy documents.

### Coach
The coach fetches the user's daily summary, then calls Gemini with:
- Today's breakdown by category
- The user's weekly goal and progress so far
- Their current logging streak

This makes the advice genuinely personal: a user who is close to their weekly goal gets encouragement to hold on, while one who is 3× over gets targeted, achievable suggestions.

### Personalized tips
The `RECOMMENDATIONS` map in `constants.js` stores 3 tips per category with a `savingPercent` (rough fraction of that category's weekly total that could be saved). The `getInsights` endpoint ranks categories by current week's emissions, then surfaces the top 2 tips per top category — so a user who drives a lot sees travel tips first, while a user who eats a lot of red meat sees food tips first.

---

## 📐 Carbon Emission Factors

| Source | Factor |
|---|---|
| Car | 0.21 kg CO₂e / km |
| Bus | 0.089 kg CO₂e / km |
| Metro | 0.041 kg CO₂e / km |
| Bike | 0.021 kg CO₂e / km |
| Walk | 0 |
| Flight | 0.255 kg CO₂e / km |
| India electricity grid | 0.82 kg CO₂e / kWh |

Reference benchmarks used for context (approximate per-person per-day figures):

| Reference | kg CO₂e / day |
|---|---|
| Global average | 12.9 |
| India average | 5.2 |
| 2030 Paris-aligned target | 6.3 |

---

## 🔮 What Could Come Next

- **Push notifications** — daily nudges when you haven't logged yet
- **Household mode** — share a workspace across family members
- **Offset marketplace** — link verified offset projects to specific activities
- **Export / sharing** — download a monthly PDF report or share a progress card
- **Richer travel** — live public transport API integration to auto-detect routes

---

<div align="center">

*"The best time to start tracking your carbon footprint was ten years ago. The second best time is today."*

**🌱 EcoTwin — making climate action personal, measurable, and rewarding.**

</div>
