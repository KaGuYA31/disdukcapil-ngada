"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        const raw = scrollY / scrollHeight;
        setProgress(Math.min(Math.max(raw, 0), 1));
      }
    };

    const handleScroll = () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Set initial state
    updateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-gradient-to-r from-green-500 via-green-600 to-teal-500 shadow-[0_0_10px_rgba(22,163,74,0.5)] origin-left"
      style={{
        scaleX: progress,
        opacity: progress > 0 ? 1 : 0,
      }}
      transition={{ opacity: { duration: 0.3 } }}
    />
  );
}
