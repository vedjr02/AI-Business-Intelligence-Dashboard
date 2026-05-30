"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDate } from "@/lib/utils";
import { CopyButton } from "@/components/ui/CopyButton";

interface DashboardTopbarProps {
  filename: string;
  rowCount: number;
  columnCount: number;
  uploadedAt?: string;
  datasetId?: string;
  onExport?: () => void;
  exporting?: boolean;
}

export function DashboardTopbar({
  filename,
  rowCount,
  columnCount,
  uploadedAt,
  datasetId,
  onExport,
  exporting,
}: DashboardTopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 glass-bar"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-9 px-3 rounded-full hover:bg-[color:var(--bg-base)] transition-colors text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] -ml-2"
          aria-label="Back to upload"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Home</span>
        </Link>

        <div className="hidden md:block h-5 w-px bg-[color:var(--border)]" />

        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 min-w-0 flex items-center gap-3"
        >
          <Logo size={22} withWordmark={false} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">{filename}</p>
              <Badge variant="gradient" size="sm">live</Badge>
            </div>
            <p className="text-[11px] text-[color:var(--text-tertiary)] tabular-nums">
              {rowCount.toLocaleString()} rows · {columnCount} columns
              {uploadedAt ? ` · ${formatDate(uploadedAt)}` : }
            </p>
            {datasetId && (
              <CopyButton value={datasetId} label="Copy ID" className="mt-1" />
            )}
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            iconLeft={<FileText size={14} />}
            loading={exporting}
            onClick={onExport}
          >
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
