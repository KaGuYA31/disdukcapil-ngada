"use client";

import { useSyncExternalStore } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Enhanced reading progress bar for content sub-pages.
 * Shows a thin progress bar at the top with a percentage indicator that
 * appears after scrolling 10% of the page.
 */
export function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progressPercent = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const opacity = useTransform(scrollYProgress, [0, 0.02, 0.05], [0, 0, 1]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none" aria-hidden="true">
      {/* Track */}
      <div className="h-[3px] bg-green-100/50 dark:bg-green-900/30 w-full" />
      {/* Progress fill */}
      <motion.div
        className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 shadow-sm shadow-green-500/30 origin-left"
        style={{ scaleX, opacity }}
      />
      {/* Percentage indicator */}
      <motion.div
        className="absolute top-1 right-2 text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50/90 dark:bg-green-900/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md shadow-sm border border-green-200/50 dark:border-green-800/50"
        style={{ opacity }}
      >
        <motion.span>{progressPercent}</motion.span>
      </motion.div>
    </div>
  );
}

/**
 * Mini version of the reading progress bar (no percentage text).
 * Suitable for pages where a cleaner look is preferred.
 */
export function MiniReadingProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const opacity = useTransform(scrollYProgress, [0, 0.02], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 origin-left z-[9999]"
      style={{ scaleX, opacity }}
      aria-hidden="true"
    />
  );
}
