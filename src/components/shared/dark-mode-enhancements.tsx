"use client";

import { useTheme } from "next-themes";
import { useRef, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * DarkModeEnhancements
 *
 * A drop-in wrapper component that enhances dark mode across the entire site.
 * It injects CSS adjustments that only apply when the dark theme is active.
 * Fixes common dark mode issues: images too bright, borders invisible,
 * text contrast, and adds subtle glow effects for cards.
 *
 * Usage: Wrap it in your root layout around {children}
 *   <DarkModeEnhancements>
 *     {children}
 *   </DarkModeEnhancements>
 */
export function DarkModeEnhancements({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const mountedRef = useRef(false);

  // Use useSyncExternalStore to track client-side mount state without setState in effect
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => {
      mountedRef.current = true;
      return true;
    },
    () => false
  );

  // Only render the style tag once mounted to avoid hydration mismatch
  const isDark = isMounted && resolvedTheme === "dark";

  return (
    <>
      {isDark && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* ═══════════════════════════════════════════════════════
                 Dark Mode Enhancements - Disdukcapil Ngada
                 Auto-injected when dark theme is active
              ═══════════════════════════════════════════════════════ */

              /* ─── Image Brightness Fix ─────────────────────────── */
              /* Reduce overly bright images in dark mode */
              img:not([src*="svg"]):not(.dark-img-bypass) {
                border-radius: 8px;
              }

              .prose img,
              article img {
                opacity: 0.92;
                border-radius: 8px;
                transition: opacity 0.3s ease;
              }

              .prose img:hover,
              article img:hover {
                opacity: 1;
              }

              /* ─── Card Subtle Glow ────────────────────────────── */
              /* Add a subtle glow to cards for depth perception */
              .dark-card-glow,
              [class*="bg-card"] {
                box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.03),
                            0 1px 3px 0 rgba(0, 0, 0, 0.2),
                            0 4px 12px 0 rgba(0, 0, 0, 0.15);
              }

              /* ─── Border Visibility ───────────────────────────── */
              /* Make subtle borders more visible in dark mode */
              .border-gray-200 {
                border-color: rgba(255, 255, 255, 0.08) !important;
              }

              .border-gray-100 {
                border-color: rgba(255, 255, 255, 0.05) !important;
              }

              .border-green-200 {
                border-color: rgba(34, 197, 94, 0.15) !important;
              }

              .border-green-100 {
                border-color: rgba(34, 197, 94, 0.08) !important;
              }

              /* ─── Text Contrast ──────────────────────────────── */
              /* Ensure proper contrast for secondary text */
              .text-gray-400 {
                color: rgba(156, 163, 175, 0.9) !important;
              }

              .text-gray-500 {
                color: rgba(156, 163, 175, 0.95) !important;
              }

              /* ─── Background Gradients ───────────────────────── */
              /* Fix gradient backgrounds for dark mode */
              .bg-gradient-to-br.from-green-700.to-green-900,
              .bg-gradient-to-br.from-green-700.to-teal-800 {
                background: linear-gradient(135deg, #14532d 0%, #052e16 100%) !important;
              }

              /* ─── Hero Section ───────────────────────────────── */
              .bg-gradient-to-br.from-green-700.to-green-900.text-white {
                background: linear-gradient(135deg, #166534 0%, #14532d 50%, #0f3d1f 100%) !important;
              }

              /* ─── Scrollbar Dark Mode ────────────────────────── */
              .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(31, 41, 55, 0.5) !important;
              }

              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(75, 85, 99, 0.7) !important;
                border-radius: 3px;
              }

              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(107, 114, 128, 0.8) !important;
              }

              /* Global scrollbar */
              *::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }

              *::-webkit-scrollbar-track {
                background: rgba(17, 24, 39, 0.3);
              }

              *::-webkit-scrollbar-thumb {
                background: rgba(55, 65, 81, 0.8);
                border-radius: 4px;
              }

              *::-webkit-scrollbar-thumb:hover {
                background: rgba(75, 85, 99, 0.9);
              }

              /* ─── Selection Color ────────────────────────────── */
              ::selection {
                background-color: rgba(34, 197, 94, 0.3);
                color: #f9fafb;
              }

              ::-moz-selection {
                background-color: rgba(34, 197, 94, 0.3);
                color: #f9fafb;
              }

              /* ─── Focus Rings ────────────────────────────────── */
              :focus-visible {
                outline-color: rgba(34, 197, 94, 0.6) !important;
                outline-offset: 2px;
              }

              /* ─── Card Hover Effects ─────────────────────────── */
              .card-hover:hover {
                box-shadow: 0 12px 40px -12px rgba(0, 0, 0, 0.4),
                            0 0 0 1px rgba(34, 197, 94, 0.06) !important;
              }

              /* ─── Prose / Article Styling ────────────────────── */
              .prose {
                --tw-prose-body: #d1d5db;
                --tw-prose-headings: #f3f4f6;
                --tw-prose-links: #4ade80;
                --tw-prose-bold: #e5e7eb;
                --tw-prose-quotes: #d1d5db;
                --tw-prose-quote-borders: #22c55e;
                --tw-prose-counters: #9ca3af;
                --tw-prose-bullets: #9ca3af;
                --tw-prose-hr: #374151;
                --tw-prose-th-borders: #374151;
                --tw-prose-td-borders: #1f2937;
              }

              .prose a {
                text-decoration-color: rgba(74, 222, 128, 0.3);
                transition: text-decoration-color 0.2s ease;
              }

              .prose a:hover {
                text-decoration-color: rgba(74, 222, 128, 0.6);
              }

              /* ─── Badge Enhancements ─────────────────────────── */
              .bg-green-50 {
                background-color: rgba(34, 197, 94, 0.08) !important;
              }

              .bg-amber-50 {
                background-color: rgba(251, 191, 36, 0.08) !important;
              }

              .bg-teal-50 {
                background-color: rgba(20, 184, 166, 0.08) !important;
              }

              .bg-gray-50 {
                background-color: rgba(31, 41, 55, 0.5) !important;
              }

              /* ─── Skeleton Loading ───────────────────────────── */
              .animate-pulse {
                animation-duration: 2s;
              }

              /* ─── Tooltip and Popover ────────────────────────── */
              [data-radix-popper-content-wrapper] {
                filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.4));
              }

              /* ─── Input Fields ───────────────────────────────── */
              input[type="email"],
              input[type="text"],
              input[type="tel"],
              input[type="number"],
              textarea,
              select {
                color-scheme: dark;
              }

              /* ─── Table Enhancements ─────────────────────────── */
              table thead {
                background-color: rgba(31, 41, 55, 0.5) !important;
              }

              table tbody tr:hover {
                background-color: rgba(34, 197, 94, 0.04) !important;
              }

              table tbody tr:nth-child(even) {
                background-color: rgba(17, 24, 39, 0.3) !important;
              }

              table tbody tr:nth-child(even):hover {
                background-color: rgba(34, 197, 94, 0.04) !important;
              }

              /* ─── Blockquote ─────────────────────────────────── */
              blockquote {
                border-left-color: rgba(34, 197, 94, 0.4) !important;
                background-color: rgba(31, 41, 55, 0.3) !important;
              }

              /* ─── Code Blocks ────────────────────────────────── */
              code {
                background-color: rgba(31, 41, 55, 0.6) !important;
                color: #e5e7eb !important;
                border: 1px solid rgba(55, 65, 81, 0.5) !important;
              }

              pre {
                background-color: rgba(17, 24, 39, 0.8) !important;
                border: 1px solid rgba(55, 65, 81, 0.5) !important;
              }
            `,
          }}
        />
      )}
      {children}
    </>
  );
}
