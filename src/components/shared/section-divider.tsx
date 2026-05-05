"use client";

import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────
type DividerVariant = "wave-1" | "wave-2" | "curved" | "zigzag" | "diagonal" | "dotted" | "gradient" | "fade";
type DividerColor = "green" | "amber" | "teal" | "gray";

interface SectionDividerProps {
  variant?: DividerVariant;
  color?: DividerColor;
  className?: string;
  flip?: boolean; // Flip vertically for bottom dividers
  height?: number; // Custom height in pixels
}

// ─── Color Maps ───────────────────────────────────────────────────
const colorMap: Record<DividerColor, { light: string; dark: string; gradient: string; darkGradient: string; stroke: string; darkStroke: string }> = {
  green: {
    light: "#dcfce7",
    dark: "#14532d",
    gradient: "from-green-50 to-white dark:from-green-950 dark:to-gray-950",
    darkGradient: "from-white via-green-50 to-white dark:from-gray-950 dark:via-green-950 dark:to-gray-950",
    stroke: "#15803d",
    darkStroke: "#22c55e",
  },
  amber: {
    light: "#fef3c7",
    dark: "#78350f",
    gradient: "from-amber-50 to-white dark:from-amber-950 dark:to-gray-950",
    darkGradient: "from-white via-amber-50 to-white dark:from-gray-950 dark:via-amber-950 dark:to-gray-950",
    stroke: "#d97706",
    darkStroke: "#fbbf24",
  },
  teal: {
    light: "#ccfbf1",
    dark: "#134e4a",
    gradient: "from-teal-50 to-white dark:from-teal-950 dark:to-gray-950",
    darkGradient: "from-white via-teal-50 to-white dark:from-gray-950 dark:via-teal-950 dark:to-gray-950",
    stroke: "#0d9488",
    darkStroke: "#2dd4bf",
  },
  gray: {
    light: "#f3f4f6",
    dark: "#374151",
    gradient: "from-gray-100 to-white dark:from-gray-900 dark:to-gray-950",
    darkGradient: "from-white via-gray-100 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950",
    stroke: "#6b7280",
    darkStroke: "#9ca3af",
  },
};

// ─── SVG Divider Components ───────────────────────────────────────

function Wave1Divider({ color, flip }: { color: DividerColor; flip: boolean }) {
  const c = colorMap[color];
  return (
    <div className="w-full overflow-hidden leading-none" aria-hidden="true">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`w-full h-auto ${flip ? "rotate-180" : ""}`}
      >
        <path
          d="M0,40 C150,100 350,0 500,40 C650,80 850,0 1000,40 C1100,60 1150,50 1200,40 L1200,120 L0,120 Z"
          fill={c.light}
          className="dark:hidden"
        />
        <path
          d="M0,40 C150,100 350,0 500,40 C650,80 850,0 1000,40 C1100,60 1150,50 1200,40 L1200,120 L0,120 Z"
          fill={c.dark}
          className="hidden dark:block"
        />
      </svg>
    </div>
  );
}

function Wave2Divider({ color, flip }: { color: DividerColor; flip: boolean }) {
  const c = colorMap[color];
  return (
    <div className="w-full overflow-hidden leading-none" aria-hidden="true">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`w-full h-auto ${flip ? "rotate-180" : ""}`}
      >
        <path
          d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z"
          fill={c.light}
          className="dark:hidden"
        />
        <path
          d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z"
          fill={c.dark}
          className="hidden dark:block"
        />
      </svg>
    </div>
  );
}

function CurvedDivider({ color, flip }: { color: DividerColor; flip: boolean }) {
  const c = colorMap[color];
  return (
    <div className="w-full overflow-hidden leading-none" aria-hidden="true">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`w-full h-auto ${flip ? "rotate-180" : ""}`}
      >
        <path
          d="M0,100 Q600,0 1200,100 L1200,120 L0,120 Z"
          fill={c.light}
          className="dark:hidden"
        />
        <path
          d="M0,100 Q600,0 1200,100 L1200,120 L0,120 Z"
          fill={c.dark}
          className="hidden dark:block"
        />
      </svg>
    </div>
  );
}

function ZigzagDivider({ color, flip }: { color: DividerColor; flip: boolean }) {
  const c = colorMap[color];
  return (
    <div className="w-full overflow-hidden leading-none" aria-hidden="true">
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        className={`w-full h-auto ${flip ? "rotate-180" : ""}`}
      >
        <path
          d="M0,0 L60,40 L0,80 L120,80 L180,40 L120,0 L240,0 L300,40 L240,80 L360,80 L420,40 L360,0 L480,0 L540,40 L480,80 L600,80 L660,40 L600,0 L720,0 L780,40 L720,80 L840,80 L900,40 L840,0 L960,0 L1020,40 L960,80 L1080,80 L1140,40 L1080,0 L1200,0 L1200,80 L0,80 Z"
          fill={c.light}
          className="dark:hidden"
        />
        <path
          d="M0,0 L60,40 L0,80 L120,80 L180,40 L120,0 L240,0 L300,40 L240,80 L360,80 L420,40 L360,0 L480,0 L540,40 L480,80 L600,80 L660,40 L600,0 L720,0 L780,40 L720,80 L840,80 L900,40 L840,0 L960,0 L1020,40 L960,80 L1080,80 L1140,40 L1080,0 L1200,0 L1200,80 L0,80 Z"
          fill={c.dark}
          className="hidden dark:block"
        />
      </svg>
    </div>
  );
}

function DiagonalDivider({ color, flip }: { color: DividerColor; flip: boolean }) {
  const c = colorMap[color];
  return (
    <div className="w-full overflow-hidden leading-none" aria-hidden="true">
      <svg
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        className={`w-full h-auto ${flip ? "rotate-180" : ""}`}
      >
        <path
          d="M0,0 L1200,60 L1200,100 L0,100 Z"
          fill={c.light}
          className="dark:hidden"
        />
        <path
          d="M0,0 L1200,60 L1200,100 L0,100 Z"
          fill={c.dark}
          className="hidden dark:block"
        />
      </svg>
    </div>
  );
}

function DottedDivider({ color }: { color: DividerColor }) {
  const c = colorMap[color];
  return (
    <div className="w-full py-6 flex items-center justify-center" aria-hidden="true">
      <div className="w-full max-w-4xl mx-auto flex items-center">
        {/* Left dots */}
        <div className="flex-1 border-t-2 border-dotted" style={{ borderColor: c.stroke }} />
        {/* Center decorative element */}
        <div className="mx-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.stroke }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.stroke }} />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.stroke }} />
        </div>
        {/* Right dots */}
        <div className="flex-1 border-t-2 border-dotted" style={{ borderColor: c.stroke }} />
      </div>
    </div>
  );
}

function GradientDivider({ color }: { color: DividerColor }) {
  const c = colorMap[color];
  return (
    <div className={`w-full h-20 bg-gradient-to-b ${c.darkGradient}`} aria-hidden="true">
      {/* Subtle shimmer line in the middle */}
      <div className="w-full h-px relative top-1/2">
        <div
          className="h-px w-full mx-auto max-w-3xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${c.stroke}40, ${c.stroke}, ${c.stroke}40, transparent)`,
          }}
        />
      </div>
    </div>
  );
}

function FadeDivider({ color }: { color: DividerColor }) {
  const c = colorMap[color];
  return (
    <div className={`w-full h-16 bg-gradient-to-b ${c.gradient} relative`} aria-hidden="true">
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-0.5 rounded-full"
        style={{ backgroundColor: c.stroke }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export function SectionDivider({
  variant = "wave-1",
  color = "green",
  className = "",
  flip = false,
  height,
}: SectionDividerProps) {
  const wrapperStyle = height ? { height: `${height}px`, overflow: "hidden" } : {};

  const renderDivider = () => {
    switch (variant) {
      case "wave-1":
        return <Wave1Divider color={color} flip={flip} />;
      case "wave-2":
        return <Wave2Divider color={color} flip={flip} />;
      case "curved":
        return <CurvedDivider color={color} flip={flip} />;
      case "zigzag":
        return <ZigzagDivider color={color} flip={flip} />;
      case "diagonal":
        return <DiagonalDivider color={color} flip={flip} />;
      case "dotted":
        return <DottedDivider color={color} />;
      case "gradient":
        return <GradientDivider color={color} />;
      case "fade":
        return <FadeDivider color={color} />;
      default:
        return <Wave1Divider color={color} flip={flip} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative ${className}`}
      style={wrapperStyle}
      role="separator"
      aria-orientation="horizontal"
    >
      {renderDivider()}
    </motion.div>
  );
}
