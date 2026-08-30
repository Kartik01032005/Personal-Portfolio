"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Ultra-smooth inertial scroll controller.
 * Provides fluid, momentum-based scrolling with zero layout thrashing
 * and seamless anchor navigation.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const isScrollingRef = useRef(false);

  useEffect(() => {
    if (reduced) return;

    // Check if touch device - keep native touch momentum on touchscreens
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let rafId: number | null = null;
    const ease = 0.085; // Natural smooth inertia coefficient

    const onWheel = (e: WheelEvent) => {
      // Don't interfere if modal or dropdown is scrolling internally
      const target = e.target as HTMLElement;
      if (target?.closest(".case-modal, [data-prevent-smooth-scroll]")) {
        return;
      }

      // Allow default behavior for modifier keys (zoom etc.)
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;

      e.preventDefault();
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetY = Math.max(0, Math.min(targetY + e.deltaY * 1.05, maxScroll));

      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        animateScroll();
      }
    };

    const animateScroll = () => {
      const diff = targetY - currentY;
      currentY += diff * ease;

      if (Math.abs(diff) > 0.4) {
        window.scrollTo(0, Math.round(currentY));
        rafId = requestAnimationFrame(animateScroll);
      } else {
        window.scrollTo(0, targetY);
        currentY = targetY;
        isScrollingRef.current = false;
        if (rafId) cancelAnimationFrame(rafId);
      }
    };

    const onSyncScroll = () => {
      if (!isScrollingRef.current) {
        targetY = window.scrollY;
        currentY = window.scrollY;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onSyncScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onSyncScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  return <>{children}</>;
}
