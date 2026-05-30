import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
  label?: string;
}

export function Divider({ className, label }: DividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex-1 h-px bg-[color:var(--border)]" />
        <span className="text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
          {label}
        </span>
        <div className="flex-1 h-px bg-[color:var(--border)]" />
      </div>
    );
  }
  return <div className={cn("h-px w-full bg-[color:var(--border)]", className)} />;
}
