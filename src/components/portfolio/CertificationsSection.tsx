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
import { ArrowUpRight, Award, Shield, Code, Cloud } from "lucide-react";
import { certifications, Certification } from "@/data/portfolio";

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

function getCertIcon(category?: string) {
  switch (category?.toLowerCase()) {
    case "networking":
      return <Award size={28} />;
    case "cybersecurity":
      return <Shield size={28} />;
    case "development":
      return <Code size={28} />;
    case "cloud computing":
      return <Cloud size={28} />;
    default:
      return <Award size={28} />;
  }
}

function CertCardInner({ cert }: { cert: Certification }) {
  return (
    <>
      {/* Top: Certificate Visual Badge / Header */}
      <div className="cert-ref-card__visual">
        <div className="cert-ref-card__badge-icon">
          {getCertIcon(cert.category)}
        </div>
        <div className="cert-ref-card__meta-top">
          <span className="cert-ref-card__category">{cert.category || "Credential"}</span>
          <span className="cert-ref-card__year mono">{cert.year}</span>
        </div>
      </div>

      {/* Bottom: Certificate Information */}
      <div className="cert-ref-card__body">
        <div className="cert-ref-card__header">
          <h3 className="cert-ref-card__title">{cert.name}</h3>
          <span className="cert-ref-card__issuer">{cert.issuer}</span>
        </div>

        <p className="cert-ref-card__desc">{cert.detail}</p>

        <div className="cert-ref-card__footer">
          <a
            className="cert-ref-card__action"
            href={cert.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View certificate for ${cert.name}`}
            suppressHydrationWarning
          >
            <span>View Certificate</span>
            <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </>
  );
}

function HorizontalCertCard({
  cert,
  index,
  total,
  scrollYProgress,
  isMobile,
}: {
  cert: Certification;
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

  const rawScale = useTransform(scrollYProgress, [r0, r1, r2], [0.95, 1.0, 0.95]);
  const scale = useSpring(rawScale, { stiffness: 90, damping: 20 });

  if (isMobile || reduced) {
    return (
      <div className="cert-horizontal-card-wrap">
        <article className="cert-ref-card" tabIndex={0}>
          <CertCardInner cert={cert} />
        </article>
      </div>
    );
  }

  return (
    <motion.div
      className="cert-horizontal-card-wrap"
      style={{
        scale,
      }}
    >
      <article className="cert-ref-card" tabIndex={0}>
        <CertCardInner cert={cert} />
      </article>
    </motion.div>
  );
}

export function CertificationsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxScrollDistance, setMaxScrollDistance] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const updateDimensions = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);

      if (!mobile && trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const stageWidth =
          trackRef.current.parentElement?.clientWidth || window.innerWidth * 0.55;
        const overflow = Math.max(0, trackWidth - stageWidth + 40);
        setMaxScrollDistance(overflow);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const cardCount = certifications.length;
      const startP = 0.06;
      const endP = 0.88;
      const norm = Math.max(0, Math.min(1, (latest - startP) / (endP - startP)));
      const idx = Math.min(cardCount, Math.max(1, Math.floor(norm * cardCount) + 1));
      setActiveCardIndex(idx);
    });
  }, [scrollYProgress]);

  const rawX = useTransform(
    scrollYProgress,
    [0.08, 0.9],
    [0, -maxScrollDistance]
  );
  const smoothX = useSpring(rawX, {
    stiffness: 75,
    damping: 22,
    mass: 0.85,
  });

  const line1Words = ["SIGNALS", "OF"];
  const line2Words = ["CONTINUED", "LEARNING."];

  return (
    <section
      id="certifications"
      ref={containerRef}
      className="cert-horizontal-section section-shell--light"
      aria-labelledby="certifications-title"
    >
      <div className="cert-sticky-viewport">
        {/* Left Side: Sidebar Header & Progress Indicator */}
        <div className="cert-sticky-sidebar">
          <div className="section-label">
            <span className="section-label__index">06 /</span>
            <span>certifications</span>
          </div>

          <motion.p
            className="eyebrow cert-header-eyebrow"
            variants={eyebrowVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.25 }}
          >
            SELECTED CREDENTIALS
          </motion.p>

          <h2 id="certifications-title" aria-label="Signals of continued learning.">
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

          <p className="cert-sidebar-desc">
            Selected certificates that document the learning behind the work and the systems I continue to build.
          </p>

          {/* Active Certificate & Progress Bar Widget */}
          <div className="cert-scroll-indicator" aria-hidden="true">
            <div className="cert-counter-badge">
              <span className="counter-current">0{activeCardIndex}</span>
              <span className="counter-total">/ 0{certifications.length}</span>
            </div>
            <div className="cert-progress-track">
              <motion.div
                className="cert-progress-fill"
                style={{ scaleX: scrollYProgress }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Horizontal Motion Stage */}
        <div className="cert-horizontal-stage">
          <motion.div
            ref={trackRef}
            className="cert-horizontal-track"
            style={isMobile || reduced ? undefined : { x: smoothX }}
          >
            {certifications.map((cert: Certification, index: number) => (
              <HorizontalCertCard
                key={cert.name}
                cert={cert}
                index={index}
                total={certifications.length}
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
