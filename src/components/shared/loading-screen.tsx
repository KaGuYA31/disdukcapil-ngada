"use client";

import { useSyncExternalStore, useCallback, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── useSyncExternalStore for mounted detection ────────────────────
// Avoids the useState(false) + useEffect(() => setMounted(true)) anti-pattern
const emptySubscribe = () => () => {};
const getIsClient = () => true;
const getIsServer = () => false;

function useMounted() {
  return useSyncExternalStore(emptySubscribe, getIsClient, getIsServer);
}

// ─── LoadingScreen Component ───────────────────────────────────────
export function LoadingScreen() {
  const mounted = useMounted();
  const [visible, setVisible] = useState(true);
  const dismissRef = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissRef.current) return;
    dismissRef.current = true;
    setVisible(false);
  }, []);

  // Check localStorage and auto-dismiss
  useEffect(() => {
    const sessionKey = "disdukcapil-loading-shown";
    const hasShown = sessionStorage.getItem(sessionKey);

    if (hasShown) {
      // Defer setState to avoid synchronous set-state-in-effect
      setTimeout(dismiss, 0);
      return;
    }

    sessionStorage.setItem(sessionKey, "1");

    const timer = setTimeout(dismiss, 2000);

    const handleLoad = () => {
      setTimeout(dismiss, 300);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, [dismiss]);

  // During SSR, render nothing
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, #064e3b 0%, #065f46 30%, #0f766e 60%, #115e59 100%)",
          }}
        >
          {/* Decorative blurs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>

          {/* Content */}
          <div className="relative flex flex-col items-center gap-6">
            {/* Government Shield Logo */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              {/* Pulse rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.5, 2],
                    opacity: [0.4, 0.2, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute w-24 h-24 rounded-full border-2 border-green-300/40"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1.6],
                    opacity: [0.3, 0.15, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.5,
                  }}
                  className="absolute w-24 h-24 rounded-full border border-teal-300/30"
                />
              </div>

              {/* Logo circle */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-2xl shadow-green-900/50"
              >
                <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-10 h-10 text-green-300"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                Disdukcapil
              </h1>
              <p className="text-green-200/80 text-sm md:text-base mt-1 font-medium tracking-wider uppercase">
                Kabupaten Ngada
              </p>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-green-200/50 text-xs tracking-widest uppercase"
            >
              Dinas Kependudukan dan Pencatatan Sipil
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="w-48 md:w-56 mt-2"
            >
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-green-400 via-teal-300 to-emerald-400 rounded-full"
                />
              </div>
              <p className="text-center text-green-200/40 text-[10px] mt-2 tracking-wider">
                Memuat halaman...
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
