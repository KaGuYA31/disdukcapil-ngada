"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function PageTransitionIndicator() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const prevPathRef = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;

      // Clear any pending timers from a rapid subsequent navigation
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // Defer the show setState into a microtask to avoid synchronous setState in effect
      const showTimer = window.setTimeout(() => {
        setIsVisible(true);
      }, 0);

      // Auto-hide after a short delay once the new route has loaded
      timerRef.current = window.setTimeout(() => {
        setIsVisible(false);
        timerRef.current = null;
      }, 800);

      return () => {
        window.clearTimeout(showTimer);
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2px] z-[99999] pointer-events-none"
      role="progressbar"
      aria-hidden="true"
    >
      <div className="h-full page-loading-bar" />
    </div>
  );
}
