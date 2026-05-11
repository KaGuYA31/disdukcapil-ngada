"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { CONTACT_INFO } from "@/lib/constants";

export function WhatsAppButton() {
  const message = "Halo, saya ingin bertanya mengenai layanan kependudukan.";
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show button after a short delay for entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide tooltip after 4 seconds
  useEffect(() => {
    if (!isVisible) return;
    const showTimer = setTimeout(() => setShowTooltip(true), 2000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 7000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
            <TooltipTrigger asChild>
              <a
                href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 whatsapp-pulse focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-label="Hubungi kami melalui WhatsApp"
              >
                {/* Hover ring effect */}
                <span className="absolute inset-0 rounded-full bg-green-400/0 group-hover:bg-green-400/20 transition-colors duration-300" />

                {/* WhatsApp icon */}
                <MessageCircle className="h-7 w-7 text-white fill-white relative z-10 transition-transform duration-300 group-hover:scale-110" />

                <span className="sr-only">Hubungi via WhatsApp</span>

                {/* Ping ring on first appearance */}
                <motion.span
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  className="absolute inset-0 rounded-full border-2 border-green-400 pointer-events-none"
                />
              </a>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              sideOffset={12}
              className="bg-gray-900 text-white border-gray-700 px-3 py-2 text-xs font-medium shadow-xl"
            >
              <p>💬 Chat via WhatsApp</p>
              <p className="text-gray-400 mt-0.5">Respon cepat 08.00–15.00 WITA</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
