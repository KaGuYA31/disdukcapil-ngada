"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function LayananOnlineLoading() {
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
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-emerald-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl" />
        <div className="absolute top-10 right-1/4 w-24 h-24 bg-gradient-to-br from-green-300/15 to-teal-400/10 rounded-full blur-lg" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-4">
            {/* Breadcrumb skeleton */}
            <Skeleton className="h-4 w-40 bg-white/20" />

            {/* Badges skeleton */}
            <div className="flex items-center gap-2 mt-4">
              <Skeleton className="h-10 w-10 rounded-xl bg-white/15" />
              <Skeleton className="h-6 w-36 rounded-full bg-white/15" />
              <Skeleton className="h-6 w-28 rounded-full bg-emerald-500/30" />
            </div>

            {/* Title skeleton */}
            <Skeleton className="h-12 w-64 bg-white/20" />

            {/* Description skeleton */}
            <Skeleton className="h-5 w-full max-w-xl bg-white/15" />
            <Skeleton className="h-5 w-80 max-w-full bg-white/10" />

            {/* Step indicators skeleton */}
            <div className="mt-8 flex items-center gap-2 sm:gap-0 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 min-w-fit">
                    <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
                    <Skeleton className="h-4 w-16 bg-white/15" />
                  </div>
                  {step < 4 && (
                    <div className="px-1 sm:px-2 flex-shrink-0">
                      <Skeleton className="w-4 sm:w-8 h-px bg-white/20" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Feature list skeleton */}
            <div className="mt-6 bg-white/15 backdrop-blur-sm rounded-lg p-6 border border-white/30">
              <Skeleton className="h-6 w-48 bg-white/20 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full bg-white/20" />
                    <Skeleton className="h-4 w-56 bg-white/15" />
                  </div>
                ))}
              </div>
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
              className="fill-green-600"
            />
          </svg>
        </div>
      </section>

      {/* Statistics Banner Skeleton */}
      <section className="py-6 bg-gradient-to-r from-green-600 via-green-700 to-teal-700 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15"
              >
                <Skeleton className="h-10 w-10 rounded-lg bg-white/20" />
                <div className="space-y-1">
                  <Skeleton className="h-7 w-16 bg-white/20" />
                  <Skeleton className="h-4 w-36 bg-white/15" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Cards Grid Skeleton */}
      <section className="py-12 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 space-y-6">
          {/* Section heading */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/40" />
            <Skeleton className="h-8 w-72" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/50" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-full max-w-[180px]" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  {[1, 2].map((j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-3.5 w-44" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-full rounded-md bg-green-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Skeleton */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {/* Section heading */}
          <div className="text-center mb-12 flex items-center justify-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/40" />
            <Skeleton className="h-8 w-72" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center space-y-3">
                <div className="relative mx-auto mb-3 sm:mb-5">
                  <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-full mx-auto" />
                </div>
                <Skeleton className="h-4 w-24 mx-auto" />
                <Skeleton className="h-5 w-32 mx-auto" />
                <Skeleton className="h-3.5 w-44 mx-auto hidden sm:block" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
