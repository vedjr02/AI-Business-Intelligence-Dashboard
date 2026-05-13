"""Smoke tests for CSV parsing."""
from services.parser import parse_dataframe


def test_parse_simple_csv():
    raw = b"Order ID,Sales,Region\nA1,100.5,East\nA2,200,West\n"
    df, schema = parse_dataframe(raw, "orders.csv")
    assert len(df) == 2
    assert len(schema) == 3
    names = {c.name for c in schema}
    assert names == {"Order ID", "Sales", "Region"}


def test_parse_semicolon_delimiter():
    raw = "a;b;c\n1;2;3\n".encode()
    df, schema = parse_dataframe(raw, "semi.csv")
    assert len(df) == 1
    assert list(df.columns) == ["a", "b", "c"]
