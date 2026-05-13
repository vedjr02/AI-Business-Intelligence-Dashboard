"""GET /api/analyse/{id} — return previously computed analysis."""
from fastapi import APIRouter, HTTPException

from services import storage

router = APIRouter()


@router.get("/analyse/{dataset_id}")
def get_analysis(dataset_id: str):
    payload = storage.load_analysis(dataset_id)
    if not payload:
        raise HTTPException(404, detail="Dataset not found")
    return payload
