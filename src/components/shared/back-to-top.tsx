"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: "easeInOut" as const }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 w-12 h-12 bg-green-700 hover:bg-green-800 text-white rounded-full shadow-lg flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Kembali ke atas"
        >
          <ArrowUp className="h-5 w-5" />
          <span className="sr-only">Kembali ke atas</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
