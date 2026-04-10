"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ShieldCheck, BarChart3, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const COOKIE_CONSENT_KEY = "cookie-consent";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: true,
  marketing: false,
};

const COOKIE_CATEGORIES = [
  {
    key: "essential" as const,
    label: "Cookie Penting",
    description: "Diperlukan agar situs web berfungsi dengan baik.",
    icon: ShieldCheck,
    disabled: true,
    defaultValue: true,
  },
  {
    key: "analytics" as const,
    label: "Cookie Analitik",
    description:
      "Membantu kami memahami bagaimana pengunjung berinteraksi dengan situs web.",
    icon: BarChart3,
    disabled: false,
    defaultValue: true,
  },
  {
    key: "marketing" as const,
    label: "Cookie Pemasaran",
    description: "Digunakan untuk menampilkan iklan yang relevan kepada Anda.",
    icon: Megaphone,
    disabled: false,
    defaultValue: false,
  },
];

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const togglePreference = useCallback((key: keyof CookiePreferences) => {
    if (key === "essential") return;
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const savePreferences = useCallback(
    (prefs: CookiePreferences) => {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
      setIsVisible(false);
    },
    []
  );

  const handleAcceptAll = useCallback(() => {
    savePreferences({ essential: true, analytics: true, marketing: true });
  }, [savePreferences]);

  const handleSavePreferences = useCallback(() => {
    savePreferences(preferences);
  }, [savePreferences, preferences]);

  const handleRejectOptional = useCallback(() => {
    savePreferences({ essential: true, analytics: false, marketing: false });
  }, [savePreferences]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="w-full px-4 pb-4 sm:px-6">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Gradient top border */}
              <div className="bg-gradient-to-r from-green-500 via-teal-500 to-green-500 h-1 rounded-t-2xl" />

              {/* Collapsed content */}
              <div className="p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 self-center sm:self-start">
                    <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center">
                      <Cookie className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Informasi Cookie
                    </h3>
                    <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
                      Kami menggunakan cookie untuk meningkatkan pengalaman Anda.
                      Dengan melanjutkan, Anda menyetujui penggunaan cookie kami.
                    </p>
                    {/* Pelajari Lebih Lanjut link */}
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="text-teal-600 hover:text-teal-700 text-xs font-medium mt-2 inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      Pelajari Lebih Lanjut
                      <motion.span
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-block"
                      >
                        →
                      </motion.span>
                    </button>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0 justify-center sm:justify-end">
                    <Button
                      onClick={() => setIsExpanded(!isExpanded)}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-xs"
                    >
                      Pengaturan
                    </Button>
                    <Button
                      onClick={handleAcceptAll}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white text-xs"
                    >
                      Terima Semua Cookie
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expandable details section */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ maxHeight: 0, opacity: 0 }}
                    animate={{ maxHeight: 384, opacity: 1 }}
                    exit={{ maxHeight: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100">
                      <div className="px-5 md:px-6 py-5">
                        {/* Section title */}
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          Kelola Preferensi Cookie
                        </h4>
                        <p className="text-xs text-gray-500 mb-5">
                          Sesuaikan penggunaan cookie berdasarkan preferensi Anda. Cookie
                          penting tidak dapat dimatikan.
                        </p>

                        {/* Cookie category rows */}
                        <div className="space-y-4">
                          {COOKIE_CATEGORIES.map((category, index) => {
                            const Icon = category.icon;
                            const isChecked = preferences[category.key];

                            return (
                              <motion.div
                                key={category.key}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.25,
                                  delay: index * 0.08,
                                  ease: "easeOut",
                                }}
                                className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 border border-gray-100"
                              >
                                {/* Category icon */}
                                <div
                                  className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                                    category.disabled
                                      ? "bg-green-100"
                                      : isChecked
                                        ? "bg-teal-50"
                                        : "bg-gray-100"
                                  }`}
                                >
                                  <Icon
                                    className={`w-4 h-4 transition-colors duration-300 ${
                                      category.disabled
                                        ? "text-green-600"
                                        : isChecked
                                          ? "text-teal-600"
                                          : "text-gray-400"
                                    }`}
                                  />
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">
                                      {category.label}
                                    </span>
                                    {category.disabled && (
                                      <span className="text-[10px] font-medium bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full leading-none">
                                        Selalu Aktif
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                    {category.description}
                                  </p>
                                </div>

                                {/* Toggle switch */}
                                <div className="flex-shrink-0 pt-1">
                                  <Switch
                                    checked={isChecked}
                                    disabled={category.disabled}
                                    onCheckedChange={() =>
                                      togglePreference(category.key)
                                    }
                                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300 transition-colors duration-300"
                                  />
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Action buttons */}
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: 0.3 }}
                          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-5 pt-4 border-t border-gray-100"
                        >
                          <Button
                            onClick={handleRejectOptional}
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-xs order-3 sm:order-1"
                          >
                            Tolak Opsional
                          </Button>
                          <div className="flex-1" />
                          <div className="flex gap-2 order-1 sm:order-2 sm:justify-end">
                            <Button
                              onClick={() => setIsExpanded(false)}
                              variant="outline"
                              size="sm"
                              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-xs"
                            >
                              Kembali
                            </Button>
                            <Button
                              onClick={handleSavePreferences}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white text-xs"
                            >
                              Simpan Preferensi
                            </Button>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
