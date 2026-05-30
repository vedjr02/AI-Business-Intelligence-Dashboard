"""POST /api/upload — accept a CSV/XLSX, analyse it, persist the result."""
from __future__ import annotations
import os
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from models.schemas import AnalysisResult, DatasetMeta
from services import storage
from services.parser import parse_dataframe, SUPPORTED_EXTS
from services.analyser import (
    compute_kpis,
    compute_charts,
    detect_anomalies,
    suggested_questions,
)

router = APIRouter()

MAX_BYTES = int(os.getenv("MAX_FILE_SIZE_MB", "50")) * 1024 * 1024


@router.post("/upload")
async def upload(file: UploadFile = File(...)) -> JSONResponse:
    if not file.filename:
        raise HTTPException(400, detail="Missing filename.")
    safe_name = os.path.basename(file.filename)
    if not file.filename.lower().endswith(SUPPORTED_EXTS):
        raise HTTPException(
            415, detail=f"Unsupported file type. Allowed: {', '.join(SUPPORTED_EXTS)}"
        )

    content = await file.read()
    if len(content) > MAX_BYTES:
        raise HTTPException(
            413, detail=f"File too large. Max {MAX_BYTES // 1024 // 1024}MB."
        )

    try:
        df, schema = parse_dataframe(content, file.filename)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(422, detail=f"Could not parse file: {exc}") from exc

    dataset_id = str(uuid.uuid4())

    kpis = compute_kpis(df, schema)
    charts = compute_charts(df, schema)
    anomalies = detect_anomalies(df, schema)
    questions = suggested_questions(df, schema)

    # Preview rows — first 10, JSON-safe
    preview = df.head(10).copy()
    for col in preview.columns:
        if str(preview[col].dtype).startswith("datetime"):
            preview[col] = preview[col].dt.strftime("%Y-%m-%d")
    preview_rows = preview.where(preview.notna(), None).to_dict(orient="records")

    meta = DatasetMeta(
        id=dataset_id,
        filename=safe_name,
        row_count=int(len(df)),
        column_count=int(len(df.columns)),
        uploaded_at=datetime.now(timezone.utc).isoformat(),
    )

    payload = AnalysisResult(
        meta=meta,
        kpis=kpis,
        charts=charts,
        anomalies=anomalies,
        suggested_questions=questions,
        preview_rows=preview_rows,
        columns=schema,
    ).model_dump(by_alias=True)

    # Persist raw file + analysis
    storage.save_dataset_file(dataset_id, safe_name, content)
    storage.save_analysis(dataset_id, payload)

    return JSONResponse(payload)
