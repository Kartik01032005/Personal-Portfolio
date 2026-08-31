"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface ScrollSectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  "aria-labelledby"?: string;
  style?: React.CSSProperties;
}

export default function ScrollSection({
  id,
  className = "",
  children,
  "aria-labelledby": ariaLabelledby,
  style,
}: ScrollSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Smooth cinematic section transitions matching the reference feel:
  // As section enters: gentle translate-up, scale-up, and opacity fade-in
  // In view: full opacity and scale
  // As section leaves top: subtle translate and opacity softening for seamless continuity
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    [0.4, 1, 1, 0.55]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    [0.982, 1, 1, 0.988]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    [28, 0, 0, -20]
  );

  if (reduced) {
    return (
      <section
        id={id}
        ref={ref}
        className={className}
        aria-labelledby={ariaLabelledby}
        style={style}
      >
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      aria-labelledby={ariaLabelledby}
      style={{
        ...style,
        opacity,
        scale,
        y,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.section>
  );
}
