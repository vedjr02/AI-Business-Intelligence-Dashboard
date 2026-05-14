"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "glass" | "outline" | "gradient";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  variant?: Variant;
  size?: Size;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  children?: React.ReactNode;
}

const sizeMap: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-full gap-1.5",
  md: "h-11 px-5 text-sm rounded-full gap-2",
  lg: "h-14 px-7 text-base rounded-full gap-2.5",
};

const variantMap: Record<Variant, string> = {
  // Solid contrast button — the HT-style hero CTA: black-on-white / white-on-black
  primary:
    "btn-primary-solid font-semibold",
  // Soft, near-invisible chip — surface-on-surface
  secondary:
    "bg-[color:var(--bg-surface)] border border-[color:var(--border)] text-[color:var(--text-primary)] hover:border-[color:var(--border-strong)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
  ghost:
    "bg-transparent text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)]",
  glass:
    "glass text-[color:var(--text-primary)] hover:bg-[color:var(--bg-elevated)]",
  outline:
    "bg-transparent border border-[color:var(--text-primary)] text-[color:var(--text-primary)] hover:bg-[color:var(--text-primary)] hover:text-[color:var(--text-inverse)]",
  // Rainbow accent — used sparingly, e.g. QueryBar send button
  gradient:
    "btn-primary-gradient text-white font-medium",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      iconLeft,
      iconRight,
      loading,
      children,
      disabled,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-medium select-none",
          "transition-[transform,background-color,border-color,box-shadow,background-position] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          sizeMap[size],
          variantMap[variant],
          className
        )}
        {...rest}
      >
        {loading ? (
          <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          iconLeft && <span className="shrink-0">{iconLeft}</span>
        )}
        {children}
        {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
