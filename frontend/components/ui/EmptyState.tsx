import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-[color:var(--border)]",
        "bg-[color:var(--bg-subtle)] px-6 py-10 text-center",
        className
      )}
    >
      <p className="text-sm font-medium text-[color:var(--text-primary)]">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-[color:var(--text-secondary)] max-w-sm mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
