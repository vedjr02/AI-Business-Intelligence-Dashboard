"use client";

/**
 * ClickSpark — radial line burst on click, ported to TypeScript from React Bits.
 *
 * Improvements over the source:
 *  - High-DPI aware (multiplies the canvas by devicePixelRatio for crisp lines).
 *  - `sparkColor="auto"` reads `--text-primary` so the burst always contrasts
 *    with the current theme without subscribing to ThemeProvider.
 *  - The wrapper passes pointer events through so children remain interactive.
 *
 * Usage:
 *   <ClickSpark sparkColor="auto" sparkSize={16} sparkRadius={50} sparkCount={9} duration={350}>
 *     {children}
 *   </ClickSpark>
 */

import { useCallback, useEffect, useRef } from "react";

type Easing = "linear" | "ease-in" | "ease-in-out" | "ease-out";

interface ClickSparkProps {
  /** Hex/rgb string, or `"auto"` to use the theme foreground (`--text-primary`). */
  sparkColor?: string;
  /** Initial length of each spark line. */
  sparkSize?: number;
  /** How far each spark travels from the click centre. */
  sparkRadius?: number;
  /** Number of spark lines per click. */
  sparkCount?: number;
  /** Total animation duration in ms. */
  duration?: number;
  /** Easing curve for the burst. */
  easing?: Easing;
  /** Additional multiplier on spark travel distance. */
  extraScale?: number;
  children?: React.ReactNode;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

export default function ClickSpark({
  sparkColor = "auto",
  sparkSize = 12,
  sparkRadius = 24,
  sparkCount = 9,
  duration = 480,
  easing = "ease-out",
  extraScale = 1,
  children,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Keep the canvas sized to its container (incl. devicePixelRatio for crisp lines).
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = wrapperRef.current;
    if (!canvas || !parent) return;

    let resizeTimeout: number | undefined;

    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const targetW = Math.max(1, Math.floor(width * dpr));
      const targetH = Math.max(1, Math.floor(height * dpr));
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext("2d");
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resizeCanvas, 100);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(parent);

    resizeCanvas();

    return () => {
      ro.disconnect();
      window.clearTimeout(resizeTimeout);
    };
  }, []);

  const ease = useCallback(
    (t: number) => {
      switch (easing) {
        case "linear":
          return t;
        case "ease-in":
          return t * t;
        case "ease-in-out":
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        case "ease-out":
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  // RAF render loop — only paints when sparks exist (no work otherwise).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;

    const resolveColor = () => {
      if (sparkColor !== "auto") return sparkColor;
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--text-primary")
        .trim();
      return v || "#0a0a0a";
    };

    const draw = (timestamp: number) => {
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      const color = resolveColor();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const eased = ease(progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const cosA = Math.cos(spark.angle);
        const sinA = Math.sin(spark.angle);

        const x1 = spark.x + distance * cosA;
        const y1 = spark.y + distance * sinA;
        const x2 = spark.x + (distance + lineLength) * cosA;
        const y2 = spark.y + (distance + lineLength) * sinA;

        ctx.globalAlpha = 1 - eased;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [sparkColor, sparkSize, sparkRadius, duration, ease, extraScale]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = performance.now();
    const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now,
    }));

    sparksRef.current.push(...newSparks);
  };

  return (
    <div
      ref={wrapperRef}
      onClick={handleClick}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 60,
        }}
      />
      {children}
    </div>
  );
}
