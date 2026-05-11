"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function StatistikLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950"
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
            <Skeleton className="h-7 w-32 rounded-full bg-white/15" />

            {/* Title with icon */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl bg-white/15" />
              <Skeleton className="h-11 w-64 bg-white/20" />
            </div>

            {/* Description lines */}
            <Skeleton className="h-5 w-full max-w-xl bg-white/15" />
            <Skeleton className="h-4 w-72 max-w-full bg-white/10" />
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
              className="fill-gray-50 dark:fill-gray-950"
            />
          </svg>
        </div>
      </section>

      {/* Quick Stats Cards Skeleton */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-5 text-center space-y-3"
            >
              {/* Icon */}
              <Skeleton className="h-12 w-12 rounded-xl mx-auto bg-green-100 dark:bg-green-900/40" />
              {/* Value */}
              <Skeleton className="h-8 w-24 mx-auto" />
              {/* Label */}
              <Skeleton className="h-4 w-28 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Print Button Skeleton */}
      <div className="container mx-auto px-4 pt-8">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </div>

      {/* Charts Section Skeleton */}
      <div className="container mx-auto px-4 py-10 space-y-8">
        {/* Total Penduduk Card */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/40" />
            <Skeleton className="h-6 w-44" />
          </div>
          <div className="text-center py-6 space-y-2">
            <Skeleton className="h-14 w-64 mx-auto" />
            <Skeleton className="h-5 w-12 mx-auto" />
          </div>
        </div>

        {/* Distribusi Jenis Kelamin Card */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-52" />
          </div>
          <Skeleton className="h-4 w-64" />
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="rounded-xl bg-green-50 dark:bg-green-900/20 p-6 text-center space-y-2">
              <Skeleton className="h-10 w-28 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
            {/* Bar skeleton */}
            <div className="h-10 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
              <div className="h-full w-3/5 bg-green-200 dark:bg-green-800 rounded-l-xl" />
            </div>
            <div className="rounded-xl bg-pink-50 dark:bg-pink-900/20 p-6 text-center space-y-2">
              <Skeleton className="h-10 w-28 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          </div>
        </div>

        {/* Kepemilikan Dokumen Cards */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-64" />
          </div>
          <Skeleton className="h-4 w-56" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-700 p-5 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/40" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="pt-2 border-t dark:border-gray-700 space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3.5 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
