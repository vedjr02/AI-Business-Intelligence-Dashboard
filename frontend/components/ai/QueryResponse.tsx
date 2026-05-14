"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { QueryTurn } from "@/hooks/useAIQuery";
import { cn } from "@/lib/utils";

interface QueryResponseProps {
  turns: QueryTurn[];
}

export function QueryResponse({ turns }: QueryResponseProps) {
  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {turns.map((turn) => (
          <ResponseCard key={turn.id} turn={turn} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ResponseCard({ turn }: { turn: QueryTurn }) {
  const [copied, setCopied] = useState(false);
  const isStreaming = turn.status === "streaming";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(turn.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="glass-strong rounded-2xl p-4 md:p-5"
    >
      {/* User question */}
      <div className="flex items-start gap-3 mb-3">
        <div className="h-7 w-7 rounded-full bg-[color:var(--bg-base)] border border-[color:var(--border)] flex items-center justify-center text-xs font-medium shrink-0">
          You
        </div>
        <p className="text-sm font-medium pt-0.5">{turn.question}</p>
      </div>

      {/* AI answer */}
      <div className="flex items-start gap-3">
        <div className="h-7 w-7 rounded-full bg-gradient-brand flex items-center justify-center text-white shrink-0 shadow-[0_6px_20px_rgba(124,58,237,0.45)]">
          <Bot size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed text-[color:var(--text-primary)] whitespace-pre-wrap">
            {turn.answer}
            {isStreaming && (
              <motion.span
                className="inline-block w-[2px] h-[14px] bg-[color:var(--accent-violet)] ml-0.5 align-middle"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
            )}
          </p>
          {turn.status === "done" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 flex items-center gap-2"
            >
              <button
                onClick={copy}
                className={cn(
                  "inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full",
                  "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]",
                  "bg-[color:var(--bg-surface)] border border-[color:var(--border)]",
                  "transition-colors"
                )}
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
