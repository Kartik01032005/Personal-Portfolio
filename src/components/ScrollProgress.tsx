"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      if (!barRef.current) {
        ticking = false;
        return;
      }
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
      barRef.current.style.transform = `scaleX(${progress})`;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    // Initial update
    update();

    // Check for Lenis instance to attach smooth frame listener
    const pollForLenis = setInterval(() => {
      if (window.__lenis) {
        window.__lenis.on("scroll", handleScroll);
        clearInterval(pollForLenis);
      }
    }, 200);

    const timeout = setTimeout(() => {
      clearInterval(pollForLenis);
    }, 5000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearInterval(pollForLenis);
      clearTimeout(timeout);
      if (window.__lenis) {
        window.__lenis.off("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="scroll-progress-line"
      aria-hidden="true"
    />
  );
}
