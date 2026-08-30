"use client";

import { motion, useReducedMotion } from "framer-motion";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  highlightWord?: string;
  highlightClass?: string;
}

export function TextReveal({
  children,
  className = "",
  delay = 0,
  as: Component = "div",
  highlightWord,
  highlightClass = "text-accent",
}: TextRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <Component className={className}>{children}</Component>;
  }

  const words = children.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (customDelay = 0) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.045,
        delayChildren: customDelay,
      },
    }),
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 35,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  return (
    <Component className={`text-reveal-wrapper ${className}`}>
      <motion.span
        className="text-reveal-inline"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={delay}
      >
        {words.map((word, i) => {
          const isHighlight = highlightWord && word.toLowerCase().includes(highlightWord.toLowerCase());
          return (
            <span key={`${word}-${i}`} className="text-reveal-mask">
              <motion.span
                variants={wordVariants}
                className={`text-reveal-word ${isHighlight ? highlightClass : ""}`}
              >
                {word}
                {i < words.length - 1 ? "\u00A0" : ""}
              </motion.span>
            </span>
          );
        })}
      </motion.span>
    </Component>
  );
}
