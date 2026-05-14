"use client";

import { forwardRef, useRef, useState } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: "default" | "glass" | "glass-strong";
  interactive?: boolean;
  glow?: boolean;
  spotlight?: boolean; // cursor-following soft highlight
  children?: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      interactive = false,
      glow = false,
      spotlight = false,
      children,
      onMouseMove,
      ...rest
    },
    ref
  ) => {
    const innerRef = useRef<HTMLDivElement | null>(null);
    const [pos, setPos] = useState({ x: 50, y: 50, opacity: 0 });

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (spotlight && innerRef.current) {
        const rect = innerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setPos({ x, y, opacity: 1 });
      }
      onMouseMove?.(e);
    };

    const handleLeave = () => {
      if (spotlight) setPos((p) => ({ ...p, opacity: 0 }));
    };

    const variantClass = {
      default: "card",
      glass: "glass",
      "glass-strong": "glass-strong",
    }[variant];

    return (
      <motion.div
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={cn(
          variantClass,
          interactive && "card-interactive",
          glow && "shadow-[var(--shadow-md)]",
          "relative overflow-hidden",
          className
        )}
        {...rest}
      >
        {spotlight && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: pos.opacity,
              background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, rgba(0,0,0,0.06), transparent 40%)`,
            }}
          />
        )}
        <div className="relative">{children}</div>
      </motion.div>
    );
  }
);
Card.displayName = "Card";
