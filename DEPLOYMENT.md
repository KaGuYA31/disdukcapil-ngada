# 🚀 Panduan Deployment Vercel - Disdukcapil Ngada

Dokumen ini berisi panduan lengkap untuk men-deploy website Disdukcapil Ngada ke Vercel.

---

## ⚠️ PENTING: Perubahan Database

Website ini sebelumnya menggunakan **SQLite** yang tidak compatible dengan Vercel (serverless). Schema sudah diubah ke **PostgreSQL** untuk deployment.

---

## 📋 LANGKAH 1: Persiapan Akun

### 1.1 Buat Akun Vercel
1. Kunjungi https://vercel.com
2. Klik **"Sign Up"**
3. Pilih login dengan **GitHub** (direkomendasikan) atau GitLab/Bitbucket

### 1.2 Buat Akun Supabase (untuk database gratis)
1. Kunjungi https://supabase.com
2. Klik **"Start your project"**
3. Login dengan GitHub atau buat akun baru
4. Buat **Organization** baru jika belum ada
5. Buat **Project** baru:
   - Name: `disdukcapil-ngada`
   - Database Password: **(simpan password ini!)**
   - Region: pilih yang terdekat (Singapore recommended)
   - Klik **"Create new project"**
6. Tunggu beberapa menit hingga project selesai dibuat

### 1.3 Dapatkan Connection String dari Supabase
1. Di dashboard Supabase, buka **Settings** > **Database**
2. Scroll ke bagian **Connection string**
3. Copy connection string **URI** format:
   ```
   postgresql://postgres.xxxxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
4. Ganti `[PASSWORD]` dengan password yang Anda buat
5. Tambahkan `?pgbouncer=true&connection_limit=1` di akhir URL untuk DATABASE_URL

**Contoh:**
```
DATABASE_URL="postgresql://postgres.xxxxx:yourpassword@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.xxxxx:yourpassword@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

---

## 📋 LANGKAH 2: Push ke GitHub

### 2.1 Buat Repository GitHub
1. Login ke https://github.com
2. Klik **"+"** > **"New repository"**
3. Isi form:
   - Repository name: `disdukcapil-ngada`
   - Description: `Website Resmi Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada`
   - Pilih **Private** atau **Public**
   - **JANGAN** centang "Add a README file"
4. Klik **"Create repository"**

### 2.2 Push Code ke GitHub
Buka terminal di folder project dan jalankan:

```bash
# Inisialisasi git
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit - Disdukcapil Ngada"

# Tambahkan remote repository
git remote add origin https://github.com/USERNAME/disdukcapil-ngada.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

---

## 📋 LANGKAH 3: Deploy ke Vercel

### 3.1 Import Project di Vercel
1. Login ke https://vercel.com
2. Klik **"Add New..."** > **"Project"**
3. Pilih repository `disdukcapil-ngada` dari daftar
4. Klik **"Import"**

### 3.2 Konfigurasi Project
Di halaman **Configure Project**:

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `.` (default)

**Build Command:** (biarkan default atau isi)
```
prisma generate && prisma migrate deploy && next build
```

**Install Command:**
```
bun install
```

**Output Directory:** (biarkan default)

### 3.3 Tambahkan Environment Variables
Klik **"Environment Variables"** dan tambahkan:

| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgresql://postgres.xxxxx:password@host:6543/postgres?pgbouncer=true&connection_limit=1` |
| `DIRECT_URL` | `postgresql://postgres.xxxxx:password@host:5432/postgres` |
| `NEXTAUTH_SECRET` | (generate random string) |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` (akan diupdate nanti) |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `your-secure-password` |
| `ADMIN_NAME` | `Administrator` |
| `ADMIN_EMAIL` | `admin@disdukcapil-ngada.go.id` |

**Cara generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```
atau gunakan: https://generate-secret.vercel.app/32

### 3.4 Deploy
1. Klik **"Deploy"**
2. Tunggu proses build selesai (2-5 menit)
3. Jika berhasil, Anda akan melihat halaman sukses dengan URL website

---

## 📋 LANGKAH 4: Setup Database

### 4.1 Jalankan Migration
Setelah deploy pertama berhasil, database masih kosong. Anda perlu menjalankan migration:

**Opsi A: Via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local

# Jalankan migration
bunx prisma migrate deploy
```

**Opsi B: Via Supabase SQL Editor**
1. Buka Supabase Dashboard
2. Pilih project
3. Buka **SQL Editor**
4. Copy isi file migration dan jalankan

### 4.2 Seed Data Awal
Untuk menambahkan data admin dan data contoh:

```bash
bunx prisma db seed
```

Atau buat admin manual via Supabase SQL Editor:
```sql
INSERT INTO "Admin" (id, username, password, name, email, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin',
  -- password: gunakan bcrypt hash
  '$2b$10$xxx...',  -- generate dengan bcrypt
  'Administrator',
  'admin@disdukcapil-ngada.go.id',
  NOW(),
  NOW()
);
```

---

## 📋 LANGKAH 5: Konfigurasi Domain (Opsional)

### 5.1 Tambah Custom Domain
1. Buka project di Vercel Dashboard
2. Klik **"Settings"** > **"Domains"**
3. Masukkan domain Anda, contoh: `disdukcapil.ngadakab.go.id`
4. Klik **"Add"**

### 5.2 Konfigurasi DNS
Tambahkan record DNS di provider domain Anda:

**Untuk subdomain (www):**
| Type | Name | Value |
|------|------|-------|
| CNAME | www | cname.vercel-dns.com |

**Untuk apex domain:**
| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |

### 5.3 Update NEXTAUTH_URL
Setelah domain dikonfigurasi:
1. Buka **Settings** > **Environment Variables**
2. Update `NEXTAUTH_URL` ke domain baru
3. Redeploy project

---

## 🔧 Troubleshooting

### Error: "Prisma Client not found"
```bash
# Tambahkan postinstall di package.json
"postinstall": "prisma generate"
```

### Error: "Database connection failed"
- Periksa DATABASE_URL dan DIRECT_URL
- Pastikan password benar
- Pastikan IP Vercel di-whitelist (Supabase biasanya otomatis)

### Error: "Migration failed"
- Jalankan `prisma migrate deploy` manual
- Cek apakah database sudah ada tabel

### Error: "Build timeout"
- Kurangi ukuran dependencies
- Gunakan `output: 'standalone'` di next.config.ts

---

## 📁 Struktur File Penting

```
├── prisma/
│   └── schema.prisma      # Database schema (PostgreSQL)
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   └── lib/               # Utilities
├── .env.example           # Template environment variables
├── vercel.json            # Vercel configuration
├── next.config.ts         # Next.js configuration
└── package.json           # Dependencies & scripts
```

---

## 📞 Support

Jika mengalami masalah:
1. Cek **Build Logs** di Vercel Dashboard
2. Cek **Function Logs** untuk API errors
3. Dokumentasi Vercel: https://vercel.com/docs
4. Dokumentasi Prisma: https://prisma.io/docs

---

## ✅ Checklist Deployment

- [ ] Akun Vercel dibuat
- [ ] Akun Supabase dibuat & project dibuat
- [ ] Connection string DATABASE_URL didapat
- [ ] Repository GitHub dibuat
- [ ] Code di-push ke GitHub
- [ ] Project di-import di Vercel
- [ ] Environment variables dikonfigurasi
- [ ] Deploy berhasil
- [ ] Migration dijalankan
- [ ] Admin user dibuat
- [ ] Custom domain dikonfigurasi (opsional)
- [ ] Website berfungsi dengan baik

---

**Selamat! Website Disdukcapil Ngada sudah online!** 🎉
