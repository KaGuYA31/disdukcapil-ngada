# Task: round-10-hero-enhance — Hero Section Polish & Enhancements

## Status: ✅ Completed

## Changes Made

### File: `src/components/sections/hero-section.tsx`

1. **Animated Scroll-Down Indicator**
   - Added `ChevronDown` to lucide-react imports
   - Created `motion.button` at `absolute bottom-28 left-1/2 -translate-x-1/2 z-10`
   - Gentle bounce animation: `animate={{ y: [0, 8, 0] }}` with 2s duration, infinite repeat
   - Circular button with glass-morphism (border-white/30, bg-white/10, backdrop-blur-sm)
   - Opacity 70% default, 100% on hover (`opacity-70 group-hover:opacity-100`)
   - onClick scrolls down by one viewport height with smooth behavior
   - Text "Scroll ke bawah" below chevron (text-xs, text-white/50)
   - Hidden on mobile, visible on md+ (`hidden md:flex`)

2. **Subtle Dot Grid Background Pattern**
   - Replaced the old SVG cross/plus pattern with a clean radial-gradient dot pattern
   - `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)` at 24px spacing
   - Very low opacity (0.07) — decorative but non-distracting
   - `pointer-events-none` to ensure no interaction interference

3. **Visitor Counter Badge (Real-time Data Indicator)**
   - `motion.div` positioned `absolute top-6 right-6 z-10`
   - Glass-morphism pill: bg-white/10, backdrop-blur-md, border-white/20, rounded-full
   - Slide-in animation: `initial={{ opacity: 0, x: 20 }}`, appears after 1.2s delay
   - Pulsing green dot indicator using nested `motion.span` with `animate-ping` + scale animation
   - Text: "Data Kependudukan Real-time" in green-100
   - Hidden on mobile/tablet, visible on lg+ (`hidden lg:flex`)

### Preserved
- All existing hero content (title, description, stats, search bar, CTA buttons, category links)
- All existing animations (staggerContainer, fadeInUp, fadeIn)
- Globe decorative element
- Wave divider
- Kepala Dinas card

### Lint
- ✅ No ESLint errors
