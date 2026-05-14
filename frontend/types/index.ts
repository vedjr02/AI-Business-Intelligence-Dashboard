/* =========================================================================
   Shared types — mirror the FastAPI API contract (see project guide §9).
   ========================================================================= */

export type DType = "numeric" | "date" | "text" | "boolean";

export interface ColumnSchema {
  name: string;
  dtype: DType;
  sample_values: string[];
  null_count?: number;
}

export type KPIFormat = "number" | "currency" | "percent";

export interface KPI {
  label: string;
  value: number;
  delta: number | null; // fractional, e.g. 0.124 = +12.4%
  format: KPIFormat;
  currency?: string;
  hint?: string;
}

export interface TrendPoint {
  label: string; // e.g. "Jan 2026"
  value: number;
  comparison?: number; // optional previous-period value
}

export interface BarDatum {
  label: string;
  value: number;
}

export interface Anomaly {
  column: string;
  value: number | string;
  row_index: number;
  severity: "high" | "medium";
  expected_min?: number;
  expected_max?: number;
}

export interface DatasetMeta {
  id: string;
  filename: string;
  row_count: number;
  column_count: number;
  uploaded_at: string;
}

export interface AnalysisResult {
  meta: DatasetMeta;
  kpis: KPI[];
  charts: {
    trend: { title: string; points: TrendPoint[] } | null;
    bar: { title: string; data: BarDatum[] } | null;
  };
  anomalies: Anomaly[];
  suggested_questions: string[];
  preview_rows: Record<string, string | number | null>[];
  schema: ColumnSchema[];
}

export interface QueryHistoryItem {
  id: string;
  question: string;
  answer: string;
  created_at: string;
}
