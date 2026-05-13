"""POST /api/export/{id} — return an AI-written executive summary string."""
from fastapi import APIRouter, HTTPException

from services import storage
from services.ai_service import generate_summary

router = APIRouter()


@router.post("/export/{dataset_id}/summary")
def export_summary(dataset_id: str):
    payload = storage.load_analysis(dataset_id)
    if not payload:
        raise HTTPException(404, detail="Dataset not found")
    context = {
        "filename": payload["meta"]["filename"],
        "row_count": payload["meta"]["row_count"],
        "column_count": payload["meta"]["column_count"],
        "schema": payload.get("schema", []),
        "kpis": payload.get("kpis", []),
        "anomalies": payload.get("anomalies", []),
        "sample": payload.get("preview_rows", []),
    }
    return {"summary": generate_summary(context)}
