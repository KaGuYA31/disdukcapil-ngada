"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Loader2 } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string | null;
  type?: string;
  createdAt?: string;
  isActive?: boolean;
}

const fallbackAnnouncements: Announcement[] = [
  {
    id: "fallback-1",
    title: "Pelayanan KTP-el untuk pertama kali GRATIS — pastikan membawa berkas lengkap",
    content: null,
  },
  {
    id: "fallback-2",
    title: "Jam Operasional: Senin-Kamis 08.00-15.30 WITA, Jumat 08.00-16.00 WITA",
    content: null,
  },
  {
    id: "fallback-3",
    title: "Layanan Jemput Bola tersedia untuk masyarakat di pelosok desa",
    content: null,
  },
];

export function AnnouncementTicker() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    // Abort any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/pengumuman?limit=5", {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();

      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setAnnouncements(json.data);
      } else {
        setAnnouncements(fallbackAnnouncements);
      }
    } catch (error) {
      // Use fallback on network error, abort, or invalid response
      if (error instanceof DOMException && error.name === "AbortError") {
        return; // Don't update state on abort
      }
      setAnnouncements(fallbackAnnouncements);
    } finally {
      // Only set loading to false if this is the current controller
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchAnnouncements]);

  // Don't render anything if there are no announcements
  if (!loading && announcements.length === 0) {
    return null;
  }

  // Duplicate announcements for seamless loop
  const displayItems = announcements.length > 0 ? announcements : fallbackAnnouncements;
  const tickerItems = [...displayItems, ...displayItems];

  return (
    <div className="announcement-ticker-bar bg-green-700 text-white py-1 text-sm overflow-hidden hidden md:block">
      <div className="container mx-auto flex items-center">
        {/* Static bell icon + label */}
        <div className="flex-shrink-0 flex items-center gap-1.5 px-4 border-r border-green-600 h-6">
          <Bell className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="font-medium text-xs tracking-wide">Pengumuman</span>
        </div>

        {/* Scrolling ticker area */}
        <div className="announcement-ticker-wrapper flex-1 overflow-hidden relative h-6 flex items-center">
          {loading ? (
            <div className="flex items-center gap-2 px-4">
              <Loader2 className="h-3.5 w-3.5 animate-spin opacity-75" />
              <span className="opacity-75 text-xs">Memuat pengumuman...</span>
            </div>
          ) : (
            <div className="announcement-ticker-track">
              {tickerItems.map((item, index) => (
                <span key={`${item.id}-${index}`} className="announcement-ticker-item inline-flex items-center">
                  {item.content ? (
                    <a
                      href="#"
                      className="inline-flex items-center gap-1 hover:underline underline-offset-2 transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      {item.title}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      {item.title}
                    </span>
                  )}
                  {index < tickerItems.length - 1 && (
                    <span className="inline-block mx-3 opacity-50 text-xs select-none" aria-hidden="true">
                      &bull;
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
