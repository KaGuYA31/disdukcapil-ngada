---
Task ID: 4
Agent: Main Coordinator
Task: Fix announcements link + enhance FAQ section with more FAQs, search, and CTA card

Work Log:
- Read worklog.md (Rounds 2-6 complete, all features accumulated)
- Read announcements-section.tsx to identify wrong link (line 328: `/pengaduan` → `/berita`)
- Read faq-section.tsx (6 FAQs, no search, no CTA card)

Task 1 - Fix Announcements Link:
- Changed `<Link href="/pengaduan">` to `<Link href="/berita">` in announcements-section.tsx
- Changed button text from "Lihat Semua Pengumuman" to "Lihat Berita & Pengumuman"
- All other functionality preserved (animation, styling, API fetch)

Task 2 - Enhance FAQ Section:
1. Added 4 new FAQs (total 10):
   - "Apakah bisa mengurus KTP dari luar kota?" (Disdukcapil Online / M-Pop)
   - "Bagaimana jika data KTP saya tidak sesuai?" (data correction process, 1-3 hari kerja)
   - "Berapa lama proses pembuatan Kartu Keluarga?" (1-3 hari kerja)
   - "Apakah ada layanan jemput bola?" (mobile service for remote areas)

2. Added search/filter functionality:
   - Added `useState` for `searchQuery`
   - Added `useMemo` for `filteredFaqs` (case-insensitive matching on question + answer)
   - Added shadcn/ui `Input` with Search icon, placeholder "Cari pertanyaan..."
   - Max-w-md mx-auto centered search bar
   - Clear button (X icon) when search query is active
   - Empty state: "Tidak ada FAQ yang cocok" with Search icon
   - Animation variants: fadeInUp for empty state, stagger preserved for filtered items

3. Added "Masih Punya Pertanyaan?" CTA card:
   - Card with bg-green-50 border-green-200
   - MessageCircle icon (lucide-react) in green-100 circle
   - Title: "Masih Punya Pertanyaan?"
   - Description: "Hubungi kami melalui WhatsApp untuk konsultasi langsung"
   - Green Button ("Chat WhatsApp" with MessageCircle icon) → WhatsApp link
   - framer-motion fadeInUp with delay 0.8
   - Responsive layout (flex-col on mobile, flex-row on sm+)

- ESLint: 0 errors, 0 warnings
- Dev server compiled successfully
- Files modified: 2 (announcements-section.tsx, faq-section.tsx)
