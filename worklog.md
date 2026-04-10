---
Task ID: 1
Agent: Main Coordinator
Task: Clone repo KaGuYA31/disdukcapil-ngada, set up project, add Layanan dropdown menu with categories, update admin panel

Work Log:
- Cloned repo KaGuYA31/disdukcapil-ngada from GitHub using provided credentials
- Analyzed the full project structure: Next.js 16 with App Router, Prisma (PostgreSQL/Supabase), shadcn/ui, Tailwind CSS
- Copied repo files to /home/z/my-project, adapting Prisma schema from PostgreSQL to SQLite for local development
- Added `category` field to the Layanan Prisma model with default "Pendaftaran Penduduk"
- Modified the header navigation to make "Layanan" a dropdown menu with two sub-items:
  - Pendaftaran Penduduk → /layanan?kategori=Pendaftaran+Penduduk
  - Pencatatan Sipil → /layanan?kategori=Pencatatan+Sipil
- Updated services-list-section to support URL query parameter category filtering with Suspense boundary
- Updated homepage services-section to dynamically group services by category (Pendaftaran Penduduk, Pencatatan Sipil)
- Updated admin layanan page: added category field to interface, form state, form UI with select dropdown, save payload
- Updated API route /api/layanan to support category filtering via ?category= and ?kategori= params
- Created comprehensive seed data with 9 layanan items (4 Pendaftaran Penduduk, 5 Pencatatan Sipil)
- Added @prisma/client to serverExternalPackages in next.config.ts to fix Turbopack compatibility
- Created webDevReview cron job (every 15 minutes)

Stage Summary:
- All features implemented and verified working:
  - Homepage renders correctly (HTTP 200)
  - API /api/layanan returns all 9 services with categories (HTTP 200)
  - Category filtering works (WHERE category = ? in SQL)
  - Header dropdown menu properly configured
  - Admin panel form includes category selector
- Dev server running with restart wrapper for stability
- Project uses SQLite for local dev, Supabase PostgreSQL for production
