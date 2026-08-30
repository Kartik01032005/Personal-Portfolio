"use client";

import React, { useRef, useState, useEffect } from "react";

interface VideoBackgroundProps {
  onLoaded?: () => void;
}

export function VideoBackground({ onLoaded }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      setIsVideoLoaded(true);
      if (onLoaded) onLoaded();
    };

    if (video.readyState >= 2) {
      handleLoaded();
    } else {
      video.addEventListener("loadeddata", handleLoaded, { once: true });
    }

    // Ensure autoplay works across all browsers
    video.play().catch(() => {
      // Browser autoplay policy handler (muted autoplay is universally supported)
    });

    return () => {
      video.removeEventListener("loadeddata", handleLoaded);
    };
  }, [onLoaded]);

  return (
    <div
      className="video-sanctuary-container"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "#05070a",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="video-background-element"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: isVideoLoaded ? 0.88 : 0,
          transition: "opacity 0.8s ease-out",
          transform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
        }}
      >
        <source src="/videos/portfolio-background.mp4" type="video/mp4" />
        <source src="/videos/sanctuary-bg.mp4" type="video/mp4" />
        <source src="/videos/reference-bg.mp4" type="video/mp4" />
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      {/* Fallback ambient dark glow when loading */}
      <div
        className="video-ambient-glow"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(224, 35, 28, 0.08) 0%, rgba(5, 7, 10, 0.95) 75%)",
          opacity: isVideoLoaded ? 0.35 : 0.85,
          transition: "opacity 0.8s ease-out",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
