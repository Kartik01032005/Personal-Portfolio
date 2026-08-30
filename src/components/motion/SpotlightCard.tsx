"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  enableTilt?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(244, 124, 72, 0.12)",
  enableTilt = true,
  onClick,
  style,
}: SpotlightCardProps) {
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200, isHovered: false });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || reduced) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y, isHovered: true });

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4; // Max 4 deg tilt
      const rotateY = ((x - centerX) / centerX) * 4;
      setTilt({ rotateX, rotateY });
    }
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, isHovered: false }));
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        ...style,
        perspective: 1000,
      }}
      animate={
        reduced
          ? {}
          : {
              rotateX: tilt.rotateX,
              rotateY: tilt.rotateY,
            }
      }
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Dynamic Cursor Spotlight Radial Overlay */}
      {!reduced && (
        <div
          className="spotlight-layer"
          style={{
            opacity: mousePos.isHovered ? 1 : 0,
            background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </motion.div>
  );
}
