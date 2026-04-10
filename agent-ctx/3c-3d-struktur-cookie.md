---
Task ID: 3c-3d
Agent: Main Coordinator
Task: Add Struktur Organisasi visual section to profil page + Cookie Consent banner

Work Log:
- Read worklog.md for project context (Round 2-10 complete, Disdukcapil Ngada government website)
- Read profil/page.tsx (client component, imports VisiMisi, Struktur, Sejarah, Lokasi sections)
- Read existing struktur-section.tsx (API-based org chart with Kepala Dinas, Sekretaris, Kepala Bidang)
- Read existing cookie-banner.tsx (dark-themed banner with settings panel, switches, JSON preferences)
- Read layout.tsx (already imports CookieBanner, placed inside Providers)

Task 1 - Struktur Organisasi Section:
- Created `/src/components/sections/profil/struktur-organisasi.tsx`:
  - CSS-based tree layout (no heavy library)
  - Kepala Dinas card: Large, centered, gradient green border (-inset-[2px] trick), photo placeholder circle with initials "KD", name/NIP/position placeholders, ShieldCheck badge
  - Vertical + horizontal gradient connector lines between hierarchy levels
  - 3 Sub-section cards in md:grid-cols-3 grid:
    - Kasubag Pendaftaran Penduduk (initial "PP") with 4 staff cards
    - Kasubag Pencatatan Sipil (initial "PS") with 4 staff cards
    - Kasubag Inovasi & TI (initial "IT") with 4 staff cards
  - Each kasubag card: gradient border, AvatarCircle component, name/NIP/position
  - Each staff card: small avatar with initials, name, position, NIP
  - Hover effects: whileHover y:-2, shadow-lg, border-green-300
  - framer-motion fadeInUp + staggerContainer animations
  - Section header with ShieldCheck icon + "Struktur Organisasi" label
- Updated profil/page.tsx: imported StrukturOrganisasiSection, placed between VisiMisiSection and StrukturSection

Task 2 - Cookie Consent Banner:
- Created `/src/components/shared/cookie-consent.tsx`:
  - GDPR-style consent banner, simpler than existing cookie-banner.tsx
  - localStorage key: "cookie-consent" (checked via getItem)
  - Fixed bottom-0, z-50, slide-up animation via framer-motion AnimatePresence
  - White background (bg-white) with shadow-lg, border-gray-200, rounded-2xl
  - Cookie icon from lucide-react in amber-50 circle
  - Title: "Informasi Cookie"
  - Description: "Kami menggunakan cookie untuk meningkatkan pengalaman Anda..."
  - "Terima Semua Cookie" button (green-600 filled)
  - "Pengaturan" button (outline, gray-300 border)
  - "accepted" stored on accept, "custom" stored on settings click
  - Responsive: full width with px-4 on mobile, max-w-2xl mx-auto on desktop
- Updated layout.tsx: replaced CookieBanner import with CookieConsent, placed right after `<body>` tag (before skip-to-content link)

ESLint: 0 errors, 0 warnings

Stage Summary:
- New Struktur Organisasi section with visual org chart tree (Kepala Dinas → 3 Kasubag → 12 staff)
- New Cookie Consent banner (white, simpler, GDPR-style, localStorage persistence)
- Both components use framer-motion animations
- Existing CookieBanner component still in codebase (not deleted, just replaced in layout)
- All changes pass ESLint cleanly
