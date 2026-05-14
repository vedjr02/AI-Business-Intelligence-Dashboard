"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { formatNumber, formatPercent, cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import type { KPI } from "@/types";

interface KPICardProps {
  kpi: KPI;
  index?: number;
}

export function KPICard({ kpi, index = 0 }: KPICardProps) {
  const animated = useCountUp(kpi.value, 900);

  const formatted =
    kpi.format === "currency"
      ? formatNumber(animated, { currency: kpi.currency ?? "USD", compact: true })
      : kpi.format === "percent"
      ? `${(animated * 100).toFixed(1)}%`
      : formatNumber(animated, { compact: true });

  const isPositive = kpi.delta !== null && kpi.delta >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Card variant="default" spotlight className="p-5 h-full">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs uppercase tracking-wider text-[color:var(--text-tertiary)] font-medium">
            {kpi.label}
          </p>
          {kpi.delta !== null && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-medium border",
                isPositive
                  ? "bg-[rgba(16,185,129,0.12)] text-[color:var(--accent-green)] border-[rgba(16,185,129,0.22)]"
                  : "bg-[rgba(239,68,68,0.12)] text-[color:var(--accent-red)] border-[rgba(239,68,68,0.22)]"
              )}
            >
              {isPositive ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
              {formatPercent(Math.abs(kpi.delta), false)}
            </span>
          )}
        </div>
        <p className="mt-3 text-3xl md:text-[34px] font-semibold tracking-tight tabular-nums">
          {formatted}
        </p>
        {kpi.hint && (
          <p className="mt-1 text-xs text-[color:var(--text-tertiary)]">
            {kpi.hint}
          </p>
        )}
      </Card>
    </motion.div>
  );
}
