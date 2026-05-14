"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <motion.button
      onClick={toggle}
      aria-label="Toggle theme"
      whileTap={{ scale: 0.92 }}
      className={cn(
        "relative h-10 w-10 rounded-full glass flex items-center justify-center overflow-hidden",
        "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]",
        "transition-colors",
        className
      )}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex"
      >
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
      </motion.span>
    </motion.button>
  );
}
