/**
 * Same-origin BFF → FastAPI (`/api/bi/*`).
 *
 * The Next.js Route Handlers always exist; the server picks the upstream with
 * `getBackendOrigin()` (`BACKEND_URL` → `NEXT_PUBLIC_API_URL` → `http://127.0.0.1:8000`).
 *
 * **Important:** We no longer require `NEXT_PUBLIC_API_URL` for the *client* to
 * "enable" uploads. Previously that gate forced everyone without that env var
 * into `getMockAnalysis()`, so every dataset looked identical. By default the
 * browser always POSTs to `/api/bi/upload` and the server talks to FastAPI.
 *
 * Set `NEXT_PUBLIC_BI_MOCK_ONLY=1` only when you intentionally want the static
 * mock dashboard (e.g. a pure-frontend demo with no API).
 */
import type { AnalysisResult } from "@/types";

const PROXY_BASE = "/api/bi";

function useBiBackendPipeline(): boolean {
  const v = process.env.NEXT_PUBLIC_BI_MOCK_ONLY?.trim().toLowerCase() ?? "";
  return v !== "1" && v !== "true" && v !== "yes";
}

/** False only when `NEXT_PUBLIC_BI_MOCK_ONLY` forces baked-in mock analysis. */
export const isApiConfigured = (): boolean => useBiBackendPipeline();

export async function checkApiHealth(): Promise<boolean> {
  if (!useBiBackendPipeline()) return false;
  try {
    const res = await fetch(`${PROXY_BASE}/health`, { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function uploadFile(file: File): Promise<AnalysisResult> {
  if (!useBiBackendPipeline()) {
    throw new Error(
      "Mock-only mode is on (NEXT_PUBLIC_BI_MOCK_ONLY). Remove it to use the real API."
    );
  }
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${PROXY_BASE}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Upload failed (${res.status})`);
  }
  return res.json() as Promise<AnalysisResult>;
}

export async function fetchAnalysis(id: string): Promise<AnalysisResult> {
  if (!useBiBackendPipeline()) {
    throw new Error(
      "Mock-only mode is on (NEXT_PUBLIC_BI_MOCK_ONLY). Remove it to use the real API."
    );
  }
  const res = await fetch(`${PROXY_BASE}/analyse/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Could not load dataset (${res.status})`);
  return res.json() as Promise<AnalysisResult>;
}

export async function fetchExecutiveSummary(datasetId: string): Promise<string> {
  if (!useBiBackendPipeline()) {
    throw new Error(
      "Mock-only mode is on (NEXT_PUBLIC_BI_MOCK_ONLY). Remove it to use the real API."
    );
  }
  const res = await fetch(
    `${PROXY_BASE}/export/${encodeURIComponent(datasetId)}/summary`,
    { method: "POST" }
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `Summary failed (${res.status})`);
  }
  const data = (await res.json()) as { summary?: string };
  return data.summary ?? "";
}
