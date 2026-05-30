"""Tests for stats helpers."""
import pandas as pd
from models.schemas import ColumnSchema
from services.stats import column_null_rates


def test_null_rates():
    df = pd.DataFrame({"a": [1, None], "b": ["x", "y"]})
    schema = [
        ColumnSchema(name="a", dtype="numeric"),
        ColumnSchema(name="b", dtype="text"),
    ]
    rates = column_null_rates(df, schema)
    assert rates["a"] == 0.5
    assert rates["b"] == 0.0
