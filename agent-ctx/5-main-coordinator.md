---
Task ID: 5
Agent: Main Coordinator
Task: Enhance service-detail.tsx with framer-motion animations, icon fixes, operating hours fix, related services section, and back button

Work Log:
- Read worklog.md for project context (Rounds 2-6 complete, all features accumulated)
- Read full service-detail.tsx (1044 lines, two render blocks: database and fallback)
- Identified structure: component exports `ServiceDetail`, has `defaultServices` object with 10 services

Changes Implemented:

  1. Added framer-motion animations:
     - Imported `motion` from "framer-motion"
     - Added animation variants: `fadeInUp` (opacity 0→1, y 20→0), `staggerContainer` (0.1s stagger), `staggerItem` (0.5s duration, easeOut), `sidebarStaggerContainer` (0.1s stagger, 0.3s delayChildren)
     - Hero Banner: wrapped in `motion.div` with `fadeInUp` animation (initial hidden, animate visible, duration 0.5)
     - Main Content cards: wrapped in `motion.div` container with `staggerContainer` + `whileInView` (viewport once, margin -50px)
     - Each card (Quick Info, Description, Requirements, Procedures, Forms, Notes, FAQ) wrapped in `motion.div` with `staggerItem` variants
     - Sidebar cards: wrapped in `motion.div` with `sidebarStaggerContainer` (slightly delayed stagger)
     - Removed unused `useRef` and `useInView` imports after fixing hook violation (inline useRef in JSX)

  2. Fixed MapPin icon for Procedures:
     - Changed `<MapPin>` to `<ClipboardCheck>` on both render blocks for "Prosedur" section title
     - Added `ClipboardCheck` to lucide-react imports

  3. Fixed operating hours on both render blocks:
     - Extracted into reusable `OfficeHours` component to avoid duplication
     - Changed "Senin - Jumat" + "09.00 - 15.00 WITA" to:
       - "Senin - Kamis" + "08.00 - 15.30 WITA"
       - "Jumat" + "08.00 - 16.00 WITA"
     - Kept "Sabtu - Minggu" + "Tutup"

  4. Added "Layanan Terkait" (Related Services) section:
     - Created `getRelatedServices(currentSlug, category?)` helper function: returns up to 4 services from defaultServices matching same category (excluding current)
     - Created `RelatedServicesCard` component: Link with icon, title (line-clamp-2), description (truncated to 80 chars), category badge, hover effect
     - Added section after main content in both render blocks
     - Uses `grid sm:grid-cols-2 lg:grid-cols-4` layout
     - Section header with MoveRight icon (green-600)

  5. Added "Kembali ke Daftar Layanan" button at bottom:
     - Added to both render blocks before closing `</>`
     - Uses `Button variant="outline"` with green border/text styling
     - ArrowLeft icon with mr-2 spacing
     - Links to /layanan

  6. Added card hover effects:
     - Added `transition-all duration-200 hover:shadow-md hover:-translate-y-0.5` to all Card components in both render blocks
     - Applied to: Quick Info cards, Free Service Notice, Description, Requirements, Procedures, Forms, Notes, FAQ, sidebar cards (Banner, Notice, OfficeHours, Contact CTA)

- ESLint: 0 errors, 0 warnings
- Dev server compiled successfully

Stage Summary:
- Service detail page now has rich framer-motion animations (fadeInUp hero, stagger cards, delayed sidebar)
- Procedures section now uses correct ClipboardCheck icon instead of MapPin
- Operating hours corrected to: Sen-Kam 08.00-15.30, Jumat 08.00-16.00, Sab-Min Tutup
- Related Services section shows 3-4 same-category services with links
- Back button added for easy navigation
- All Card components have hover effects
- Reusable OfficeHours component eliminates duplication
- Both render blocks (database and fallback) have identical feature parity
