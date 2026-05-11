"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";

export default function OpenDataLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Banner Skeleton */}
        <section className="relative bg-gradient-to-br from-green-700 to-green-900 dark:from-green-900 dark:to-green-950 py-16 overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-green-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Breadcrumb skeleton */}
                <Skeleton className="h-4 w-48 bg-green-600/20" />
                {/* Title skeleton */}
                <Skeleton className="h-10 w-80 bg-green-600/20" />
                {/* Subtitle skeleton */}
                <Skeleton className="h-5 w-64 bg-green-600/20" />
                {/* Description skeleton */}
                <Skeleton className="h-4 w-full max-w-2xl bg-green-600/20" />
                <Skeleton className="h-4 w-72 bg-green-600/20" />
              </motion.div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Section 1: Prinsip Open Data Skeleton */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Section header skeleton */}
            <div className="text-center space-y-3">
              <Skeleton className="h-4 w-28 mx-auto" />
              <Skeleton className="h-8 w-56 mx-auto" />
              <Skeleton className="h-4 w-80 mx-auto" />
            </div>

            {/* Principle cards skeleton */}
            <div className="grid md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                  className="rounded-xl border-2 p-6 space-y-4 bg-white dark:bg-gray-800/50"
                >
                  <div className="flex justify-center">
                    <Skeleton className="h-16 w-16 rounded-2xl" />
                  </div>
                  <Skeleton className="h-6 w-32 mx-auto" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section 2: Dataset Tersedia Skeleton */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Section header skeleton */}
            <div className="text-center space-y-3">
              <Skeleton className="h-4 w-28 mx-auto" />
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-80 mx-auto" />
            </div>

            {/* Dataset cards skeleton */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.07 }}
                  className="rounded-xl border-2 p-6 space-y-4 bg-white dark:bg-gray-800/50"
                >
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section 3: Format Data Skeleton */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="text-center space-y-3">
              <Skeleton className="h-4 w-28 mx-auto" />
              <Skeleton className="h-8 w-64 mx-auto" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <div className="rounded-xl border-2 p-6 md:p-8 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900">
                <div className="grid sm:grid-cols-3 gap-6">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="text-center space-y-3">
                      <Skeleton className="h-14 w-14 rounded-2xl mx-auto" />
                      <Skeleton className="h-5 w-16 mx-auto" />
                      <Skeleton className="h-4 w-48 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Section 4: CTA Skeleton */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="rounded-xl bg-gradient-to-br from-green-700 to-green-900 dark:from-green-900 dark:to-green-950 p-8 md:p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-green-600/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/15 rounded-full blur-2xl" />
              <div className="relative z-10 space-y-4">
                <Skeleton className="h-10 w-10 rounded-full mx-auto bg-green-600/20" />
                <Skeleton className="h-8 w-64 mx-auto bg-green-600/20" />
                <Skeleton className="h-4 w-full max-w-xl mx-auto bg-green-600/20" />
                <Skeleton className="h-4 w-48 mx-auto bg-green-600/20" />
                <Skeleton className="h-12 w-52 mx-auto rounded-md bg-green-600/20" />
                <Skeleton className="h-3 w-40 mx-auto bg-green-600/20" />
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
