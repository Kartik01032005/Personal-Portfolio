"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  MotionValue,
  Variants,
} from "framer-motion";
import { verifiedTimeline, TimelineItem } from "@/data/portfolio";

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

const eyebrowVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function TimelineItemCard({
  item,
  index,
  total,
  scrollYProgress,
  isMobile,
}: {
  item: TimelineItem;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  isMobile: boolean;
}) {
  const reduced = useReducedMotion();

  const startP = 0.08;
  const endP = 0.88;
  const step = (endP - startP) / Math.max(total - 1, 1);
  const center = startP + index * step;
  const radius = step * 0.75;

  const r0 = Math.max(0, center - radius);
  const r1 = center;
  const r2 = Math.min(1, center + radius);

  const rawScale = useTransform(scrollYProgress, [r0, r1, r2], [0.94, 1.0, 0.94]);
  const rawOpacity = useTransform(scrollYProgress, [r0, r1, r2], [0.55, 1.0, 0.55]);

  const scale = useSpring(rawScale, { stiffness: 90, damping: 20 });
  const opacity = useSpring(rawOpacity, { stiffness: 90, damping: 20 });

  if (isMobile || reduced) {
    return (
      <article className="timeline-item">
        <div className="timeline-item__date mono">{item.date}</div>
        <div className="timeline-item__marker">
          <span />
        </div>
        <div className="timeline-item__body">
          <p className="eyebrow">{item.org}</p>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      </article>
    );
  }

  return (
    <motion.article
      className="timeline-item timeline-item--animated"
      style={{
        scale,
        opacity,
      }}
    >
      <div className="timeline-item__date mono">{item.date}</div>
      <div className="timeline-item__marker">
        <span />
      </div>
      <div className="timeline-item__body">
        <p className="eyebrow">{item.org}</p>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </motion.article>
  );
}

export function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [maxScrollDistance, setMaxScrollDistance] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(1);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const updateDimensions = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);

      if (!mobile && listRef.current) {
        const listHeight = listRef.current.scrollHeight;
        const viewportStageHeight = window.innerHeight * 0.58;
        const overflow = Math.max(0, listHeight - viewportStageHeight + 60);
        setMaxScrollDistance(overflow);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const count = verifiedTimeline.length;
      const startP = 0.06;
      const endP = 0.88;
      const norm = Math.max(0, Math.min(1, (latest - startP) / (endP - startP)));
      const idx = Math.min(count, Math.max(1, Math.floor(norm * count) + 1));
      setActiveItemIndex(idx);
    });
  }, [scrollYProgress]);

  // Spring smoothed upward scroll translation (moving y from 0 to -maxScrollDistance)
  const rawY = useTransform(
    scrollYProgress,
    [0.08, 0.90],
    [0, -maxScrollDistance]
  );
  const smoothY = useSpring(rawY, {
    stiffness: 75,
    damping: 22,
    mass: 0.85,
  });

  const line1Words = ["THE", "WORK", "BEHIND"];
  const line2Words = ["THE", "WORK."];

  return (
    <section
      id="experience"
      ref={containerRef}
      className="experience-vertical-section section-shell--dark"
      aria-labelledby="experience-title"
    >
      <div className="experience-sticky-viewport">
        {/* Left Side: Header & Rail Info */}
        <div className="experience-sticky-sidebar">
          <div className="section-rail" style={{ marginBottom: "1rem" }}>
            <div className="section-label">
              <span className="section-label__index">05 /</span>
              <span>Experience</span>
            </div>
            <p className="rail-note">
              Learning in public,
              <br />
              building with intent.
            </p>
          </div>

          <div className="experience-header-main">
            <motion.p
              className="eyebrow"
              variants={eyebrowVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.25 }}
            >
              A workbench, not a highlight reel
            </motion.p>

            <h2 id="experience-title" aria-label="The work behind the work.">
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
                {line1Words.map((word, i) => (
                  <span
                    key={`l1-${i}`}
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

              <motion.em
                style={{ display: "block", fontStyle: "normal" }}
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
                {line2Words.map((word, i) => (
                  <span
                    key={`l2-${i}`}
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
              </motion.em>
            </h2>
          </div>

          <div className="experience-scroll-indicator" aria-hidden="true">
            <div className="experience-counter-badge">
              <span className="counter-current">0{activeItemIndex}</span>
              <span className="counter-total">/ 0{verifiedTimeline.length}</span>
            </div>
            <div className="experience-progress-track">
              <motion.div
                className="experience-progress-fill"
                style={{ scaleY: scrollYProgress }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Upward Scrolling Timeline Stage */}
        <div className="experience-sticky-stage">
          <motion.div
            ref={listRef}
            className="timeline experience-timeline-track"
            style={isMobile || reduced ? undefined : { y: smoothY }}
          >
            {verifiedTimeline.map((item: TimelineItem, index: number) => (
              <TimelineItemCard
                key={`${item.title}-${item.date}`}
                item={item}
                index={index}
                total={verifiedTimeline.length}
                scrollYProgress={scrollYProgress}
                isMobile={isMobile}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
