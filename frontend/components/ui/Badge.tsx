import { cn } from "@/lib/utils";

type Variant =
  | "neutral"
  | "blue"
  | "green"
  | "red"
  | "amber"
  | "violet"
  | "gradient";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: "sm" | "md";
}

const variantStyles: Record<Variant, string> = {
  neutral:
    "bg-[color:var(--bg-subtle)] text-[color:var(--text-secondary)] border border-[color:var(--border)]",
  blue:
    "bg-[rgba(37,99,235,0.10)] text-[color:var(--accent-blue)] border border-[rgba(37,99,235,0.20)]",
  green:
    "bg-[rgba(16,185,129,0.12)] text-[color:var(--accent-green)] border border-[rgba(16,185,129,0.22)]",
  red:
    "bg-[rgba(239,68,68,0.12)] text-[color:var(--accent-red)] border border-[rgba(239,68,68,0.22)]",
  amber:
    "bg-[rgba(245,158,11,0.14)] text-[color:var(--accent-amber)] border border-[rgba(245,158,11,0.25)]",
  violet:
    "bg-[rgba(124,58,237,0.12)] text-[color:var(--accent-violet)] border border-[rgba(124,58,237,0.25)]",
  gradient:
    "bg-[color:var(--text-primary)] text-[color:var(--text-inverse)] border border-transparent",
};

export function Badge({
  className,
  variant = "neutral",
  size = "sm",
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-full select-none leading-none whitespace-nowrap",
        size === "sm" ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-xs",
        variantStyles[variant],
        className
      )}
      {...rest}
    />
  );
}
