"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSpreadsheet, CheckCircle2, X } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { useToast } from "@/components/providers/ToastProvider";

const STAGES = [
  "Reading file",
  "Detecting schema",
  "Computing KPIs",
  "Detecting anomalies",
  "Generating insights",
] as const;

interface UploadProgressProps {
  file: File;
  onCancel: () => void;
  onUpload: (file: File) => Promise<string>;
}

export function UploadProgress({ file, onCancel, onUpload }: UploadProgressProps) {
  const [stageIdx, setStageIdx] = useState(0);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Run the (mock or real) upload in parallel with a pleasant animated progress.
      let id: string | null = null;
      const uploadPromise = onUpload(file)
        .then((d) => (id = d))
        .catch((err) => {
          if (cancelled) return;
          show({
            variant: "error",
            title: "Upload failed",
            description: err instanceof Error ? err.message : "Please try again.",
          });
          onCancel();
        });

      // Animate through stages — total ~2.4s if upload is faster.
      const stageDuration = 480;
      for (let i = 0; i < STAGES.length; i++) {
        if (cancelled) return;
        setStageIdx(i);
        const start = performance.now();
        const startPct = (i / STAGES.length) * 100;
        const endPct = ((i + 1) / STAGES.length) * 100;
        await new Promise<void>((resolve) => {
          const tick = (now: number) => {
            if (cancelled) return resolve();
            const t = Math.min((now - start) / stageDuration, 1);
            setPct(startPct + (endPct - startPct) * t);
            if (t < 1) requestAnimationFrame(tick);
            else resolve();
          };
          requestAnimationFrame(tick);
        });
      }

      await uploadPromise;
      if (cancelled || !id) return;
      setPct(100);
      setDone(true);
      // Brief celebration before navigation.
      setTimeout(() => {
        if (!cancelled) {
          window.location.assign(`/dashboard/${id}`);
        }
      }, 650);
    };

    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="glass-strong w-full max-w-2xl mx-auto p-7 md:p-9 rounded-[28px]"
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div className="h-14 w-14 rounded-2xl bg-[color:var(--text-primary)] text-[color:var(--text-inverse)] flex items-center justify-center">
            {done ? (
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <CheckCircle2 size={26} />
              </motion.div>
            ) : (
              <FileSpreadsheet size={24} />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-xs text-[color:var(--text-secondary)] mt-0.5">
                {formatBytes(file.size)}
              </p>
            </div>
            {!done && (
              <button
                onClick={onCancel}
                className="text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors"
                aria-label="Cancel"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--border)]">
            <motion.div
              className="h-full bg-[color:var(--text-primary)]"
              animate={{ width: `${pct}%` }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
            />
          </div>

          {/* Stage label */}
          <div className="mt-3 flex items-center justify-between text-xs">
            <AnimatePresence mode="wait">
              <motion.span
                key={done ? "done" : stageIdx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "font-medium",
                  done
                    ? "text-[color:var(--accent-green)]"
                    : "text-[color:var(--text-primary)]"
                )}
              >
                {done ? "Ready — opening your dashboard" : STAGES[stageIdx]}
              </motion.span>
            </AnimatePresence>
            <span className="text-[color:var(--text-tertiary)] tabular-nums">
              {Math.round(pct)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
