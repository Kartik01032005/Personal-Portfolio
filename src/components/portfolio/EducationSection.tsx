"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useReducedMotion } from "framer-motion";

interface EducationSectionProps {
  SectionLabel: React.ComponentType<{ index: string; children: React.ReactNode }>;
}

const text3 =
  "A multidisciplinary program blending software, computer science, data, and business fundamentals.";

function GlowingTrailParagraph({
  text,
  activeWordCount,
  className,
}: {
  text: string;
  activeWordCount: number;
  className?: string;
}) {
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <p className={className}>
      {words.map((word, i) => {
        const isActive = i < activeWordCount;
        return (
          <span
            key={i}
            className="glow-trail-word"
            data-active={isActive ? "true" : "false"}
          >
            {word}{" "}
          </span>
        );
      })}
    </p>
  );
}

export function EducationSection({ SectionLabel }: EducationSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const words = useMemo(() => text3.split(" "), []);
  const [activeWordCount, setActiveWordCount] = useState(reduced ? words.length : 0);
  const eduSettledRef = useRef(false);
  const isPausedRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (reduced) {
      setActiveWordCount(words.length);
      return;
    }

    const el = document.getElementById("education");
    if (!el) return;

    // ── Scroll-lock helpers ──────────────────────────────────────────────────
    const preventPausedScroll = (event: Event) => event.preventDefault();
    const preventPausedScrollKeys = (event: KeyboardEvent) => {
      const scrollKeys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
      if (!scrollKeys.includes(event.key)) return;
      if (
        event.target instanceof HTMLElement &&
        event.target.closest("input, textarea, select, [contenteditable='true']")
      ) return;
      event.preventDefault();
    };

    // ── Glow animation ───────────────────────────────────────────────────────
    const triggerGlow = () => {
      // Mobile: instant reveal, no animation
      if (window.innerWidth <= 680) {
        setActiveWordCount(words.length);
        return;
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
      let w = 0;
      setActiveWordCount(0);
      intervalRef.current = setInterval(() => {
        w += 1;
        setActiveWordCount(w);
        if (w >= words.length) {
          if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        }
      }, 40);
    };

    // ── Pause + glow sequence ────────────────────────────────────────────────
    // Called once Lenis is already stopped at the exact section position.
    const runPauseSequence = () => {
      if (isPausedRef.current) return;
      isPausedRef.current = true;

      document.documentElement.classList.add("education-scroll-paused");
      window.addEventListener("wheel", preventPausedScroll, { passive: false });
      window.addEventListener("touchmove", preventPausedScroll, { passive: false });
      window.addEventListener("keydown", preventPausedScrollKeys);

      // Start glow right away — no perceptible delay
      setTimeout(() => { triggerGlow(); }, 50);

      // Release after 650 ms — same duration as other sections
      setTimeout(() => {
        window.removeEventListener("wheel", preventPausedScroll);
        window.removeEventListener("touchmove", preventPausedScroll);
        window.removeEventListener("keydown", preventPausedScrollKeys);
        document.documentElement.classList.remove("education-scroll-paused");
        window.__lenis?.start();
        isPausedRef.current = false;
      }, 650);
    };

    // ── Initial check on mount ───────────────────────────────────────────────
    const initialRect = el.getBoundingClientRect();
    if (window.innerWidth <= 680) {
      setActiveWordCount(words.length);
    } else if (initialRect.top <= 5 && initialRect.bottom > 100) {
      // Page loaded mid-section — show fully revealed
      eduSettledRef.current = true;
      setActiveWordCount(words.length);
    } else {
      setActiveWordCount(0);
    }

    // ── Core scroll handler ──────────────────────────────────────────────────
    //
    // Geometry recap (position:sticky; top:0 inside 100vh container):
    //   - Before container reaches viewport top: rect.top = containerTop > 0
    //   - While container is in viewport (sticky active): rect.top = 0
    //   - After container exits upward: rect.top = containerBottom - elementHeight < 0
    //
    // So rect.top ≈ 0 is the exact moment the section pins at its intended
    // position, in BOTH scroll directions. This is the one valid trigger point.
    //
    // On trigger:
    //   1. lenis.scrollTo(target, { immediate }) — resets Lenis's internal
    //      animation target to the section position, cancelling any remaining
    //      forward momentum so lenis.start() later won't overshoot.
    //   2. lenis.stop() — pauses scroll.
    //   3. runPauseSequence() — glow + 650 ms lock + lenis.start().
    const handleScroll = () => {
      // Mobile: always fully revealed, no interaction
      if (window.innerWidth <= 680) {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        setActiveWordCount(words.length);
        return;
      }

      if (isPausedRef.current) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 800;
      const currentScrollY = window.scrollY || window.pageYOffset || 0;


      // Trigger window: rect.top in [-5, 15] — catches both scroll directions
      // at the exact sticky pin point. Wide enough for Lenis's easing to land
      // cleanly; narrow enough to never fire mid-section.
      const atPosition = rect.top >= -5 && rect.top <= 15 && rect.bottom > 100;

      if (atPosition && !eduSettledRef.current) {
        eduSettledRef.current = true;

        if (window.__lenis && window.innerWidth > 680 && !reduced) {
          // Compute the exact document scroll position for rect.top === 0.
          // targetScrollY = currentScrollY + rect.top (works for both +/- rect.top).
          const targetScrollY = Math.max(0, currentScrollY + rect.top);

          // Step 1: Reset Lenis target → cancels remaining momentum
          window.__lenis.scrollTo(targetScrollY, { immediate: true, force: true });
          // Step 2: Pause
          window.__lenis.stop();
          // Step 3: Glow + lock + resume
          runPauseSequence();
        } else {
          // No Lenis (reduced-motion already returns early above, but guard anyway)
          triggerGlow();
        }
        return;
      }

      // ── Reset triggers ────────────────────────────────────────────────────
      // When section is well above viewport (user scrolled UP past it):
      if (rect.top > viewportHeight * 0.6) {
        eduSettledRef.current = false;
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        setActiveWordCount(0);
      }
      // When section is well below viewport (user scrolled DOWN past it):
      else if (rect.bottom < -100) {
        eduSettledRef.current = false;
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        setActiveWordCount(words.length);
      }

    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("wheel", preventPausedScroll);
      window.removeEventListener("touchmove", preventPausedScroll);
      window.removeEventListener("keydown", preventPausedScrollKeys);
      document.documentElement.classList.remove("education-scroll-paused");
    };
  }, [words.length, reduced]);

  return (
    <div ref={containerRef} className="education-pin-container">
      <section
        id="education"
        className="section-shell section-shell--light education-section education-section--pinned"
        aria-labelledby="education-title"
      >
          <div className="section-rail">
            <SectionLabel index="02">Education</SectionLabel>
            <p className="rail-note">Foundations for the next build.</p>
          </div>
        <div className="education-content">
          <div className="education-card">
            <div className="education-card__top">
              <div className="education-card__info">
                <p className="eyebrow">Current foundation</p>
                <h2 id="education-title">
                  <span className="education-card__degree-line">B.E. — Computer Science &amp;</span>
                  <span className="education-card__degree-line education-card__degree-accent">Business Systems</span>
                </h2>
                <p className="education-card__institution">Srinivas Institute of Technology</p>
                <GlowingTrailParagraph
                  text={text3}
                  activeWordCount={activeWordCount}
                  className="education-card__desc"
                />
              </div>
              <div className="education-card__year mono">
                2023—2027
              </div>
            </div>

            <div className="education-actions">
              <div className="edu-btn edu-btn--solid">
                <span>CGPA 7.85 / 10</span>
              </div>
              <div className="edu-btn edu-btn--outline">
                <span>Mangalore, India</span>
              </div>
              <div className="edu-btn edu-btn--outline">
                <span>CS + Business Systems</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
