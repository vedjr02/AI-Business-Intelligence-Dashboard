"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, ChevronDown, MessageSquare } from "lucide-react";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { QueryResponse } from "./QueryResponse";
import { useAIQuery } from "@/hooks/useAIQuery";
import { SparkleIcon } from "@/components/ui/SparkleIcon";
import { cn } from "@/lib/utils";

interface QueryBarProps {
  datasetId: string;
  suggestedQuestions: string[];
}

export function QueryBar({ datasetId, suggestedQuestions }: QueryBarProps) {
  const [value, setValue] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const responseScrollRef = useRef<HTMLDivElement | null>(null);
  const { history, ask, isStreaming } = useAIQuery(datasetId);

  const submit = async () => {
    const q = value.trim();
    if (!q || isStreaming) return;
    setValue("");
    setCollapsed(false); // re-open whenever a new question is asked
    inputRef.current?.focus();
    await ask(q);
  };

  // Auto-grow textarea up to ~5 lines.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "0";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  // Auto-scroll response panel as new text streams in.
  useEffect(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    if (last.status === "streaming") {
      responseScrollRef.current?.scrollTo({
        top: responseScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history]);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 pointer-events-none">
      {/* Gradient mask that fades the scrolling content below the bar — kills the see-through mess. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-48 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, var(--bg-base) 0%, var(--bg-base) 35%, color-mix(in srgb, var(--bg-base) 80%, transparent) 60%, transparent 100%)",
        }}
      />
      <div className="mx-auto max-w-5xl px-4 md:px-6 pb-4 md:pb-6 flex flex-col gap-3">
        {/* Response panel — slides up above the input. Collapsible. */}
        <AnimatePresence mode="wait">
          {history.length > 0 && !collapsed && (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto relative"
            >
              {/* Hide button — top-right of the response panel */}
              <motion.button
                onClick={() => setCollapsed(true)}
                whileTap={{ scale: 0.92 }}
                className={cn(
                  "absolute -top-2 right-3 z-10",
                  "h-8 px-3 inline-flex items-center gap-1.5 rounded-full",
                  "glass-strong text-[11px] font-medium",
                  "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]",
                  "transition-colors"
                )}
                aria-label="Hide responses"
              >
                <ChevronDown size={12} />
                Hide
              </motion.button>
              <div
                ref={responseScrollRef}
                className="max-h-[42vh] overflow-y-auto rounded-3xl no-scrollbar pt-2"
              >
                <QueryResponse turns={history} />
              </div>
            </motion.div>
          )}

          {history.length > 0 && collapsed && (
            <motion.button
              key="show"
              onClick={() => setCollapsed(false)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "pointer-events-auto self-end inline-flex items-center gap-2 px-3.5 py-2 rounded-full",
                "glass-strong text-xs font-medium",
                "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]",
                "transition-colors"
              )}
            >
              <MessageSquare size={12} className="text-[color:var(--accent-violet)]" />
              Show {history.length} {history.length === 1 ? "response" : "responses"}
            </motion.button>
          )}
        </AnimatePresence>

        {/* The bar itself */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="query-bar pointer-events-auto rounded-3xl p-3 md:p-4 relative overflow-visible"
        >
          <div className="flex items-end gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 px-2 pb-1.5 pt-1 leading-none">
                <SparkleIcon size={12} />
                <span className="text-[10px] uppercase tracking-[0.12em] text-[color:var(--text-tertiary)] font-semibold">
                  AI Analyst
                </span>
              </div>
              <textarea
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void submit();
                  }
                }}
                placeholder="Ask anything about your data…"
                rows={1}
                className={cn(
                  "w-full resize-none bg-transparent px-2 pb-1 outline-none",
                  "text-base placeholder:text-[color:var(--text-tertiary)]",
                  "leading-snug max-h-[120px]"
                )}
              />
            </div>

            <motion.button
              onClick={submit}
              disabled={!value.trim() || isStreaming}
              whileTap={{ scale: 0.94 }}
              className={cn(
                "h-11 w-11 rounded-full flex items-center justify-center shrink-0",
                "btn-primary-solid",
                "disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed"
              )}
              aria-label="Send"
            >
              {isStreaming ? (
                <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </motion.button>
          </div>

          <div className="mt-2 pt-2 border-t border-[color:var(--border)]">
            <SuggestedQuestions
              questions={suggestedQuestions}
              onPick={(q) => {
                setValue(q);
                inputRef.current?.focus();
              }}
              disabled={isStreaming}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
