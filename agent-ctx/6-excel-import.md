# Work Record - Task 6
## Excel Template Upload Feature for Bulk Population Data

### Summary
Added Excel template upload/download feature to the admin statistik page for bulk importing PendudukKecamatan data.

### Files Created
1. **`/home/z/my-project/src/app/api/admin/statistik/import-excel/route.ts`** — API route
   - **GET**: Generates and returns a downloadable Excel template (.xlsx) with sample data and proper column headers
   - **POST**: Accepts FormData with Excel file + type parameter, parses with `xlsx` library, validates headers & row data, clears old period data, batch-inserts new records (50 per batch), logs to UploadHistory table

2. **`/home/z/my-project/src/app/admin/statistik/page.tsx`** — Updated admin page
   - Added "Import Data Excel" card above existing manual input form
   - Drag & drop file upload area with visual feedback (green border on drag, file info display)
   - "Download Template" button that fetches template from API and triggers browser download
   - Column header badges showing required fields (kodeKec, kecamatan, lakiLaki, perempuan, total, rasioJK, periode)
   - Import status indicators: idle → uploading (spinner) → success (green checkmark + count) / error (red X + retry)
   - Toast notifications for all actions (download, import success, import failure)
   - File validation: .xlsx/.xls only, max 5MB
   - Dark mode support on all new elements
   - Existing manual input form preserved below the import section

### API Details
- **Template columns**: kodeKec, kecamatan, lakiLaki, perempuan, total, rasioJK, periode
- **Import type**: `pendudukKecamatan` (passed as FormData field)
- **Validation**: Required headers check, per-row validation (kodeKec/kecamatan required, non-negative numbers)
- **Data strategy**: Deletes old PendudukKecamatan records matching the imported period before inserting
- **Batch insert**: 50 records per batch for performance
- **Upload logging**: Records file name, period, record count, and uploader to UploadHistory table

### Verification
- ESLint: 0 new errors (2 pre-existing in db.ts)
