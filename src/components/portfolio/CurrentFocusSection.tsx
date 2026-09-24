"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { currentFocus } from "@/data/portfolio";

const headingWordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.88,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 130,
      damping: 15,
      mass: 0.7,
    },
  },
};

interface CurrentFocusSectionProps {
  SectionLabel: React.ComponentType<{ index: string; children: React.ReactNode }>;
}

function FocusItemGlowTrail({
  text,
  containerRef,
  itemIndex,
  totalItems,
}: {
  text: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  itemIndex: number;
  totalItems: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const [activeWordCount, setActiveWordCount] = useState(reduced ? words.length : 0);

  useEffect(() => {
    if (reduced) {
      setActiveWordCount(words.length);
      return;
    }

    const itemStep = 0.85 / totalItems;
    const startProgress = 0.04 + itemIndex * itemStep;
    const endProgress = startProgress + itemStep * 0.95;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      let progress = 0;
      if (totalScrollable <= 0) {
        if (rect.top <= windowHeight * 0.7) progress = 1;
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
  }, [containerRef, itemIndex, totalItems, words.length, reduced]);

  return (
    <>
      <span className="mono focus-item__index" data-active={activeWordCount > 0 ? "true" : "false"}>
        0{itemIndex + 1}
      </span>
      <span className="focus-item__text">
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
      </span>
    </>
  );
}

export function CurrentFocusSection({ SectionLabel }: CurrentFocusSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={containerRef} className="focus-pin-container">
      <section
        className="section-shell section-shell--warm focus-section focus-section--pinned"
        aria-labelledby="focus-title"
      >
        <div className="section-rail">
          <SectionLabel index="07">Current focus</SectionLabel>
          <p className="rail-note">
            A roadmap with
            <br />
            room to change.
          </p>
        </div>
        <div className="focus-content">
          <div className="section-heading">
            <p className="eyebrow">Currently building & learning</p>
            <h2 id="focus-title" aria-label="Curious enough to keep going.">
              <motion.span
                style={{ display: "block" }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.07,
                      delayChildren: 0.06,
                    },
                  },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.25 }}
              >
                {["Curious", "enough"].map((word, index) => (
                  <span
                    key={`focus-l1-${index}`}
                    style={{
                      display: "inline-block",
                      overflow: "visible",
                      marginRight: "0.28em",
                    }}
                  >
                    <motion.span
                      variants={headingWordVariants}
                      style={{
                        display: "inline-block",
                        transformOrigin: "center bottom",
                      }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </motion.span>

              <motion.span
                style={{ display: "block", color: "#EA5B24" }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.07,
                      delayChildren: 0.28,
                    },
                  },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.25 }}
              >
                {["to", "keep"].map((word, index) => (
                  <span
                    key={`focus-l2-${index}`}
                    style={{
                      display: "inline-block",
                      overflow: "visible",
                      marginRight: "0.28em",
                    }}
                  >
                    <motion.span
                      variants={headingWordVariants}
                      style={{
                        display: "inline-block",
                        transformOrigin: "center bottom",
                      }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
                <span
                  style={{
                    display: "inline-block",
                    overflow: "visible",
                  }}
                >
                  <motion.em
                    variants={headingWordVariants}
                    style={{
                      display: "inline-block",
                      transformOrigin: "center bottom",
                    }}
                  >
                    going.
                  </motion.em>
                </span>
              </motion.span>
            </h2>
          </div>
          <div className="focus-list">
            {currentFocus.map((item: string, index: number) => (
              <div
                key={`${index}-${item}`}
                className="focus-item"
              >
                <FocusItemGlowTrail
                  text={item}
                  containerRef={containerRef}
                  itemIndex={index}
                  totalItems={currentFocus.length}
                />
                <ArrowUpRight size={16} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
