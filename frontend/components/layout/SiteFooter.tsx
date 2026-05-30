import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--border)] px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo size={20} withWordmark />
        <p className="text-xs text-[color:var(--text-tertiary)]">
          Built for instant insights from any spreadsheet.
        </p>
        <Link
          href="https://github.com/vedjr02/AI-Business-Intelligence-Dashboard"
          className="text-xs text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </Link>
      </div>
    </footer>
  );
}
