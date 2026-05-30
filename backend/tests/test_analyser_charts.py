"""Tests for chart generation."""
import pandas as pd

from models.schemas import ColumnSchema
from services.analyser import compute_charts


def test_bar_chart_from_category():
    df = pd.DataFrame({"category": ["A", "A", "B"], "amount": [10, 20, 5]})
    schema = [
        ColumnSchema(name="category", dtype="text", sample_values=["A"]),
        ColumnSchema(name="amount", dtype="numeric", sample_values=["10"]),
    ]
    charts = compute_charts(df, schema)
    assert charts.bar is not None
    assert len(charts.bar["data"]) >= 1
