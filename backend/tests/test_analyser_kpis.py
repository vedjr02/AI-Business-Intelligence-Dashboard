"""Tests for KPI computation."""
import pandas as pd

from models.schemas import ColumnSchema
from services.analyser import compute_kpis


def test_compute_kpis_includes_row_count():
    df = pd.DataFrame({"sales": [10, 20, 30], "region": ["A", "B", "C"]})
    schema = [
        ColumnSchema(name="sales", dtype="numeric", sample_values=["10"]),
        ColumnSchema(name="region", dtype="text", sample_values=["A"]),
    ]
    kpis = compute_kpis(df, schema)
    labels = [k.label for k in kpis]
    assert "Records" in labels
    assert any("sales" in lbl.lower() for lbl in labels)
