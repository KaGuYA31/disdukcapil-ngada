"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function SitemapPageLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main-content" className="flex-1">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          {/* Hero Banner Skeleton */}
          <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16 relative overflow-hidden">
            {/* Decorative elements matching the real page */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-green-600/20 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl">
                {/* Breadcrumb skeleton */}
                <div className="mb-4 space-y-2">
                  <Skeleton className="h-3 w-28 bg-green-600/40" />
                </div>
                {/* Title skeleton */}
                <Skeleton className="h-10 w-64 bg-green-600/40 mb-2" />
                {/* Description skeleton */}
                <Skeleton className="h-5 w-96 max-w-full bg-green-600/30" />
              </div>
            </div>
          </section>

          {/* Content Skeleton */}
          <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-950">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto space-y-12">
                {/* Repeat skeleton categories to match real page layout */}
                {[...Array(4)].map((_, catIdx) => (
                  <div key={catIdx} className="space-y-6">
                    {/* Category header skeleton */}
                    <div className="space-y-2">
                      <Skeleton className="h-7 w-48 bg-gray-200 dark:bg-gray-800" />
                      <Skeleton className="h-4 w-72 bg-gray-200 dark:bg-gray-800" />
                      <Skeleton className="mt-3 h-1 w-16 bg-gray-200 dark:bg-gray-800" />
                    </div>

                    {/* Cards grid skeleton (4 columns on lg) */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[...Array(catIdx === 1 ? 8 : catIdx === 2 ? 4 : 3)].map(
                        (_, cardIdx) => (
                          <div
                            key={cardIdx}
                            className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
                          >
                            <div className="flex items-start gap-4">
                              {/* Icon skeleton */}
                              <Skeleton className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                              <div className="flex-1 space-y-2">
                                {/* Title skeleton */}
                                <Skeleton className="h-5 w-24 bg-gray-200 dark:bg-gray-700" />
                                {/* Description skeleton */}
                                <Skeleton className="h-4 w-full bg-gray-100 dark:bg-gray-800" />
                                <Skeleton className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800" />
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}

                {/* Bottom info card skeleton */}
                <div className="mt-8 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-64 bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-full bg-gray-100 dark:bg-gray-800" />
                      <Skeleton className="h-4 w-5/6 bg-gray-100 dark:bg-gray-800" />
                      <div className="flex gap-3 pt-2">
                        <Skeleton className="h-9 w-40 rounded-lg bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-9 w-44 rounded-lg bg-gray-200 dark:bg-gray-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
