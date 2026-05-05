import type { Variants } from "framer-motion";

// ─── Fade In Up ────────────────────────────────────────────────────────
// Fade in from below — used across hero banners, cards, and content blocks.

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// ─── Stagger Container ─────────────────────────────────────────────────
// Staggers children animations with a configurable delay between each child.

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

// ─── Fade In ───────────────────────────────────────────────────────────
// Simple opacity fade — useful for overlays and subtle entrance effects.

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ─── Scale In ──────────────────────────────────────────────────────────
// Scale from slightly smaller to full size — great for modals and cards.

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ─── Fade In Scale ─────────────────────────────────────────────────────
// Combines opacity + scale entrance — used on illustrations and hero imagery.

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ─── Slide In Left ─────────────────────────────────────────────────────
// Enters from the left side — useful for sidebar content and timeline items.

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ─── Slide In Right ────────────────────────────────────────────────────
// Enters from the right side — useful for complementary content panels.

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ─── Stagger Item ──────────────────────────────────────────────────────
// Individual stagger item — used as child of staggerContainer.

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ─── Link Card Hover ───────────────────────────────────────────────────
// Hover interaction for card-style navigation links with lift and shadow.

export const linkCardHover: Variants = {
  rest: { y: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  hover: {
    y: -4,
    boxShadow: "0 8px 30px rgba(5, 150, 105, 0.12)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
};
