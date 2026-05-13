# Lumen — AI Business Intelligence Dashboard

Turn any CSV or Excel file into a beautiful, AI-powered analytics dashboard
in seconds. Auto-generated KPIs, gradient-rich charts, statistical anomaly
detection, and a natural-language Q&A interface powered by Claude.

![Status](https://img.shields.io/badge/status-MVP-blueviolet)
![Frontend](https://img.shields.io/badge/frontend-Next.js%2016-black)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)


## ✨ What it does

- **Drop a file** — CSV / XLSX, up to 50MB
- **Auto KPIs** — Revenue, growth, averages, completeness
- **Smart charts** — Time-series trend + top-N bar with gradient fills
- **Anomaly detection** — IQR-based outlier flagging with severity
- **Ask anything** — Stream Claude answers grounded in your data
- **Export PDF** — Polished report with AI executive summary

## 🎨 Design DNA

A 2026-modern, gradient-led, glass-layered aesthetic:
- Animated aurora mesh-gradient background
- Heavy glassmorphism on every floating surface
- Gradient typography for headlines
- Spring-physics motion (Framer Motion)
- Cursor-following spotlight on interactive cards
- Dark mode as the primary mode

## 🚀 Quick start

```bash
# 1. Backend
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your ANTHROPIC_API_KEY
uvicorn main:app --reload --port 8000

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open <http://localhost:3000>.

## 📂 Structure

```
.
├── frontend/    # Next.js 16, Tailwind 4, Framer Motion, Recharts
├── backend/     # FastAPI, Pandas, Anthropic Claude
└── PROJECT_GUIDE.md
```

See `PROJECT_GUIDE.md` for the full design + architecture brief.

## 🔌 API

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/upload` | Upload + analyse a file, returns full `AnalysisResult` |
| GET  | `/api/analyse/{id}` | Reload a previously computed analysis |
| POST | `/api/query` | Streaming AI Q&A grounded in the dataset |
| POST | `/api/export/{id}/summary` | AI-written executive summary for PDF |

## 🧪 Try without a backend

The frontend ships with a local mock data layer, so you can preview the
entire UX (upload → dashboard → AI streaming) without running FastAPI or
configuring an API key. Simply leave `NEXT_PUBLIC_API_URL` blank in
`frontend/.env.local`.

## 📦 Tech stack

| Layer | Tech |
|---|---|
| UI Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Motion | Framer Motion 12 |
| Charts | Recharts 3 |
| Backend | FastAPI |
| Data | Pandas + NumPy |
| AI | Anthropic Claude Sonnet 4 |
| Storage | Local FS (Supabase ready) |
| PDF | jsPDF + html2canvas |

## 📜 License

MIT
