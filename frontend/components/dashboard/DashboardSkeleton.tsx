import { Logo } from "@/components/ui/Logo";

export function DashboardSkeleton() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-30 glass-bar">
        <div className="mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center gap-3">
          <div className="skeleton h-7 w-20 rounded-full" />
          <div className="h-5 w-px bg-[color:var(--border)] hidden md:block" />
          <Logo size={22} withWordmark={false} />
          <div className="skeleton h-5 w-40 rounded" />
          <div className="ml-auto flex items-center gap-2">
            <div className="skeleton h-9 w-24 rounded-2xl" />
            <div className="skeleton h-10 w-10 rounded-full" />
          </div>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-8 space-y-6">
        <div className="space-y-2">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-8 w-2/3 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-[112px] rounded-[18px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="skeleton h-[320px] rounded-[18px] lg:col-span-2" />
          <div className="skeleton h-[320px] rounded-[18px]" />
        </div>
        <div className="skeleton h-[420px] rounded-[18px]" />
      </main>
    </div>
  );
}
