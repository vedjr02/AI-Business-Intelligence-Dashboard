"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, ArrowRight, Sparkles, BarChart3, Lock, FileText } from "lucide-react";
import { DropZone } from "@/components/upload/DropZone";
import { SampleDatasetChip } from "@/components/upload/SampleDatasetChip";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import Aurora from "@/components/layout/Aurora";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ApiStatusBanner } from "@/components/layout/ApiStatusBanner";
import VariableProximity from "@/components/effects/VariableProximity";
import { saveDataset } from "@/lib/datasetStore";
import { getMockAnalysis } from "@/lib/mockData";
import { isApiConfigured, uploadFile } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

const containerStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const EASE = [0.16, 1, 0.3, 1] as const;

const FEATURES = [
  {
    icon: Sparkles,
    title: "Ask anything",
    description:
      "Natural-language Q&A grounded in your actual numbers. No prompt-engineering required.",
  },
  {
    icon: BarChart3,
    title: "Auto KPIs",
    description:
      "Revenue, growth, margins, outliers — surfaced the second you upload.",
  },
  {
    icon: Lock,
    title: "Anomaly detection",
    description:
      "Statistical IQR flags catch the weird stuff you'd never spot by eye.",
  },
  {
    icon: FileText,
    title: "PDF reports",
    description:
      "Export a polished, AI-summarized brief in one click — share-ready.",
  },
];

const STATS = [
  { value: "10s", label: "From CSV to insight" },
  { value: "30+", label: "KPIs surfaced automatically" },
  { value: "1-click", label: "Executive PDF report" },
];

export default function LandingPage() {
  const { show } = useToast();
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  const handleUpload = async (file: File): Promise<string> => {
    if (isApiConfigured()) {
      const analysis = await uploadFile(file);
      saveDataset(analysis);
      return analysis.meta.id;
    }
    await new Promise((r) => setTimeout(r, 700));
    const id = crypto.randomUUID();
    const analysis = getMockAnalysis(id, file.name);
    saveDataset(analysis);
    return id;
  };

  const handleSample = async (filename: string, rows: number) => {
    if (!isApiConfigured()) {
      const id = crypto.randomUUID();
      const analysis = getMockAnalysis(id, filename);
      analysis.meta.row_count = rows;
      saveDataset(analysis);
      window.location.assign(`/dashboard/${id}`);
      return;
    }
    try {
      const res = await fetch(`/samples/${filename}`);
      if (!res.ok) {
        throw new Error(
          `Could not load ${filename} from this site (${res.status}).`
        );
      }
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "text/csv" });
      const analysis = await uploadFile(file);
      saveDataset(analysis);
      window.location.assign(`/dashboard/${analysis.meta.id}`);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Analysis failed. Check the API.";
      show({
        variant: "error",
        title: "Sample could not be analysed",
        description: `${msg} For live numbers, ensure your FastAPI server is reachable (BACKEND_URL on Vercel) and clear NEXT_PUBLIC_BI_MOCK_ONLY.`,
      });
    }
  };

  const scrollToUpload = () => {
    document
      .getElementById("upload")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="relative isolate flex flex-1 flex-col">
      {/* Aurora sits at z-0. Do NOT put an opaque bg on <main> — it would paint over
          negative-z children and hide the canvas. Page fill comes from body (globals.css). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[130vh] md:h-[140vh]"
      >
        <Aurora
          colorStops={["#ed3abe", "#9c3ef9", "#2503b0"]}
          blend={0.7}
          amplitude={1.15}
          speed={0.5}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--bg-base))",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="fixed top-4 right-4 z-50 md:top-5 md:right-5"
      >
        <ThemeToggle className="h-8 w-8 [&_svg]:!h-3.5 [&_svg]:!w-3.5" />
      </motion.div>

      <div className="relative z-10 flex flex-1 flex-col">
      {/* ───────────── Hero — huge type, parallax fade ───────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[100vh] flex flex-col justify-center px-6 lg:px-8 pt-24 pb-24"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          variants={containerStagger}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-6xl w-full"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: EASE }}
            className="eyebrow mb-6"
          >
            AI business intelligence
          </motion.div>

          <motion.h1
            ref={headlineRef}
            variants={fadeUp}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-display max-w-[18ch] cursor-default"
          >
            <VariableProximity
              label="Decisions, delivered"
              containerRef={headlineRef}
              fromFontVariationSettings="'wght' 820, 'opsz' 110"
              toFontVariationSettings="'wght' 1000, 'opsz' 144"
              radius={180}
              falloff="linear"
              style={{ display: "block" }}
            />
            <VariableProximity
              label="from your data."
              containerRef={headlineRef}
              fromFontVariationSettings="'wght' 820, 'opsz' 110"
              toFontVariationSettings="'wght' 1000, 'opsz' 144"
              radius={180}
              falloff="linear"
              style={{ display: "block" }}
            />
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-lead mt-8 max-w-2xl"
          >
            Drop a CSV or Excel file and get instant KPIs, charts, anomaly
            detection, and an AI analyst that answers your questions in plain
            English.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Button
              size="lg"
              variant="primary"
              iconRight={<ArrowDown size={18} />}
              onClick={scrollToUpload}
            >
              Upload your data
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleSample("superstore.csv", 30)}
            >
              Try a sample
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll affordance */}
        <motion.button
          onClick={scrollToUpload}
          className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors"
          aria-label="Scroll to upload"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={16} />
          </motion.div>
        </motion.button>
      </section>

      {/* ───────────── Hairline divider ───────────── */}
      <div className="hairline" />

      <ApiStatusBanner />

      {/* ───────────── Upload section ───────────── */}
      <section id="upload" className="px-6 lg:px-8 py-24 lg:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div>
              <div className="eyebrow mb-4">Step 1</div>
              <h2 className="text-h1 max-w-[15ch]">Start with a file.</h2>
            </div>
            <p className="text-lead max-w-md md:text-right">
              CSV or Excel, up to 50&nbsp;MB. Or pick a sample below to see what
              the dashboard looks like.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="space-y-4"
          >
            {!isApiConfigured() && (
              <p className="text-sm text-[color:var(--text-secondary)] rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-subtle)] px-4 py-3">
                <span className="font-medium text-[color:var(--text-primary)]">
                  Static demo mode
                </span>{" "}
                — NEXT_PUBLIC_BI_MOCK_ONLY is set, so every file and sample uses
                the same preset KPIs. Remove it to analyse real uploads via your
                API.
              </p>
            )}
            <DropZone onUpload={handleUpload} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <span className="eyebrow">Or try a sample</span>
            <div className="flex flex-wrap gap-2 justify-center">
              <SampleDatasetChip
                emoji="🛒"
                label="Superstore Sales"
                rows={30}
                onClick={() => handleSample("superstore.csv", 30)}
              />
              <SampleDatasetChip
                emoji="📞"
                label="Telco Customers"
                rows={50}
                onClick={() => handleSample("telco.csv", 50)}
              />
              <SampleDatasetChip
                emoji="📦"
                label="E-commerce Orders"
                rows={40}
                onClick={() => handleSample("ecommerce.csv", 40)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="hairline" />

      {/* ───────────── Stats strip ───────────── */}
      <section className="px-6 lg:px-8 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            >
              <div className="text-h1 leading-none">{s.value}</div>
              <div className="text-[color:var(--text-secondary)] mt-3 text-sm">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="hairline" />

      {/* ───────────── Features — solid card grid ───────────── */}
      <section className="px-6 lg:px-8 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-16 max-w-3xl"
          >
            <div className="eyebrow mb-4">What you get</div>
            <h2 className="text-h1">
              An entire analytics team, in one upload.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[color:var(--border)] border border-[color:var(--border)] rounded-3xl overflow-hidden">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.07,
                    ease: EASE,
                  }}
                  className="bg-[color:var(--bg-surface)] p-8 lg:p-10 group hover:bg-[color:var(--bg-subtle)] transition-colors duration-300"
                >
                  <div className="h-12 w-12 rounded-2xl bg-[color:var(--text-primary)] text-[color:var(--text-inverse)] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <h3 className="text-h3 mb-2">{f.title}</h3>
                  <p className="text-[color:var(--text-secondary)] leading-relaxed">
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="hairline" />

      {/* ───────────── Closing CTA ───────────── */}
      <section className="px-6 lg:px-8 py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="text-display">
            Stop staring at <span className="text-gradient">spreadsheets.</span>
          </h2>
          <p className="text-lead mt-8 max-w-xl mx-auto">
            Upload once. Get answers in seconds. Share a polished brief with
            your team in one click.
          </p>
          <div className="mt-10 flex justify-center">
            <Button
              size="lg"
              variant="primary"
              iconRight={<ArrowRight size={18} />}
              onClick={scrollToUpload}
            >
              Upload your data
            </Button>
          </div>
        </motion.div>
      </section>

      <SiteFooter />
    </div>
    </main>
  );
}
