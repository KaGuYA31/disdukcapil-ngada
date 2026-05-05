"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/30 px-4">
      {/* Decorative gradient orbs */}
      <div
        className="absolute top-20 left-10 w-72 h-72 bg-green-500/8 dark:bg-green-500/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/8 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-md w-full text-center"
      >
        {/* Warning Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6"
        >
          <AlertTriangle className="h-10 w-10 text-amber-600 dark:text-amber-400" />
        </motion.div>

        {/* Error Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3"
        >
          Terjadi Kesalahan
        </motion.h1>

        {/* Error Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed"
        >
          Maaf, terjadi kesalahan yang tidak terduga saat memuat halaman. Silakan coba lagi atau kembali ke beranda.
        </motion.p>

        {/* Error digest (development info) */}
        {error.digest && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-xs text-gray-400 dark:text-gray-500 mb-6 font-mono"
          >
            Kode error: {error.digest}
          </motion.p>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
        >
          <Button
            onClick={reset}
            size="lg"
            className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white px-6 font-semibold shadow-lg shadow-green-700/20 dark:shadow-green-900/30 hover:shadow-xl hover:shadow-green-700/30 dark:hover:shadow-green-900/40 transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 transition-colors"
          >
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>
        </motion.div>

        {/* Help info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-sm text-gray-400 dark:text-gray-500"
        >
          Masih mengalami masalah? Hubungi kami{" "}
          <a
            href="https://wa.me/6281234567890?text=Halo%2C%20saya%20menemukan%20kesalahan%20pada%20website%20Disdukcapil%20Ngada."
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 dark:text-green-400 hover:underline font-medium inline-flex items-center gap-1"
          >
            <Phone className="h-3.5 w-3.5" />
            via WhatsApp
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
