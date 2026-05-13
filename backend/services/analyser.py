"""KPIs, chart series, and statistical anomaly detection."""
from __future__ import annotations
from typing import List, Optional, Tuple
import math

import numpy as np
import pandas as pd

from models.schemas import (
    Anomaly,
    BarDatum,
    Charts,
    ColumnSchema,
    KPI,
    TrendPoint,
)


# ────────────────────────────────────────────────────────────────────────────
# Helpers
# ────────────────────────────────────────────────────────────────────────────

def _safe_float(x) -> Optional[float]:
    try:
        f = float(x)
        if math.isnan(f) or math.isinf(f):
            return None
        return f
    except (TypeError, ValueError):
        return None


def _detect_currency_column(df: pd.DataFrame, schema: List[ColumnSchema]) -> Optional[str]:
    """Heuristic: column named like 'sales', 'revenue', 'amount', 'price'."""
    keywords = ("sales", "revenue", "amount", "total", "price", "value", "cost")
    for col in schema:
        if col.dtype != "numeric":
            continue
        if any(k in col.name.lower() for k in keywords):
            return col.name
    # Fallback: first numeric column
    for col in schema:
        if col.dtype == "numeric":
            return col.name
    return None


def _detect_date_column(schema: List[ColumnSchema]) -> Optional[str]:
    for col in schema:
        if col.dtype == "date":
            return col.name
    return None


def _detect_category_column(schema: List[ColumnSchema]) -> Optional[str]:
    """Pick a low-cardinality text column."""
    candidates = [c for c in schema if c.dtype == "text"]
    return candidates[0].name if candidates else None


# ────────────────────────────────────────────────────────────────────────────
# KPIs
# ────────────────────────────────────────────────────────────────────────────

def compute_kpis(df: pd.DataFrame, schema: List[ColumnSchema]) -> List[KPI]:
    kpis: List[KPI] = []

    numeric_cols = [c for c in schema if c.dtype == "numeric"]
    money_col = _detect_currency_column(df, schema)

    # Total revenue (or sum of best numeric column)
    if money_col is not None:
        total = _safe_float(df[money_col].sum()) or 0.0
        delta = _delta_vs_prior_period(df, money_col, schema)
        kpis.append(
            KPI(
                label=f"Total {money_col}",
                value=total,
                delta=delta,
                format="currency",
                currency="USD",
                hint=f"Sum of {money_col}",
            )
        )

    # Row count
    kpis.append(
        KPI(
            label="Records",
            value=float(len(df)),
            delta=None,
            format="number",
            hint="Total rows analysed",
        )
    )

    # Average value (best numeric col)
    if money_col is not None:
        avg = _safe_float(df[money_col].mean()) or 0.0
        kpis.append(
            KPI(
                label=f"Avg {money_col}",
                value=avg,
                delta=None,
                format="currency",
                currency="USD",
                hint=f"Mean of {money_col}",
            )
        )

    # Null percentage
    total_cells = df.size
    null_cells = int(df.isna().sum().sum())
    null_pct = null_cells / total_cells if total_cells else 0.0
    kpis.append(
        KPI(
            label="Data Completeness",
            value=1.0 - null_pct,
            delta=None,
            format="percent",
            hint=f"{null_cells:,} missing values",
        )
    )

    # Cap at 4 KPIs for the grid
    return kpis[:4]


def _delta_vs_prior_period(
    df: pd.DataFrame, value_col: str, schema: List[ColumnSchema]
) -> Optional[float]:
    """If a date column exists, split data in half by time and compute delta."""
    date_col = _detect_date_column(schema)
    if date_col is None:
        return None
    try:
        sub = df[[date_col, value_col]].dropna()
        if len(sub) < 4:
            return None
        sub = sub.sort_values(date_col)
        mid = len(sub) // 2
        prior = sub.iloc[:mid][value_col].sum()
        current = sub.iloc[mid:][value_col].sum()
        if prior == 0:
            return None
        return float((current - prior) / abs(prior))
    except Exception:
        return None


# ────────────────────────────────────────────────────────────────────────────
# Charts
# ────────────────────────────────────────────────────────────────────────────

def compute_charts(df: pd.DataFrame, schema: List[ColumnSchema]) -> Charts:
    trend = _trend_chart(df, schema)
    bar = _bar_chart(df, schema)
    return Charts(trend=trend, bar=bar)


def _trend_chart(df: pd.DataFrame, schema: List[ColumnSchema]) -> Optional[dict]:
    date_col = _detect_date_column(schema)
    value_col = _detect_currency_column(df, schema)
    if not date_col or not value_col:
        return None
    try:
        ts = (
            df[[date_col, value_col]]
            .dropna()
            .copy()
        )
        if len(ts) < 3:
            return None
        ts[date_col] = pd.to_datetime(ts[date_col], errors="coerce")
        ts = ts.dropna(subset=[date_col])
        # Aggregate by month
        grouped = (
            ts.groupby(pd.Grouper(key=date_col, freq="MS"))[value_col]
            .sum()
            .reset_index()
            .tail(12)
        )
        if grouped.empty:
            return None
        points = [
            TrendPoint(
                label=row[date_col].strftime("%b"),
                value=_safe_float(row[value_col]) or 0.0,
            ).model_dump()
            for _, row in grouped.iterrows()
        ]
        return {"title": f"{value_col} over time", "points": points}
    except Exception:
        return None


def _bar_chart(df: pd.DataFrame, schema: List[ColumnSchema]) -> Optional[dict]:
    cat_col = _detect_category_column(schema)
    val_col = _detect_currency_column(df, schema)
    if not cat_col:
        return None
    try:
        if val_col:
            grouped = df.groupby(cat_col)[val_col].sum().sort_values(ascending=False).head(5)
        else:
            grouped = df[cat_col].value_counts().head(5)
        data = [
            BarDatum(label=str(idx), value=_safe_float(v) or 0.0).model_dump()
            for idx, v in grouped.items()
        ]
        title = (
            f"Top {cat_col} by {val_col}" if val_col else f"Top {cat_col} (count)"
        )
        return {"title": title, "data": data}
    except Exception:
        return None


# ────────────────────────────────────────────────────────────────────────────
# Anomalies (IQR-based)
# ────────────────────────────────────────────────────────────────────────────

def detect_anomalies(df: pd.DataFrame, schema: List[ColumnSchema]) -> List[Anomaly]:
    anomalies: List[Anomaly] = []
    numeric_cols = [c.name for c in schema if c.dtype == "numeric"]
    for col in numeric_cols:
        series = df[col].dropna()
        if len(series) < 8:
            continue
        q1, q3 = series.quantile(0.25), series.quantile(0.75)
        iqr = q3 - q1
        if iqr == 0:
            continue
        lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
        outliers = df[(df[col] < lo) | (df[col] > hi)]
        # Cap to 5 per column to avoid overwhelming the UI
        for ri, val in outliers[col].head(5).items():
            dist = max(abs(val - lo), abs(val - hi))
            severity = "high" if dist > 3 * iqr else "medium"
            anomalies.append(
                Anomaly(
                    column=col,
                    value=_safe_float(val),
                    row_index=int(ri),
                    severity=severity,
                    expected_min=_safe_float(lo),
                    expected_max=_safe_float(hi),
                )
            )
    # Cap total anomalies for sanity
    return anomalies[:10]


# ────────────────────────────────────────────────────────────────────────────
# Suggested questions (derived from schema)
# ────────────────────────────────────────────────────────────────────────────

def suggested_questions(
    df: pd.DataFrame, schema: List[ColumnSchema]
) -> List[str]:
    money_col = _detect_currency_column(df, schema)
    date_col = _detect_date_column(schema)
    cat_col = _detect_category_column(schema)

    qs: List[str] = []
    if money_col and date_col:
        qs.append(f"How did {money_col} trend over time?")
    if money_col and cat_col:
        qs.append(f"Which {cat_col.lower()} drives the most {money_col.lower()}?")
    if money_col:
        qs.append(f"Are there any unusual {money_col.lower()} values?")
    qs.append("What's the most important insight in this data?")
    qs.append("Summarise the dataset in three bullet points.")
    return qs[:5]
