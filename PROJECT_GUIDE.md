# Lumen — AI Business Intelligence Dashboard

> Original project brief preserved for reference. The implementation has
> elevated the visual direction: mesh gradients, glassmorphism, animated
> aurora background, gradient typography, and spring-physics motion.

---

## 0. Project Vision

A web application where any user can upload a CSV or Excel file and immediately get:
- Auto-generated KPI cards, trend charts, and bar charts
- AI-powered natural language Q&A ("Why did revenue drop in March?")
- Anomaly detection that flags outliers automatically
- A downloadable PDF report with an AI-written executive summary

**The bar**: It should look and feel like a premium 2026 product — smooth,
intentional, beautiful. Heavy on gradients, glass, motion. No clutter.

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Animation | Framer Motion 12 |
| Charts | Recharts 3 |
| Backend | Python + FastAPI |
| Data processing | Pandas + NumPy |
| AI / NL Query | Anthropic Claude (`claude-sonnet-4-20250514`) |
| Database / Storage | Local filesystem (Supabase-ready) |
| PDF Export | jsPDF + html2canvas |
| Auth | (Phase 2) Supabase Auth |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## 2. Folder Structure

```
AI-Business-Intelligence-Dashboard/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                       # Landing
│   │   └── dashboard/
│   │       ├── page.tsx                   # Redirect → /
│   │       └── [id]/page.tsx              # Main dashboard
│   ├── components/
│   │   ├── ui/                            # Button, Card, Badge, Spinner, Modal, Tooltip, Logo, ThemeToggle
│   │   ├── layout/                        # AuroraBackground
│   │   ├── providers/                     # ThemeProvider, ToastProvider
│   │   ├── upload/                        # DropZone, UploadProgress, SampleDatasetChip
│   │   ├── dashboard/                     # KPICard/Grid, TrendChart, BarChart, ChartCard/Grid, AnomalyBanner, DataTable, Topbar, Skeleton
│   │   ├── ai/                            # QueryBar, QueryResponse, SuggestedQuestions
│   │   └── export/                        # (PDF logic lives in useExport hook)
│   ├── hooks/                             # useCountUp, useAIQuery, useExport
│   ├── lib/                               # utils, api, mockData, datasetStore
│   ├── types/                             # index.ts (shared types)
│   ├── public/samples/                    # superstore.csv + future samples
│   └── app/globals.css                    # design tokens
│
├── backend/
│   ├── main.py                            # FastAPI app + CORS
│   ├── routers/                           # upload, analyse, query, export
│   ├── services/                          # parser, analyser, ai_service, storage
│   ├── models/schemas.py                  # Pydantic models
│   ├── storage/                           # local persistence
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

---

## 3. Design System

See `frontend/app/globals.css` for the canonical tokens. Highlights:

- **Aurora background** — animated blurred radial-gradient blobs (`.aurora`)
- **Glass tokens** — `.glass`, `.glass-strong`, `.glass-bar`
- **Gradient text** — `.text-gradient`, `.text-gradient-cool`
- **Spring motion** — uses Framer Motion springs (`stiffness: 380, damping: 32`)
- **Card hover** — spotlight cursor glow, subtle lift, no harsh shadows
- **Dark mode is default** (looks premium for BI tools); toggle persists in `localStorage`

---

## 4. API Contract (kept identical to brief §9)

### POST /api/upload
- `multipart/form-data { file }`
- Returns `AnalysisResult` (see `models/schemas.py` / `types/index.ts`)

### GET /api/analyse/{id}
- Returns previously computed `AnalysisResult`

### POST /api/query
- `{ dataset_id, question }`
- Streaming `text/plain` response (token-by-token)

### POST /api/export/{id}/summary
- Returns AI-written executive summary string

---

## 5. Environment Variables

### `backend/.env`
```
ANTHROPIC_API_KEY=
SUPABASE_URL=             # optional
SUPABASE_SERVICE_KEY=     # optional
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
MAX_FILE_SIZE_MB=50
LOCAL_STORAGE_DIR=./storage
```

### `frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 6. Run Locally

```bash
# Backend
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # then fill in ANTHROPIC_API_KEY
uvicorn main:app --reload --port 8000

# Frontend (in a separate terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 (or :3001).

---

## 7. CV-Ready Description

> **Lumen — AI Business Intelligence Dashboard.** Built a full-stack analytics
> platform that turns raw CSV/Excel data into actionable business insights.
> Auto-detected KPIs, interactive gradient charts, IQR-based anomaly detection,
> and a natural-language Q&A interface powered by Claude with streaming
> responses. Polished glassmorphism UI with mesh-gradient backgrounds,
> spring-physics motion, and a one-click PDF report. Stack: Next.js 16,
> FastAPI, Pandas, Anthropic Claude, Recharts, Framer Motion. Deployable to
> Vercel + Railway.
