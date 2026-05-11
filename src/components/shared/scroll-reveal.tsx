"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────────
type ScrollRevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade-in"
  | "scale-in"
  | "slide-up";

interface ScrollRevealProps {
  /** Animation variant (default: "fade-up") */
  variant?: ScrollRevealVariant;
  /** Delay before animation starts in seconds (default: 0) */
  delay?: number;
  /** Animation duration in seconds (default: 0.5) */
  duration?: number;
  /** Stagger delay between each child in seconds. When set, each direct child animates independently. (default: 0 — disabled) */
  stagger?: number;
  /** Only trigger the animation once (default: true) */
  triggerOnce?: boolean;
  /** IntersectionObserver root margin, e.g. "-50px" or "-10% 0px" (default: "-80px") */
  margin?: string;
  /** Easing curve for the animation (default: "easeOut") */
  easing?: "easeOut" | "easeIn" | "easeInOut" | "circOut" | "backOut" | "spring";
  /** Extra CSS classes for the wrapper element */
  className?: string;
  /** Content to reveal on scroll */
  children: ReactNode;
}

// ─── Variant Definitions ───────────────────────────────────────────
const hiddenVariants: Record<
  ScrollRevealVariant,
  { opacity: number; x?: number | string; y?: number | string; scale?: number }
> = {
  "fade-up": { opacity: 0, y: 40 },
  "fade-down": { opacity: 0, y: -40 },
  "fade-left": { opacity: 0, x: -40 },
  "fade-right": { opacity: 0, x: 40 },
  "fade-in": { opacity: 0 },
  "scale-in": { opacity: 0, scale: 0.85 },
  "slide-up": { opacity: 0, y: 100 },
};

const visibleVariant: { opacity: number; x: number; y: number; scale: number } = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
};

// ─── Spring Config ─────────────────────────────────────────────────
const springTransition = { type: "spring" as const, stiffness: 100, damping: 15 };

// ─── Build Transition ──────────────────────────────────────────────
function buildTransition(
  duration: number,
  delay: number,
  easing: ScrollRevealProps["easing"]
) {
  if (easing === "spring") return springTransition;
  return { duration, delay, ease: easing || "easeOut" };
}

// ─── Main Component ────────────────────────────────────────────────
export function ScrollReveal({
  variant = "fade-up",
  delay = 0,
  duration = 0.5,
  stagger = 0,
  triggerOnce = true,
  margin = "-80px",
  easing = "easeOut",
  className = "",
  children,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: triggerOnce, margin });

  const hidden = hiddenVariants[variant];

  // ── Stagger mode: wrap each child in its own motion.div ──
  if (stagger > 0) {
    const childArray = Array.isArray(children) ? children : [children];

    return (
      <div ref={ref} className={className}>
        {childArray.map((child, index) => (
          <motion.div
            key={index}
            initial={hidden}
            animate={inView ? visibleVariant : hidden}
            transition={buildTransition(duration, delay + index * stagger, easing)}
          >
            {child}
          </motion.div>
        ))}
      </div>
    );
  }

  // ── Single wrapper mode ──
  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={inView ? visibleVariant : hidden}
      transition={buildTransition(duration, delay, easing)}
      className={className}
    >
      {children}
    </motion.div>
  );
}
