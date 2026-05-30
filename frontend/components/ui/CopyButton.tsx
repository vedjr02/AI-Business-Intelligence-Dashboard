"use client";

import { Check, Copy } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyButton({ value, label = "Copy", className }: CopyButtonProps) {
  const { copy, copied } = useClipboard();

  return (
    <button
      type="button"
      onClick={() => void copy(value)}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-[color:var(--text-tertiary)]",
        "hover:text-[color:var(--text-primary)] transition-colors",
        className
      )}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : label}
    </button>
  );
}
