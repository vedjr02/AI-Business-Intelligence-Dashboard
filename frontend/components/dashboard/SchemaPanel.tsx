"use client";

import type { ColumnSchema } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const DTYPE_LABEL: Record<string, string> = {
  numeric: "Number",
  date: "Date",
  text: "Text",
  boolean: "Boolean",
};

interface SchemaPanelProps {
  schema: ColumnSchema[];
}

export function SchemaPanel({ schema }: SchemaPanelProps) {
  if (!schema.length) return null;

  return (
    <Card variant="default" className="p-5">
      <p className="eyebrow mb-3">Schema</p>
      <ul className="space-y-2">
        {schema.map((col) => (
          <li
            key={col.name}
            className="flex items-center justify-between gap-3 text-sm border-b border-[color:var(--border)] pb-2 last:border-0 last:pb-0"
          >
            <span className="font-medium truncate">{col.name}</span>
            <Badge variant="neutral" size="sm">
              {DTYPE_LABEL[col.dtype] ?? col.dtype}
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
