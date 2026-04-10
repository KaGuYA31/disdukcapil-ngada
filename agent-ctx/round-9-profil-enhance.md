# Round 9 - Profil Page Enhancement

## Task ID: round-9-profil-enhance

## Summary
Enhanced the Profil page (`src/app/profil/page.tsx`) and all inner section components with framer-motion animations, matching the exact patterns used in other enhanced pages (transparansi, berita).

## Changes Made

### 1. `src/app/profil/page.tsx` — Main Page
- Converted to `"use client"` component
- Removed static `metadata` export (incompatible with "use client")
- Added framer-motion `fadeInUp` and `staggerContainer` variants (exact same as transparansi/berita)
- Hero banner now uses `motion.div` with stagger animations for:
  - Breadcrumb fade-in
  - Title with `Building2` icon fade-in
  - Description text fade-in
- Added decorative gradient orbs (top-right `w-72 h-72 bg-green-600/20`, bottom-left `w-48 h-48 bg-green-500/10`)
- Added `relative z-10` to hero content container
- Added `relative overflow-hidden` to hero section
- Imported and rendered `BackToTop` component before closing `</div>`

### 2. `src/components/sections/profil/visi-misi-section.tsx`
- Added framer-motion `fadeInUp` and `staggerContainer` variants
- Added `whileInView` animations to header section (span, h2, p)
- Added `whileInView` animations to Visi and Misi cards

### 3. `src/components/sections/profil/struktur-section.tsx`
- Added framer-motion `fadeInUp` and `staggerContainer` variants
- Added `whileInView` animations to header section
- Added `whileInView` animations to organizational chart (Kepala Dinas, Sekretaris, Kepala Bidang cards)
- Added `whileInView` animations to Bidang cards grid

### 4. `src/components/sections/profil/sejarah-section.tsx`
- Added framer-motion `fadeInUp` and `staggerContainer` variants
- Added `whileInView` animations to header section
- Added `whileInView` animations to timeline items

### 5. `src/components/sections/profil/lokasi-section.tsx`
- Added framer-motion `fadeInUp` and `staggerContainer` variants
- Added `whileInView` animations to header section
- Added `whileInView` animations to contact info cards (Alamat, Telepon, Jam Pelayanan, Email, Google Maps button)
- Added `whileInView` animation to map container

## Animation Patterns
- `fadeInUp`: `hidden: { opacity: 0, y: 30 }` → `visible: { opacity: 1, y: 0, duration: 0.6, ease: "easeOut" }`
- `staggerContainer`: `hidden: { opacity: 0 }` → `visible: { staggerChildren: 0.12, delayChildren: 0.1 }`
- `viewport: { once: true, amount: 0.2 }` for scroll-triggered animations
- Hero uses `initial="hidden" animate="visible"` (immediate), sections use `whileInView` (scroll-triggered)

## Lint Check
- `bun run lint` passed with no errors
