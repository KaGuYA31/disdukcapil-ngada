"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Accessibility, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/**
 * Floating accessibility settings widget.
 * Provides quick accessibility adjustments:
 * - Font size (small/medium/large)
 * - High contrast mode
 * - Reduced motion preference
 * - Link focus visibility
 * - Text spacing
 *
 * Settings are stored in localStorage and applied to <html> via data attributes
 * or CSS custom properties.
 */
type FontSize = "small" | "medium" | "large";
type LineHeight = "normal" | "relaxed" | "loose";

interface AccessibilityConfig {
  fontSize: FontSize;
  highContrast: boolean;
  reducedMotion: boolean;
  focusVisible: boolean;
  lineHeight: LineHeight;
}

const DEFAULT_CONFIG: AccessibilityConfig = {
  fontSize: "medium",
  highContrast: false,
  reducedMotion: false,
  focusVisible: true,
  lineHeight: "normal",
};

function loadConfig(): AccessibilityConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const saved = localStorage.getItem("accessibility-settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        fontSize: parsed.fontSize || DEFAULT_CONFIG.fontSize,
        highContrast: typeof parsed.highContrast === "boolean" ? parsed.highContrast : DEFAULT_CONFIG.highContrast,
        reducedMotion: typeof parsed.reducedMotion === "boolean" ? parsed.reducedMotion : DEFAULT_CONFIG.reducedMotion,
        focusVisible: typeof parsed.focusVisible === "boolean" ? parsed.focusVisible : DEFAULT_CONFIG.focusVisible,
        lineHeight: parsed.lineHeight || DEFAULT_CONFIG.lineHeight,
      };
    }
  } catch {}
  return DEFAULT_CONFIG;
}

function persistConfig(config: AccessibilityConfig) {
  if (typeof window === "undefined") return;
  localStorage.setItem("accessibility-settings", JSON.stringify(config));
}

export function AccessibilitySettingsWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [config, setConfig] = useState<AccessibilityConfig>(loadConfig);

  const updateSetting = useCallback(<K extends keyof AccessibilityConfig>(key: K, value: AccessibilityConfig[K]) => {
    setConfig((prev) => {
      const next = { ...prev, [key]: value };
      persistConfig(next);
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    persistConfig(DEFAULT_CONFIG);
  }, []);

  const { fontSize, highContrast, reducedMotion, focusVisible, lineHeight } = config;

  // Show button after delay
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Apply settings to document
  useEffect(() => {
    const html = document.documentElement;

    // Font size
    html.style.fontSize = fontSize === "small" ? "14px" : fontSize === "medium" ? "16px" : "18px";
    html.className = html.className.replace(/font-(small|medium|large)/g, "") + ` font-${fontSize}`;

    // High contrast
    if (highContrast) {
      html.style.setProperty("--contrast-high", "1");
      html.style.filter = "contrast(1.3)";
    } else {
      html.style.removeProperty("--contrast-high");
      html.style.filter = "";
    }

    // Reduced motion
    if (reducedMotion) {
      html.style.setProperty("--animate-duration", "0s");
    } else {
      html.style.removeProperty("--animate-duration");
    }

    // Focus visible
    if (focusVisible) {
      document.head.insertAdjacentHTML("beforeend", `<style>:focus-visible { outline: 2px solid #15803d !important; outline-offset: 2px !important; }</style>`);
    }

    // Line height
    html.style.lineHeight = lineHeight === "normal" ? "1.5" : lineHeight === "relaxed" ? "1.75" : "2";
  }, [fontSize, highContrast, reducedMotion, focusVisible, lineHeight]);

  const settingOptions = [
    { id: "fontSize", label: "Ukuran Huruf", desc: "Sesuaikan ukuran teks", value: fontSize, options: [
      { value: "small", label: "Kecil (14px)" },
      { value: "medium", label: "Sedang (16px)" },
      { value: "large", label: "Besar (18px)" },
    ]},
    { id: "lineHeight", label: "Jarak Baris", desc: "Jarak antar baris teks", value: lineHeight, options: [
      { value: "normal", label: "Normal (1.5)" },
      { value: "relaxed", label: "Santai (1.75)" },
      { value: "loose", label: "Longgar (2.0)" },
    ]},
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 left-6 z-50"
        >
          {/* Toggle Button */}
          {!isOpen && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="w-11 h-11 bg-gray-700 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Pengaturan Aksesibilitas"
            >
              <Accessibility className="h-5 w-5 text-white" />
            </motion.button>
          )}

          {/* Settings Panel */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute bottom-14 left-0 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Accessibility className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Aksesibilitas</h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
                    aria-label="Tutup"
                  >
                    <Minimize2 className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                </div>

                <CardContent className="p-4 space-y-4">
                  {/* Font Size Selector */}
                  <div>
                    <Label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Ukuran Huruf</Label>
                    <div className="flex gap-2 mt-1.5">
                      {settingOptions[0].options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => updateSetting("fontSize", opt.value as FontSize)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                            fontSize === opt.value
                              ? "bg-green-600 text-white shadow-sm"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Line Height Selector */}
                  <div>
                    <Label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Jarak Baris</Label>
                    <div className="flex gap-2 mt-1.5">
                      {settingOptions[1].options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => updateSetting("lineHeight", opt.value as LineHeight)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                            lineHeight === opt.value
                              ? "bg-green-600 text-white shadow-sm"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Switches */}
                  <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    {[
                      { id: "highContrast", label: "Kontras Tinggi", desc: "Tingkatkan kontras warna", checked: highContrast, onChange: (v: boolean) => updateSetting("highContrast", v) },
                      { id: "reducedMotion", label: "Gerak Minimal", desc: "Kurangi animasi", checked: reducedMotion, onChange: (v: boolean) => updateSetting("reducedMotion", v) },
                      { id: "focusVisible", label: "Fokus Terlihat", desc: "Sorot outline fokus", checked: focusVisible, onChange: (v: boolean) => updateSetting("focusVisible", v) },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <Label htmlFor={item.id} className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                            {item.label}
                          </Label>
                          <p className="text-[10px] text-gray-400">{item.desc}</p>
                        </div>
                        <Switch
                          id={item.id}
                          checked={item.checked}
                          onCheckedChange={item.onChange}
                          className="data-[state=checked]:bg-green-600"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Reset Button */}
                <div className="px-4 pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs border-gray-200 dark:border-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-900/20"
                    onClick={handleReset}
                  >
                    <Maximize2 className="h-3.5 w-3.5 mr-1.5" />
                    Reset ke Default
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
