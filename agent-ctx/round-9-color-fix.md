# Round 9 - Color Fix: Blue/Purple → Green Palette

## Task ID
round-9-color-fix

## Summary
Removed all blue and purple color violations from public-facing components, replacing them with appropriate green/teal/amber/rose palette alternatives. Admin pages were intentionally left unchanged.

## Files Modified

### 1. `src/app/layanan/page.tsx`
- **Status**: Already clean (no blue/purple found) — previously fixed or never had violations.

### 2. `src/components/sections/profil/lokasi-section.tsx`
- **Phone card**: `bg-blue-100` → `bg-teal-100`, `text-blue-600` → `text-teal-600` (2 instances — two duplicate card sections)
- **Email card**: `bg-purple-100` → `bg-rose-100`, `text-purple-600` → `text-rose-600` (2 instances — two duplicate card sections)

### 3. `src/components/sections/layanan/service-detail.tsx` (largest change)
- **KK (kartu-keluarga) service data**: `text-blue-600` → `text-teal-600`, `bg-blue-100` → `bg-teal-100`
- **Akta Perceraian service data**: `text-purple-600` → `text-amber-600`, `bg-purple-100` → `bg-amber-100`
- **Free Service Notice card**: `bg-blue-50` → `bg-green-50`, `border-blue-200` → `border-green-200`, `text-blue-600/700/800` → `text-green-600/700/800`
- **Procedure section icons** (3 instances): `text-blue-600` → `text-teal-600`
- **Procedure step circles** (2 instances): `bg-blue-600` → `bg-teal-600`
- **Office Hours Clock icon** (2 instances): `text-blue-600` → `text-teal-600`
- **FAQ HelpCircle icon**: `text-purple-600` → `text-amber-600`

### 4. `src/components/sections/layanan/services-list-section.tsx`
- **Same Day Service Notice**: `bg-blue-50` → `bg-green-50`, `border-blue-200` → `border-green-200`, `text-blue-600/700/800` → `text-green-600/700/800`

### 5. `src/app/layanan-online/cek-status/page.tsx`
- **Status config "Baru"**: `text-blue-700` → `text-teal-700`, `bg-blue-100` → `bg-teal-100`
- **Timeline "Pengajuan Dibuat" icon**: `bg-blue-100` → `bg-teal-100`, `text-blue-600` → `text-teal-600`

## Verification
- `bun run lint` passes with zero errors
- All 5 files confirmed clean of `blue` and `purple` class strings via grep
