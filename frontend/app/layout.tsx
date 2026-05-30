import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import ClickSpark from "@/components/effects/ClickSpark";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Lumen — AI Business Intelligence",
  description:
    "Upload any CSV or Excel file and get instant AI-powered insights, anomaly detection, and beautiful reports.",
  applicationName: "Lumen BI",
  authors: [{ name: "Lumen" }],
  manifest: "/manifest.json",
  keywords: ["AI", "BI", "Dashboard", "Analytics", "Claude", "Data"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider>
          <SmoothScroll>
            <ToastProvider>
              <ClickSpark
                sparkColor="auto"
                sparkSize={14}
                sparkRadius={42}
                sparkCount={10}
                duration={420}
                easing="ease-out"
              >
                <div className="relative z-10 min-h-screen flex flex-col">
                  {children}
                </div>
              </ClickSpark>
            </ToastProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
