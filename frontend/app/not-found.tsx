"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-strong max-w-md w-full text-center p-10 rounded-3xl"
      >
        <Logo size={32} className="mx-auto mb-5" />
        <p className="text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)] mb-2">
          404
        </p>
        <h1 className="text-h2 mb-2">
          Page <span className="text-gradient">not found</span>
        </h1>
        <p className="text-sm text-[color:var(--text-secondary)] mb-6">
          That route doesn't exist. Let's get you home.
        </p>
        <Link href="/">
          <Button iconLeft={<ArrowLeft size={14} />}>Back to upload</Button>
        </Link>
      </motion.div>
    </main>
  );
}
