"use client";

import { MessageCircle } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

export function WhatsAppButton() {
  const message = "Halo, saya ingin bertanya mengenai layanan kependudukan.";

  return (
    <a
      href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-200 whatsapp-pulse"
      aria-label="Hubungi kami melalui WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-white fill-white" />
      <span className="sr-only">Hubungi via WhatsApp</span>
    </a>
  );
}
