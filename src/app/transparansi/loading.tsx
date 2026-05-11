"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function TransparansiLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen flex flex-col"
    >
      {/* Hero Banner Skeleton */}
      <section className="bg-gradient-to-br from-green-700 via-teal-800 to-green-900 text-white py-16 md:py-20 relative overflow-hidden">
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
            <Skeleton className="h-4 w-56 bg-white/20" />

            {/* Section label badge */}
            <Skeleton className="h-7 w-36 rounded-full bg-white/15" />

            {/* Title with icon */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl bg-white/15" />
              <Skeleton className="h-11 w-72 bg-white/20" />
            </div>

            {/* Description lines */}
            <Skeleton className="h-5 w-full max-w-xl bg-white/15" />
            <Skeleton className="h-4 w-80 max-w-full bg-white/10" />

            {/* Hero stat pills */}
            <div className="mt-6 flex flex-wrap gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-9 w-32 rounded-lg bg-white/10"
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

      {/* KPI Performance Indicators Skeleton */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Section heading */}
          <div className="text-center mb-8 space-y-2">
            <Skeleton className="h-4 w-40 mx-auto" />
            <Skeleton className="h-8 w-56 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 space-y-4"
              >
                {/* Icon */}
                <Skeleton className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/40" />
                {/* Value */}
                <Skeleton className="h-8 w-20" />
                {/* Label */}
                <Skeleton className="h-4 w-36" />
                {/* Progress bar */}
                <Skeleton className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Timeline Skeleton */}
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Section title */}
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/40" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-52" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>

          {/* Timeline items */}
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="pl-8 md:pl-10 relative">
                {/* Timeline line */}
                <div className="absolute left-3 md:left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                {/* Timeline dot */}
                <div className="absolute left-1.5 md:left-2.5 top-6 w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border-l-4 border-l-gray-300 dark:border-l-gray-600 border border-gray-200 dark:border-gray-700 p-4 md:p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparansi Content Skeleton */}
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Category tabs skeleton */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                className="h-9 w-28 rounded-full flex-shrink-0"
              />
            ))}
          </div>

          {/* Document list skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <Skeleton className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex-shrink-0" />
                <div className="flex-1 space-y-2 min-w-0">
                  <Skeleton className="h-5 w-full max-w-[400px]" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-9 w-24 rounded-md flex-shrink-0 bg-green-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
