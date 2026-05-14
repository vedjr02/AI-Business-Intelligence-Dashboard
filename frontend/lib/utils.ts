import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names while resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number compactly: 1,234,567 → "1.23M". */
export function formatNumber(
  value: number | null | undefined,
  options: { decimals?: number; currency?: string | null; compact?: boolean } = {}
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const { decimals = 1, currency = null, compact = true } = options;

  const formatter = new Intl.NumberFormat("en-US", {
    notation: compact && Math.abs(value) >= 1000 ? "compact" : "standard",
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
    ...(currency
      ? { style: "currency", currency, currencyDisplay: "narrowSymbol" }
      : {}),
  });
  return formatter.format(value);
}

/** Format a percent: 0.124 → "+12.4%". */
export function formatPercent(value: number, sign = true): string {
  const formatted = `${(value * 100).toFixed(1)}%`;
  if (!sign) return formatted;
  if (value > 0) return `+${formatted}`;
  return formatted;
}

/** Format a date as "Jan 4, 2026". */
export function formatDate(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/** Bytes → human readable. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let val = bytes / 1024;
  let i = 0;
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024;
    i++;
  }
  return `${val.toFixed(1)} ${units[i]}`;
}

/** Sleep helper. */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Clamp utility. */
export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}
