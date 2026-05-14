"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  type TooltipContentProps,
} from "recharts";
import { ChartCard } from "./ChartCard";
import { formatNumber } from "@/lib/utils";
import type { TrendPoint } from "@/types";

interface TrendChartProps {
  title: string;
  points: TrendPoint[];
  delay?: number;
}

const CustomTooltip = ({ active, payload, label }: TooltipContentProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong px-3 py-2 rounded-xl text-xs min-w-[140px] shadow-[var(--shadow-md)]">
      <p className="text-[color:var(--text-tertiary)] mb-1">{label}</p>
      {payload.map((p) => (
        <div key={String(p.dataKey)} className="flex items-center justify-between gap-3 py-0.5">
          <span className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: p.color as string }}
            />
            <span className="capitalize text-[color:var(--text-secondary)]">
              {String(p.dataKey) === "value" ? "This year" : "Last year"}
            </span>
          </span>
          <span className="font-medium tabular-nums">
            {formatNumber(Number(p.value), { currency: "USD" })}
          </span>
        </div>
      ))}
    </div>
  );
};

export function TrendChart({ title, points, delay = 0 }: TrendChartProps) {
  return (
    <ChartCard title={title} subtitle="Last 12 months vs prior year" delay={delay}>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={points} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="grad-primary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="grad-secondary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="line-primary" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} dy={6} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatNumber(v, { compact: true })}
            width={48}
          />
          <RechartsTooltip content={CustomTooltip} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="comparison"
            stroke="#06B6D4"
            strokeWidth={1.5}
            fill="url(#grad-secondary)"
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive
            animationDuration={900}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="url(#line-primary)"
            strokeWidth={2.4}
            fill="url(#grad-primary)"
            dot={false}
            activeDot={{
              r: 5,
              stroke: "#fff",
              strokeWidth: 2,
              fill: "#8B5CF6",
            }}
            isAnimationActive
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
