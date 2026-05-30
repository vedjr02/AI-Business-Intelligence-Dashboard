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
