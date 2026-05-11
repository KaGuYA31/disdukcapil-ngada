"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import type { LucideIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────
interface AnimatedCounterProps {
  /** Target number to count up to */
  value: number;
  /** Suffix text after the number (e.g., "+", "K", "M", "%", "jiwa") */
  suffix?: string;
  /** Prefix text before the number (e.g., "Rp", "~") */
  prefix?: string;
  /** Animation duration in seconds (default: 2) */
  duration?: number;
  /** Delay before animation starts in seconds (default: 0) */
  delay?: number;
  /** Label text below the counter */
  label?: string;
  /** Icon component from lucide-react */
  icon?: LucideIcon;
  /** Color scheme */
  color?: "green" | "amber" | "teal" | "rose" | "blue" | "emerald";
  /** Display size: "sm", "md", "lg", "xl" */
  size?: "sm" | "md" | "lg" | "xl";
  /** Enable thousands separator (default: true) */
  separator?: boolean;
  /** Decimal places (default: 0) */
  decimals?: number;
  /** Extra CSS classes */
  className?: string;
  /** Custom easing function */
  easing?: "easeOut" | "easeIn" | "easeInOut" | "circOut" | "backOut";
}

// ─── Color Configs ────────────────────────────────────────────────
const colorConfigs = {
  green: {
    text: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    label: "text-gray-500 dark:text-gray-400",
    ring: "ring-green-200 dark:ring-green-800/40",
    glow: "shadow-green-500/10",
  },
  amber: {
    text: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    label: "text-gray-500 dark:text-gray-400",
    ring: "ring-amber-200 dark:ring-amber-800/40",
    glow: "shadow-amber-500/10",
  },
  teal: {
    text: "text-teal-600 dark:text-teal-400",
    iconBg: "bg-teal-100 dark:bg-teal-900/30",
    iconColor: "text-teal-600 dark:text-teal-400",
    label: "text-gray-500 dark:text-gray-400",
    ring: "ring-teal-200 dark:ring-teal-800/40",
    glow: "shadow-teal-500/10",
  },
  rose: {
    text: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-100 dark:bg-rose-900/30",
    iconColor: "text-rose-600 dark:text-rose-400",
    label: "text-gray-500 dark:text-gray-400",
    ring: "ring-rose-200 dark:ring-rose-800/40",
    glow: "shadow-rose-500/10",
  },
  blue: {
    text: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    label: "text-gray-500 dark:text-gray-400",
    ring: "ring-blue-200 dark:ring-blue-800/40",
    glow: "shadow-blue-500/10",
  },
  emerald: {
    text: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    label: "text-gray-500 dark:text-gray-400",
    ring: "ring-emerald-200 dark:ring-emerald-800/40",
    glow: "shadow-emerald-500/10",
  },
};

// ─── Size Configs ─────────────────────────────────────────────────
const sizeConfigs = {
  sm: {
    number: "text-2xl",
    iconWrapper: "w-8 h-8",
    iconSize: "h-4 w-4",
    labelSize: "text-xs",
    gap: "gap-2",
    padding: "p-3",
  },
  md: {
    number: "text-3xl md:text-4xl",
    iconWrapper: "w-10 h-10",
    iconSize: "h-5 w-5",
    labelSize: "text-sm",
    gap: "gap-3",
    padding: "p-4",
  },
  lg: {
    number: "text-4xl md:text-5xl",
    iconWrapper: "w-12 h-12",
    iconSize: "h-6 w-6",
    labelSize: "text-sm",
    gap: "gap-3",
    padding: "p-5",
  },
  xl: {
    number: "text-5xl md:text-6xl",
    iconWrapper: "w-14 h-14",
    iconSize: "h-7 w-7",
    labelSize: "text-base",
    gap: "gap-4",
    padding: "p-6",
  },
};

// ─── Main Component ───────────────────────────────────────────────
export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  delay = 0,
  label,
  icon: Icon,
  color = "green",
  size = "md",
  separator = true,
  decimals = 0,
  className = "",
  easing = "easeOut",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => {
    const factor = Math.pow(10, decimals);
    return Math.round(latest * factor) / factor;
  });
  const [display, setDisplay] = useState(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (inView && !hasStartedRef.current) {
      hasStartedRef.current = true;

      // Apply delay
      const delayTimeout = setTimeout(() => {
        const controls = animate(motionValue, value, {
          duration,
          ease: easing,
        });

        const unsubscribe = rounded.on("change", (latest) => setDisplay(latest));

        return () => {
          controls.stop();
          unsubscribe();
        };
      }, delay * 1000);

      return () => clearTimeout(delayTimeout);
    }
  }, [inView, motionValue, rounded, value, duration, delay, easing]);

  // Format the display number
  const formatNumber = (num: number) => {
    if (separator) {
      return new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(num);
    }
    return num.toFixed(decimals);
  };

  const colors = colorConfigs[color];
  const sizes = sizeConfigs[size];

  // Compact mode: just the number with animation (no card)
  if (!Icon && !label) {
    return (
      <span
        ref={ref}
        className={`tabular-nums font-bold ${colors.text} ${sizes.number} ${className}`}
        aria-label={`${prefix}${formatNumber(value)}${suffix}`}
        role="timer"
      >
        {prefix}
        {formatNumber(display)}
        {suffix}
      </span>
    );
  }

  // Full card mode with icon and label
  return (
    <div
      className={`relative rounded-xl ${sizes.padding} bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-lg ${colors.glow} transition-all duration-300 hover:-translate-y-1 group ${className}`}
    >
      {/* Subtle top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-gradient-to-r from-transparent via-current to-transparent opacity-20 text-${color === "emerald" ? "emerald" : color}-500`} />

      <div className={`flex ${Icon ? "flex-col" : "flex-col"} items-center text-center gap-2`}>
        {/* Icon */}
        {Icon && (
          <div
            className={`${sizes.iconWrapper} ${colors.iconBg} rounded-xl flex items-center justify-center ring-1 ring-inset ${colors.ring} group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}
          >
            <Icon className={`${sizes.iconSize} ${colors.iconColor}`} />
          </div>
        )}

        {/* Counter Value */}
        <div className="flex items-baseline justify-center">
          {prefix && (
            <span className={`font-semibold ${colors.text} ${sizes.number === "text-5xl md:text-6xl" ? "text-2xl md:text-3xl" : sizes.number === "text-4xl md:text-5xl" ? "text-xl md:text-2xl" : "text-lg"}`}>
              {prefix}
            </span>
          )}
          <span
            ref={ref}
            className={`tabular-nums font-bold ${colors.text} ${sizes.number}`}
            aria-label={`${prefix}${formatNumber(value)}${suffix}`}
            role="timer"
          >
            {formatNumber(display)}
          </span>
          {suffix && (
            <span className={`font-bold ${colors.text} ${sizes.number === "text-5xl md:text-6xl" ? "text-2xl md:text-3xl" : sizes.number === "text-4xl md:text-5xl" ? "text-xl md:text-2xl" : "text-lg"}`}>
              {suffix}
            </span>
          )}
        </div>

        {/* Label */}
        {label && (
          <p className={`${sizes.labelSize} ${colors.label} font-medium`}>
            {label}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Preset: Stats Row (for homepage) ─────────────────────────────
interface StatsCounterItem {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: LucideIcon;
  color?: "green" | "amber" | "teal" | "rose" | "blue" | "emerald";
}

interface StatsCounterRowProps {
  items: StatsCounterItem[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export function StatsCounterRow({
  items,
  className = "",
  columns = 4,
}: StatsCounterRowProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 md:gap-6 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
        >
          <AnimatedCounter
            value={item.value}
            suffix={item.suffix}
            prefix={item.prefix}
            label={item.label}
            icon={item.icon}
            color={item.color || "green"}
            size="md"
          />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Preset: Inline Counter (minimal) ─────────────────────────────
interface InlineCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  color?: "green" | "amber" | "teal" | "rose" | "blue" | "emerald";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  duration?: number;
  delay?: number;
}

export function InlineCounter({
  value,
  suffix = "",
  prefix = "",
  color = "green",
  size = "md",
  className = "",
  duration = 2,
  delay = 0,
}: InlineCounterProps) {
  return (
    <AnimatedCounter
      value={value}
      suffix={suffix}
      prefix={prefix}
      color={color}
      size={size}
      className={className}
      duration={duration}
      delay={delay}
    />
  );
}
