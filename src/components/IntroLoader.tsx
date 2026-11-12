"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroLoaderProps {
  onComplete: () => void;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasFinishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Complete and trigger transition
  const handleFinish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsVisible(false);

    // Subtle 450ms exit fade-out transition, then unmount intro component
    setTimeout(() => {
      onCompleteRef.current();
    }, 450);
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    // Safety fallback: if video is blocked or delayed, do not trap visitor
    const fallbackTimer = setTimeout(() => {
      handleFinish();
    }, 3200);

    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== "AbortError") {
            console.warn("Autoplay was prevented:", err);
            handleFinish();
          }
        });
      }
    }

    return () => {
      clearTimeout(fallbackTimer);
      if (video) {
        video.pause();
      }
    };
  }, [handleFinish]);

  // Also enforce exact 2.2s cap via onTimeUpdate if needed
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 2.2) {
      handleFinish();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="intro-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          }}
          aria-hidden="true"
        >
          <div className="intro-loader__content">
            <div className="intro-loader__video-wrapper">
              <video
                ref={videoRef}
                src="/images/kartik-intro.mp4"
                autoPlay
                muted
                playsInline
                preload="auto"
                controls={false}
                onEnded={handleFinish}
                onError={handleFinish}
                onTimeUpdate={handleTimeUpdate}
                className="intro-loader__video"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
