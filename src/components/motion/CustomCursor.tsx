"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export function CustomCursor() {
  const reduced = useReducedMotion();
  const [cursorState, setCursorState] = useState<"default" | "hover" | "project" | "text" | "hidden">("default");
  const [projectText, setProjectText] = useState("EXPLORE");
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth inertial spring physics for outer ring
  const springConfig = { damping: 26, stiffness: 340, mass: 0.4 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setIsClient(true);
    // Don't activate custom cursor on touch screens or if reduced motion is requested
    const isTouch = window.matchMedia("(pointer: coarse), (hover: none)").matches;
    if (isTouch || reduced) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveProject = target.closest("[data-cursor='project'], .project-card");
      const interactiveLink = target.closest("a, button, [role='button'], input, textarea, .nav-cta, .tag, .focus-item");
      const textSelectable = target.closest("h1, h2, h3, p.lede");

      if (interactiveProject) {
        setCursorState("project");
        setProjectText(interactiveProject.getAttribute("data-cursor-text") || "EXPLORE");
      } else if (interactiveLink) {
        setCursorState("hover");
      } else if (textSelectable) {
        setCursorState("text");
      } else {
        setCursorState("default");
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [mouseX, mouseY, isVisible, reduced]);

  if (!isClient || reduced) return null;

  return (
    <div className="custom-cursor-container" aria-hidden="true">
      {/* Precision Center Dot */}
      <motion.div
        className="cursor-dot"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* Reactive Outer Ring / Badge */}
      <motion.div
        className={`cursor-ring cursor-ring--${cursorState}`}
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale:
            cursorState === "hover"
              ? 1.5
              : cursorState === "project"
              ? 2.2
              : cursorState === "text"
              ? 0.55
              : 1,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      >
        {cursorState === "project" && (
          <span className="cursor-label">{projectText}</span>
        )}
      </motion.div>
    </div>
  );
}
