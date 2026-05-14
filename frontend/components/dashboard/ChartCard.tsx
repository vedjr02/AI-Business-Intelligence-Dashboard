"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
  onDownload?: () => void;
}

export function ChartCard({
  title,
  subtitle,
  children,
  delay = 0,
  className,
  onDownload,
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Card variant="default" spotlight className={cn("p-5 md:p-6 h-full flex flex-col", className)}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-semibold text-[15px] tracking-tight">{title}</h3>
            {subtitle && (
              <p className="text-xs text-[color:var(--text-tertiary)] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {onDownload && (
            <Tooltip content="Download as PNG">
              <button
                onClick={onDownload}
                className="h-8 w-8 rounded-full hover:bg-[color:var(--bg-base)] inline-flex items-center justify-center text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors"
                aria-label="Download chart"
              >
                <Download size={14} />
              </button>
            </Tooltip>
          )}
        </div>
        <div className="flex-1 min-h-0">{children}</div>
      </Card>
    </motion.div>
  );
}
