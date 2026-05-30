"use client";

import { EmptyState } from "@/components/ui/EmptyState";

interface ChartEmptyProps {
  kind: "trend" | "bar";
}

export function ChartEmpty({ kind }: ChartEmptyProps) {
  const title =
    kind === "trend"
      ? "No time-series chart for this file"
      : "No category breakdown available";
  const description =
    kind === "trend"
      ? "Add a date column and a numeric value column to see trends."
      : "Add a text/category column to see a top-N breakdown.";

  return <EmptyState title={title} description={description} className="h-64 flex flex-col justify-center" />;
}
