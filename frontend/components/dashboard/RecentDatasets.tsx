"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listRecent, type RecentEntry } from "@/lib/recentDatasets";
import { Card } from "@/components/ui/Card";
import { formatRelativeTime } from "@/lib/formatters";

export function RecentDatasets() {
  const [items, setItems] = useState<RecentEntry[]>([]);

  useEffect(() => {
    setItems(listRecent());
  }, []);

  if (!items.length) return null;

  return (
    <Card className="p-5">
      <p className="eyebrow mb-3">Recent</p>
      <ul className="space-y-2">
        {items.map((d) => (
          <li key={d.id}>
            <Link
              href={`/dashboard/${d.id}`}
              className="text-sm hover:underline truncate block"
            >
              {d.filename}
            </Link>
            <span className="text-[11px] text-[color:var(--text-tertiary)]">
              {formatRelativeTime(d.uploadedAt)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
