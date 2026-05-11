// Shared form definitions based on Permendagri No. 6 Tahun 2026
// This serves as the source of truth and fallback when database is unavailable

export interface FormulirDefinition {
  code: string;
  name: string;
  description: string;
  category: string;
  fileName: string;
  fileSize: string;
  order: number;
}

export const FORMULIR_LIST: FormulirDefinition[] = [
  // PENDAFTARAN PENDUDUK
  { code: "F-1.01", name: "Formulir Biodata Keluarga", description: "Formulir isian biodata keluarga untuk pendaftaran penduduk", category: "Pendaftaran Penduduk", fileName: "F-1-01.pdf", fileSize: "344 KB", order: 1 },
  { code: "F-1.02", name: "Formulir Pendaftaran Peristiwa Kependudukan", description: "Formulir untuk mendaftarkan peristiwa kependudukan (kelahiran, kematian, pernikahan, dll)", category: "Pendaftaran Penduduk", fileName: "F-1-02.pdf", fileSize: "278 KB", order: 2 },
  { code: "F-1.03", name: "Formulir Pendaftaran Perpindahan Penduduk", description: "Formulir untuk mendaftarkan perpindahan penduduk antar kabupaten/kota/provinsi", category: "Pendaftaran Penduduk", fileName: "F-1-03.pdf", fileSize: "171 KB", order: 3 },
  
  // PERSYARATAN / SPTJM
  { code: "F-1.03A", name: "Surat Kuasa Pengasuhan Anak dari Orang Tua/Wali", description: "Surat kuasa untuk pengasuhan anak bagi perpindahan penduduk", category: "Persyaratan", fileName: "F-1-03A.pdf", fileSize: "238 KB", order: 4 },
  { code: "F-1.03B", name: "Surat Pernyataan Bersedia Menerima sebagai Anggota Keluarga", description: "Surat pernyataan kesediaan menerima anggota keluarga baru", category: "Persyaratan", fileName: "F-1-03B.pdf", fileSize: "128 KB", order: 5 },
  { code: "F-1.03C", name: "Surat Pernyataan Tidak Keberatan Penggunaan Alamat", description: "Surat pernyataan tidak keberatan penggunaan alamat untuk KK", category: "Persyaratan", fileName: "F-1-03C.pdf", fileSize: "237 KB", order: 6 },
  { code: "F-1.04", name: "Surat Pernyataan Tidak Memiliki Dokumen Kependudukan", description: "Surat pernyataan bagi penduduk yang belum memiliki dokumen kependudukan", category: "Persyaratan", fileName: "F-1-04.pdf", fileSize: "261 KB", order: 7 },
  { code: "F-1.05", name: "SPTJM Perkawinan/Perceraian Belum Tercatat", description: "Surat Pernyataan Tanggung Jawab Mutlak untuk perkawinan/perceraian yang belum tercatat", category: "Persyaratan", fileName: "F-1-05.pdf", fileSize: "164 KB", order: 8 },
  { code: "F-1.06", name: "Surat Pernyataan Perubahan Elemen Data Kependudukan", description: "Surat pernyataan untuk perubahan elemen data kependudukan", category: "Persyaratan", fileName: "F-1-06.pdf", fileSize: "162 KB", order: 9 },
  { code: "F-1.07", name: "Surat Kuasa dalam Pelayanan Administrasi Kependudukan", description: "Surat kuasa untuk mewakili pelayanan administrasi kependudukan", category: "Persyaratan", fileName: "F-1-07.pdf", fileSize: "135 KB", order: 10 },
  
  // PENCATATAN SIPIL
  { code: "F-2.01A", name: "Pelaporan Kelahiran, Lahir Mati, dan Kematian", description: "Formulir pelaporan peristiwa kelahiran, lahir mati, dan kematian", category: "Pencatatan Sipil", fileName: "F-2-01A.pdf", fileSize: "146 KB", order: 11 },
  { code: "F-2.01B", name: "Pelaporan Perkawinan dan Pembatalan Perkawinan", description: "Formulir pelaporan peristiwa perkawinan dan pembatalan perkawinan", category: "Pencatatan Sipil", fileName: "F-2-01B.pdf", fileSize: "199 KB", order: 12 },
  { code: "F-2.01C", name: "Pelaporan Perceraian dan Pembatalan Perceraian", description: "Formulir pelaporan peristiwa perceraian dan pembatalan perceraian", category: "Pencatatan Sipil", fileName: "F-2-01C.pdf", fileSize: "200 KB", order: 13 },
  { code: "F-2.01D", name: "Pelaporan Pengangkatan/Pengakuan/Pengesahan Anak", description: "Formulir pelaporan pengangkatan, pengakuan, dan pengesahan anak", category: "Pencatatan Sipil", fileName: "F-2-01D.pdf", fileSize: "205 KB", order: 14 },
  { code: "F-2.01E", name: "Pelaporan Perubahan Nama/Status Kewarganegaraan", description: "Formulir pelaporan perubahan nama atau status kewarganegaraan", category: "Pencatatan Sipil", fileName: "F-2-01E.pdf", fileSize: "141 KB", order: 15 },
  { code: "F-2.01F", name: "Pembetulan/Pembatalan/Penerbitan Kembali Akta", description: "Formulir untuk pembetulan, pembatalan, atau penerbitan kembali akta", category: "Pencatatan Sipil", fileName: "F-2-01F.pdf", fileSize: "90 KB", order: 16 },
  
  // PENCATATAN SIPIL LUAR NEGERI
  { code: "F-2.02A", name: "Pelaporan Kelahiran dan Kematian dari Luar NKRI", description: "Formulir pelaporan kelahiran dan kematian dari luar negeri", category: "Pencatatan Sipil LN", fileName: "F-2-02A.pdf", fileSize: "172 KB", order: 17 },
  { code: "F-2.02B", name: "Pelaporan Perkawinan dan Perceraian dari Luar NKRI", description: "Formulir pelaporan perkawinan dan perceraian dari luar negeri", category: "Pencatatan Sipil LN", fileName: "F-2-02B.pdf", fileSize: "145 KB", order: 18 },
  { code: "F-2.02C", name: "Pelaporan Pengangkatan Anak WNI oleh WNA dari Luar NKRI", description: "Formulir pelaporan pengangkatan anak WNI oleh WNA dari luar negeri", category: "Pencatatan Sipil LN", fileName: "F-2-02C.pdf", fileSize: "201 KB", order: 19 },
  { code: "F-2.02D", name: "Pelepasan Kewarganegaraan dari Luar NKRI", description: "Formulir pelaporan pelepasan kewarganegaraan dari luar negeri", category: "Pencatatan Sipil LN", fileName: "F-2-02D.pdf", fileSize: "195 KB", order: 20 },
  { code: "F-2.02E", name: "Pembetulan/Pembatalan Akta dari Luar NKRI", description: "Formulir pembetulan/pembatalan akta pencatatan sipil dari luar negeri", category: "Pencatatan Sipil LN", fileName: "F-2-02E.pdf", fileSize: "160 KB", order: 21 },
  
  // SPTJM PENCATATAN SIPIL
  { code: "F-2.03", name: "SPTJM Kebenaran Data Kelahiran", description: "Surat Pernyataan Tanggung Jawab Mutlak kebenaran data kelahiran", category: "Persyaratan", fileName: "F-2-03.pdf", fileSize: "96 KB", order: 22 },
  { code: "F-2.04", name: "SPTJM Kebenaran sebagai Pasangan Suami Istri", description: "Surat Pernyataan Tanggung Jawab Mutlak kebenaran pasangan suami istri", category: "Persyaratan", fileName: "F-2-04.pdf", fileSize: "126 KB", order: 23 },
  { code: "F-2.04A", name: "SPTJM Kebenaran Pasangan Suami Istri (Meninggal Sebelum Pencatatan)", description: "SPTJM kebenaran pasangan suami istri yang meninggal sebelum pencatatan", category: "Persyaratan", fileName: "F-2-04A.pdf", fileSize: "130 KB", order: 24 },
  { code: "F-2.04B", name: "SPTJM Pembetulan Akta Pencatatan Sipil", description: "SPTJM untuk pembetulan akta pencatatan sipil", category: "Persyaratan", fileName: "F-2-04B.pdf", fileSize: "158 KB", order: 25 },
  { code: "F-2.04C", name: "SPTJM Pembatalan Akta Pencatatan Sipil tanpa Pengadilan", description: "SPTJM untuk pembatalan akta pencatatan sipil tanpa putusan pengadilan", category: "Persyaratan", fileName: "F-2-04C.pdf", fileSize: "158 KB", order: 26 },
  { code: "F-2.04D", name: "Surat Permohonan Penerbitan Kembali Kutipan Akta", description: "Surat permohonan penerbitan kembali kutipan akta yang hilang/rusak", category: "Persyaratan", fileName: "F-2-04D.pdf", fileSize: "71 KB", order: 27 },
];

// Mapping of layanan slug to related form codes
export const LAYANAN_FORM_MAP: Record<string, { codes: string[]; links: { name: string; code: string; fileName: string }[] }> = {
  "ktp-el": {
    codes: ["F-1.01"],
    links: [
      { name: "F-1.01 - Formulir Biodata Keluarga", code: "F-1.01", fileName: "F-1-01.pdf" },
    ],
  },
  "kartu-keluarga": {
    codes: ["F-1.01"],
    links: [
      { name: "F-1.01 - Formulir Biodata Keluarga", code: "F-1.01", fileName: "F-1-01.pdf" },
    ],
  },
  "kartu-identitas-anak": {
    codes: ["F-1.01", "F-2.01A"],
    links: [
      { name: "F-1.01 - Formulir Biodata Keluarga", code: "F-1.01", fileName: "F-1-01.pdf" },
      { name: "F-2.01A - Pelaporan Kelahiran", code: "F-2.01A", fileName: "F-2-01A.pdf" },
    ],
  },
  "surat-keterangan-pindah": {
    codes: ["F-1.01", "F-1.03", "F-1.03B"],
    links: [
      { name: "F-1.01 - Formulir Biodata Keluarga", code: "F-1.01", fileName: "F-1-01.pdf" },
      { name: "F-1.03 - Formulir Pendaftaran Perpindahan Penduduk", code: "F-1.03", fileName: "F-1-03.pdf" },
      { name: "F-1.03B - SPTJM Bersedia Menerima Anggota Keluarga", code: "F-1.03B", fileName: "F-1-03B.pdf" },
    ],
  },
  "skpln": {
    codes: ["F-1.01", "F-1.03", "F-1.03B"],
    links: [
      { name: "F-1.01 - Formulir Biodata Keluarga", code: "F-1.01", fileName: "F-1-01.pdf" },
      { name: "F-1.03 - Formulir Pendaftaran Perpindahan Penduduk", code: "F-1.03", fileName: "F-1-03.pdf" },
      { name: "F-1.03B - SPTJM Bersedia Menerima Anggota Keluarga", code: "F-1.03B", fileName: "F-1-03B.pdf" },
    ],
  },
  "akta-kelahiran": {
    codes: ["F-2.01A", "F-2.03"],
    links: [
      { name: "F-2.01A - Pelaporan Kelahiran, Lahir Mati, dan Kematian", code: "F-2.01A", fileName: "F-2-01A.pdf" },
      { name: "F-2.03 - SPTJM Kebenaran Data Kelahiran", code: "F-2.03", fileName: "F-2-03.pdf" },
    ],
  },
  "akta-kematian": {
    codes: ["F-2.01A"],
    links: [
      { name: "F-2.01A - Pelaporan Kelahiran, Lahir Mati, dan Kematian", code: "F-2.01A", fileName: "F-2-01A.pdf" },
    ],
  },
  "akta-perkawinan": {
    codes: ["F-2.01B", "F-2.04"],
    links: [
      { name: "F-2.01B - Pelaporan Perkawinan dan Pembatalan Perkawinan", code: "F-2.01B", fileName: "F-2-01B.pdf" },
      { name: "F-2.04 - SPTJM Kebenaran sebagai Pasangan Suami Istri", code: "F-2.04", fileName: "F-2-04.pdf" },
    ],
  },
  "akta-perceraian": {
    codes: ["F-2.01C"],
    links: [
      { name: "F-2.01C - Pelaporan Perceraian dan Pembatalan Perceraian", code: "F-2.01C", fileName: "F-2-01C.pdf" },
    ],
  },
  "pengakuan-anak": {
    codes: ["F-2.01D"],
    links: [
      { name: "F-2.01D - Pelaporan Pengangkatan/Pengakuan/Pengesahan Anak", code: "F-2.01D", fileName: "F-2-01D.pdf" },
    ],
  },
  "pembetulan-akta": {
    codes: ["F-2.01F", "F-2.04B", "F-2.04C", "F-2.04D"],
    links: [
      { name: "F-2.01F - Pembetulan/Pembatalan/Penerbitan Kembali Akta", code: "F-2.01F", fileName: "F-2-01F.pdf" },
      { name: "F-2.04B - SPTJM Pembetulan Akta Pencatatan Sipil", code: "F-2.04B", fileName: "F-2-04B.pdf" },
      { name: "F-2.04C - SPTJM Pembatalan Akta tanpa Pengadilan", code: "F-2.04C", fileName: "F-2-04C.pdf" },
      { name: "F-2.04D - Surat Permohonan Penerbitan Kembali Kutipan Akta", code: "F-2.04D", fileName: "F-2-04D.pdf" },
    ],
  },
  "perubahan-nama-kewarganegaraan": {
    codes: ["F-2.01E"],
    links: [
      { name: "F-2.01E - Pelaporan Perubahan Nama/Status Kewarganegaraan", code: "F-2.01E", fileName: "F-2-01E.pdf" },
    ],
  },
};

// Helper: get forms by category
export function getFormsByCategory(category: string): FormulirDefinition[] {
  return FORMULIR_LIST.filter(f => f.category === category);
}

// Helper: get form by code
export function getFormByCode(code: string): FormulirDefinition | undefined {
  return FORMULIR_LIST.find(f => f.code === code);
}

// Helper: get download URL for a form
export function getFormDownloadUrl(fileName: string): string {
  return `/formulir/${fileName}`;
}
