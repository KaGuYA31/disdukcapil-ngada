"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phoneNumber = "6281234567890"; // Ganti dengan nomor WhatsApp resmi
  const message = "Halo, saya ingin bertanya mengenai layanan kependudukan.";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors whatsapp-pulse"
      aria-label="Hubungi kami melalui WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-white fill-white" />
    </a>
  );
}
