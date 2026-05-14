"use client";

import {
  ResponsiveContainer,
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell,
  type TooltipContentProps,
} from "recharts";
import { ChartCard } from "./ChartCard";
import { formatNumber } from "@/lib/utils";
import type { BarDatum } from "@/types";

interface BarChartProps {
  title: string;
  data: BarDatum[];
  delay?: number;
}

const GRADIENT_STOPS = [
  ["#6366F1", "#8B5CF6"],
  ["#8B5CF6", "#A855F7"],
  ["#EC4899", "#F472B6"],
  ["#F97316", "#FBBF24"],
  ["#06B6D4", "#22D3EE"],
];

const CustomTooltip = ({ active, payload, label }: TooltipContentProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong px-3 py-2 rounded-xl text-xs">
      <p className="text-[color:var(--text-tertiary)] mb-1">{label}</p>
      <p className="font-medium tabular-nums">
        {formatNumber(Number(payload[0].value), { currency: "USD" })}
      </p>
    </div>
  );
};

export function BarChart({ title, data, delay = 0 }: BarChartProps) {
  return (
    <ChartCard title={title} subtitle="By revenue contribution" delay={delay}>
      <ResponsiveContainer width="100%" height={260}>
        <RBarChart
          data={data}
          margin={{ top: 8, right: 6, left: 0, bottom: 0 }}
          barCategoryGap={18}
        >
          <defs>
            {GRADIENT_STOPS.map(([from, to], i) => (
              <linearGradient key={i} id={`bar-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={from} stopOpacity={1} />
                <stop offset="100%" stopColor={to} stopOpacity={0.55} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} dy={6} interval={0} tick={{ fontSize: 11 }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatNumber(v, { compact: true })}
            width={48}
          />
          <RechartsTooltip content={CustomTooltip} cursor={{ fill: "var(--border)", opacity: 0.4 }} />
          <Bar
            dataKey="value"
            radius={[10, 10, 0, 0]}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={`url(#bar-grad-${i % GRADIENT_STOPS.length})`} />
            ))}
          </Bar>
        </RBarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
