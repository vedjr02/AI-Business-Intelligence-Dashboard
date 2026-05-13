"""POST /api/query — streaming AI Q&A grounded in the dataset."""
from __future__ import annotations
import asyncio

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from models.schemas import QueryRequest
from services import storage
from services.ai_service import stream_query

router = APIRouter()


@router.post("/query")
async def query(req: QueryRequest):
    payload = storage.load_analysis(req.dataset_id)
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

    async def event_generator():
        try:
            async for chunk in stream_query(req.question, context):
                yield chunk
                # Tiny breath so the network actually flushes per chunk.
                await asyncio.sleep(0)
        except Exception as exc:  # noqa: BLE001
            yield f"\n[error] {exc}"

    return StreamingResponse(event_generator(), media_type="text/plain; charset=utf-8")
