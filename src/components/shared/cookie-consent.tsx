"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "cookie-consent";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  }, []);

  const handleSettings = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "custom");
    setIsVisible(false);
  }, []);

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
          <div className="w-full px-4 pb-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
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
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0 justify-center sm:justify-end">
                    <Button
                      onClick={handleSettings}
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
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
