#!/usr/bin/env bash
# Deploy the Next.js app from frontend/ (correct root for this monorepo).
# Usage:
#   npx vercel login          # once per machine
#   ./scripts/vercel-deploy.sh        # preview
#   ./scripts/vercel-deploy.sh --prod # production
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/frontend"
exec npx vercel "$@"
