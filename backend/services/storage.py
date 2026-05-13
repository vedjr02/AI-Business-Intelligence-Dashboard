"""
Tiny storage abstraction: write to Supabase if configured, otherwise to a
local folder. Keeps the rest of the codebase agnostic.
"""
from __future__ import annotations
import json
import os
from pathlib import Path
from typing import Any, Dict, Optional


def _local_dir() -> Path:
    p = Path(os.getenv("LOCAL_STORAGE_DIR", "./storage")).resolve()
    p.mkdir(parents=True, exist_ok=True)
    return p


def save_dataset_file(dataset_id: str, filename: str, content: bytes) -> str:
    """Persist the raw upload. Returns a storage path / key."""
    safe = filename.replace("/", "_").replace("\\", "_")
    target = _local_dir() / f"{dataset_id}__{safe}"
    target.write_bytes(content)
    return str(target)


def save_analysis(dataset_id: str, payload: Dict[str, Any]) -> None:
    target = _local_dir() / f"{dataset_id}.json"
    target.write_text(json.dumps(payload, default=str))


def load_analysis(dataset_id: str) -> Optional[Dict[str, Any]]:
    target = _local_dir() / f"{dataset_id}.json"
    if not target.exists():
        return None
    return json.loads(target.read_text())


def load_raw_file(dataset_id: str) -> Optional[bytes]:
    for p in _local_dir().glob(f"{dataset_id}__*"):
        return p.read_bytes()
    return None
