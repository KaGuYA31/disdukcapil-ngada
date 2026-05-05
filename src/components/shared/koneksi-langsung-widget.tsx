"use client";

import { useCallback, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, Mail, X, HelpCircle } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

// ─── Mounted Detection ──────────────────────────────────────────────
const emptySubscribe = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

// ─── External Store for scroll + dismiss ───────────────────────────
type Listener = () => void;
let listeners: Listener[] = [];
let dismissed = false;

function subscribeToStore(callback: Listener) {
  listeners = [...listeners, callback];
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  return window.scrollY >= scrollHeight * 0.5 && !dismissed;
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

// Attach scroll listener once (module-level, only client)
if (typeof window !== "undefined") {
  let prevPastThreshold = false;
  window.addEventListener(
    "scroll",
    () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pastThreshold = window.scrollY >= scrollHeight * 0.5;
      // Reset dismissed when user scrolls back up
      if (!pastThreshold && prevPastThreshold) {
        dismissed = false;
      }
      prevPastThreshold = pastThreshold;
      emitChange();
    },
    { passive: true },
  );
}

// ─── Quick Actions ──────────────────────────────────────────────────
const quickActions = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: CONTACT_INFO.whatsappUrl,
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    icon: Phone,
    label: "Telepon",
    href: `tel:${CONTACT_INFO.phoneRaw}`,
    color: "bg-teal-500 hover:bg-teal-600",
  },
  {
    icon: Mail,
    label: "Email",
    href: `mailto:${CONTACT_INFO.email}`,
    color: "bg-emerald-500 hover:bg-emerald-600",
  },
];

// ─── Component ──────────────────────────────────────────────────────
export function KoneksiLangsungWidget() {
  const mounted = useSyncExternalStore(emptySubscribe, getTrue, getFalse);
  const shouldShow = useSyncExternalStore(subscribeToStore, getSnapshot, getFalse);

  const handleDismiss = useCallback(() => {
    dismissed = true;
    emitChange();
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-32 right-6 z-50">
      <AnimatePresence>
        {shouldShow && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
              mass: 0.8,
            }}
            className="relative"
          >
            {/* Main Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-green-600/10 border border-gray-200/80 dark:border-gray-700/50 p-4 min-w-[220px] backdrop-blur-sm">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    Butuh Bantuan?
                  </span>
                </div>
                <button
                  onClick={handleDismiss}
                  className="w-6 h-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                  aria-label="Tutup bantuan"
                >
                  <X className="h-3.5 w-3.5 text-gray-400" />
                </button>
              </div>

              {/* Subtext */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Hubungi kami langsung melalui:
              </p>

              {/* Action Buttons */}
              <div className="space-y-2">
                {quickActions.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <motion.a
                      key={action.label}
                      href={action.href}
                      target={action.label === "WhatsApp" ? "_blank" : undefined}
                      rel={action.label === "WhatsApp" ? "noopener noreferrer" : undefined}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl ${action.color} text-white text-sm font-medium shadow-md shadow-green-600/10 transition-shadow hover:shadow-lg`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{action.label}</span>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Connector arrow pointing down */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 rotate-45 bg-white dark:bg-gray-900 border-r border-b border-gray-200/80 dark:border-gray-700/50" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
