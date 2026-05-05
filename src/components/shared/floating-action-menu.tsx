"use client";

import { useState, useCallback } from "react";
import { Phone, Mail, MapPin, MessageCircle, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Contact Data ──────────────────────────────────────────────────
const contactActions = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: "https://wa.me/628123456789",
    color: "bg-green-500 hover:bg-green-600",
    ring: "ring-green-200 dark:ring-green-800",
  },
  {
    icon: Phone,
    label: "Telepon",
    href: "tel:+62038321678",
    color: "bg-teal-500 hover:bg-teal-600",
    ring: "ring-teal-200 dark:ring-teal-800",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:disdukcapil@ngadakab.go.id",
    color: "bg-emerald-500 hover:bg-emerald-600",
    ring: "ring-emerald-200 dark:ring-emerald-800",
  },
  {
    icon: MapPin,
    label: "Lokasi",
    href: "https://maps.google.com/?q=Disdukcapil+Kabupaten+Ngada+Bajawa",
    color: "bg-green-600 hover:bg-green-700",
    ring: "ring-green-300 dark:ring-green-700",
  },
] as const;

// ─── Spring Config ─────────────────────────────────────────────────
const springConfig = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
  mass: 0.8,
};

// ─── Floating Action Menu ──────────────────────────────────────────
export function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Fan-out positions for action buttons (relative to FAB)
  const buttonPositions = [
    { x: -70, y: -55 },  // WhatsApp (top-left)
    { x: 0, y: -75 },    // Phone (top)
    { x: 70, y: -55 },   // Email (top-right)
    { x: 0, y: -110 },   // Location (far top)
  ];

  return (
    <div className="fixed bottom-24 right-6 z-50 flex items-end justify-end">
      {/* Action Buttons */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              onClick={close}
              aria-hidden="true"
            />

            {/* Buttons */}
            {contactActions.map((action, index) => {
              const pos = buttonPositions[index];
              const Icon = action.icon;

              return (
                <motion.a
                  key={action.label}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: pos.x,
                    y: pos.y,
                  }}
                  exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  transition={{
                    ...springConfig,
                    delay: index * 0.05,
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`absolute bottom-2 right-2 w-12 h-12 ${action.color} rounded-full flex items-center justify-center shadow-lg text-white transition-colors group`}
                  aria-label={action.label}
                  title={action.label}
                >
                  <Icon className="h-5 w-5" />

                  {/* Tooltip */}
                  <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {action.label}
                    {/* Arrow */}
                    <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900 dark:border-l-gray-700" />
                  </span>
                </motion.a>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-14 h-14 bg-gradient-to-br from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 rounded-full flex items-center justify-center shadow-xl shadow-green-600/30 text-white transition-all duration-300 z-50"
        aria-label={isOpen ? "Tutup menu" : "Buka menu kontak"}
      >
        {/* Ripple background */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scale: 1, opacity: 0.3 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-green-400 rounded-full"
            />
          )}
        </AnimatePresence>

        {/* Icon: + or × */}
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </motion.div>

        {/* Ring indicator */}
        <motion.div
          animate={{
            boxShadow: isOpen
              ? "0 0 0 4px rgba(22, 163, 74, 0.2)"
              : "0 0 0 0px rgba(22, 163, 74, 0)",
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-full"
        />
      </motion.button>
    </div>
  );
}
