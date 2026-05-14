/**
 * Same-origin BFF → FastAPI (`/api/bi/*`).
 * Set `NEXT_PUBLIC_API_URL` (used as upstream on the server) or `BACKEND_URL`
 * server-only + `NEXT_PUBLIC_BI_USE_PROXY=1` to enable the proxy without exposing
 * the host in client bundles.
 */
import type { AnalysisResult } from "@/types";

const PROXY_BASE = "/api/bi";

function useBackend(): boolean {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";
  const proxy = process.env.NEXT_PUBLIC_BI_USE_PROXY;
  return url.length > 0 || proxy === "1" || proxy === "true";
}

/** True when same-origin `/api/bi` proxy should be used (client + server). */
export const isApiConfigured = (): boolean => useBackend();

export async function uploadFile(file: File): Promise<AnalysisResult> {
  if (!useBackend()) throw new Error("Backend not configured");
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
  if (!useBackend()) throw new Error("Backend not configured");
  const res = await fetch(`${PROXY_BASE}/analyse/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Could not load dataset (${res.status})`);
  return res.json() as Promise<AnalysisResult>;
}

export async function fetchExecutiveSummary(datasetId: string): Promise<string> {
  if (!useBackend()) throw new Error("Backend not configured");
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
