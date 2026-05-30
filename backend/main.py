"""
Lumen BI — FastAPI entrypoint.
Run: uvicorn main:app --reload --port 8000
"""
from __future__ import annotations
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from middleware.timing import TimingMiddleware

load_dotenv()

from routers import upload, analyse, query, export

app = FastAPI(
    title="Lumen BI API",
    description="AI-powered business intelligence backend.",
    version="0.1.0",
)

allowed_origins = [
    o.strip()
    for o in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://localhost:3001",
    ).split(",")
    if o.strip()
]

app.add_middleware(TimingMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(analyse.router, prefix="/api", tags=["analyse"])
app.include_router(query.router, prefix="/api", tags=["query"])
app.include_router(export.router, prefix="/api", tags=["export"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "lumen-bi-api", "version": "0.1.1"}


@app.get("/")
def root():
    return {
        "service": "Lumen BI",
        "version": "0.1.0",
        "docs": "/docs",
    }
