import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 18, className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn("inline-block animate-spin", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
        <defs>
          <linearGradient id="lumen-spinner" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--grad-1)" />
            <stop offset="50%" stopColor="var(--grad-2)" />
            <stop offset="100%" stopColor="var(--grad-3)" />
          </linearGradient>
        </defs>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="var(--border)"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M22 12a10 10 0 0 0-10-10"
          stroke="url(#lumen-spinner)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}
