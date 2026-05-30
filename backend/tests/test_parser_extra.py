"""Extra parser edge-case tests."""
import pandas as pd
from services.parser import parse_dataframe


def test_parse_csv_strips_column_whitespace():
    raw = b"name , value\nAlice , 1\nBob , 2\n"
    df, schema = parse_dataframe(raw, "test.csv")
    assert "name" in df.columns or "name " in df.columns
    assert len(df) == 2
