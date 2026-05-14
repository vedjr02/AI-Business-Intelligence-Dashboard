"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { KPIGrid } from "@/components/dashboard/KPIGrid";
import { ChartGrid } from "@/components/dashboard/ChartGrid";
import { AnomalyBanner } from "@/components/dashboard/AnomalyBanner";
import { DataTable } from "@/components/dashboard/DataTable";
import { QueryBar } from "@/components/ai/QueryBar";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { loadDataset, saveDataset } from "@/lib/datasetStore";
import { fetchAnalysis, isApiConfigured } from "@/lib/api";
import { useExport } from "@/hooks/useExport";
import type { AnalysisResult } from "@/types";

export default function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const { exporting, exportPdf } = useExport("dashboard-capture", data);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      const cached = loadDataset(id);
      if (cached) {
        // Brief delay so the entrance animations feel intentional.
        await new Promise((r) => setTimeout(r, 300));
        if (!cancelled) {
          setData(cached);
          setLoading(false);
        }
        return;
      }
      if (isApiConfigured()) {
        try {
          const fresh = await fetchAnalysis(id);
          if (cancelled) return;
          saveDataset(fresh);
          setData(fresh);
          setLoading(false);
          return;
        } catch {
          /* fall through to redirect */
        }
      }
      if (!cancelled) router.replace("/");
    };

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex-1 flex flex-col">
      <DashboardTopbar
        filename={data.meta.filename}
        rowCount={data.meta.row_count}
        columnCount={data.meta.column_count}
        onExport={exportPdf}
        exporting={exporting}
      />

      <main
        id="dashboard-capture"
        className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-6 md:py-8 space-y-4 md:space-y-6 pb-64"
      >
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <p className="eyebrow">Overview</p>
          <h1 className="text-h1 max-w-3xl">
            Here&rsquo;s what&rsquo;s <span className="text-gradient">happening</span> in your data.
          </h1>
        </motion.section>

        <section>
          <KPIGrid kpis={data.kpis} />
        </section>

        {data.anomalies.length > 0 && (
          <section>
            <AnomalyBanner anomalies={data.anomalies} />
          </section>
        )}

        <section>
          <ChartGrid charts={data.charts} />
        </section>

        <section>
          <DataTable rows={data.preview_rows} schema={data.schema} />
        </section>
      </main>

      <div data-pdf-hide>
        <QueryBar
          datasetId={id}
          suggestedQuestions={data.suggested_questions}
        />
      </div>
    </div>
  );
}
