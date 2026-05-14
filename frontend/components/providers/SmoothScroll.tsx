"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * SmoothScroll
 *
 * Lenis-powered RAF smooth scroll. Produces the silky, slightly-damped scroll
 * feel popularised by sites like healthytogether.co. Disabled when the user
 * prefers reduced motion. Adds the required `lenis` / `lenis-smooth` classes
 * to <html> so the matching globals.css rules apply.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      lerp: 0.1,
    });

    // Tag <html> so the Lenis recommended CSS rules apply.
    document.documentElement.classList.add("lenis", "lenis-smooth");

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      document.documentElement.classList.remove(
        "lenis",
        "lenis-smooth",
        "lenis-scrolling",
        "lenis-stopped"
      );
    };
  }, []);

  return <>{children}</>;
}
