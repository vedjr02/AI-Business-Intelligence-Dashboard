"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ChevronDown } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import type { Anomaly } from "@/types";

interface AnomalyBannerProps {
  anomalies: Anomaly[];
}

export function AnomalyBanner({ anomalies }: AnomalyBannerProps) {
  const [open, setOpen] = useState(false);
  if (!anomalies.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-[rgba(245,158,11,0.3)] overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(239,68,68,0.06) 100%)",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left"
        aria-expanded={open}
      >
        <div className="h-9 w-9 rounded-xl bg-[rgba(245,158,11,0.18)] flex items-center justify-center text-[color:var(--accent-amber)] shrink-0">
          <AlertTriangle size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {anomalies.length} anomal{anomalies.length === 1 ? "y" : "ies"} detected
          </p>
          <p className="text-xs text-[color:var(--text-secondary)] mt-0.5">
            Statistical outliers found via IQR analysis — review for data quality.
          </p>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[color:var(--text-tertiary)]"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-2">
              {anomalies.map((a, i) => (
                <motion.div
                  key={`${a.column}-${a.row_index}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[color:var(--bg-surface)] border border-[color:var(--border)]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        a.severity === "high"
                          ? "bg-[color:var(--accent-red)]"
                          : "bg-[color:var(--accent-amber)]"
                      )}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{a.column}</p>
                      <p className="text-[11px] text-[color:var(--text-tertiary)]">
                        Row {a.row_index.toLocaleString()}
                        {a.expected_min !== undefined && a.expected_max !== undefined && (
                          <> · expected {formatNumber(a.expected_min)}—{formatNumber(a.expected_max)}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold tabular-nums shrink-0">
                    {typeof a.value === "number" ? formatNumber(a.value, { decimals: 2 }) : String(a.value)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
