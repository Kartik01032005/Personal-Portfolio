"use client";

import { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface EducationSectionProps {
  SectionLabel: React.ComponentType<{ index: string; children: React.ReactNode }>;
}

const text3 =
  "A multidisciplinary program blending software, computer science, data, and business fundamentals.";

function GlowingTrailParagraph({
  text,
  containerRef,
  startProgress,
  endProgress,
  className,
}: {
  text: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  startProgress: number;
  endProgress: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const [activeWordCount, setActiveWordCount] = useState(reduced ? words.length : 0);

  useEffect(() => {
    if (reduced) {
      setActiveWordCount(words.length);
      return;
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      let progress = 0;
      if (totalScrollable <= 0) {
        if (rect.top <= windowHeight * 0.65) progress = 1;
      } else {
        progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      }

      if (progress >= startProgress) {
        const normalized = Math.min(
          1,
          Math.max(0, (progress - startProgress) / (endProgress - startProgress))
        );
        const count = Math.min(
          words.length,
          Math.floor(normalized * (words.length + 1))
        );
        setActiveWordCount(count);
      } else {
        setActiveWordCount(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [containerRef, startProgress, endProgress, words.length, reduced]);

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

  return (
    <div ref={containerRef} className="education-pin-container">
      <section
        id="education"
        className="section-shell section-shell--light education-section education-section--pinned"
        aria-labelledby="education-title"
      >
        <div className="section-rail">
          <SectionLabel index="02">Education</SectionLabel>
          <p className="rail-note">
            Foundations for
            <br />
            the next build.
          </p>
        </div>
        <div className="education-content">
          <div className="education-card">
            <div className="education-card__top">
              <div className="education-card__info">
                <p className="eyebrow">Current foundation</p>
                <h2 id="education-title">
                  B.E. — Computer Science
                  <br />& Business Systems
                </h2>
                <p className="education-card__institution">Srinivas Institute of Technology</p>
                <GlowingTrailParagraph
                  text={text3}
                  containerRef={containerRef}
                  startProgress={0.04}
                  endProgress={0.48}
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
