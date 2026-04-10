# Worklog: round-9-pengaduan-enhance

## Task
Enhance the Pengaduan (Complaints) page with framer-motion animations and BackToTop component.

## Changes Made — `src/app/pengaduan/page.tsx`

1. **Added `"use client"` directive** — Required for framer-motion client-side animations.
2. **Removed static `metadata` export** — Incompatible with client components.
3. **Added imports**:
   - `motion` from `framer-motion`
   - `MessageSquare` icon from `lucide-react`
   - `BackToTop` from `@/components/shared/back-to-top`
4. **Added animation variants** — `fadeInUp` and `staggerContainer` (identical to transparansi/berita pages).
5. **Enhanced hero section**:
   - Added `relative overflow-hidden` to the section for gradient orb containment.
   - Added two decorative gradient orbs: top-right (w-72 h-72 bg-green-600/20) and bottom-left (w-48 h-48 bg-green-500/10).
   - Added `relative z-10` to the content container for proper layering.
   - Wrapped hero content in `motion.div` with `staggerContainer` variants.
   - Applied `fadeInUp` variant to breadcrumb, title, and description elements.
   - Added `MessageSquare` icon to the h1 title (matching the page's complaint/support theme).
6. **Added `<BackToTop />`** component before the closing `</div>`.

## Pattern Compliance
All animation patterns exactly match `src/app/transparansi/page.tsx` and `src/app/berita/page.tsx`.

## Lint Result
✅ `bun run lint` — No errors.
