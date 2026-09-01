"use client";

import { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface AboutSectionProps {
  SectionLabel: React.ComponentType<{ index: string; children: React.ReactNode }>;
  jumpTo: (href: string) => void;
}

const text1 =
  "I'm Kartik Manjunath Nilekani — a Computer Science and Business Systems engineering student passionate about building practical solutions at the intersection of software, data analytics, finance, and AI. I enjoy transforming ideas into meaningful digital products and exploring how technology can solve real-world problems.";

const text2 =
  "I work with modern web technologies and AI tools, continuously expanding my skills through hands-on projects, internships, hackathons, and experimentation. My goal is to combine technical thinking with business and analytical perspectives to build solutions that are useful, practical, and impactful.";

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

export function AboutSection({ SectionLabel, jumpTo }: AboutSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={containerRef} className="about-pin-container">
      <section
        id="about"
        className="section-shell section-shell--light about-section about-section--pinned"
        aria-labelledby="about-title"
      >
        <div className="section-rail">
          <SectionLabel index="01">About</SectionLabel>
          <p className="rail-note">A practical builder with a wide lens.</p>
        </div>
        <div className="about-main">
          <div className="about-section-heading">
            <p className="eyebrow">Profile / foundation</p>
            <h2 id="about-title">
              About Me<span>.</span>
            </h2>
          </div>
          <div className="about-layout">
            <div className="about-portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/profile.jpg"
                alt="Kartik Manjunath Nilekani"
                className="about-portrait__img"
                loading="lazy"
              />
            </div>
            <div className="about-copy">
              <GlowingTrailParagraph
                text={text1}
                containerRef={containerRef}
                startProgress={0.04}
                endProgress={0.46}
                className="lede"
              />
              <GlowingTrailParagraph
                text={text2}
                containerRef={containerRef}
                startProgress={0.46}
                endProgress={0.88}
              />
              <div className="about-meta">
                <span>
                  <b>01</b> Srinivas Institute of Technology
                </span>
                <span>
                  <b>02</b> 2023—2027 / Mangalore
                </span>
              </div>
              <div className="about-actions">
                <a
                  className="button button--primary"
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Kartik-Manjunath-Nilekani-Resume.pdf"
                >
                  Download Resume <ArrowUpRight size={16} />
                </a>
                <button
                  className="button button--outline"
                  type="button"
                  onClick={() => jumpTo("#experience")}
                  suppressHydrationWarning
                >
                  Learn more about me <ArrowDownRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
