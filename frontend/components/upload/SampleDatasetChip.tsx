"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SampleDatasetChipProps {
  label: string;
  rows: number;
  emoji: string;
  onClick: () => void;
}

export function SampleDatasetChip({
  label,
  rows,
  emoji,
  onClick,
}: SampleDatasetChipProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "glass px-4 py-2.5 rounded-full text-sm flex items-center gap-2 group leading-none",
        "hover:bg-[color:var(--bg-subtle)] hover:border-[color:var(--border-strong)] transition-colors"
      )}
    >
      <span className="text-[15px] -mt-px" aria-hidden>
        {emoji}
      </span>
      <span className="font-medium">{label}</span>
      <span className="text-[11px] text-[color:var(--text-tertiary)] tabular-nums opacity-80">
        {rows.toLocaleString()} rows
      </span>
    </motion.button>
  );
}
