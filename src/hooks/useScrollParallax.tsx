import { useEffect } from "react";

export default function useScrollParallax(
  ref: React.RefObject<HTMLElement | null>,
  strength = 0.06
) {
  useEffect(() => {
    if (!ref?.current) return;
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const el = ref.current as HTMLElement;
    let raf = 0;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight || document.documentElement.clientHeight;
      // compute a centered percentage (-1..1)
      const centerOffset = (rect.top + rect.height / 2 - winH / 2) / (winH / 2);
      const translateY = -centerOffset * strength * 100; // px-ish effect
      el.style.transform = `translate3d(0, ${translateY}px, 0)`;
    };

    const handler = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(onScroll);
    };

    window.addEventListener("scroll", handler, { passive: true });
    // initial
    handler();

    return () => {
      window.removeEventListener("scroll", handler);
      if (raf) cancelAnimationFrame(raf);
      // reset transform
      if (el) el.style.transform = "";
    };
  }, [ref, strength]);
}
