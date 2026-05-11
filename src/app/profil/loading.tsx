"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function ProfilLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen flex flex-col"
    >
      {/* Hero Banner Skeleton */}
      <section className="bg-gradient-to-br from-green-700 via-green-800 to-teal-900 text-white py-16 md:py-20 relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-green-500/25 to-emerald-600/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-tr from-teal-500/20 to-green-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-green-400/15 to-emerald-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-4">
            {/* Breadcrumb skeleton */}
            <Skeleton className="h-4 w-48 bg-white/20" />

            {/* Section label badge */}
            <Skeleton className="h-7 w-36 rounded-full bg-white/15" />

            {/* Title with icon */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl bg-white/15" />
              <Skeleton className="h-11 w-48 bg-white/20" />
            </div>

            {/* Description lines */}
            <Skeleton className="h-5 w-full max-w-xl bg-white/15" />
            <Skeleton className="h-4 w-80 max-w-full bg-white/10" />

            {/* Quick info pills */}
            <div className="mt-6 flex flex-wrap gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="h-9 w-28 rounded-lg bg-white/10"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 60V20C240 50 480 0 720 20C960 40 1200 10 1440 30V60H0Z"
              className="fill-white dark:fill-gray-950"
            />
          </svg>
        </div>
      </section>

      {/* Print Button Skeleton */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </div>

      {/* Tab Navigation Skeleton */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex w-full overflow-x-auto">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 md:px-6 py-4 whitespace-nowrap"
              >
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-28" />
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content Skeleton */}
      <div className="bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 py-12">
          {/* Visi Misi style content */}
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Section heading */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/40" />
              <Skeleton className="h-8 w-48" />
            </div>

            {/* Visi card */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 space-y-4">
              <Skeleton className="h-6 w-16" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </div>

            {/* Misi items */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 space-y-4">
              <Skeleton className="h-6 w-20" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-6 w-6 rounded-full bg-green-200 dark:bg-green-800 flex-shrink-0 mt-0.5" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Additional content block */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-3">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
