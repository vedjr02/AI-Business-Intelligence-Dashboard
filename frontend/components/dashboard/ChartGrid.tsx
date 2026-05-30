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
