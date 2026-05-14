import { cn } from "@/lib/utils";

interface SparkleIconProps {
  size?: number;
  className?: string;
}

/**
 * A four-point sparkle perfectly centered in its viewbox. Drop-in replacement
 * for `lucide-react`'s `Sparkles` when icon-to-text alignment matters.
 */
export function SparkleIcon({ size = 12, className }: SparkleIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
      className={cn("inline-block shrink-0", className)}
      style={{ verticalAlign: "middle" }}
    >
      <path d="M8 0.5C8.3 0.5 8.55 0.7 8.6 1L9.25 4.55C9.43 5.52 10.2 6.27 11.18 6.43L14.6 7C14.9 7.05 15.1 7.3 15.1 7.6C15.1 7.9 14.9 8.15 14.6 8.2L11.18 8.77C10.2 8.93 9.43 9.68 9.25 10.65L8.6 14.2C8.55 14.5 8.3 14.7 8 14.7C7.7 14.7 7.45 14.5 7.4 14.2L6.75 10.65C6.57 9.68 5.8 8.93 4.82 8.77L1.4 8.2C1.1 8.15 0.9 7.9 0.9 7.6C0.9 7.3 1.1 7.05 1.4 7L4.82 6.43C5.8 6.27 6.57 5.52 6.75 4.55L7.4 1C7.45 0.7 7.7 0.5 8 0.5Z" />
      <circle cx="13" cy="2.5" r="1" opacity="0.7" />
    </svg>
  );
}
