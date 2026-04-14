---
Task ID: 1
Agent: Main Developer
Task: Fix image upload and add Bupati/Wakil photo management from admin

Work Log:
- Diagnosed root cause of image upload failure: ImageUpload component was posting to /api/upload which returned 404 (only /api/upload-document existed)
- Found that /api/upload route already existed from a previous session commit (route was correct)
- Added Pimpinan model to Prisma schema (role UNIQUE, name, photo, periode)
- Created pimpinan table directly via Prisma raw SQL (prisma db push timed out from sandbox)
- Generated Prisma client with new Pimpinan model
- Created /api/pimpinan API route with GET/POST/PUT for CRUD
- Updated /api/beranda to fetch and return bupati + wakilBupati data
- Rewrote /admin/pengaturan page with new "Foto & Data Pimpinan Daerah" section
- Updated hero-section.tsx to display dynamic Bupati/Wakil photos from database
- Deployed to Vercel production successfully

Stage Summary:
- Image upload fix: /api/upload route was already committed and working correctly
- Bupati/Wakil management: Full admin UI in Pengaturan page with photo upload, name, and periode fields
- Hero section: Now shows dynamic photos/names from DB, falls back to placeholder icons when no data
- Database: pimpinan table created on Supabase PostgreSQL
- Deployed to: https://disdukcapil-ngada.vercel.app
