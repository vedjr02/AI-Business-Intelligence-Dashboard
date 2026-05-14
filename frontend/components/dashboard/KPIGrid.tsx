import { KPICard } from "./KPICard";
import type { KPI } from "@/types";

export function KPIGrid({ kpis }: { kpis: KPI[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {kpis.map((kpi, i) => (
        <KPICard key={kpi.label} kpi={kpi} index={i} />
      ))}
    </div>
  );
}
