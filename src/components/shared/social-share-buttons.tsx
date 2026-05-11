"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Facebook,
  Twitter,
  MessageCircle,
  Linkedin,
  Send,
  Link2,
  CheckCircle2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

interface SharePlatform {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  hoverGradient: string;
  defaultBg: string;
  defaultText: string;
}

export function SocialShareButtons({
  url,
  title,
  description,
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const platforms: SharePlatform[] = [
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      hoverGradient: "hover:from-blue-600 hover:to-blue-700",
      defaultBg: "bg-gray-100 dark:bg-gray-800",
      defaultText: "text-blue-600 dark:text-blue-400",
    },
    {
      name: "Twitter / X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      hoverGradient: "hover:from-gray-900 hover:to-gray-800 dark:hover:from-gray-200 dark:hover:to-gray-300",
      defaultBg: "bg-gray-100 dark:bg-gray-800",
      defaultText: "text-gray-800 dark:text-gray-200",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
      hoverGradient: "hover:from-green-600 hover:to-green-700",
      defaultBg: "bg-gray-100 dark:bg-gray-800",
      defaultText: "text-green-600 dark:text-green-400",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      hoverGradient: "hover:from-sky-600 hover:to-sky-700",
      defaultBg: "bg-gray-100 dark:bg-gray-800",
      defaultText: "text-sky-600 dark:text-sky-400",
    },
    {
      name: "Telegram",
      icon: Send,
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      hoverGradient: "hover:from-blue-500 hover:to-cyan-500",
      defaultBg: "bg-gray-100 dark:bg-gray-800",
      defaultText: "text-blue-500 dark:text-blue-400",
    },
  ];

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Tautan disalin!",
        description: description
          ? `Link berhasil disalin ke clipboard.`
          : "Link berhasil disalin ke clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Gagal menyalin",
        description: "Tidak dapat mengakses clipboard. Coba salin secara manual.",
        variant: "destructive",
      });
    }
  }, [url, description, toast]);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {platforms.map((platform) => {
        const Icon = platform.icon;
        return (
          <Tooltip key={platform.name}>
            <TooltipTrigger asChild>
              <motion.a
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                className={`
                  inline-flex items-center justify-center
                  w-10 h-10 rounded-full
                  transition-all duration-200
                  ${platform.defaultBg}
                  ${platform.defaultText}
                  ${platform.hoverGradient}
                  hover:text-white dark:hover:text-gray-900
                  shadow-sm hover:shadow-md
                  border border-gray-200 dark:border-gray-700
                  hover:border-transparent
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
                `}
                aria-label={`Bagikan ke ${platform.name}`}
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>
              <p>{platform.name}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}

      {/* Copy Link Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={handleCopyLink}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className={`
              inline-flex items-center justify-center
              w-10 h-10 rounded-full
              transition-all duration-200
              bg-gray-100 dark:bg-gray-800
              text-gray-600 dark:text-gray-400
              hover:from-amber-500 hover:to-orange-500
              hover:text-white dark:hover:text-white
              shadow-sm hover:shadow-md
              border border-gray-200 dark:border-gray-700
              hover:border-transparent
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
            `}
            aria-label={copied ? "Tautan tersalin" : "Salin tautan"}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="link"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link2 className="w-4 h-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={6}>
          <p>{copied ? "Tersalin!" : "Salin Tautan"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
