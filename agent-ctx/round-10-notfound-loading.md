# Task: round-10-notfound-loading

## Summary
Created three files for enhanced 404 handling and loading states:

### 1. `src/app/not-found.tsx` (Created)
- **Full-page layout** with Header and Footer matching all other pages
- **Large "404" number** with green-to-teal gradient text (`text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent`)
- **Friendly Indonesian message**: "Halaman Tidak Ditemukan" (h2) + description paragraph
- **Search bar** with Input + Button that redirects to `/berita?q=searchterm` on submit
- **4 quick link buttons** in a responsive 2×2/4-column grid: Beranda, Layanan, Berita, Profil
- **"Kembali ke Beranda" primary button** (green-700) with Home icon
- **Decorative gradient orbs** in background (matching profil page pattern)
- **framer-motion animations**: fadeInUp + staggerContainer for all elements
- Responsive design with proper spacing

### 2. `src/app/berita/[slug]/loading.tsx` (Created)
- Skeleton loader matching berita detail page layout
- Header spacer + hero gradient skeleton + 3-column content grid skeleton
- Uses `animate-pulse` for loading animation

### 3. `src/app/inovasi/[id]/loading.tsx` (Created)
- Skeleton loader matching inovasi detail page layout
- Header spacer + hero gradient skeleton + meta card + content body + image skeletons
- Uses `animate-pulse` for loading animation

## Quality
- ESLint: passed with zero errors/warnings
- Dev server: compiling successfully
- Design consistency: follows project patterns (green/teal palette, framer-motion animations, Header/Footer layout)
