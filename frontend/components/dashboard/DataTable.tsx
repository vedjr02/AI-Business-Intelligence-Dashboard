"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { ColumnSchema } from "@/types";

interface DataTableProps {
  rows: Record<string, string | number | null>[];
  schema: ColumnSchema[];
}

function dtypeBadge(dtype: string) {
  switch (dtype) {
    case "numeric":
      return <Badge variant="blue">#</Badge>;
    case "date":
      return <Badge variant="violet">date</Badge>;
    case "boolean":
      return <Badge variant="amber">bool</Badge>;
    default:
      return <Badge variant="neutral">abc</Badge>;
  }
}

export function DataTable({ rows, schema }: DataTableProps) {
  const columns = schema.length
    ? schema.map((c) => c.name)
    : rows[0]
    ? Object.keys(rows[0])
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-[color:var(--border)] flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[15px]">Data preview</h3>
            <p className="text-xs text-[color:var(--text-tertiary)] mt-0.5">
              First {rows.length} rows
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[color:var(--border)] sticky top-0 bg-[color:var(--bg-surface)] z-10">
                {columns.map((col) => {
                  const meta = schema.find((s) => s.name === col);
                  return (
                    <th
                      key={col}
                      className="text-left px-4 py-2.5 font-medium text-[color:var(--text-secondary)] whitespace-nowrap"
                    >
                      <span className="inline-flex items-center gap-2">
                        {col}
                        {meta && dtypeBadge(meta.dtype)}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-b border-[color:var(--border)] last:border-0 hover:bg-[color:var(--bg-base)] transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-4 py-2.5 whitespace-nowrap text-[color:var(--text-secondary)] tabular-nums"
                    >
                      {row[col] === null || row[col] === undefined ? (
                        <span className="text-[color:var(--text-tertiary)] italic">null</span>
                      ) : (
                        String(row[col])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
