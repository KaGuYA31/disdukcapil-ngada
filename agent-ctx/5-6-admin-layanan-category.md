# Work Record - Task 5-6

## Summary
Updated admin panel for layanan management and API routes to support the new `category` field on the Layanan model. Created seed data with 9 layanan items across two categories.

## Files Modified

### 1. `/home/z/my-project/src/app/admin/layanan/page.tsx`
- Added `category: string` to the `Layanan` interface
- Added `category: "Pendaftaran Penduduk"` to `formData` initial state
- Added category `<select>` dropdown in the form dialog (before icon selector)
- Updated `openNewDialog` to reset category to default
- Updated `openEditDialog` to read category from layanan data
- Updated `handleSave` to include category in the API payload
- Added category `<Badge>` display in the SortableItem component

### 2. `/home/z/my-project/src/app/api/layanan/route.ts`
- **GET handler**: Added category filtering via `?category=` and `?kategori=` query params
- **POST handler**: Added `category` field to destructuring and create data (defaults to "Pendaftaran Penduduk")
- **PUT handler**: Added `category` field to destructuring and update data (preserves existing value if not provided)

### 3. `/home/z/my-project/prisma/seed.ts` (Created)
- Created comprehensive seed file with:
  - 1 Admin user (username: admin, password: admin123)
  - 4 "Pendaftaran Penduduk" layanan items (KTP-el, KK, Perubahan Data, Legalisasi)
  - 5 "Pencatatan Sipil" layanan items (Akta Kelahiran, Akta Kematian, Akta Perkawinan, Akta Perceraian, Pindah Penduduk)
  - Each layanan has full requirements, procedures, and metadata
- Uses `upsert` to allow re-running the seed safely

### 4. `/home/z/my-project/src/app/api/upload-document/route.ts`
- Restructured POST handler to parse formData first, then check Supabase
- Added mock upload fallback when Supabase is not configured (local development)
- Mock returns a fake URL with file metadata for testing
- Added mock DELETE fallback for local development

### 5. `/home/z/my-project/src/app/api/beranda/route.ts`
- Reviewed and confirmed it already handles missing data gracefully (returns null values)
- No changes needed

## Key Implementation Decisions
- Category selector uses a native `<select>` element consistent with the existing icon selector pattern
- Category filtering in the API supports both `category` and `kategori` query params (Indonesian URL friendliness)
- Seed uses `upsert` by slug to allow safe re-running without duplicates
- Mock upload returns `mock: true` flag so consumers can distinguish mock vs real uploads

## Issues Encountered
- Pre-existing Turbopack cache issue: The dev server's compiled chunks reference a stale `postgresql` provider from a previous schema state, even though the current schema.prisma correctly uses `sqlite`. This causes `/api/beranda` to return 500. The database operations (db:push, db:seed) work correctly. This is a Turbopack build cache issue requiring a full server restart to resolve - not related to our changes.
- ESLint: 0 errors, 1 pre-existing warning in an unrelated file
