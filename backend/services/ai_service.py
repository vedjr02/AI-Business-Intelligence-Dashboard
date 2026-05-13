"""Claude integration — streaming Q&A grounded in the user's data."""
from __future__ import annotations
import json
import os
from typing import AsyncGenerator, Dict, Any, List

try:
    import anthropic  # type: ignore
except ImportError:  # pragma: no cover
    anthropic = None  # type: ignore


SYSTEM_PROMPT_TEMPLATE = """\
You are Lumen — a senior business analyst AI embedded inside a BI dashboard.
You have full access to the user's dataset metadata, computed KPIs, and a
sample of rows. Use them to answer the user's question.

DATASET METADATA
----------------
Filename: {filename}
Rows: {row_count}
Columns: {column_count}

SCHEMA
------
{schema}

KEY METRICS (already computed)
------------------------------
{kpis}

SAMPLE ROWS (first 20 rows)
---------------------------
{sample}

ANOMALIES DETECTED
------------------
{anomalies}

RULES
-----
- Be direct, sharp, and specific. Cite numbers from the data.
- If you notice a trend or anomaly the user didn't ask about, surface it briefly.
- Format numbers nicely (e.g., $1.2M, 12.4%, 9,994).
- Keep answers under 150 words unless the user asks for more.
- Never make up data that isn't in the dataset.
- If the question is outside the dataset's scope, say so politely.
"""


def _build_system_prompt(context: Dict[str, Any]) -> str:
    return SYSTEM_PROMPT_TEMPLATE.format(
        filename=context.get("filename", ""),
        row_count=context.get("row_count", 0),
        column_count=context.get("column_count", 0),
        schema=json.dumps(context.get("schema", []), indent=2)[:6000],
        kpis=json.dumps(context.get("kpis", []), indent=2)[:2000],
        sample=json.dumps(context.get("sample", []), indent=2)[:6000],
        anomalies=json.dumps(context.get("anomalies", []), indent=2)[:2000],
    )


async def stream_query(
    question: str, context: Dict[str, Any]
) -> AsyncGenerator[str, None]:
    """Yield response chunks token by token."""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key or anthropic is None:
        # Graceful fallback so the API still streams something useful in dev.
        msg = (
            "AI is offline — set ANTHROPIC_API_KEY to enable Claude. "
            f"In the meantime: your dataset has {context.get('row_count', 0)} rows "
            f"and {context.get('column_count', 0)} columns. "
            f"Your question was: '{question}'."
        )
        for token in msg.split(" "):
            yield token + " "
        return

    client = anthropic.Anthropic(api_key=api_key)
    system_prompt = _build_system_prompt(context)

    with client.messages.stream(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": question}],
    ) as stream:
        for text in stream.text_stream:
            yield text


def generate_summary(context: Dict[str, Any]) -> str:
    """
    Non-streaming executive summary used by the PDF export endpoint.
    Falls back to a deterministic local summary if Claude is unavailable.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key or anthropic is None:
        return (
            f"This dataset contains {context.get('row_count', 0)} rows "
            f"across {context.get('column_count', 0)} columns. "
            f"{len(context.get('anomalies', []))} statistical anomalies were "
            "detected. Configure ANTHROPIC_API_KEY for richer AI summaries."
        )

    client = anthropic.Anthropic(api_key=api_key)
    system_prompt = _build_system_prompt(context)
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=400,
        system=system_prompt,
        messages=[
            {
                "role": "user",
                "content": (
                    "Write a 3-sentence executive summary of this dataset for "
                    "a busy CEO. Focus on what's important, not what's there."
                ),
            }
        ],
    )
    # Extract text content
    parts: List[str] = []
    for block in response.content:
        text = getattr(block, "text", None)
        if text:
            parts.append(text)
    return "\n".join(parts).strip() or "Summary unavailable."
