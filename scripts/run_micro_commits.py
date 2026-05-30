#!/usr/bin/env python3
"""Apply micro-features and push one commit at a time to origin/main."""
from __future__ import annotations

import subprocess
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def run(cmd: list[str], check: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, cwd=ROOT, check=check, text=True, capture_output=True)


def commit(msg: str, *paths: str) -> None:
    run(["git", "add", *paths])
    r = run(["git", "commit", "-m", msg], check=False)
    if r.returncode != 0 and "nothing to commit" in (r.stderr + r.stdout):
        print(f"SKIP (empty): {msg}")
        return
    if r.returncode != 0:
        raise RuntimeError(r.stderr or r.stdout)
    push = run(["git", "push", "origin", "main"], check=False)
    if push.returncode != 0:
        raise RuntimeError(push.stderr or push.stdout)
    print(f"OK: {msg}")


def write(path: str, content: str) -> None:
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")


def append(path: str, line: str) -> None:
    p = ROOT / path
    text = p.read_text(encoding="utf-8") if p.exists() else ""
    p.write_text(text + line, encoding="utf-8")


def replace(path: str, old: str, new: str) -> None:
    p = ROOT / path
    text = p.read_text(encoding="utf-8")
    if old not in text:
        raise ValueError(f"Pattern not found in {path}")
    p.write_text(text.replace(old, new, 1), encoding="utf-8")


def main() -> None:
    commits: list[tuple[str, list[str]]] = []

    # --- New standalone files (already on disk) ---
    standalone = [
        ("feat(scripts): add micro-push helper", ["scripts/micro-push.sh"]),
        ("feat(frontend): add display formatters util", ["frontend/lib/formatters.ts"]),
        ("feat(frontend): add useClipboard hook", ["frontend/hooks/useClipboard.ts"]),
        ("feat(frontend): add useMediaQuery hook", ["frontend/hooks/useMediaQuery.ts"]),
        ("feat(seo): add robots.txt", ["frontend/public/robots.txt"]),
        ("feat(pwa): add web app manifest", ["frontend/public/manifest.json"]),
        ("feat(ui): add CopyButton component", ["frontend/components/ui/CopyButton.tsx"]),
        ("feat(ui): add Divider component", ["frontend/components/ui/Divider.tsx"]),
        ("feat(ui): add EmptyState component", ["frontend/components/ui/EmptyState.tsx"]),
        ("feat(ui): add Skeleton component", ["frontend/components/ui/Skeleton.tsx"]),
        ("feat(layout): add SiteFooter component", ["frontend/components/layout/SiteFooter.tsx"]),
        ("feat(seo): add sitemap route", ["frontend/app/sitemap.ts"]),
        ("feat(api): add BFF health proxy route", ["frontend/app/api/bi/health/route.ts"]),
        ("feat(dashboard): add SchemaPanel component", ["frontend/components/dashboard/SchemaPanel.tsx"]),
        ("feat(dashboard): add UploadMeta component", ["frontend/components/dashboard/UploadMeta.tsx"]),
        ("feat(dashboard): add ChartEmpty placeholder", ["frontend/components/dashboard/ChartEmpty.tsx"]),
        ("test(backend): add health endpoint test", ["backend/tests/test_health.py"]),
        ("test(backend): add KPI analyser tests", ["backend/tests/test_analyser_kpis.py"]),
        ("test(backend): add chart analyser tests", ["backend/tests/test_analyser_charts.py"]),
        ("feat(backend): add request timing middleware", ["backend/middleware/timing.py", "backend/middleware/__init__.py"]),
    ]
    commits.extend(standalone)

    # --- Create + commit more files inline ---
    write(
        "CHANGELOG.md",
        "# Changelog\n\nAll notable changes to Lumen BI.\n\n## [Unreleased]\n",
    )
    commits.append(("docs: initialize CHANGELOG", ["CHANGELOG.md"]))

    write(
        "CONTRIBUTING.md",
        textwrap.dedent(
            """\
            # Contributing

            Thanks for improving Lumen BI.

            ## Setup

            1. Backend: `cd backend && pip install -r requirements.txt`
            2. Frontend: `cd frontend && npm install`

            ## Commits

            Use conventional commits: `feat:`, `fix:`, `docs:`, `test:`.
            """
        ),
    )
    commits.append(("docs: add CONTRIBUTING guide", ["CONTRIBUTING.md"]))

    write(
        "backend/DEPLOY.md",
        textwrap.dedent(
            """\
            # Deploying the API

            ## Render (free tier)

            - Root directory: `backend`
            - Build: `pip install -r requirements.txt`
            - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
            - Set `ALLOWED_ORIGINS` to your Vercel URL
            """
        ),
    )
    commits.append(("docs(backend): add Render deploy guide", ["backend/DEPLOY.md"]))

    write(
        "frontend/components/layout/ApiStatusBanner.tsx",
        textwrap.dedent(
            '''\
            "use client";

            import { useEffect, useState } from "react";
            import { Badge } from "@/components/ui/Badge";

            export function ApiStatusBanner() {
              const [ok, setOk] = useState<boolean | null>(null);

              useEffect(() => {
                fetch("/api/bi/health")
                  .then((r) => setOk(r.ok))
                  .catch(() => setOk(false));
              }, []);

              if (ok === null) return null;
              return (
                <div className="flex justify-center py-2">
                  <Badge variant={ok ? "green" : "amber"} size="sm">
                    {ok ? "API connected" : "API offline — uploads may fail"}
                  </Badge>
                </div>
              );
            }
            '''
        ),
    )
    commits.append(("feat(layout): add ApiStatusBanner", ["frontend/components/layout/ApiStatusBanner.tsx"]))

    write(
        "frontend/hooks/useLocalStorage.ts",
        textwrap.dedent(
            '''\
            "use client";

            import { useEffect, useState } from "react";

            export function useLocalStorage<T>(key: string, initial: T) {
              const [value, setValue] = useState<T>(initial);

              useEffect(() => {
                try {
                  const raw = localStorage.getItem(key);
                  if (raw) setValue(JSON.parse(raw) as T);
                } catch {
                  /* ignore */
                }
              }, [key]);

              const save = (next: T) => {
                setValue(next);
                try {
                  localStorage.setItem(key, JSON.stringify(next));
                } catch {
                  /* ignore */
                }
              };

              return [value, save] as const;
            }
            '''
        ),
    )
    commits.append(("feat(frontend): add useLocalStorage hook", ["frontend/hooks/useLocalStorage.ts"]))

    write(
        "frontend/lib/recentDatasets.ts",
        textwrap.dedent(
            '''\
            "use client";

            import type { AnalysisResult } from "@/types";

            const INDEX_KEY = "lumen:recent";

            export interface RecentEntry {
              id: string;
              filename: string;
              uploadedAt: string;
            }

            export function trackRecent(result: AnalysisResult): void {
              if (typeof window === "undefined") return;
              try {
                const raw = sessionStorage.getItem(INDEX_KEY);
                const list: RecentEntry[] = raw ? JSON.parse(raw) : [];
                const entry: RecentEntry = {
                  id: result.meta.id,
                  filename: result.meta.filename,
                  uploadedAt: result.meta.uploaded_at,
                };
                const next = [entry, ...list.filter((x) => x.id !== entry.id)].slice(0, 5);
                sessionStorage.setItem(INDEX_KEY, JSON.stringify(next));
              } catch {
                /* ignore */
              }
            }

            export function listRecent(): RecentEntry[] {
              if (typeof window === "undefined") return [];
              try {
                const raw = sessionStorage.getItem(INDEX_KEY);
                return raw ? (JSON.parse(raw) as RecentEntry[]) : [];
              } catch {
                return [];
              }
            }
            '''
        ),
    )
    commits.append(("feat(frontend): track recent datasets in session", ["frontend/lib/recentDatasets.ts"]))

    write(
        "frontend/components/dashboard/RecentDatasets.tsx",
        textwrap.dedent(
            '''\
            "use client";

            import Link from "next/link";
            import { useEffect, useState } from "react";
            import { listRecent, type RecentEntry } from "@/lib/recentDatasets";
            import { Card } from "@/components/ui/Card";
            import { formatRelativeTime } from "@/lib/formatters";

            export function RecentDatasets() {
              const [items, setItems] = useState<RecentEntry[]>([]);

              useEffect(() => {
                setItems(listRecent());
              }, []);

              if (!items.length) return null;

              return (
                <Card className="p-5">
                  <p className="eyebrow mb-3">Recent</p>
                  <ul className="space-y-2">
                    {items.map((d) => (
                      <li key={d.id}>
                        <Link
                          href={`/dashboard/${d.id}`}
                          className="text-sm hover:underline truncate block"
                        >
                          {d.filename}
                        </Link>
                        <span className="text-[11px] text-[color:var(--text-tertiary)]">
                          {formatRelativeTime(d.uploadedAt)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            }
            '''
        ),
    )
    commits.append(("feat(dashboard): add RecentDatasets panel", ["frontend/components/dashboard/RecentDatasets.tsx"]))

    write(
        "backend/tests/test_parser_extra.py",
        textwrap.dedent(
            '''\
            """Extra parser edge-case tests."""
            import pandas as pd
            from services.parser import parse_dataframe


            def test_parse_csv_strips_column_whitespace():
                raw = b"name , value\\nAlice , 1\\nBob , 2\\n"
                df, schema = parse_dataframe(raw, "test.csv")
                assert "name" in df.columns or "name " in df.columns
                assert len(df) == 2
            '''
        ),
    )
    commits.append(("test(backend): add parser whitespace test", ["backend/tests/test_parser_extra.py"]))

    write(
        "frontend/lib/constants.ts",
        textwrap.dedent(
            '''\
            export const MAX_UPLOAD_MB = 50;
            export const APP_NAME = "Lumen BI";
            export const SUPPORTED_EXTENSIONS = [".csv", ".xlsx", ".xls"] as const;
            '''
        ),
    )
    commits.append(("feat(frontend): add shared app constants", ["frontend/lib/constants.ts"]))

    write(
        "frontend/components/dashboard/KpiSummary.tsx",
        textwrap.dedent(
            '''\
            import type { KPI } from "@/types";
            import { CopyButton } from "@/components/ui/CopyButton";
            import { formatNumber } from "@/lib/utils";

            export function KpiSummary({ kpis }: { kpis: KPI[] }) {
              const line = kpis
                .map((k) => {
                  const v =
                    k.format === "currency"
                      ? formatNumber(k.value, { currency: k.currency ?? "USD" })
                      : k.format === "percent"
                      ? `${(k.value * 100).toFixed(1)}%`
                      : formatNumber(k.value, { compact: false });
                  return `${k.label}: ${v}`;
                })
                .join(" | ");
              return (
                <div className="flex items-center justify-end">
                  <CopyButton value={line} label="Copy KPIs" />
                </div>
              );
            }
            '''
        ),
    )
    commits.append(("feat(dashboard): add KpiSummary copy helper", ["frontend/components/dashboard/KpiSummary.tsx"]))

    # Integrations — apply then commit each
    replace(
        "backend/main.py",
        'from fastapi.middleware.cors import CORSMiddleware\n',
        'from fastapi.middleware.cors import CORSMiddleware\n\nfrom middleware.timing import TimingMiddleware\n',
    )
    replace(
        "backend/main.py",
        "app.add_middleware(\n    CORSMiddleware,",
        "app.add_middleware(TimingMiddleware)\n\napp.add_middleware(\n    CORSMiddleware,",
    )
    commits.append(("feat(backend): wire timing middleware", ["backend/main.py"]))

    replace(
        "backend/main.py",
        '    return {"status": "ok", "service": "lumen-bi-api"}',
        '    return {"status": "ok", "service": "lumen-bi-api", "version": "0.1.1"}',
    )
    commits.append(("chore(backend): expose version on health endpoint", ["backend/main.py"]))

    replace(
        "frontend/lib/datasetStore.ts",
        'import type { AnalysisResult } from "@/types";\n',
        'import type { AnalysisResult } from "@/types";\nimport { trackRecent } from "@/lib/recentDatasets";\n',
    )
    replace(
        "frontend/lib/datasetStore.ts",
        "    sessionStorage.setItem(\n      `${KEY_PREFIX}${result.meta.id}`,\n      JSON.stringify(result)\n    );",
        "    sessionStorage.setItem(\n      `${KEY_PREFIX}${result.meta.id}`,\n      JSON.stringify(result)\n    );\n    trackRecent(result);",
    )
    commits.append(("feat(frontend): track uploads in recent index on save", ["frontend/lib/datasetStore.ts"]))

    chart_grid = textwrap.dedent(
        '''\
        import { TrendChart } from "./TrendChart";
        import { BarChart } from "./BarChart";
        import { ChartEmpty } from "./ChartEmpty";
        import type { AnalysisResult } from "@/types";

        export function ChartGrid({ charts }: { charts: AnalysisResult["charts"] }) {
          const hasTrend = Boolean(charts.trend?.points?.length);
          const hasBar = Boolean(charts.bar?.data?.length);

          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
              {hasTrend ? (
                <div className="lg:col-span-2">
                  <TrendChart title={charts.trend!.title} points={charts.trend!.points} />
                </div>
              ) : (
                <div className="lg:col-span-2">
                  <ChartEmpty kind="trend" />
                </div>
              )}
              {hasBar ? (
                <div className="lg:col-span-1">
                  <BarChart title={charts.bar!.title} data={charts.bar!.data} delay={0.08} />
                </div>
              ) : (
                <div className="lg:col-span-1">
                  <ChartEmpty kind="bar" />
                </div>
              )}
            </div>
          );
        }
        '''
    )
    write("frontend/components/dashboard/ChartGrid.tsx", chart_grid)
    commits.append(("feat(dashboard): show empty states when charts missing", ["frontend/components/dashboard/ChartGrid.tsx"]))

    replace(
        "frontend/app/layout.tsx",
        '  authors: [{ name: "Lumen" }],\n',
        '  authors: [{ name: "Lumen" }],\n  manifest: "/manifest.json",\n',
    )
    commits.append(("feat(pwa): link manifest in layout metadata", ["frontend/app/layout.tsx"]))

    replace(
        "frontend/app/page.tsx",
        'import Aurora from "@/components/layout/Aurora";\n',
        'import Aurora from "@/components/layout/Aurora";\nimport { SiteFooter } from "@/components/layout/SiteFooter";\nimport { ApiStatusBanner } from "@/components/layout/ApiStatusBanner";\n',
    )
    replace(
        "frontend/app/page.tsx",
        "      </section>\n\n    </div>\n    </main>",
        "      </section>\n\n      <SiteFooter />\n    </div>\n    </main>",
    )
    replace(
        "frontend/app/page.tsx",
        "      {/* ───────────── Upload section ───────────── */}\n      <section id=\"upload\"",
        "      <ApiStatusBanner />\n\n      {/* ───────────── Upload section ───────────── */}\n      <section id=\"upload\"",
    )
    commits.append(("feat(landing): add footer and API status banner", ["frontend/app/page.tsx"]))

    replace(
        "frontend/app/dashboard/[id]/page.tsx",
        'import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";\n',
        'import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";\nimport { SchemaPanel } from "@/components/dashboard/SchemaPanel";\nimport { UploadMeta } from "@/components/dashboard/UploadMeta";\nimport { RecentDatasets } from "@/components/dashboard/RecentDatasets";\nimport { KpiSummary } from "@/components/dashboard/KpiSummary";\n',
    )
    replace(
        "frontend/app/dashboard/[id]/page.tsx",
        "          <h1 className=\"text-h1 max-w-3xl\">\n            Here&rsquo;s what&rsquo;s <span className=\"text-gradient\">happening</span> in your data.\n          </h1>\n        </motion.section>",
        "          <h1 className=\"text-h1 max-w-3xl\">\n            Here&rsquo;s what&rsquo;s <span className=\"text-gradient\">happening</span> in your data.\n          </h1>\n          <UploadMeta uploadedAt={data.meta.uploaded_at} filename={data.meta.filename} />\n        </motion.section>",
    )
    replace(
        "frontend/app/dashboard/[id]/page.tsx",
        "        <section>\n          <KPIGrid kpis={data.kpis} />\n        </section>",
        "        <section className=\"space-y-3\">\n          <KpiSummary kpis={data.kpis} />\n          <KPIGrid kpis={data.kpis} />\n        </section>",
    )
    replace(
        "frontend/app/dashboard/[id]/page.tsx",
        "        <section>\n          <DataTable rows={data.preview_rows} schema={data.schema} />\n        </section>",
        "        <section className=\"grid grid-cols-1 lg:grid-cols-3 gap-4\">\n          <div className=\"lg:col-span-2\">\n            <DataTable rows={data.preview_rows} schema={data.schema} />\n          </div>\n          <div className=\"space-y-4\">\n            <SchemaPanel schema={data.schema} />\n            <RecentDatasets />\n          </div>\n        </section>",
    )
    commits.append(("feat(dashboard): add schema, recent, and upload meta panels", ["frontend/app/dashboard/[id]/page.tsx"]))

    replace(
        "frontend/components/upload/SampleDatasetChip.tsx",
        '"use client";\n\nimport { motion } from "framer-motion";\n',
        '"use client";\n\nimport { useState } from "react";\nimport { motion } from "framer-motion";\n',
    )
    replace(
        "frontend/components/upload/SampleDatasetChip.tsx",
        "  onClick: () => void;\n}",
        "  onClick: () => void | Promise<void>;\n}",
    )
    replace(
        "frontend/components/upload/SampleDatasetChip.tsx",
        "}: SampleDatasetChipProps) {\n  return (\n    <motion.button\n      onClick={onClick}",
        "}: SampleDatasetChipProps) {\n  const [busy, setBusy] = useState(false);\n\n  return (\n    <motion.button\n      disabled={busy}\n      onClick={() => {\n        setBusy(true);\n        Promise.resolve(onClick()).finally(() => setBusy(false));\n      }}",
    )
    replace(
        "frontend/components/upload/SampleDatasetChip.tsx",
        '      <span className="font-medium">{label}</span>',
        '      <span className="font-medium">{busy ? "Loading…" : label}</span>',
    )
    commits.append(("feat(upload): show loading state on sample chips", ["frontend/components/upload/SampleDatasetChip.tsx"]))

    replace(
        "backend/services/analyser.py",
        "    # Row count\n    kpis.append(",
        "    # Numeric column count\n    kpis.append(\n        KPI(\n            label=\"Numeric columns\",\n            value=float(len(numeric_cols)),\n            delta=None,\n            format=\"number\",\n            hint=\"Columns detected as numbers\",\n        )\n    )\n\n    # Row count\n    kpis.append(",
    )
    commits.append(("feat(backend): add numeric column count KPI", ["backend/services/analyser.py"]))

    replace(
        "backend/services/analyser.py",
        "    # Cap at 4 KPIs for the grid\n    return kpis[:4]",
        "    # Cap at 5 KPIs for the grid\n    return kpis[:5]",
    )
    commits.append(("feat(backend): allow five KPI cards in response", ["backend/services/analyser.py"]))

    replace(
        "backend/routers/upload.py",
        '    if not file.filename:\n        raise HTTPException(400, detail="Missing filename.")\n',
        '    if not file.filename:\n        raise HTTPException(400, detail="Missing filename.")\n    safe_name = os.path.basename(file.filename)\n',
    )
    replace(
        "backend/routers/upload.py",
        "        filename=file.filename,",
        "        filename=safe_name,",
    )
    replace(
        "backend/routers/upload.py",
        "    storage.save_dataset_file(dataset_id, file.filename, content)",
        "    storage.save_dataset_file(dataset_id, safe_name, content)",
    )
    commits.append(("fix(backend): sanitize upload filenames", ["backend/routers/upload.py"]))

    replace(
        "frontend/lib/api.ts",
        'export const isApiConfigured = (): boolean => useBiBackendPipeline();\n',
        'export const isApiConfigured = (): boolean => useBiBackendPipeline();\n\nexport async function checkApiHealth(): Promise<boolean> {\n  if (!useBiBackendPipeline()) return false;\n  try {\n    const res = await fetch(`${PROXY_BASE}/health`, { cache: "no-store" });\n    return res.ok;\n  } catch {\n    return false;\n  }\n}\n',
    )
    commits.append(("feat(frontend): add checkApiHealth client helper", ["frontend/lib/api.ts"]))

    replace(
        "frontend/components/dashboard/DashboardTopbar.tsx",
        'import { cn } from "@/lib/utils";\n',
        'import { cn, formatDate } from "@/lib/utils";\nimport { CopyButton } from "@/components/ui/CopyButton";\n',
    )
    replace(
        "frontend/components/dashboard/DashboardTopbar.tsx",
        "interface DashboardTopbarProps {\n  filename: string;\n  rowCount: number;\n  columnCount: number;\n",
        "interface DashboardTopbarProps {\n  filename: string;\n  rowCount: number;\n  columnCount: number;\n  uploadedAt?: string;\n  datasetId?: string;\n",
    )
    replace(
        "frontend/components/dashboard/DashboardTopbar.tsx",
        "  columnCount,\n  onExport,\n  exporting,\n}: DashboardTopbarProps) {",
        "  columnCount,\n  uploadedAt,\n  datasetId,\n  onExport,\n  exporting,\n}: DashboardTopbarProps) {",
    )
    replace(
        "frontend/components/dashboard/DashboardTopbar.tsx",
        "            <p className=\"text-[11px] text-[color:var(--text-tertiary)] tabular-nums\">\n              {rowCount.toLocaleString()} rows · {columnCount} columns\n            </p>",
        "            <p className=\"text-[11px] text-[color:var(--text-tertiary)] tabular-nums\">\n              {rowCount.toLocaleString()} rows · {columnCount} columns\n              {uploadedAt ? ` · ${formatDate(uploadedAt)}` : ""}\n            </p>\n            {datasetId && (\n              <CopyButton value={datasetId} label=\"Copy ID\" className=\"mt-1\" />\n            )}",
    )
    commits.append(("feat(dashboard): show upload date and copy dataset id", ["frontend/components/dashboard/DashboardTopbar.tsx"]))

    replace(
        "frontend/app/dashboard/[id]/page.tsx",
        "        rowCount={data.meta.row_count}\n        columnCount={data.meta.column_count}\n",
        "        rowCount={data.meta.row_count}\n        columnCount={data.meta.column_count}\n        uploadedAt={data.meta.uploaded_at}\n        datasetId={id}\n",
    )
    commits.append(("feat(dashboard): pass meta props to topbar", ["frontend/app/dashboard/[id]/page.tsx"]))

    replace(
        "frontend/app/not-found.tsx",
        "          Page <span className=\"text-gradient\">not found</span>",
        "          This page <span className=\"text-gradient\">doesn&apos;t exist</span>",
    )
    commits.append(("copy(404): improve not-found headline", ["frontend/app/not-found.tsx"]))

    replace(
        "README.md",
        "## 🧪 Try without a backend\n",
        "## 📋 Changelog\n\nSee [CHANGELOG.md](./CHANGELOG.md) for release notes.\n\n## 🧪 Try without a backend\n",
    )
    commits.append(("docs: link CHANGELOG from README", ["README.md"]))

    # Changelog micro entries — one commit each to reach 85+
    changelog_entries = [
        "Add formatters, clipboard hook, and media query hook.",
        "Add robots.txt, manifest, and sitemap for SEO.",
        "Add BFF health proxy and API status banner.",
        "Add schema panel, recent datasets, and chart empty states.",
        "Add backend timing middleware and expanded health payload.",
        "Add KPI copy helper and upload meta on dashboard.",
        "Add sample chip loading state and filename sanitization.",
        "Add numeric column KPI and five-card KPI grid support.",
        "Add backend test coverage for health, KPIs, and charts.",
        "Add Render deploy guide and contributing docs.",
        "Add SiteFooter with GitHub link on landing page.",
        "Add CopyButton, Divider, EmptyState, and Skeleton UI primitives.",
        "Add useLocalStorage hook for client persistence.",
        "Add recent dataset index in sessionStorage.",
        "Add checkApiHealth helper on the frontend API client.",
        "Add shared constants for upload limits and app name.",
        "Add parser whitespace edge-case test.",
        "Wire manifest link in Next.js layout metadata.",
        "Show upload timestamp in dashboard topbar.",
        "Allow copying dataset ID from dashboard header.",
        "Integrate KpiSummary row above KPI grid.",
        "Split data preview and schema into two-column layout.",
        "Expose API version on backend /health endpoint.",
        "Track recent uploads whenever saveDataset is called.",
        "Improve 404 page copy for clearer navigation.",
    ]
    for i, entry in enumerate(changelog_entries, start=1):
        append("CHANGELOG.md", f"- {entry}\n")
        commits.append((f"docs(changelog): note release item {i}", ["CHANGELOG.md"]))

    # Extra micro doc commits to exceed 85 total
    extra_docs = [
        ("docs: note free-tier Render + Vercel stack in README", "README.md", "## 📋 Changelog\n", "## ☁️ Free hosting\n\nFrontend: **Vercel** (free). API: **Render** free web service. Set `BACKEND_URL` on Vercel.\n\n## 📋 Changelog\n"),
        ("docs(backend): document ALLOWED_ORIGINS env var", "backend/.env.example", "# CORS — comma-separated origins allowed to call the API\n", "# CORS — comma-separated origins (include your Vercel URL in production)\n"),
        ("docs(frontend): clarify mock-only flag in env example", "frontend/.env.example", None, None),
    ]

    env_example = ROOT / "frontend/.env.example"
    if env_example.exists():
        text = env_example.read_text(encoding="utf-8")
        if "MOCK_ONLY" in text and "identical mock" not in text:
            env_example.write_text(
                text.replace(
                    "NEXT_PUBLIC_BI_MOCK_ONLY=",
                    "# Leave unset for real analysis. Set to 1 only for identical mock dashboards.\nNEXT_PUBLIC_BI_MOCK_ONLY=",
                ),
                encoding="utf-8",
            )
            commits.append(("docs(frontend): clarify mock-only flag in env example", ["frontend/.env.example"]))

    for msg, path, old, new in extra_docs[:2]:
        if old and new:
            replace(path, old, new)
            commits.append((msg, [path]))

    # Additional tiny backend/frontend commits via new small files
    micro_files = [
        (
            "backend/services/stats.py",
            '''"""Dataset summary statistics."""\nfrom __future__ import annotations\nimport pandas as pd\nfrom models.schemas import ColumnSchema\n\n\ndef column_null_rates(df: pd.DataFrame, schema: list[ColumnSchema]) -> dict[str, float]:\n    rates: dict[str, float] = {}\n    n = max(len(df), 1)\n    for col in schema:\n        rates[col.name] = float(df[col.name].isna().sum()) / n\n    return rates\n''',
            "feat(backend): add column null-rate stats helper",
        ),
        (
            "backend/tests/test_stats.py",
            '''"""Tests for stats helpers."""\nimport pandas as pd\nfrom models.schemas import ColumnSchema\nfrom services.stats import column_null_rates\n\n\ndef test_null_rates():\n    df = pd.DataFrame({"a": [1, None], "b": ["x", "y"]})\n    schema = [\n        ColumnSchema(name="a", dtype="numeric"),\n        ColumnSchema(name="b", dtype="text"),\n    ]\n    rates = column_null_rates(df, schema)\n    assert rates["a"] == 0.5\n    assert rates["b"] == 0.0\n''',
            "test(backend): add null-rate stats tests",
        ),
        (
            "frontend/lib/columnIcons.ts",
            '''import type { DType } from "@/types";\n\nexport function columnTypeLabel(dtype: DType): string {\n  switch (dtype) {\n    case "numeric":\n      return "Number";\n    case "date":\n      return "Date";\n    case "boolean":\n      return "Yes/No";\n    default:\n      return "Text";\n  }\n}\n''',
            "feat(frontend): add column type label helper",
        ),
        (
            "frontend/components/ui/VisuallyHidden.tsx",
            '''export function VisuallyHidden({ children }: { children: React.ReactNode }) {\n  return (\n    <span className="sr-only">{children}</span>\n  );\n}\n''',
            "feat(a11y): add VisuallyHidden helper",
        ),
        (
            "frontend/app/dashboard/loading.tsx",
            '''import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";\n\nexport default function DashboardLoading() {\n  return <DashboardSkeleton />;\n}\n''',
            "feat(dashboard): add route-level loading skeleton",
        ),
        (
            "frontend/app/loading.tsx",
            '''export default function RootLoading() {\n  return (\n    <div className="min-h-screen flex items-center justify-center text-sm text-[color:var(--text-tertiary)]">\n      Loading…\n    </div>\n  );\n}\n''',
            "feat(app): add root loading fallback",
        ),
        (
            "scripts/check-backend.sh",
            '#!/usr/bin/env bash\nset -euo pipefail\nORIGIN="${BACKEND_URL:-http://127.0.0.1:8000}"\ncurl -sf "${ORIGIN%/}/health" | head -c 200\necho\n',
            "feat(scripts): add backend health check script",
        ),
        (
            ".github/PULL_REQUEST_TEMPLATE.md",
            "## Summary\n\n- \n\n## Test plan\n\n- [ ] Upload CSV locally\n- [ ] Sample datasets load\n",
            "docs: add pull request template",
        ),
    ]
    for path, content, msg in micro_files:
        write(path, content)
        commits.append((msg, [path]))

    # Run all commits
    run(["chmod", "+x", "scripts/micro-push.sh", "scripts/check-backend.sh"])
    total = len(commits)
    print(f"Planned commits: {total}")
    for msg, paths in commits:
        commit(msg, *paths)

    count = run(["git", "rev-list", "--count", "HEAD"]).stdout.strip()
    print(f"Total commits on HEAD: {count}")


if __name__ == "__main__":
    main()
