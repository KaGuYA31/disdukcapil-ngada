"use client";

import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type SectionHeaderVariant = "center" | "left" | "right";

export type BadgeVariant = "green" | "teal" | "amber" | "rose";

export interface SectionHeaderProps {
  /** Primary heading text (required). Rendered as an `<h2>`. */
  title: string;
  /** Short paragraph below the title. */
  description?: string;
  /** Text rendered inside a coloured badge pill above the title. */
  badge?: string;
  /** Lucide icon shown inside the badge (to the left of `badge` text). */
  icon?: LucideIcon;
  /** Colour theme of the badge pill. @default "green" */
  badgeVariant?: BadgeVariant;
  /** Layout alignment. @default "center" */
  variant?: SectionHeaderVariant;
  /** Optional CTA / action element placed on the right side (only with `variant="left"`). */
  action?: ReactNode;
  /** Additional class names forwarded to the outermost wrapper. */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Badge colour map                                                           */
/* -------------------------------------------------------------------------- */

const badgeVariantClasses: Record<BadgeVariant, string> = {
  green:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/60 dark:text-green-300 dark:border-green-800",
  teal: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800",
  amber:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  rose: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
};

/* -------------------------------------------------------------------------- */
/*  Alignment helpers                                                          */
/* -------------------------------------------------------------------------- */

const alignmentClasses: Record<SectionHeaderVariant, string> = {
  center: "text-center items-center",
  left: "text-left items-start",
  right: "text-right items-end",
};

/* -------------------------------------------------------------------------- */
/*  Animation variants                                                         */
/* -------------------------------------------------------------------------- */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function SectionHeader({
  title,
  description,
  badge,
  icon: Icon,
  badgeVariant = "green",
  variant = "center",
  action,
  className,
}: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const alignment = alignmentClasses[variant];
  const showAction = variant === "left" && action;

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn(
        "flex flex-col gap-3 mb-10 md:mb-14",
        alignment,
        showAction && "text-left items-start flex-col md:flex-row md:items-end md:justify-between md:gap-6",
        className,
      )}
    >
      {/* ---- Badge + title + description block ---- */}
      <div className="flex flex-col gap-3">
        {/* Badge */}
        {badge && (
          <motion.div variants={childVariants}>
            <Badge
              variant="outline"
              className={cn(
                "gap-1.5 px-3 py-1 text-xs font-semibold tracking-wide uppercase rounded-full",
                badgeVariantClasses[badgeVariant],
              )}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {badge}
            </Badge>
          </motion.div>
        )}

        {/* Title */}
        <motion.h2
          variants={childVariants}
          className={cn(
            "text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight animated-underline",
            "text-gradient-green",
          )}
        >
          {title}
        </motion.h2>

        {/* Description */}
        {description && (
          <motion.p
            variants={childVariants}
            className="mt-1 max-w-2xl text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* ---- Optional action slot (right side, left variant only) ---- */}
      {showAction && (
        <motion.div
          variants={childVariants}
          className="shrink-0 mt-2 md:mt-0"
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
