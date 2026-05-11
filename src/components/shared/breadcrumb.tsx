"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import {
  Breadcrumb as UIBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const lastIndex = items.length - 1;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" as const }}
      aria-label="Breadcrumb"
    >
      <UIBreadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === lastIndex;
            const isHome = item.label.toLowerCase() === "beranda" && index === 0;

            return (
              <BreadcrumbItem key={`${item.label}-${index}`}>
                {isLast ? (
                  <BreadcrumbPage className="text-white font-medium text-sm">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.href || "/"}
                        className="text-green-200 hover:text-white transition-colors text-sm flex items-center gap-1"
                      >
                        {isHome ? (
                          <Home className="w-3.5 h-3.5" />
                        ) : null}
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator className="text-green-300/60">
                      <span className="text-green-300/60">/</span>
                    </BreadcrumbSeparator>
                  </>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </UIBreadcrumb>
    </motion.nav>
  );
}
