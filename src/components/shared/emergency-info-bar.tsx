"use client";

import { useState, useEffect, useSyncExternalStore, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, X, AlertTriangle, Clock } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

const STORAGE_KEY = "disdukcapil-emergency-bar-dismissed";

interface EmergencyNotification {
  id: string;
  type: "info" | "warning" | "holiday";
  message: string;
  date?: string;
}

const EMERGENCY_NOTIFICATIONS: EmergencyNotification[] = [
  {
    id: "holiday-jan-2025",
    type: "holiday",
    message: "Pemberitahuan: Pelayanan tutup pada hari libur nasional. Silakan cek jadwal pelayanan untuk informasi lebih lanjut.",
    date: "Berlaku sepanjang tahun",
  },
];

// External store for sync localStorage reads
let barListeners: Array<() => void> = [];

function subscribeBar(listener: () => void): () => void {
  barListeners.push(listener);
  return () => {
    barListeners = barListeners.filter((l) => l !== listener);
  };
}

function getDismissState(): { isDismissed: boolean; shouldShow: boolean } {
  if (typeof window === "undefined") return { isDismissed: false, shouldShow: false };
  try {
    const dismissedStr = localStorage.getItem(STORAGE_KEY);
    if (dismissedStr) {
      const data = JSON.parse(dismissedStr);
      const lastDismissed = data.timestamp || 0;
      const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
      if (lastDismissed >= twentyFourHoursAgo) {
        return { isDismissed: true, shouldShow: false };
      }
    }
    return { isDismissed: false, shouldShow: true };
  } catch {
    return { isDismissed: false, shouldShow: true };
  }
}

// Cached snapshots to avoid infinite re-render loops
let _cachedClientSnapshot: { isDismissed: boolean; shouldShow: boolean } | null = null;
let _cachedServerSnapshot: { isDismissed: boolean; shouldShow: boolean } | null = null;

function getBarSnapshot(): { isDismissed: boolean; shouldShow: boolean } {
  const result = getDismissState();
  // Only return a new object reference if the values actually changed
  if (!_cachedClientSnapshot || _cachedClientSnapshot.isDismissed !== result.isDismissed || _cachedClientSnapshot.shouldShow !== result.shouldShow) {
    _cachedClientSnapshot = result;
  }
  return _cachedClientSnapshot;
}

function getBarServerSnapshot(): { isDismissed: boolean; shouldShow: boolean } {
  if (!_cachedServerSnapshot) {
    _cachedServerSnapshot = { isDismissed: false, shouldShow: false };
  }
  return _cachedServerSnapshot;
}

export function EmergencyInfoBar() {
  const dismissState = useSyncExternalStore(subscribeBar, getBarSnapshot, getBarServerSnapshot);
  const [isVisible, setIsVisible] = useState(false);

  // Show bar after mount delay (using callback pattern to avoid setState in effect)
  useEffect(() => {
    if (!dismissState.shouldShow) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [dismissState.shouldShow]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ timestamp: Date.now(), dismissed: true })
    );
    // Notify external store subscribers
    _cachedClientSnapshot = null; // Invalidate cache so next getBarSnapshot() returns new value
    for (const fn of barListeners) fn();
  }, []);

  const handlePhoneCall = () => {
    window.location.href = `tel:${CONTACT_INFO.phoneRaw}`;
  };

  const handleWhatsApp = () => {
    window.open(CONTACT_INFO.whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Don't render if dismissed or shouldn't show
  if (dismissState.isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-[60] safe-area-top"
        >
          {/* Main bar */}
          <div className="relative bg-gradient-to-r from-green-700 via-green-800 to-emerald-800 dark:from-green-900 dark:via-green-950 dark:to-emerald-950 text-white shadow-lg shadow-green-900/20">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400" />

            {/* Notification area */}
            {EMERGENCY_NOTIFICATIONS.length > 0 && (
              <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5">
                <div className="container mx-auto flex items-center justify-center gap-2 text-xs">
                  <AlertTriangle className="h-3 w-3 text-amber-400 flex-shrink-0" />
                  <p className="text-amber-200/90 truncate">
                    {EMERGENCY_NOTIFICATIONS[0].message}
                  </p>
                </div>
              </div>
            )}

            {/* Main content */}
            <div className="container mx-auto px-4 py-2.5">
              <div className="flex items-center justify-between gap-3">
                {/* Left: Emergency contact info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Phone */}
                  <button
                    onClick={handlePhoneCall}
                    className="flex items-center gap-1.5 hover:bg-white/10 rounded-lg px-2.5 py-1.5 transition-colors group flex-shrink-0"
                    aria-label={`Hubungi ${CONTACT_INFO.phone}`}
                  >
                    <Phone className="h-3.5 w-3.5 text-green-300 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium text-green-100 group-hover:text-white transition-colors hidden sm:inline">
                      {CONTACT_INFO.phone}
                    </span>
                  </button>

                  {/* Divider */}
                  <div className="w-px h-4 bg-white/20 hidden sm:block" />

                  {/* WhatsApp */}
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center gap-1.5 hover:bg-white/10 rounded-lg px-2.5 py-1.5 transition-colors group flex-shrink-0"
                    aria-label="Hubungi via WhatsApp"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-green-300 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium text-green-100 group-hover:text-white transition-colors hidden sm:inline">
                      WhatsApp
                    </span>
                  </button>

                  {/* Divider */}
                  <div className="w-px h-4 bg-white/20 hidden md:block" />

                  {/* Hours info */}
                  <div className="hidden md:flex items-center gap-1.5 text-xs text-green-200/70">
                    <Clock className="h-3 w-3" />
                    <span>Sen-Jum 08:00-15:00 WITA</span>
                  </div>
                </div>

                {/* Right: Dismiss */}
                <button
                  onClick={handleDismiss}
                  className="flex items-center gap-1 hover:bg-white/10 rounded-lg px-2 py-1.5 transition-colors flex-shrink-0 text-green-200/60 hover:text-white"
                  aria-label="Tutup pemberitahuan"
                >
                  <X className="h-4 w-4" />
                  <span className="text-xs hidden sm:inline">Tutup</span>
                </button>
              </div>
            </div>
          </div>

          {/* Spacer to push content down */}
          {EMERGENCY_NOTIFICATIONS.length > 0 ? (
            <div className="h-[calc(2.5rem+1.75rem+2px)]" />
          ) : (
            <div className="h-[calc(2.5rem+2px)]" />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
