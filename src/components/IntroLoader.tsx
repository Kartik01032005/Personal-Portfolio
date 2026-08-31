"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface IntroLoaderProps {
  onComplete: () => void;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const reduced = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (reduced) {
      onComplete();
      return;
    }

    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85;
      videoRef.current.play().catch(() => {});
    }

    // Begin smooth fade-out at 2.65s
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2650);

    // Complete transition and unmount at exactly 3.0s
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [reduced, onComplete]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="intro-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
          }}
          aria-hidden="true"
        >
          {/* Centered Laser-Sharp Handwriting Video on 100% Solid Black */}
          <div className="intro-loader__content">
            <motion.div
              className="intro-loader__video-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <video
                ref={videoRef}
                src="/kartik_handwriting_reveal.mp4"
                autoPlay
                muted
                playsInline
                preload="auto"
                className="intro-loader__video"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
