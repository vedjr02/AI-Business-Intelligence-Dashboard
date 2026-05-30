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
