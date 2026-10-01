"use client";

import { motion, Variants } from "framer-motion";
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

export function CurrentFocusSection({ SectionLabel }: CurrentFocusSectionProps) {
  return (
    <section
      id="current-focus"
      className="section-shell section-shell--warm focus-section"
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
            <div key={`${index}-${item}`} className="focus-item">
              <span className="mono focus-item__index">
                0{index + 1}
              </span>
              <span className="focus-item__text">{item}</span>
              <ArrowUpRight size={16} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
