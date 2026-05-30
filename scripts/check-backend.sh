#!/usr/bin/env bash
set -euo pipefail
ORIGIN="${BACKEND_URL:-http://127.0.0.1:8000}"
curl -sf "${ORIGIN%/}/health" | head -c 200
echo
