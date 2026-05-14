import { TrendChart } from "./TrendChart";
import { BarChart } from "./BarChart";
import type { AnalysisResult } from "@/types";

export function ChartGrid({ charts }: { charts: AnalysisResult["charts"] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
      {charts.trend && (
        <div className="lg:col-span-2">
          <TrendChart title={charts.trend.title} points={charts.trend.points} />
        </div>
      )}
      {charts.bar && (
        <div className="lg:col-span-1">
          <BarChart title={charts.bar.title} data={charts.bar.data} delay={0.08} />
        </div>
      )}
    </div>
  );
}
