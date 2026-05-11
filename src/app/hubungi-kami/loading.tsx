"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function HubungiKamiLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex-1"
    >
      {/* ─── Hero Banner Skeleton ─── */}
      <section className="bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white py-16 md:py-20 relative overflow-hidden">
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
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-11 w-11 bg-white/20" />
              <Skeleton className="h-11 w-56 bg-white/20" />
            </div>

            {/* Description */}
            <Skeleton className="h-5 w-full max-w-lg bg-white/15" />
            <Skeleton className="h-5 w-3/4 max-w-md bg-white/15" />

            {/* Quick Contact Stats */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <Skeleton className="h-5 w-5 rounded bg-white/20 mx-auto mb-2" />
                  <Skeleton className="h-3 w-16 bg-white/15 mx-auto mb-1" />
                  <Skeleton className="h-4 w-24 bg-white/20 mx-auto" />
                </div>
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

      {/* ─── Contact Info Cards Skeleton ─── */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-10 space-y-3">
            <Skeleton className="h-7 w-40 rounded-full mx-auto" />
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 max-w-full mx-auto" />
          </div>

          {/* Cards grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 space-y-3"
              >
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact Form & Map Skeleton ─── */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-10 space-y-3">
            <Skeleton className="h-7 w-36 rounded-full mx-auto" />
            <Skeleton className="h-8 w-72 mx-auto" />
            <Skeleton className="h-4 w-96 max-w-full mx-auto" />
          </div>

          {/* Two-column skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Form skeleton */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
              {/* Form header */}
              <div className="bg-gradient-to-r from-green-700 to-green-900 px-6 py-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl bg-white/20" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 bg-white/20" />
                    <Skeleton className="h-4 w-60 bg-white/15" />
                  </div>
                </div>
              </div>

              {/* Form fields */}
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-28 w-full rounded-md" />
                </div>
                <Skeleton className="h-11 w-36 rounded-md bg-green-700" />
              </div>
            </div>

            {/* Map skeleton */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>

              {/* Map placeholder */}
              <Skeleton className="w-full h-[360px] rounded-2xl" />

              {/* Office info card */}
              <div className="rounded-xl border border-green-200 dark:border-green-800 p-4 flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0 bg-green-600" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-48" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Additional Help Skeleton ─── */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 space-y-3">
            <Skeleton className="h-7 w-36 rounded-full mx-auto" />
            <Skeleton className="h-8 w-60 mx-auto" />
          </div>

          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-5">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 flex items-start gap-4"
              >
                <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-4 w-28 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
