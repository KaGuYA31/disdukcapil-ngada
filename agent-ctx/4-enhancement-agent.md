---
Task ID: 4
Agent: Enhancement Agent
Task: Enhance News section with animations, category filter, and loading state

Work Log:
- Read worklog.md and analyzed existing project structure, section patterns, and animation conventions
- Read current news-section.tsx and identified areas for enhancement (no animations, basic styling, "D" placeholder)
- Read skeleton.tsx and badge.tsx UI components for reference
- Reviewed announcements-section.tsx for loading skeleton and animation patterns
- Enhanced news-section.tsx with all requested features:

  **1. Framer-motion animations:**
  - Added motion, useInView imports from framer-motion
  - Section header: fade-in + slide-up (headerVariants, whileInView, once: true, margin: "-100px")
  - "Lihat Semua" button: fade-in with 0.2s delay (buttonVariants)
  - Category filter tabs: fade-in from bottom (tabsVariants)
  - News cards: staggered fade-in + slide-up with 0.1s delay between cards (containerVariants + cardVariants)
  - Card hover: translateY(-1) and shadow-sm → shadow-lg with transition-all duration-300

  **2. Improved card styling:**
  - Added gradient overlay on thumbnail for text readability
  - Added date badge overlapping thumbnail bottom-right corner
  - Category-specific thumbnail gradients (green/amber/rose)
  - Better card padding, improved description line-height
  - "Baca Selengkapnya →" link at bottom of each card

  **3. Category filter tabs:**
  - Semua, Informasi, Pengumuman, Kegiatan pills with green accent active state
  - useState filtering with smooth transitions

  **4. Loading state:**
  - NewsLoadingSkeleton with 3 skeleton cards, 500ms simulated delay
  - Skeleton pills for category tabs during loading

  **5. Visual improvements:**
  - Replaced "D" placeholder with category-specific lucide-react icons (Info, Megaphone, CalendarDays)
  - No blue/indigo colors used

- Ran bun run lint — 0 errors, 0 warnings
- Dev server compiles successfully (HTTP 200)

Stage Summary:
- All 5 enhancement requirements implemented successfully
- ESLint passes with 0 errors
- Dev server compiles and serves homepage (HTTP 200)
