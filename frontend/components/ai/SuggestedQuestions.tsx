"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SparkleIcon } from "@/components/ui/SparkleIcon";

interface SuggestedQuestionsProps {
  questions: string[];
  onPick: (q: string) => void;
  disabled?: boolean;
}

export function SuggestedQuestions({
  questions,
  onPick,
  disabled,
}: SuggestedQuestionsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 py-1">
      <span className="text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)] inline-flex items-center gap-1.5 shrink-0 leading-none font-semibold">
        <SparkleIcon size={11} />
        Try
      </span>
      {questions.map((q, i) => (
        <motion.button
          key={q}
          onClick={() => onPick(q)}
          disabled={disabled}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[color:var(--bg-surface)] border border-[color:var(--border)] hover:border-[color:var(--text-primary)] hover:text-[color:var(--text-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {q}
          <ArrowUpRight size={11} className="opacity-60" />
        </motion.button>
      ))}
    </div>
  );
}
