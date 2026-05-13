"""Pydantic models — mirror the TypeScript types in frontend/types/index.ts."""
from __future__ import annotations
from typing import Any, List, Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

DType = Literal["numeric", "date", "text", "boolean"]
KPIFormat = Literal["number", "currency", "percent"]
Severity = Literal["high", "medium"]


class ColumnSchema(BaseModel):
    name: str
    dtype: DType
    sample_values: List[str] = Field(default_factory=list)
    null_count: int = 0


class KPI(BaseModel):
    label: str
    value: float
    delta: Optional[float] = None
    format: KPIFormat = "number"
    currency: Optional[str] = None
    hint: Optional[str] = None


class TrendPoint(BaseModel):
    label: str
    value: float
    comparison: Optional[float] = None


class BarDatum(BaseModel):
    label: str
    value: float


class Anomaly(BaseModel):
    column: str
    value: Any
    row_index: int
    severity: Severity
    expected_min: Optional[float] = None
    expected_max: Optional[float] = None


class DatasetMeta(BaseModel):
    id: str
    filename: str
    row_count: int
    column_count: int
    uploaded_at: str


class Charts(BaseModel):
    trend: Optional[dict] = None  # { "title": str, "points": [TrendPoint] }
    bar: Optional[dict] = None    # { "title": str, "data": [BarDatum] }


class AnalysisResult(BaseModel):
    # Allow the API field name "schema" without colliding with BaseModel internals.
    model_config = ConfigDict(populate_by_name=True)

    meta: DatasetMeta
    kpis: List[KPI]
    charts: Charts
    anomalies: List[Anomaly]
    suggested_questions: List[str]
    preview_rows: List[dict]
    columns: List[ColumnSchema] = Field(
        default_factory=list, alias="schema", serialization_alias="schema"
    )


class QueryRequest(BaseModel):
    dataset_id: str
    question: str
