"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: true,
  marketing: false,
};

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!accepted) {
      // Small delay so the page loads first
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(defaultPreferences));
    setIsVisible(false);
  }, []);

  const handleSaveSettings = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
    setIsVisible(false);
  }, [preferences]);

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === "essential") return; // Essential is always on
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
          <div className="bg-gray-900 text-white">
            {/* Main Banner */}
            <div className="container mx-auto px-4 py-4 md:py-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Left side: icon + title + description */}
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Cookie className="h-5 w-5 text-green-400" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm md:text-base text-white">
                      Penggunaan Cookie
                    </h3>
                    <p className="text-xs md:text-sm text-gray-300 mt-1 leading-relaxed">
                      Website ini menggunakan cookie untuk meningkatkan pengalaman
                      pengguna. Dengan melanjutkan, Anda menyetujui penggunaan cookie
                      kami.
                    </p>
                  </div>
                </div>

                {/* Right side: buttons */}
                <div className="flex items-center gap-2 flex-shrink-0 md:ml-6">
                  <Button
                    onClick={() => setShowSettings(!showSettings)}
                    variant="outline"
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent"
                  >
                    Pengaturan
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Terima Semua
                  </Button>
                </div>
              </div>

              {/* Settings Panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                      {/* Cookie Categories */}
                      <div className="grid gap-3 sm:grid-cols-3">
                        {[
                          {
                            key: "essential" as const,
                            title: "Cookie Esensial",
                            description: "Diperlukan untuk fungsi website",
                            disabled: true,
                          },
                          {
                            key: "analytics" as const,
                            title: "Cookie Analitik",
                            description: "Membantu kami meningkatkan website",
                            disabled: false,
                          },
                          {
                            key: "marketing" as const,
                            title: "Cookie Pemasaran",
                            description: "Digunakan untuk iklan",
                            disabled: false,
                          },
                        ].map((category) => (
                          <div
                            key={category.key}
                            className={cn(
                              "rounded-lg border p-3 transition-colors",
                              preferences[category.key]
                                ? "border-white/20 bg-white/5"
                                : "border-white/10 bg-white/[0.02]"
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <label
                                htmlFor={`cookie-${category.key}`}
                                className="text-sm font-medium text-white cursor-pointer"
                              >
                                {category.title}
                              </label>
                              <Switch
                                id={`cookie-${category.key}`}
                                checked={preferences[category.key]}
                                onCheckedChange={() => togglePreference(category.key)}
                                disabled={category.disabled}
                                className="data-[state=checked]:bg-green-600"
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {category.description}
                              {category.disabled && (
                                <span className="text-green-400 ml-1">(Selalu aktif)</span>
                              )}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Save Settings Button */}
                      <div className="flex justify-end">
                        <Button
                          onClick={handleSaveSettings}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Simpan Pengaturan
                        </Button>
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
