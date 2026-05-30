# Deploying the API

## Render (free tier)

- Root directory: `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Set `ALLOWED_ORIGINS` to your Vercel URL
