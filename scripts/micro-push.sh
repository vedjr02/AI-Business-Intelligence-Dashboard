#!/usr/bin/env bash
# Micro-commit helper: stage paths, commit, push.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
msg="$1"
shift
git add "$@"
git commit -m "$msg"
git push origin main
