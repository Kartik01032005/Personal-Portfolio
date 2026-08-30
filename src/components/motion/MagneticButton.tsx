"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  onClick?: () => void;
}

export function Magnetic({
  children,
  strength = 0.28,
  className = "",
  onClick,
}: MagneticProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  if (reduced) {
    return (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={`magnetic-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 20, mass: 0.2 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
