"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
      if (mediaQuery?.matches) return;

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        infinite: false,
      });

      window.__lenis = lenis;

      let rafId: number;
      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      const onReducedMotionChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          lenis.destroy();
          window.__lenis = undefined;
          cancelAnimationFrame(rafId);
        }
      };

      if (mediaQuery) {
        if (typeof mediaQuery.addEventListener === "function") {
          mediaQuery.addEventListener("change", onReducedMotionChange);
        } else if (typeof (mediaQuery as any).addListener === "function") {
          (mediaQuery as any).addListener(onReducedMotionChange);
        }
      }

      return () => {
        if (mediaQuery) {
          if (typeof mediaQuery.removeEventListener === "function") {
            mediaQuery.removeEventListener("change", onReducedMotionChange);
          } else if (typeof (mediaQuery as any).removeListener === "function") {
            (mediaQuery as any).removeListener(onReducedMotionChange);
          }
        }
        cancelAnimationFrame(rafId);
        lenis.destroy();
        window.__lenis = undefined;
      };
    } catch {
      // Fallback gracefully without throwing
    }
  }, []);

  return null;
}
