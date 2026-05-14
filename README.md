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

The browser talks to **same-origin** `/api/bi/*` (Next.js Route Handlers), which forward to FastAPI — no CORS issues when you deploy the frontend and API on different hosts.

**`frontend/.env.local`**

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Upstream FastAPI URL (read on the **server** by the proxy). Example: `http://127.0.0.1:8000` |
| `BACKEND_URL` | Optional server-only override (e.g. Railway URL on Vercel). Takes precedence over `NEXT_PUBLIC_API_URL` |
| `NEXT_PUBLIC_BI_USE_PROXY` | Set to `1` to enable the proxy when you only set `BACKEND_URL` |

See `frontend/.env.example` for a template.

## ▲ Deploy on Vercel (monorepo)

**I (or any assistant) cannot log into your Vercel or GitHub account** — only you can finish the link in the browser. The steps below take about two minutes.

This repo’s Next.js app lives in **`frontend/`**. If Vercel builds from the repository root, you can get **`404: NOT_FOUND`** and a suspiciously fast build (e.g. a few ms) because there is no Next app at the repo root.

### GitHub → Vercel (recommended)

1. **Vercel → Add New → Project** → import **`vedjr02/AI-Business-Intelligence-Dashboard`**.
2. Before deploying, open **Configure Project** → **Root Directory** → **Edit** → set to **`frontend`** → **Continue**.
3. **Environment Variables** (Production, optional until you host the API): **`BACKEND_URL`** = your FastAPI base URL (no trailing slash). The **home page works without it**; uploads / AI need the API or mocks.
4. **Deploy**.

To fix an existing project: **Settings → General → Root Directory** = **`frontend`** → **Redeploy**.

### CLI (deploy from `frontend/` without changing dashboard root)

```bash
chmod +x scripts/vercel-deploy.sh   # once
npx vercel login                     # once per machine
./scripts/vercel-deploy.sh           # preview
./scripts/vercel-deploy.sh --prod    # production
```

The Python API is **not** deployed by Vercel here — host it elsewhere (Railway, Render, Fly.io, etc.) and set **`BACKEND_URL`** on Vercel when ready.

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
