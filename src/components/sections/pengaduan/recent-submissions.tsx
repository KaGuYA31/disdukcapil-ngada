"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Inbox,
  Calendar,
  User,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface PengaduanItem {
  id: string;
  name: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

function getStatusConfig(status: string) {
  switch (status) {
    case "Baru":
      return {
        label: "Baru",
        bg: "bg-emerald-100 dark:bg-emerald-900/40",
        text: "text-emerald-700 dark:text-emerald-300",
        dot: "bg-emerald-500",
        icon: AlertCircle,
      };
    case "Diproses":
      return {
        label: "Diproses",
        bg: "bg-amber-100 dark:bg-amber-900/40",
        text: "text-amber-700 dark:text-amber-300",
        dot: "bg-amber-500",
        icon: Clock,
      };
    case "Selesai":
      return {
        label: "Selesai",
        bg: "bg-teal-100 dark:bg-teal-900/40",
        text: "text-teal-700 dark:text-teal-300",
        dot: "bg-teal-500",
        icon: CheckCircle2,
      };
    default:
      return {
        label: status,
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
        dot: "bg-gray-400",
        icon: AlertCircle,
      };
  }
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
      >
        <Inbox className="h-10 w-10 text-green-400 dark:text-green-500" />
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
        Belum Ada Pengaduan
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
        Pengaduan yang Anda kirim akan muncul di sini. Silakan isi formulir di bawah untuk menyampaikan keluhan atau saran Anda.
      </p>
    </motion.div>
  );
}

export function RecentSubmissions() {
  const [submissions, setSubmissions] = useState<PengaduanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch("/api/pengaduan?pageSize=5");
      const result = await response.json();
      if (result.success) {
        setSubmissions(result.data || []);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return (
    <section className="py-8 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Pengaduan Anda
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  5 pengaduan terakhir yang tercatat
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-green-500" />
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Memuat pengaduan terbaru...
              </span>
            </div>
          ) : error ? (
            <motion.div variants={fadeInUp}>
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="py-6 text-center">
                  <AlertCircle className="h-8 w-8 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Gagal memuat data pengaduan. Silakan coba lagi.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : submissions.length === 0 ? (
            <motion.div variants={fadeInUp}>
              <Card className="border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <CardContent className="py-4">
                  <EmptyState />
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div variants={fadeInUp} className="space-y-3">
              <AnimatePresence>
                {submissions.map((item, idx) => {
                  const statusConfig = getStatusConfig(item.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: idx * 0.06 }}
                    >
                      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md hover:border-green-200 dark:hover:border-green-800 transition-all duration-200 cursor-default group">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              {/* Subject & Name Row */}
                              <div className="flex items-center gap-2 mb-1.5">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                  {item.subject}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className={`${statusConfig.bg} ${statusConfig.text} text-xs font-medium px-2 py-0.5 border-0 flex-shrink-0`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} mr-1.5 flex-shrink-0`} />
                                  {statusConfig.label}
                                </Badge>
                              </div>

                              {/* Truncated message */}
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 leading-relaxed">
                                {item.message}
                              </p>

                              {/* Meta info */}
                              <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {item.name}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(item.createdAt)}
                                </span>
                              </div>
                            </div>

                            <StatusIcon className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-green-400 dark:group-hover:text-green-500 transition-colors flex-shrink-0 mt-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
