"use client";

import type { AnalysisResult } from "@/types";

/**
 * Tiny client-side store that persists analyzed datasets in sessionStorage
 * so users can navigate between pages without losing context.
 * Will be replaced by /api/analyse/{id} calls once the backend is wired up.
 */
const KEY_PREFIX = "lumen:dataset:";

export function saveDataset(result: AnalysisResult): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      `${KEY_PREFIX}${result.meta.id}`,
      JSON.stringify(result)
    );
  } catch {
    /* ignore quota errors */
  }
}

export function loadDataset(id: string): AnalysisResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`${KEY_PREFIX}${id}`);
    return raw ? (JSON.parse(raw) as AnalysisResult) : null;
  } catch {
    return null;
  }
}

export function clearDataset(id: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(`${KEY_PREFIX}${id}`);
}
