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
import { ArrowUpRight, Github } from "lucide-react";
import { projects, Project } from "@/data/portfolio";

// ─── Heading Spring Variants ──────────────────────────────────────────────────
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

// ─── Card Inner Component (Preserving all original markup & interactions) ────
function ProjectCardInner({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (p: Project) => void;
}) {
  const reduced = useReducedMotion();
  const cinematicEasing = [0.22, 1, 0.36, 1] as const;

  return (
    <>
      {/* Top: Project Visual Diagram */}
      <div
        className="project-ref-card__visual"
        onClick={() => onOpen(project)}
        role="button"
        tabIndex={0}
        aria-label={`Open ${project.name} case study`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(project);
          }
        }}
        suppressHydrationWarning
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={project.image}
          alt={`${project.name} preview`}
          loading="lazy"
          className="project-ref-card__img"
          whileHover={reduced ? undefined : { scale: 1.03 }}
          transition={{ duration: 0.45, ease: cinematicEasing as any }}
          suppressHydrationWarning
        />
      </div>

      {/* Bottom: Project Information */}
      <div className="project-ref-card__body">
        <div className="project-ref-card__meta">
          <span className="project-ref-card__category">
            {project.category || project.kicker}
          </span>
          <span className="project-ref-card__year">{project.year || "2026"}</span>
        </div>

        <div className="project-ref-card__header">
          <h3
            className="project-ref-card__title"
            onClick={() => onOpen(project)}
            title={`View ${project.name} details`}
            suppressHydrationWarning
          >
            {project.name}
          </h3>
          <div className="project-ref-card__actions">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} GitHub Repository`}
                className="project-ref-card__icon-btn"
                title="View GitHub Repository"
                suppressHydrationWarning
              >
                <Github size={16} />
              </a>
            )}
            <button
              type="button"
              onClick={() => onOpen(project)}
              aria-label={`Open ${project.name} case study`}
              className="project-ref-card__icon-btn"
              title="Open Case Study"
              suppressHydrationWarning
            >
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        <p className="project-ref-card__desc">{project.description}</p>

        <div className="project-ref-card__pills">
          {project.stack.map((tech) => (
            <span key={tech} className="project-ref-pill">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Horizontal Showcase Card with Active State Motion ───────────────────────
function HorizontalCard({
  project,
  index,
  total,
  scrollYProgress,
  onOpen,
  isMobile,
}: {
  project: Project;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  onOpen: (p: Project) => void;
  isMobile: boolean;
}) {
  const reduced = useReducedMotion();

  // Active center progress range for each card
  // Card 0: 0.12, Card 1: 0.36, Card 2: 0.60, Card 3: 0.84
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
      <div className="projects-horizontal-card-wrap">
        <article
          className="project-ref-card"
          tabIndex={0}
          role="button"
          aria-label={`Open ${project.name} case study`}
          suppressHydrationWarning
        >
          <ProjectCardInner project={project} onOpen={onOpen} />
        </article>
      </div>
    );
  }

  return (
    <motion.div
      className="projects-horizontal-card-wrap"
      style={{
        scale,
      }}
    >
      <article
        className="project-ref-card"
        tabIndex={0}
        role="button"
        aria-label={`Open ${project.name} case study`}
        suppressHydrationWarning
      >
        <ProjectCardInner project={project} onOpen={onOpen} />
      </article>
    </motion.div>
  );
}

// ─── Main ProjectsSection Component ──────────────────────────────────────────
export function ProjectsSection({
  onOpen,
}: {
  onOpen: (project: Project) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxScrollDistance, setMaxScrollDistance] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(1);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate dynamic track translation distance on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);

      if (!mobile && trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const stageWidth = trackRef.current.parentElement?.clientWidth || window.innerWidth * 0.55;
        const overflow = Math.max(0, trackWidth - stageWidth + 40);
        setMaxScrollDistance(overflow);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Map scroll progress to active card index
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const cardCount = projects.length;
      const startP = 0.06;
      const endP = 0.88;
      const norm = Math.max(0, Math.min(1, (latest - startP) / (endP - startP)));
      const idx = Math.min(cardCount, Math.max(1, Math.floor(norm * cardCount) + 1));
      setActiveCardIndex(idx);
    });
  }, [scrollYProgress]);

  // Spring smoothed horizontal scroll translation
  const rawX = useTransform(
    scrollYProgress,
    [0.08, 0.90],
    [0, -maxScrollDistance]
  );
  const smoothX = useSpring(rawX, {
    stiffness: 75,
    damping: 22,
    mass: 0.85,
  });

  const line1Words = ["PROJECTS", "WITH", "A"];
  const line2Words = ["REASON", "TO", "EXIST."];

  return (
    <section
      id="projects"
      ref={containerRef}
      className="projects-horizontal-section section-shell--light"
      aria-labelledby="projects-title"
    >
      <div className="projects-sticky-viewport">
        {/* Left Side: Sidebar Header & Counter */}
        <div className="projects-sticky-sidebar">
          <div className="section-label">
            <span className="section-label__index">04 /</span>
            <span>projects</span>
          </div>

          <motion.p
            className="eyebrow projects-header-eyebrow"
            variants={eyebrowVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.25 }}
          >
            Work in progress, made visible
          </motion.p>

          <h2 id="projects-title" aria-label="Projects with a reason to exist.">
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

          {/* Active Project & Progress Bar Widget */}
          <div className="projects-scroll-indicator" aria-hidden="true">
            <div className="projects-counter-badge">
              <span className="counter-current">0{activeCardIndex}</span>
              <span className="counter-total">/ 0{projects.length}</span>
            </div>
            <div className="projects-progress-track">
              <motion.div
                className="projects-progress-fill"
                style={{ scaleX: scrollYProgress }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Horizontal Project Motion Stage (One by One) */}
        <div className="projects-horizontal-stage">
          <motion.div
            ref={trackRef}
            className="projects-horizontal-track"
            style={isMobile || reduced ? undefined : { x: smoothX }}
          >
            {projects.map((project: Project, index: number) => (
              <HorizontalCard
                key={project.id}
                project={project}
                index={index}
                total={projects.length}
                scrollYProgress={scrollYProgress}
                onOpen={onOpen}
                isMobile={isMobile}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
