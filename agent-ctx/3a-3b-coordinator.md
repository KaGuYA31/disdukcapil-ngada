---
Task ID: 3a-3b
Agent: Main Coordinator
Task: Create Open Data Kependudukan page + Enhance Berita Detail page

Work Log:
- Read worklog.md for project context (Rounds 2-6 complete, all features accumulated)
- Read existing files: statistik/page.tsx, berita/[slug]/page.tsx, news-detail.tsx, constants.ts, breadcrumb.tsx, back-to-top.tsx, whatsapp-button.tsx, berita API routes

## Task 1: Open Data Kependudukan Page

Created `/src/app/statistik/open-data/page.tsx`:
- "use client" directive for framer-motion support
- Header, Footer, WhatsAppButton, BackToTop, Breadcrumb imports
- Hero section: gradient bg (from-green-700 to-green-900), breadcrumb (Beranda > Info Kependudukan > Open Data), Database icon, description about open data transparency
- Decorative gradient orbs (3 orbs with blur-3xl)
- OPERATING_HOURS and CONTACT_INFO imported from constants
- Section 1: "Prinsip Open Data" - 3 cards (Keterbukaan/Unlock/green, Aksesibilitas/Eye/teal, Akuntabilitas/ShieldCheck/amber)
- Section 2: "Dataset Tersedia" - 6 data cards in responsive grid (md:grid-cols-2 lg:grid-cols-3):
  1. Jumlah Penduduk per Kecamatan (BarChart3, teal)
  2. Statistik KTP-el (CreditCard, emerald)
  3. Statistik Akta Kelahiran (Baby, amber)
  4. Statistik Kartu Keluarga (Users, rose)
  5. Statistik Perpindahan (MoveRight, teal)
  6. Statistik Akta Perkawinan (Heart, amber)
  Each card: icon, title, description, "Lihat Data" button with ArrowRight hover effect
- Section 3: "Format Data" - Info card with 3 format icons (JSON/FileJson/teal, CSV/FileSpreadsheet/green, PDF/FileText/rose)
- Section 4: CTA card "Butuh Data Spesifik?" with WhatsApp link, operating hours note
- framer-motion animations: fadeInUp stagger on all sections, `"easeOut" as const`

Created `/src/app/statistik/open-data/loading.tsx`:
- Full layout skeleton with Header, Footer, WhatsAppButton, BackToTop
- Hero banner skeleton (breadcrumb + title + description bars)
- 3-column prinsip cards skeleton
- 6-column dataset cards skeleton
- Format data card skeleton
- All with animate-pulse

## Task 2: Enhanced Berita Detail Page

Enhanced `/src/app/berita/[slug]/page.tsx`:
- Added BackToTop component import and render
- Kept metadata export (server component, no "use client" needed)

Enhanced `/src/components/sections/berita/news-detail.tsx`:
- Added framer-motion fadeInUp stagger animations on hero (breadcrumb, badge, title, meta)
- Added decorative gradient orbs to hero background (2 orbs with blur-3xl)
- Added AbortController with useRef for proper cleanup
- Added useCallback for stable fetch references
- Added "Berita Terkait" section: fetches related news from same category via /api/berita?category={category}&limit=4, filters out current article, shows 3 cards in responsive grid (md:grid-cols-3)
  - Each card: thumbnail or gradient placeholder, category badge, title with line-clamp-2, date
  - Hover effects: border-green-300, shadow-lg, image scale-105, title color change
  - "Lihat Semua Berita" button at bottom
- Added WhatsApp share button (MessageCircle icon) that opens wa.me/?text={title}%20{url}
  - Replaced Facebook/Twitter share buttons with WhatsApp + Salin Link
- Added reading time estimate (strips HTML tags, counts words, divides by 200 wpm, min 1 min)
  - Shows with Clock icon in hero meta
- Added author info display: avatar circle (User icon), author name (falls back to "Redaksi Disdukcapil Ngada"), full date with weekday
- Added loading skeleton for hero + article body
- Added SITE_CONFIG and CONTACT_INFO imports from constants
- Color fixes: WhatsApp share button uses green theme instead of blue/purple
- All existing functionality preserved: API fetch, error states, breadcrumb, category badges

- ESLint: 0 errors, 0 warnings
- Dev server compiled successfully

Stage Summary:
- New page: /statistik/open-data with full content sections and animations
- Loading skeleton for open-data page
- Berita detail page enhanced with: animations, gradient orbs, related news, WhatsApp share, reading time, author info
- BackToTop added to berita detail page
- Zero blue/purple colors — palette limited to green, teal, amber, rose
