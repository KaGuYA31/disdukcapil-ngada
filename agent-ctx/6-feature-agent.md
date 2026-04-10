---
Task ID: 6
Agent: Feature Agent
Task: Create Breadcrumb navigation component and add to sub-pages

Work Log:
- Read worklog.md and analyzed existing project structure, page patterns, and shared components
- Checked for existing shadcn/ui breadcrumb component at @/components/ui/breadcrumb — found and confirmed available
- Created /home/z/my-project/src/components/shared/breadcrumb.tsx with:
  - "use client" directive for framer-motion animation
  - Props: `{ items: { label: string; href?: string }[] }` — last item rendered as non-link (current page)
  - Built on top of shadcn/ui Breadcrumb primitives (Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator)
  - Home icon from lucide-react displayed for first "Beranda" item
  - White text styling for green hero sections: text-green-200 for links, text-white for current page
  - "/" separator styled with text-green-300/60 color
  - framer-motion fade-in + slide-up animation on mount (opacity 0→1, y -8→0, 0.4s easeOut)
  - aria-label="Breadcrumb" for accessibility
- Added Breadcrumb component to 7 sub-pages, inserting inside hero section above h1:
  - /layanan/page.tsx — Breadcrumb: Beranda > Layanan Publik (server component)
  - /berita/page.tsx — Breadcrumb: Beranda > Berita & Informasi (server component)
  - /profil/page.tsx — Breadcrumb: Beranda > Profil Dinas (server component)
  - /pengaduan/page.tsx — Breadcrumb: Beranda > Bantuan & Pengaduan (server component)
  - /transparansi/page.tsx — Breadcrumb: Beranda > Transparansi & Publikasi (server component)
  - /inovasi/page.tsx — Breadcrumb: Beranda > Inovasi (client component)
  - /statistik/page.tsx — Breadcrumb: Beranda > Statistik (client component)
- On statistik page, replaced the "Kembali ke Beranda" button with the Breadcrumb component (removed unused Link, Home, Button imports)
- Changed h1 mb-4 to mb-2 across pages to keep spacing tight with breadcrumb above
- Ran bun run lint — 0 errors, 0 warnings

Stage Summary:
- Breadcrumb shared component created using shadcn/ui primitives with framer-motion animation
- All 7 sub-pages now have breadcrumb navigation inside their green hero sections
- White/green-200 text colors ensure readability on dark green hero backgrounds
- Home icon on "Beranda" item for visual clarity
- Lint passes with 0 errors
