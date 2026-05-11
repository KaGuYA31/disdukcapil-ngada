"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accessibility,
  Keyboard,
  Type,
  Contrast,
  Minus,
  Plus,
  X,
} from "lucide-react";

// ============================================================
// Types
// ============================================================

interface AccessibilityEnhancedProps {
  className?: string;
}

interface KeyboardShortcut {
  key: string;
  alt?: boolean;
  ctrl?: boolean;
  label: string;
  action: () => void;
}

// ============================================================
// Constants
// ============================================================

const FONT_SIZE_MIN = 14;
const FONT_SIZE_MAX = 22;
const FONT_SIZE_STEP = 2;
const FONT_SIZE_DEFAULT = 16;
const FONT_SIZE_STORAGE_KEY = "a11y-font-size";
const HIGH_CONTRAST_STORAGE_KEY = "a11y-high-contrast";

const SKIP_LINKS = [
  { href: "#main-content", label: "Langsung ke konten utama" },
  { href: "#main-navigation", label: "Langsung ke navigasi" },
  { href: "#search-input", label: "Langsung ke pencarian" },
  { href: "#footer", label: "Langsung ke footer" },
] as const;

const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { key: "1", alt: true, label: "Beranda", action: () => navigateTo("/") },
  { key: "2", alt: true, label: "Persyaratan", action: () => navigateTo("/layanan") },
  { key: "3", alt: true, label: "Berita", action: () => navigateTo("/berita") },
  { key: "4", alt: true, label: "Pengaduan", action: () => navigateTo("/pengaduan") },
  { key: "5", alt: true, label: "Hubungi Kami", action: () => navigateTo("/hubungi-kami") },
  { key: "/", alt: true, label: "Buka Pencarian", action: () => openSearch() },
  { key: "Escape", label: "Tutup Modal/Pencarian", action: () => closeActiveDialog() },
];

// ============================================================
// Utility functions
// ============================================================

function navigateTo(path: string) {
  if (typeof window !== "undefined") {
    window.location.href = path;
  }
}

function openSearch() {
  if (typeof window !== "undefined") {
    document.dispatchEvent(new CustomEvent("open-search"));
  }
}

function closeActiveDialog() {
  if (typeof window !== "undefined") {
    const event = new KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(event);
  }
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed === typeof fallback) return parsed as T;
    }
  } catch {
    // ignore
  }
  return fallback;
}

function saveToStorage(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// ============================================================
// useReducedMotion hook (SSR-safe via useSyncExternalStore)
// ============================================================

function subscribeToMotionChange(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerMotionSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToMotionChange,
    getMotionSnapshot,
    getServerMotionSnapshot
  );
}

// ============================================================
// useFocusTrap hook
// ============================================================

export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  active: boolean
) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function getFocusableElements(): HTMLElement[] {
      const elements = Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelector)
      );
      return elements.filter(
        (el) => el.offsetParent !== null && !el.hasAttribute("aria-hidden")
      );
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    // Focus the first focusable element
    const focusable = getFocusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  return containerRef;
}

// ============================================================
// useRovingFocus hook
// ============================================================

interface UseRovingFocusOptions {
  orientation?: "horizontal" | "vertical" | "both";
  loop?: boolean;
}

export function useRovingFocus<T extends HTMLElement = HTMLElement>(
  options: UseRovingFocusOptions = {}
) {
  const { orientation = "vertical", loop = true } = options;
  const containerRef = useRef<T>(null);
  const currentIndexRef = useRef(0);

  const getItems = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(
        '[data-roving-focus-item]'
      )
    );
  }, []);

  const setActive = useCallback(
    (index: number) => {
      const items = getItems();
      if (items.length === 0) return;

      // Remove tabindex from all
      items.forEach((item) => item.setAttribute("tabindex", "-1"));

      // Clamp index
      let target = index;
      if (target < 0) target = loop ? items.length - 1 : 0;
      if (target >= items.length) target = loop ? 0 : items.length - 1;

      // Set tabindex on active
      items[target].setAttribute("tabindex", "0");
      items[target].focus();
      currentIndexRef.current = target;
    },
    [getItems, loop]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleKeyDown(e: KeyboardEvent) {
      const items = getItems();
      if (items.length === 0) return;

      const isNext =
        e.key === "ArrowDown" ||
        (orientation !== "vertical" && e.key === "ArrowRight");
      const isPrev =
        e.key === "ArrowUp" ||
        (orientation !== "vertical" && e.key === "ArrowLeft");
      const isHome = e.key === "Home";
      const isEnd = e.key === "End";

      if (!isNext && !isPrev && !isHome && !isEnd) return;

      e.preventDefault();

      if (isNext) {
        setActive(currentIndexRef.current + 1);
      } else if (isPrev) {
        setActive(currentIndexRef.current - 1);
      } else if (isHome) {
        setActive(0);
      } else if (isEnd) {
        setActive(items.length - 1);
      }
    }

    container.addEventListener("keydown", handleKeyDown);
    // Initialize: set first item active
    setActive(0);

    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [getItems, setActive, orientation]);

  return containerRef;
}

// ============================================================
// Keyboard Key Badge component
// ============================================================

function KeyBadge({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-sm text-[11px] font-mono font-semibold text-gray-700 dark:text-gray-300">
      {children}
    </kbd>
  );
}

// ============================================================
// Main Component
// ============================================================

export function AccessibilityEnhanced({ className }: AccessibilityEnhancedProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [fontSize, setFontSize] = useState(() => loadFromStorage<number>(FONT_SIZE_STORAGE_KEY, FONT_SIZE_DEFAULT));
  const [highContrast, setHighContrast] = useState(() => loadFromStorage<boolean>(HIGH_CONTRAST_STORAGE_KEY, false));
  const reducedMotion = useReducedMotion();

  // ── Apply font size on mount and when changed ──
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // ── Apply high contrast on mount and when changed ──
  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute("data-high-contrast", "true");
    } else {
      document.documentElement.removeAttribute("data-high-contrast");
    }
  }, [highContrast]);

  // ── Font size controls ──
  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => {
      const next = Math.min(prev + FONT_SIZE_STEP, FONT_SIZE_MAX);
      document.documentElement.style.fontSize = `${next}px`;
      saveToStorage(FONT_SIZE_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => {
      const next = Math.max(prev - FONT_SIZE_STEP, FONT_SIZE_MIN);
      document.documentElement.style.fontSize = `${next}px`;
      saveToStorage(FONT_SIZE_STORAGE_KEY, next);
      return next;
    });
  }, []);

  // ── High contrast toggle ──
  const toggleHighContrast = useCallback(() => {
    setHighContrast((prev) => {
      const next = !prev;
      saveToStorage(HIGH_CONTRAST_STORAGE_KEY, next);
      return next;
    });
  }, []);

  // ── Keyboard shortcuts listener ──
  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      // Don't capture when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      for (const shortcut of KEYBOARD_SHORTCUTS) {
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey : !e.ctrlKey;

        if (
          altMatch &&
          ctrlMatch &&
          e.key.toLowerCase() === shortcut.key.toLowerCase()
        ) {
          e.preventDefault();
          shortcut.action();
          return;
        }

        // Special case for Escape (no alt)
        if (
          shortcut.key === "Escape" &&
          !shortcut.alt &&
          !shortcut.ctrl &&
          e.key === "Escape"
        ) {
          shortcut.action();
          return;
        }
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // ── Close panel on Escape ──
  useEffect(() => {
    if (!isPanelOpen) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setIsPanelOpen(false);
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isPanelOpen]);

  // ── Animation variants respecting reduced motion ──
  const panelVariants = reducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
        exit: { x: -20, opacity: 0, transition: { duration: 0.2 } },
      };

  const fabVariants = reducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      }
    : {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
      };

  return (
    <>
      {/* ── Skip Links ── */}
      <nav aria-label="Tautan langsung" className="relative z-[100]">
        <motion.ol
          className="flex flex-col"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {SKIP_LINKS.map((skipLink) => (
            <li key={skipLink.href}>
              <a
                href={skipLink.href}
                className="skip-link sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:inline-flex focus:items-center focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:rounded-lg focus:bg-[#059669] focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#059669]"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.querySelector(skipLink.href);
                  if (target) {
                    (target as HTMLElement).focus();
                    (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {skipLink.label}
              </a>
            </li>
          ))}
        </motion.ol>
      </nav>

      {/* ── Floating Action Button ── */}
      <motion.div
        className={className}
        {...fabVariants}
        animate="animate"
        style={{ position: "fixed", bottom: "1.5rem", left: "1.5rem", zIndex: 60 }}
      >
        <AnimatePresence>
          {!isPanelOpen && (
            <motion.button
              whileHover={reducedMotion ? {} : { scale: 1.1 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
              onClick={() => setIsPanelOpen(true)}
              className="group relative w-12 h-12 rounded-full bg-[#15803d] hover:bg-[#166534] text-white shadow-lg hover:shadow-xl transition-colors duration-200 flex items-center justify-center"
              aria-label="Buka panel aksesibilitas"
              aria-expanded={false}
            >
              <Accessibility className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22c55e]" />
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Accessibility Panel ── */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
              onClick={() => setIsPanelOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.aside
              className="absolute bottom-0 left-0 sm:bottom-6 sm:left-6 sm:top-auto w-full sm:w-96 max-h-[85vh] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(34,197,94,0.15)",
              }}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Panel aksesibilitas"
            >
              {/* Dark mode panel styling */}
              <style>{`
                .dark .a11y-panel-bg {
                  background: rgba(31, 41, 55, 0.9) !important;
                  border-color: rgba(34, 197, 94, 0.2) !important;
                }
              `}</style>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#15803d] flex items-center justify-center">
                    <Accessibility className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      Aksesibilitas
                    </h2>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      Pengaturan navigasi & tampilan
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
                  aria-label="Tutup panel"
                >
                  <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto max-h-[60vh] sm:max-h-[55vh] p-5 space-y-6">
                {/* ── Keyboard Shortcuts ── */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Keyboard className="h-4 w-4 text-[#15803d]" />
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                      Pintasan Keyboard
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {KEYBOARD_SHORTCUTS.map((shortcut) => (
                      <div
                        key={shortcut.key + (shortcut.alt ? "-alt" : "")}
                        className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          {shortcut.label}
                        </span>
                        <div className="flex items-center gap-1">
                          {shortcut.alt && <KeyBadge>Alt</KeyBadge>}
                          <KeyBadge>{shortcut.key === "Escape" ? "Esc" : shortcut.key}</KeyBadge>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── Font Size ── */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Type className="h-4 w-4 text-[#15803d]" />
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                      Ukuran Huruf
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decreaseFontSize}
                      disabled={fontSize <= FONT_SIZE_MIN}
                      className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      aria-label="Kurangi ukuran huruf"
                    >
                      <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                        {fontSize}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-0.5">
                        px
                      </span>
                      <div className="flex gap-0.5 justify-center mt-1.5">
                        {Array.from({ length: 5 }, (_, i) => {
                          const size = FONT_SIZE_MIN + i * FONT_SIZE_STEP;
                          return (
                            <div
                              key={size}
                              className={`h-1.5 rounded-full transition-all duration-200 ${
                                fontSize >= size
                                  ? "bg-[#15803d] flex-1"
                                  : "bg-gray-200 dark:bg-gray-700 flex-1"
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <button
                      onClick={increaseFontSize}
                      disabled={fontSize >= FONT_SIZE_MAX}
                      className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      aria-label="Perbesar ukuran huruf"
                    >
                      <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </section>

                {/* ── High Contrast ── */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Contrast className="h-4 w-4 text-[#15803d]" />
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                      Kontras Tinggi
                    </h3>
                  </div>
                  <button
                    onClick={toggleHighContrast}
                    className={`w-full flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-200 ${
                      highContrast
                        ? "bg-[#15803d] text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                    role="switch"
                    aria-checked={highContrast}
                    aria-label="Aktifkan mode kontras tinggi"
                  >
                    <span className="text-xs font-medium">
                      {highContrast ? "Mode Kontras Tinggi Aktif" : "Aktifkan Kontras Tinggi"}
                    </span>
                    <div
                      className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                        highContrast ? "bg-white/30" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform duration-200 ${
                          highContrast ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </div>
                  </button>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 px-1">
                    Meningkatkan kontras warna untuk keterbacaan yang lebih baik
                  </p>
                </section>

                {/* ── Reduced Motion Status ── */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="h-4 w-4 text-[#15803d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                      Info Sistem
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className={`w-2.5 h-2.5 rounded-full ${reducedMotion ? "bg-amber-500" : "bg-[#22c55e]"}`} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {reducedMotion
                        ? "Gerak minimal diaktifkan — animasi dinonaktifkan"
                        : "Animasi aktif — gerakan diperbolehkan"}
                    </span>
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                <p className="text-[10px] text-center text-gray-400 dark:text-gray-500">
                  Disdukcapil Kabupaten Ngada — Aksesibilitas Web
                </p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
