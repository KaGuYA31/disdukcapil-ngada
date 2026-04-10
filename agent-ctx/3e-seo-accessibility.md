---
Task ID: 3e
Agent: Main Coordinator
Task: Add SEO structured data (JSON-LD) to layout.tsx and skip-to-content accessibility link

Work Log:
- Read worklog.md (Rounds 2-6 complete, all features accumulated)
- Read layout.tsx (server component with metadata export, existing skip-link with CSS class)
- Read page.tsx (confirmed id="main-content" already exists on <main> tag)
- Confirmed all sub-pages have id="main-content" on their <main> tags

Changes Implemented:

1. Added JSON-LD structured data to layout.tsx <head>:
   - GovernmentOrganization schema: name, alternateName, url, logo, full postal address (Jl. Ahmad Yani No.1, Bajawa, Ngada, NTT 86411), telephone, email, opening hours (Mon-Thu 08:00-15:30, Fri 08:00-16:00), social media links (Facebook, Instagram, YouTube), area served
   - WebSite schema with SearchAction for sitelinks search box targeting /berita?q={search_term_string}

2. Updated skip-to-content accessibility link:
   - Replaced old CSS class `skip-link` with Tailwind utility classes: sr-only (hidden by default), focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-green-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none
   - Link appears as a green button when focused via keyboard Tab navigation

3. Cleaned up globals.css:
   - Removed old .skip-link and .skip-link:focus CSS rules (lines 170-184) — no longer needed since Tailwind classes handle all styling

4. Verified id="main-content":
   - Already exists on <main> in page.tsx and all sub-pages (berita, profil, pengaduan, layanan, layanan/[slug], transparansi, inovasi, statistik, berita/[slug], layanan-online) — no changes needed

- ESLint: 0 errors, 0 warnings
- Dev server compiled successfully (all routes returning HTTP 200)
- Layout remains a server component (no "use client" added)

Files Modified:
- src/app/layout.tsx (+65 lines: <head> with 2 JSON-LD scripts, updated skip-to-content link)
- src/app/globals.css (-15 lines: removed .skip-link CSS rules)

Stage Summary:
- SEO: Two JSON-LD schemas (GovernmentOrganization + WebSite with SearchAction) injected in <head>
- Accessibility: Skip-to-content link with proper Tailwind focus-visible styles
- Zero breaking changes — purely additive
