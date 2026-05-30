"""Tests for the health endpoint."""
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_returns_ok():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert data["service"] == "lumen-bi-api"
