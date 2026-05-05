"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export function ScrollProgress() {
  const { scrollY, scrollYProgress } = useScroll();

  // Smooth spring animation for the horizontal progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Fade in opacity when scrolling past ~100px
  const opacity = useTransform(scrollY, [0, 100], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-400 to-emerald-500 origin-left z-[9999]"
      style={{
        scaleX,
        opacity,
      }}
      aria-hidden="true"
    />
  );
}
