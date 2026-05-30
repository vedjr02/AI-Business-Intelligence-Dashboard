"""Dataset summary statistics."""
from __future__ import annotations
import pandas as pd
from models.schemas import ColumnSchema


def column_null_rates(df: pd.DataFrame, schema: list[ColumnSchema]) -> dict[str, float]:
    rates: dict[str, float] = {}
    n = max(len(df), 1)
    for col in schema:
        rates[col.name] = float(df[col.name].isna().sum()) / n
    return rates
