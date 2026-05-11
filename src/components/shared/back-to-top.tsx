"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setIsVisible(scrollY > 400);
      setScrollPercent(docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 group cursor-pointer"
          aria-label="Kembali ke atas"
        >
          {/* Progress ring */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24" cy="24" r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-green-200/50 dark:text-green-800/50"
              />
              <circle
                cx="24" cy="24" r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - scrollPercent / 100)}`}
                strokeLinecap="round"
                className="text-green-600 dark:text-green-400 transition-all duration-150"
              />
            </svg>
            {/* Inner button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg shadow-green-600/30 group-hover:shadow-green-600/50 group-hover:scale-105 transition-all duration-200 flex items-center justify-center">
                <ArrowUp className="h-4 w-4" />
              </div>
            </div>
          </div>
          <span className="sr-only">Kembali ke atas ({Math.round(scrollPercent)}%)</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
