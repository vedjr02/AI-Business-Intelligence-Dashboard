#!/usr/bin/env python3
"""Resume micro-commits: one file (or changelog line) per push."""
from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def run(cmd: list[str]) -> None:
    r = subprocess.run(cmd, cwd=ROOT, text=True, capture_output=True)
    if r.returncode != 0:
        raise RuntimeError((r.stderr or r.stdout) + f"\ncmd: {' '.join(cmd)}")


def commit(msg: str, *paths: str) -> None:
    run(["git", "add", *paths])
    run(["git", "commit", "-m", msg])
    run(["git", "push", "origin", "main"])
    print(f"OK: {msg}")


def append_changelog(line: str) -> None:
    cl = ROOT / "CHANGELOG.md"
    text = cl.read_text(encoding="utf-8")
    cl.write_text(text + f"- {line}\n", encoding="utf-8")


def main() -> None:
    file_commits = [
        ("feat(frontend): track uploads in recent index on save", ["frontend/lib/datasetStore.ts"]),
        ("feat(dashboard): show empty states when charts missing", ["frontend/components/dashboard/ChartGrid.tsx"]),
        ("feat(pwa): link manifest in layout metadata", ["frontend/app/layout.tsx"]),
        ("feat(landing): add footer and API status banner", ["frontend/app/page.tsx"]),
        ("feat(dashboard): add schema sidebar and upload meta", ["frontend/app/dashboard/[id]/page.tsx"]),
        ("feat(upload): show loading state on sample chips", ["frontend/components/upload/SampleDatasetChip.tsx"]),
        ("feat(backend): expand KPI grid with numeric column metric", ["backend/services/analyser.py"]),
        ("fix(backend): sanitize upload filenames", ["backend/routers/upload.py"]),
        ("feat(frontend): add checkApiHealth client helper", ["frontend/lib/api.ts"]),
        ("feat(dashboard): show upload date and copy dataset id", ["frontend/components/dashboard/DashboardTopbar.tsx"]),
        ("copy(404): improve not-found headline", ["frontend/app/not-found.tsx"]),
        ("docs: add hosting notes and changelog link in README", ["README.md"]),
        ("docs(backend): clarify ALLOWED_ORIGINS for production", ["backend/.env.example"]),
        ("feat(backend): add column null-rate stats helper", ["backend/services/stats.py"]),
        ("test(backend): add null-rate stats tests", ["backend/tests/test_stats.py"]),
        ("feat(frontend): add column type label helper", ["frontend/lib/columnIcons.ts"]),
        ("feat(a11y): add VisuallyHidden helper", ["frontend/components/ui/VisuallyHidden.tsx"]),
        ("feat(dashboard): add route-level loading skeleton", ["frontend/app/dashboard/loading.tsx"]),
        ("feat(app): add root loading fallback", ["frontend/app/loading.tsx"]),
        ("feat(scripts): add backend health check script", ["scripts/check-backend.sh"]),
        ("docs: add pull request template", [".github/PULL_REQUEST_TEMPLATE.md"]),
        ("chore(scripts): add micro-commit batch runners", ["scripts/run_micro_commits.py", "scripts/resume_micro_commits.py"]),
    ]

    changelog_lines = [
        "Wire recent-dataset tracking when saving analysis results.",
        "Show chart empty states when trend or bar data is unavailable.",
        "Link PWA manifest from Next.js root layout metadata.",
        "Add SiteFooter and live API status banner on landing page.",
        "Add schema panel, recent list, and KPI copy on dashboard.",
        "Disable sample chips while sample CSV is uploading.",
        "Add numeric-column KPI and allow five KPI cards in the grid.",
        "Sanitize uploaded filenames before persisting analysis.",
        "Add client-side checkApiHealth helper for BFF probe.",
        "Show upload date and copyable dataset ID in dashboard topbar.",
        "Improve 404 headline copy for clearer wayfinding.",
        "Document free Vercel + Render hosting stack in README.",
        "Clarify ALLOWED_ORIGINS env var for production CORS.",
        "Add column null-rate statistics helper on the backend.",
        "Add VisuallyHidden helper and column type label util.",
        "Add route-level loading skeletons for dashboard and app root.",
        "Add shell script to curl backend /health for ops checks.",
        "Add GitHub pull request template for contributors.",
        "Add batch scripts for incremental micro-commit workflow.",
        "Expose API version field on backend /health response.",
        "Add BFF /api/bi/health proxy route on the frontend.",
        "Add ApiStatusBanner to surface live API connectivity.",
        "Add RecentDatasets panel backed by sessionStorage index.",
        "Add KpiSummary row with copy-all KPIs action.",
        "Add UploadMeta relative timestamp under dashboard headline.",
        "Add SchemaPanel listing column names and detected types.",
        "Add ChartEmpty component for missing chart scenarios.",
        "Add useLocalStorage hook for lightweight client persistence.",
        "Add shared constants for upload limits and app branding.",
        "Add CONTRIBUTING and backend DEPLOY guides.",
        "Add backend timing middleware with X-Process-Time-Ms header.",
        "Add health, KPI, chart, parser, and stats backend tests.",
        "Add robots.txt, sitemap.ts, and web manifest for SEO.",
        "Add CopyButton, Divider, EmptyState, and Skeleton primitives.",
        "Add formatters for relative time and string truncation.",
        "Add useClipboard and useMediaQuery client hooks.",
        "Add micro-push shell helper for one-commit-one-push flow.",
        "Initialize CHANGELOG with unreleased section.",
        "Add SiteFooter component with GitHub repository link.",
    ]

    run(["chmod", "+x", "scripts/check-backend.sh"])

    for msg, paths in file_commits:
        commit(msg, *paths)

    for i, line in enumerate(changelog_lines, start=1):
        append_changelog(line)
        commit(f"docs(changelog): note release item {i}", ["CHANGELOG.md"])

    count = subprocess.check_output(["git", "rev-list", "--count", "HEAD"], cwd=ROOT, text=True).strip()
    print(f"Total commits on HEAD: {count}")


if __name__ == "__main__":
    main()
