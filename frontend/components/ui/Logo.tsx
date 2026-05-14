import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

export function Logo({ size = 28, withWordmark = true, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="lumen-logo" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="10" fill="url(#lumen-logo)" />
        <path
          d="M9 27 L17 19 L23 24 L31 12"
          stroke="white"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="31" cy="12" r="2.2" fill="white" />
      </svg>
      {withWordmark && (
        <span
          className="text-[20px] leading-none font-extrabold tracking-tight"
          style={{ marginTop: "1px" }}
        >
          Lumen
        </span>
      )}
    </span>
  );
}
