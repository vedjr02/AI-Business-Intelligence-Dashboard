"""CSV / XLSX → typed pandas DataFrame + schema."""
from __future__ import annotations
from io import BytesIO
from typing import List, Tuple
import csv
import re

import numpy as np
import pandas as pd

from models.schemas import ColumnSchema, DType


SUPPORTED_EXTS = (".csv", ".xlsx", ".xls")
CURRENCY_RE = re.compile(r"[\$£€¥₹]|,")


def _detect_delimiter(sample: str) -> str:
    """Sniff the most likely CSV delimiter."""
    try:
        dialect = csv.Sniffer().sniff(sample, delimiters=",;\t|")
        return dialect.delimiter
    except csv.Error:
        return ","


def _maybe_numeric(series: pd.Series) -> pd.Series:
    """Try to coerce stringy currency / numeric columns to numbers."""
    if pd.api.types.is_numeric_dtype(series):
        return series
    if series.dtype != object:
        return series
    cleaned = series.astype(str).str.replace(CURRENCY_RE, "", regex=True).str.strip()
    coerced = pd.to_numeric(cleaned, errors="coerce")
    if coerced.notna().sum() / max(len(coerced), 1) > 0.8:
        return coerced
    return series


def _maybe_datetime(series: pd.Series) -> pd.Series:
    """Try to parse a column as dates — only commit if >80% parse cleanly."""
    if pd.api.types.is_datetime64_any_dtype(series):
        return series
    if series.dtype != object:
        return series
    parsed = pd.to_datetime(series, errors="coerce", format="mixed")
    if parsed.notna().sum() / max(len(parsed), 1) > 0.8:
        return parsed
    return series


def _infer_dtype(series: pd.Series) -> DType:
    if pd.api.types.is_bool_dtype(series):
        return "boolean"
    if pd.api.types.is_numeric_dtype(series):
        return "numeric"
    if pd.api.types.is_datetime64_any_dtype(series):
        return "date"
    return "text"


def parse_dataframe(content: bytes, filename: str) -> Tuple[pd.DataFrame, List[ColumnSchema]]:
    """
    Parse CSV/Excel content into a typed DataFrame and a column schema.
    Auto-detects delimiter, dates, and numeric/currency columns.
    """
    lower = filename.lower()
    if lower.endswith(".csv"):
        sample = content[:4096].decode("utf-8", errors="ignore")
        sep = _detect_delimiter(sample)
        df = pd.read_csv(BytesIO(content), sep=sep, low_memory=False)
    elif lower.endswith((".xlsx", ".xls")):
        df = pd.read_excel(BytesIO(content), engine="openpyxl")
    else:
        raise ValueError(f"Unsupported file type. Use one of: {SUPPORTED_EXTS}")

    # Strip whitespace from column names
    df.columns = [str(c).strip() for c in df.columns]

    # Coerce types
    for col in df.columns:
        df[col] = _maybe_numeric(df[col])
    for col in df.columns:
        if df[col].dtype == object:
            df[col] = _maybe_datetime(df[col])

    # Build schema
    schema: List[ColumnSchema] = []
    for col in df.columns:
        dtype = _infer_dtype(df[col])
        sample_values = (
            df[col]
            .dropna()
            .head(5)
            .astype(str)
            .tolist()
        )
        schema.append(
            ColumnSchema(
                name=col,
                dtype=dtype,
                sample_values=sample_values,
                null_count=int(df[col].isna().sum()),
            )
        )

    return df, schema
