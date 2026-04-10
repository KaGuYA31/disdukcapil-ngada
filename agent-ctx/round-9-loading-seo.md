# Round 9 - Loading Skeletons & SEO Metadata

## Task ID: round-9-loading-seo

## Summary
Added loading.tsx skeleton UI files for 4 key routes and enhanced global SEO metadata in the root layout.

## Changes Made

### Task 1: Loading Skeleton Files
Created identical loading.tsx files with skeleton UI pattern for these routes:
- `src/app/profil/loading.tsx`
- `src/app/layanan/loading.tsx`
- `src/app/pengaduan/loading.tsx`
- `src/app/layanan-online/loading.tsx`

Each loading.tsx provides:
- Header spacer (h-16) matching the navigation bar height
- Hero section skeleton with gradient background and 3 animated pulse bars (breadcrumb, title, subtitle)
- Content section skeleton with a heading bar and a 3-column grid of 6 card placeholders
- Dark mode support via `dark:` Tailwind variants

### Task 2: Global SEO Metadata Enhancements
Updated `src/app/layout.tsx` metadata export with:
1. **`metadataBase`** — `new URL("https://disdukcapil-ngada.vercel.app")`
2. **`openGraph.url`** — `"https://disdukcapil-ngada.vercel.app"`
3. **`openGraph.siteName`** — `"Disdukcapil Kabupaten Ngada"`
4. **`twitter`** object — `card: "summary_large_image"`, `title`, `description`
5. **`alternates.canonical`** — `"/"`

Note: `og:type: "website"` and `og:locale: "id_ID"` were already present and left unchanged.

## Verification
- `bun run lint` passed with no errors
