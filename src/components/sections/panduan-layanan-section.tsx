"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  FileText,
  Building2,
  Users,
  Clock,
  AlertTriangle,
  ChevronDown,
  ArrowRight,
  ClipboardList,
  ScanFace,
  Stamp,
  Printer,
  Home,
  HeartHandshake,
  Handshake,
  UserCheck,
  FileCheck2,
  FolderSearch,
  PenLine,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────

interface StepTip {
  icon: "warning" | "info" | "success";
  text: string;
}

interface PanduanStep {
  nomor: number;
  judul: string;
  judulSingkat: string;
  deskripsi: string;
  deskripsiSingkat: string;
  estimasiWaktu: string;
  dokumen: string[];
  tips: StepTip[];
}

interface LayananPanduan {
  id: string;
  nama: string;
  icon: React.ReactNode;
  steps: PanduanStep[];
  overview: string;
}

// ─── Service Data ─────────────────────────────────────────────────────

const layananPanduanList: LayananPanduan[] = [
  {
    id: "ktp-el",
    nama: "KTP-el",
    icon: <UserCheck className="h-5 w-5" />,
    overview: "Panduan lengkap pembuatan dan pembaruan Kartu Tanda Penduduk Elektronik (KTP-el) di Disdukcapil Kabupaten Ngada.",
    steps: [
      {
        nomor: 1,
        judul: "Siapkan Dokumen Persyaratan",
        judulSingkat: "Siapkan Dokumen",
        deskripsi: "Kumpulkan semua dokumen yang diperlukan: Surat Pengantar RT/RW, Kartu Keluarga (KK) asli, Akta Kelahiran atau Ijazah, Surat Nikah (jika sudah menikah), dan Pas Foto 2x3 (2 lembar). Pastikan semua dokumen dalam kondisi baik dan fotokopi masing-masing 1 lembar.",
        deskripsiSingkat: "Kumpulkan Surat Pengantar RT/RW, KK asli, Akta Kelahiran/Ijazah, dan dokumen pendukung lainnya.",
        estimasiWaktu: "1-2 hari",
        dokumen: ["Surat Pengantar RT/RW", "KK Asli", "Akta Kelahiran/Ijazah", "Surat Nikah (jika menikah)", "Pas Foto 2x3 (2 lbr)"],
        tips: [
          { icon: "info", text: "Pastikan data di KK sudah sesuai dengan data diri Anda. Jika ada ketidaksesuaian, ajukan perbaikan KK terlebih dahulu." },
          { icon: "warning", text: "Pas Foto harus berlatar belakang merah, ukuran 2x3, terbaru (maks 6 bulan)." },
        ],
      },
      {
        nomor: 2,
        judul: "Datang ke Kantor Disdukcapil",
        judulSingkat: "Datang ke Disdukcapil",
        deskripsi: "Kunjungi kantor Disdukcapil Kabupaten Ngada di Jl. El Tari, Bajawa pada jam kerja (Senin-Jumat, 08:00-15:00 WITA). Ambil nomor antrian di loket pendaftaran dan tunggu giliran Anda dipanggil. Disarankan datang di pagi hari untuk menghindari antrian panjang.",
        deskripsiSingkat: "Kunjungi Disdukcapil Ngada, ambil nomor antrian, dan tunggu giliran.",
        estimasiWaktu: "30-60 menit",
        dokumen: ["Semua dokumen yang telah disiapkan", "Bolpen"],
        tips: [
          { icon: "success", text: "Kantor Disdukcapil buka Senin-Jumat, 08:00-15:00 WITA. Datang pagi untuk antrian lebih cepat." },
          { icon: "info", text: "Anda bisa cek status antrian melalui fitur Antrian Online di website ini." },
        ],
      },
      {
        nomor: 3,
        judul: "Verifikasi Dokumen oleh Petugas",
        judulSingkat: "Verifikasi Dokumen",
        deskripsi: "Serahkan semua dokumen persyaratan kepada petugas di loket pendaftaran. Petugas akan memeriksa kelengkapan dan keabsahan dokumen Anda. Jika dokumen lengkap, petugas akan mencetak formulir isian data penduduk yang perlu Anda isi dengan benar.",
        deskripsiSingkat: "Serahkan dokumen ke petugas dan isi formulir isian data.",
        estimasiWaktu: "15-20 menit",
        dokumen: ["Semua dokumen asli + fotokopi"],
        tips: [
          { icon: "warning", text: "Periksa kembali kelengkapan dokumen sebelum ke Disdukcapil untuk menghindari bolak-balik." },
        ],
      },
      {
        nomor: 4,
        judul: "Perekaman Biometrik",
        judulSingkat: "Perekaman Biometrik",
        deskripsi: "Setelah verifikasi dokumen, Anda akan dipanggil untuk melakukan perekaman biometrik meliputi: sidik jari (10 jari), foto wajah, dan pengambilan iris mata. Pastikan Anda dalam keadaan sehat, tidak menggunakan kacamata (saat foto), dan pakaian rapi.",
        deskripsiSingkat: "Lakukan perekaman sidik jari, foto wajah, dan iris mata.",
        estimasiWaktu: "10-15 menit",
        dokumen: ["KTP lama (jika perpanjangan)", "Surat pengantar dari petugas"],
        tips: [
          { icon: "info", text: "Tidak boleh menggunakan kacamata, lensa kontak warna, atau aksesoris wajah saat perekaman." },
          { icon: "warning", text: "Sidik jari harus dalam kondisi bersih dan kering. Hindari menggunakan lotion di tangan." },
        ],
      },
      {
        nomor: 5,
        judul: "Tunggu Proses Pencetakan",
        judulSingkat: "Tunggu Pencetakan",
        deskripsi: "Setelah perekaman biometrik berhasil, data Anda akan diverifikasi dan diproses oleh Dukcapil Pusat melalui Sistem Informasi Administrasi Kependudukan (SIAK). Proses ini memakan waktu sekitar 14 hari kerja untuk KTP-el baru. Anda bisa memantau status KTP-el melalui website.",
        deskripsiSingkat: "Tunggu proses verifikasi dan pencetakan oleh sistem SIAK.",
        estimasiWaktu: "5-14 hari kerja",
        dokumen: ["Surat Tanda Bukti Perekaman"],
        tips: [
          { icon: "success", text: "Simpan Surat Tanda Bukti Perekaman dengan baik. Ini berlaku sebagai identitas sementara." },
          { icon: "info", text: "Cek status KTP-el secara berkala melalui website atau hubungi Disdukcapil." },
        ],
      },
      {
        nomor: 6,
        judul: "Pengambilan KTP-el",
        judulSingkat: "Ambil KTP-el",
        deskripsi: "Setelah KTP-el siap, Anda akan dihubungi oleh petugas atau bisa mengecek statusnya secara online. Datang ke Disdukcapil dengan membawa Surat Tanda Bukti Perekaman untuk mengambil KTP-el Anda. Periksa kembali data di KTP-el sebelum meninggalkan kantor.",
        deskripsiSingkat: "Ambil KTP-el yang sudah jadi dengan membawa bukti perekaman.",
        estimasiWaktu: "10-15 menit",
        dokumen: ["Surat Tanda Bukti Perekaman", "KTP lama (jika ada)"],
        tips: [
          { icon: "warning", text: "Periksa kembali semua data di KTP-el (nama, NIK, alamat, tanggal lahir) sebelum pulang." },
          { icon: "info", text: "Jika KTP-el tidak diambil dalam 60 hari, bisa saja dicetak ulang." },
        ],
      },
    ],
  },
  {
    id: "kk",
    nama: "Kartu Keluarga",
    icon: <ClipboardList className="h-5 w-5" />,
    overview: "Panduan pembuatan dan perubahan Kartu Keluarga (KK) di Disdukcapil Kabupaten Ngada.",
    steps: [
      {
        nomor: 1,
        judul: "Siapkan Dokumen Keluarga",
        judulSingkat: "Siapkan Dokumen",
        deskripsi: "Kumpulkan dokumen untuk semua anggota keluarga yang akan tercatat: KTP-el semua anggota, Akta Kelahiran masing-masing, Surat Nikah/Buku Nikah, dan Surat Pengantar RT/RW. Untuk KK baru, siapkan juga Surat Keterangan Pindah jika berasal dari daerah lain.",
        deskripsiSingkat: "Kumpulkan KTP-el, Akta Kelahiran, dan dokumen keluarga lainnya.",
        estimasiWaktu: "1-3 hari",
        dokumen: ["KTP-el semua anggota", "Akta Kelahiran anggota", "Surat Nikah/Buku Nikah", "Surat Pengantar RT/RW", "Surat Keterangan Pindah (jika perlu)"],
        tips: [
          { icon: "info", text: "Pastikan semua akta kelahiran anggota keluarga sudah ada dan lengkap." },
        ],
      },
      {
        nomor: 2,
        judul: "Isi Formulir F-1.01",
        judulSingkat: "Isi Formulir",
        deskripsi: "Ambil dan isi formulir Isian Penduduk (F-1.01) di Disdukcapil. Formulir ini berisi data lengkap seluruh anggota keluarga: nama, NIK, tempat/tanggal lahir, jenis kelamin, pekerjaan, pendidikan, agama, status perkawinan, dan hubungan dalam keluarga.",
        deskripsiSingkat: "Isi formulir F-1.01 dengan data lengkap semua anggota keluarga.",
        estimasiWaktu: "20-30 menit",
        dokumen: ["Formulir F-1.01 (diisi)", "Semua dokumen keluarga"],
        tips: [
          { icon: "warning", text: "Isi formulir dengan huruf cetak yang jelas dan data yang akurat. Kesalahan data bisa memperlambat proses." },
        ],
      },
      {
        nomor: 3,
        judul: "Verifikasi oleh Petugas",
        judulSingkat: "Verifikasi Data",
        deskripsi: "Serahkan formulir dan dokumen kepada petugas. Petugas akan memverifikasi data, mencocokkan dengan database SIAK, dan mengkonfirmasi kebenaran informasi. Jika ada ketidaksesuaian data, petugas akan memberikan petunjuk perbaikan.",
        deskripsiSingkat: "Petugas memverifikasi dan mencocokkan data Anda dengan database.",
        estimasiWaktu: "15-30 menit",
        dokumen: ["Formulir F-1.01", "Semua dokumen asli"],
        tips: [
          { icon: "success", text: "Jika semua data cocok, proses dilanjutkan ke pencetakan KK." },
        ],
      },
      {
        nomor: 4,
        judul: "Tanda Tangan & Pencetakan KK",
        judulSingkat: "Tanda Tangan & Cetak",
        deskripsi: "Setelah data terverifikasi, Kepala Seksi atau pejabat berwenang akan menandatangani KK. Kemudian KK dicetak oleh petugas. Anda akan diminta memeriksa kembali seluruh data yang tercantum sebelum KK diserahkan.",
        deskripsiSingkat: "KK ditandatangani pejabat dan dicetak, lalu serahkan kepada Anda.",
        estimasiWaktu: "30-60 menit",
        dokumen: ["Formulir F-1.01 yang telah diverifikasi"],
        tips: [
          { icon: "warning", text: "Periksa setiap data anggota keluarga di KK: NIK, nama, tempat/tanggal lahir, dan alamat." },
        ],
      },
      {
        nomor: 5,
        judul: "Serah Terima KK",
        judulSingkat: "Serah Terima",
        deskripsi: "Kartu Keluarga yang sudah jadi diserahkan kepada Anda. Simpan KK dengan baik di tempat yang aman. KK diperlukan untuk berbagai keperluan administrasi seperti pengurusan KTP, pendaftaran sekolah, pembukaan rekening bank, dan lain-lain.",
        deskripsiSingkat: "Terima KK Anda dan simpan dengan baik.",
        estimasiWaktu: "5-10 menit",
        dokumen: ["KK baru"],
        tips: [
          { icon: "success", text: "Fotokopi KK beberapa lembar untuk keperluan administrasi mendatang." },
          { icon: "info", text: "Laporkan segera ke Disdukcapil jika terjadi perubahan data keluarga (kelahiran, kematian, pindah, dll)." },
        ],
      },
    ],
  },
  {
    id: "akta-kelahiran",
    nama: "Akta Kelahiran",
    icon: <FileCheck2 className="h-5 w-5" />,
    overview: "Panduan pembuatan Akta Kelahiran untuk bayi yang baru lahir di wilayah Kabupaten Ngada.",
    steps: [
      {
        nomor: 1,
        judul: "Siapkan Surat Keterangan Kelahiran",
        judulSingkat: "Siapkan Surat Kelahiran",
        deskripsi: "Dapatkan Surat Keterangan Kelahiran dari rumah sakit, puskesmas, atau bidan yang membantu persalinan. Surat ini memuat data bayi (nama, jenis kelamin, berat, waktu kelahiran) dan data orang tua. Jika lahir di rumah, minta surat keterangan dari bidan desa setempat.",
        deskripsiSingkat: "Dapatkan Surat Keterangan Kelahiran dari RS/Puskesmas/Bidan.",
        estimasiWaktu: "1 hari",
        dokumen: ["Surat Keterangan Kelahiran dari RS/Bidan", "Surat Pengantar RT/RW"],
        tips: [
          { icon: "warning", text: "Akta Kelahiran sebaiknya dibuat maksimal 60 hari setelah kelahiran. Lebih dari 60 hari dikenakan proses sidang." },
        ],
      },
      {
        nomor: 2,
        judul: "Kumpulkan Dokumen Orang Tua",
        judulSingkat: "Kumpulkan Dokumen Ortu",
        deskripsi: "Siapkan KTP-el kedua orang tua asli, Kartu Keluarga (KK) asli, Surat Nikah/Buku Nikah asli, dan Surat Pengantar RT/RW. Jika orang tua belum menikah secara resmi, siapkan surat keterangan tidak mampu menikah dari desa dan akta pengakuan anak.",
        deskripsiSingkat: "Siapkan KTP-el, KK, dan Surat Nikah kedua orang tua.",
        estimasiWaktu: "1-2 hari",
        dokumen: ["KTP-el kedua orang tua", "KK asli", "Surat Nikah/Buku Nikah", "Surat Pengantar RT/RW"],
        tips: [
          { icon: "info", text: "Jika orang tua belum tercatat di Disdukcapil, lakukan perekaman KTP-el terlebih dahulu." },
        ],
      },
      {
        nomor: 3,
        judul: "Datang ke Disdukcapil",
        judulSingkat: "Datang ke Disdukcapil",
        deskripsi: "Kunjungi kantor Disdukcapil Kabupaten Ngada dengan membawa semua dokumen. Ambil nomor antrian di loket Pencatatan Sipil. Serahkan dokumen kepada petugas dan isi formulir permohonan akta kelahiran. Orang tua atau wali harus hadir langsung.",
        deskripsiSingkat: "Bawa semua dokumen ke Disdukcapil, isi formulir permohonan.",
        estimasiWaktu: "30-60 menit",
        dokumen: ["Semua dokumen yang telah disiapkan"],
        tips: [
          { icon: "success", text: "Akta Kelahiran gratis berdasarkan UU No. 24 Tahun 2013. Tidak dipungut biaya apapun." },
        ],
      },
      {
        nomor: 4,
        judul: "Verifikasi & Penerbitan Akta",
        judulSingkat: "Verifikasi & Terbitkan",
        deskripsi: "Petugas akan memverifikasi seluruh dokumen dan data. Setelah diverifikasi, data kelahiran dicatat dalam database SIAK dan akta kelahiran diterbitkan. Proses ini biasanya dapat selesai dalam hari yang sama jika dokumen lengkap dan data sudah tervalidasi.",
        deskripsiSingkat: "Petugas verifikasi dokumen dan terbitkan akta kelahiran.",
        estimasiWaktu: "1-3 hari kerja",
        dokumen: ["Formulir permohonan", "Semua dokumen asli"],
        tips: [
          { icon: "info", text: "Jika dokumen lengkap dan data sudah tervalidasi, akta bisa selesai di hari yang sama." },
        ],
      },
      {
        nomor: 5,
        judul: "Ambil Akta Kelahiran",
        judulSingkat: "Ambil Akta",
        deskripsi: "Ambil Akta Kelahiran yang sudah jadi di Disdukcapil. Bawa surat bukti permohonan sebagai tanda terima. Periksa kembali data bayi dan orang tua yang tercantum dalam akta. Pastikan nama, tanggal lahir, dan tempat lahir sudah benar.",
        deskripsiSingkat: "Ambil dan periksa akta kelahiran yang sudah jadi.",
        estimasiWaktu: "10-15 menit",
        dokumen: ["Surat bukti permohonan"],
        tips: [
          { icon: "warning", text: "Periksa kesesuaian nama, tanggal, dan tempat lahir. Jika ada kesalahan, segera laporkan untuk perbaikan." },
          { icon: "success", text: "Akta Kelahiran adalah dokumen penting. Simpan dalam amplop plastik dan buat fotokopi." },
        ],
      },
    ],
  },
  {
    id: "pindah-penduduk",
    nama: "Pindah Penduduk",
    icon: <Home className="h-5 w-5" />,
    overview: "Panduan proses pindah penduduk (pindah datang dan pindah keluar) di Disdukcapil Kabupaten Ngada.",
    steps: [
      {
        nomor: 1,
        judul: "Minta Surat Pengantar dari RT/RW",
        judulSingkat: "Surat RT/RW",
        deskripsi: "Minta surat pengantar pindah dari RT/RW di kelurahan/desa asal. Surat ini berisi keterangan bahwa Anda benar-benar tinggal di wilayah tersebut dan akan pindah ke alamat baru. Sertakan alasan kepindahan (kerja, kuliah, menikah, dll).",
        deskripsiSingkat: "Minta surat pengantar pindah dari RT/RW desa asal.",
        estimasiWaktu: "1 hari",
        dokumen: ["Surat Pengantar RT/RW", "KTP-el asli", "KK asli"],
        tips: [
          { icon: "info", text: "Jelaskan alasan kepindahan dengan jelas kepada ketua RT/RW." },
        ],
      },
      {
        nomor: 2,
        judul: "Urus di Disdukcapil Asal",
        judulSingkat: "Disdukcapil Asal",
        deskripsi: "Datang ke Disdukcapil kabupaten/kota asal dengan membawa KTP-el, KK, surat pengantar RT/RW, dan pas foto 3x4 (4 lembar). Isi formulir permohonan pindah. Petugas akan menerbitkan Surat Keterangan Pindah (SKP) antar kabupaten/kota.",
        deskripsiSingkat: "Urus SKP di Disdukcapil asal dengan dokumen lengkap.",
        estimasiWaktu: "1-3 hari kerja",
        dokumen: ["KTP-el asli", "KK asli", "Surat Pengantar RT/RW", "Pas Foto 3x4 (4 lbr)", "Surat keterangan kerja/kuliah (opsional)"],
        tips: [
          { icon: "warning", text: "Proses ini diurus di Disdukcapil ASAL, bukan di tujuan." },
        ],
      },
      {
        nomor: 3,
        judul: "Waktu Proses Sinkronisasi",
        judulSingkat: "Proses Sinkronisasi",
        deskripsi: "Setelah SKP diterbitkan, data kepindahan akan disinkronkan melalui sistem SIAK antar Disdukcapil asal dan tujuan. Proses ini memakan waktu sekitar 7 hari kerja. Selama proses, Anda bisa menggunakan SKP sebagai dokumen sementara.",
        deskripsiSingkat: "Tunggu proses sinkronisasi data antar Disdukcapil (~7 hari kerja).",
        estimasiWaktu: "5-7 hari kerja",
        dokumen: ["Surat Keterangan Pindah (SKP)"],
        tips: [
          { icon: "success", text: "SKP berlaku sebagai dokumen sementara selama proses pindah berlangsung." },
          { icon: "info", text: "Anda bisa memantau progress melalui sistem informasi kependudukan online." },
        ],
      },
      {
        nomor: 4,
        judul: "Lapor ke Disdukcapil Tujuan",
        judulSingkat: "Disdukcapil Tujuan",
        deskripsi: "Setelah proses sinkronisasi selesai, datang ke Disdukcapil kabupaten/kota tujuan dengan membawa SKP dan dokumen pendukung. Ambil surat pengantar RT/RW dari alamat baru. Petugas akan memverifikasi data dan memproses pencatatan kepindahan.",
        deskripsiSingkat: "Lapor ke Disdukcapil tujuan dengan SKP dan surat pengantar baru.",
        estimasiWaktu: "1-2 hari kerja",
        dokumen: ["SKP asli", "Surat Pengantar RT/RW baru", "KTP-el asli", "KK asli", "Pas Foto 3x4 (4 lbr)"],
        tips: [
          { icon: "warning", text: "Pastikan sudah punya alamat dan surat pengantar RT/RW baru sebelum ke Disdukcapil tujuan." },
        ],
      },
      {
        nomor: 5,
        judul: "Penerbitan KK & KTP-el Baru",
        judulSingkat: "Terbit KK & KTP Baru",
        deskripsi: "Disdukcapil tujuan akan menerbitkan KK baru dengan alamat yang sudah berubah. Setelah KK terbit, Anda perlu melakukan perekaman ulang untuk KTP-el dengan alamat baru. Proses KTP-el baru memakan waktu sekitar 14 hari kerja.",
        deskripsiSingkat: "Dapatkan KK baru dan lakukan perekaman KTP-el baru.",
        estimasiWaktu: "7-14 hari kerja",
        dokumen: ["KK baru", "Dokumen pendukung"],
        tips: [
          { icon: "success", text: "Selamat! Anda resmi tercatat sebagai penduduk di wilayah baru." },
          { icon: "info", text: "Selama menunggu KTP-el baru, gunakan SKP sebagai identitas." },
        ],
      },
    ],
  },
  {
    id: "akta-kematian",
    nama: "Akta Kematian",
    icon: <HeartHandshake className="h-5 w-5" />,
    overview: "Panduan pembuatan Akta Kematian di Disdukcapil Kabupaten Ngada untuk keperluan administrasi keluarga.",
    steps: [
      {
        nomor: 1,
        judul: "Siapkan Surat Keterangan Kematian",
        judulSingkat: "Surat Kematian",
        deskripsi: "Dapatkan Surat Keterangan Kematian dari rumah sakit, puskesmas, atau bidan (jika meninggal di fasilitas kesehatan). Jika meninggal di rumah, minta surat keterangan dari kelurahan/desa. Surat ini memuat data almarhum/ahli waris dan penyebab kematian.",
        deskripsiSingkat: "Dapatkan surat keterangan kematian dari RS/desa.",
        estimasiWaktu: "1 hari",
        dokumen: ["Surat Keterangan Kematian dari RS/Bidan/Desa"],
        tips: [
          { icon: "warning", text: "Laporkan kematian dalam waktu 30 hari sejak tanggal meninggal dunia." },
        ],
      },
      {
        nomor: 2,
        judul: "Kumpulkan Dokumen Ahli Waris",
        judulSingkat: "Dokumen Ahli Waris",
        deskripsi: "Siapkan KTP-el almarhum/ahli waris, KK asli, Surat Nikah/Buku Nikah (jika sudah menikah), dan Surat Pengantar RT/RW. Jika pelapor bukan keluarga langsung, siapkan surat kuasa dari keluarga terdekat.",
        deskripsiSingkat: "Siapkan KTP-el, KK, dan dokumen keluarga yang ditinggalkan.",
        estimasiWaktu: "1-2 hari",
        dokumen: ["KTP-el almarhum/ahli waris", "KK asli", "Surat Nikah/Buku Nikah", "Surat Pengantar RT/RW"],
        tips: [
          { icon: "info", text: "Ahli waris atau keluarga terdekat yang berhak melaporkan kematian." },
        ],
      },
      {
        nomor: 3,
        judul: "Lapor ke Disdukcapil",
        judulSingkat: "Lapor ke Disdukcapil",
        deskripsi: "Datang ke Disdukcapil Kabupaten Ngada dengan membawa semua dokumen. Ambil nomor antrian loket Pencatatan Sipil. Serahkan dokumen kepada petugas, isi formulir pelaporan kematian, dan berikan keterangan yang diperlukan.",
        deskripsiSingkat: "Bawa semua dokumen ke Disdukcapil, isi formulir pelaporan.",
        estimasiWaktu: "30-60 menit",
        dokumen: ["Semua dokumen yang telah disiapkan"],
        tips: [
          { icon: "success", text: "Pembuatan Akta Kematian gratis. Tidak dipungut biaya apapun." },
        ],
      },
      {
        nomor: 4,
        judul: "Verifikasi & Penerbitan Akta",
        judulSingkat: "Verifikasi & Terbitkan",
        deskripsi: "Petugas memverifikasi dokumen dan data kematian. Setelah diverifikasi, data kematian dicatat dalam database SIAK dan Akta Kematian diterbitkan. Proses ini biasanya selesai dalam 1-3 hari kerja. Akta Kematian diperlukan untuk pengurusan waris, pensiun, dan administrasi lainnya.",
        deskripsiSingkat: "Petugas verifikasi dan terbitkan Akta Kematian.",
        estimasiWaktu: "1-3 hari kerja",
        dokumen: ["Formulir pelaporan kematian", "Semua dokumen asli"],
        tips: [
          { icon: "info", text: "Akta Kematian penting untuk pengurusan waris, pensiun janda/duda, dan perubahan KK." },
        ],
      },
      {
        nomor: 5,
        judul: "Perbarui KK & Administrasi Lanjutan",
        judulSingkat: "Perbarui KK",
        deskripsi: "Setelah mendapat Akta Kematian, ajukan perubahan KK untuk mengeluarkan anggota keluarga yang meninggal. Proses ini bisa dilakukan di Disdukcapil yang sama. Acara keluarga yang terdampak juga perlu mengurus administrasi lanjutan (waris, pensiun, dll).",
        deskripsiSingkat: "Perbarui KK dan urus administrasi lanjutan terkait.",
        estimasiWaktu: "1-3 hari kerja",
        dokumen: ["Akta Kematian", "KK asli", "KTP-el ahli waris"],
        tips: [
          { icon: "warning", text: "KK harus segera diperbarui setelah ada anggota keluarga yang meninggal." },
          { icon: "success", text: "Disdukcapil Ngada siap membantu proses administrasi keluarga yang terdampak." },
        ],
      },
    ],
  },
];

// ─── Animation Variants ───────────────────────────────────────────────

const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const floatOrb = {
  animate: (delay: number) => ({
    y: [0, -18, 0],
    x: [0, 12, 0],
    scale: [1, 1.08, 1],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay,
    },
  }),
};

const pulseRing = {
  animate: {
    scale: [1, 1.6, 1],
    opacity: [0.4, 0, 0.4],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

// ┅ Tip Icon Component ─────────────────────────────────────────────────

function TipCallout({ tip }: { tip: StepTip }) {
  const config = {
    warning: {
      bg: "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30",
      text: "text-amber-700 dark:text-amber-300",
      icon: <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />,
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30",
      text: "text-blue-700 dark:text-blue-300",
      icon: <FileText className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />,
    },
    success: {
      bg: "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30",
      text: "text-green-700 dark:text-green-300",
      icon: <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />,
    },
  };
  const c = config[tip.icon];

  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-lg border ${c.bg}`}>
      {c.icon}
      <p className={`text-xs leading-relaxed ${c.text}`}>{tip.text}</p>
    </div>
  );
}

// ┅ Step Icon mapping ──────────────────────────────────────────────────

function getStepIcon(stepIndex: number): React.ReactNode {
  const icons: React.ReactNode[] = [
    <FolderSearch key="folder" className="h-5 w-5" />,
    <Building2 key="building" className="h-5 w-5" />,
    <FileCheck2 key="filecheck" className="h-5 w-5" />,
    <ScanFace key="scanface" className="h-5 w-5" />,
    <Clock key="clock" className="h-5 w-5" />,
    <Printer key="printer" className="h-5 w-5" />,
    <Stamp key="stamp" className="h-5 w-5" />,
    <Handshake key="handshake" className="h-5 w-5" />,
  ];
  return icons[stepIndex % icons.length];
}

// Completion percentage per layanan (simulated)
const completionPercent: Record<string, number> = {
  "ktp-el": 85,
  "kk": 90,
  "akta-kelahiran": 78,
  "pindah-penduduk": 65,
  "akta-kematian": 72,
};

// ─── Main Component ───────────────────────────────────────────────────

export function PanduanLayananSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeTab, setActiveTab] = useState("ktp-el");
  const [isDetailed, setIsDetailed] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const activeLayanan = layananPanduanList.find((l) => l.id === activeTab)!;

  const toggleDetail = () => {
    setIsDetailed((prev) => !prev);
  };

  const toggleStep = (nomor: number) => {
    if (!isDetailed) return;
    setExpandedStep((prev) => (prev === nomor ? null : nomor));
  };

  const currentCompletion = completionPercent[activeTab] ?? 80;

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white dark:bg-gray-950 relative overflow-hidden"
      aria-labelledby="panduan-layanan-title"
    >
      {/* ── Gradient Hero Banner ── */}
      <div className="relative h-[120px] bg-gradient-to-r from-green-700 via-green-800 to-teal-900 overflow-hidden">
        {/* SVG Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 0L26 14L14 26L2 14Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Animated gradient orbs */}
        <motion.div
          custom={0}
          variants={floatOrb}
          initial="hidden"
          animate="animate"
          className="absolute top-2 left-1/3 w-44 h-44 bg-green-400/20 rounded-full blur-3xl"
        />
        <motion.div
          custom={1.5}
          variants={floatOrb}
          initial="hidden"
          animate="animate"
          className="absolute bottom-0 right-1/3 w-52 h-52 bg-teal-400/15 rounded-full blur-3xl"
        />
        {/* Content overlay */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Langkah-langkah Layanan
              </h1>
              <p className="text-green-200/80 text-sm mt-0.5">
                Panduan visual lengkap untuk setiap layanan administrasi kependudukan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%2315803d' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-1/4 -left-32 w-72 h-72 bg-green-100/30 dark:bg-green-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-amber-100/20 dark:bg-amber-900/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-8 mt-8"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Ikuti langkah-langkah berikut agar proses Anda berjalan lancar.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Service Selector Tabs */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mb-6"
          >
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin" style={{ scrollbarWidth: "thin", scrollbarColor: "#15803d transparent" }}>
              {layananPanduanList.map((layanan) => (
                <button
                  key={layanan.id}
                  onClick={() => {
                    setActiveTab(layanan.id);
                    setExpandedStep(null);
                  }}
                  className={cn(
                    "relative flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                    activeTab === layanan.id
                      ? "bg-green-600 text-white shadow-lg shadow-green-600/25 dark:bg-green-500 dark:shadow-green-500/20"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  )}
                  aria-label={`Layanan ${layanan.nama}`}
                >
                  {layanan.icon}
                  <span>{layanan.nama}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Overview + Toggle + Progress */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                {activeLayanan.overview}
              </p>
              <Button
                variant="outline"
                onClick={toggleDetail}
                className={cn(
                  "flex-shrink-0 gap-2 font-medium transition-all duration-300",
                  isDetailed
                    ? "border-green-600 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                    : "border-gray-300 text-gray-600 dark:text-gray-400 dark:border-gray-600"
                )}
              >
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isDetailed && "rotate-180")} />
                {isDetailed ? "Langkah Singkat" : "Langkah Detail"}
              </Button>
            </div>

            {/* Animated Progress Bar */}
            <div className="mt-4 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Kelengkapan Panduan
                </span>
                <span className="text-xs font-bold text-green-600 dark:text-green-400 tabular-nums">
                  {currentCompletion}%
                </span>
              </div>
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  key={activeTab}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentCompletion}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">
                {activeLayanan.steps.length} langkah • {activeLayanan.steps.reduce((a, s) => a + s.dokumen.length, 0)} dokumen
              </p>
            </div>
          </motion.div>

          {/* Steps Timeline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${isDetailed ? "detail" : "singkat"}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <div className="relative">
                {/* Vertical Timeline Line (Desktop) - animated */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 origin-top bg-gradient-to-b from-green-500 via-teal-400 to-green-500/10 dark:from-green-500 dark:via-teal-600 dark:to-green-800/10"
                />

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {activeLayanan.steps.map((step, idx) => {
                    const isExpanded = expandedStep === step.nomor;
                    const isLast = idx === activeLayanan.steps.length - 1;

                    return (
                      <motion.div
                        key={step.nomor}
                        custom={idx}
                        variants={stepVariants}
                        className="relative"
                      >
                        {/* Timeline connector for mobile */}
                        {!isLast && (
                          <motion.div
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                            className="md:hidden absolute left-5 top-12 bottom-0 w-0.5 origin-top bg-gradient-to-b from-green-300 to-green-100 dark:from-green-700 dark:to-green-900/30"
                          />
                        )}

                        <div className="flex gap-4 md:gap-6">
                          {/* Step Number Circle with pulsing glow ring */}
                          <div className="relative z-10 flex-shrink-0">
                            {/* Pulsing ring behind step dot */}
                            <motion.span
                              variants={pulseRing}
                              animate="animate"
                              className="absolute inset-0 w-10 h-10 md:w-16 md:h-16 rounded-full bg-green-400/30 dark:bg-green-500/20"
                            />
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className={cn(
                                "relative w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center text-sm md:text-lg font-bold shadow-sm transition-all duration-300",
                                isExpanded
                                  ? "bg-green-600 text-white shadow-green-600/30 shadow-lg"
                                  : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                              )}
                            >
                              {step.nomor}
                            </motion.div>
                          </div>

                          {/* Step Content - 3D tilt on hover */}
                          <motion.div
                            whileHover={{
                              y: -4,
                              rotateY: -2,
                              rotateX: 2,
                              transition: { duration: 0.25 },
                            }}
                            style={{ perspective: "800px" }}
                            className="flex-1"
                          >
                            <Card className={cn(
                              "border shadow-sm overflow-hidden transition-all duration-300",
                              isExpanded
                                ? "border-green-300 dark:border-green-700 shadow-lg shadow-green-500/10 dark:shadow-green-400/10"
                                : "border-gray-200 dark:border-gray-800 hover:shadow-md hover:border-green-200 dark:hover:border-green-800/50"
                            )}>
                              {/* Gradient accent line at top */}
                              <div className={cn(
                                "h-0.5 transition-colors duration-300",
                                isExpanded
                                  ? "bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500"
                                  : "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800"
                              )} />
                              <CardContent className="p-4 md:p-5">
                                {/* Step Header */}
                                <div
                                  className={cn(
                                    "flex items-start gap-3 cursor-pointer",
                                    isDetailed && "cursor-pointer"
                                  )}
                                  onClick={() => toggleStep(step.nomor)}
                                  role={isDetailed ? "button" : undefined}
                                  tabIndex={isDetailed ? 0 : undefined}
                                  onKeyDown={(e) => {
                                    if (isDetailed && (e.key === "Enter" || e.key === " ")) {
                                      e.preventDefault();
                                      toggleStep(step.nomor);
                                    }
                                  }}
                                  aria-expanded={isDetailed ? isExpanded : undefined}
                                >
                                  {/* Icon with pulsing glow ring */}
                                  <div className="relative">
                                    <motion.span
                                      variants={pulseRing}
                                      animate="animate"
                                      className="absolute inset-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-400/20 dark:bg-green-500/15"
                                    />
                                    <div className={cn(
                                      "relative w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                                      isExpanded
                                        ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                                    )}>
                                      {getStepIcon(idx)}
                                    </div>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="text-sm md:text-base font-semibold text-gray-900 dark:text-gray-100">
                                        {isDetailed ? step.judul : step.judulSingkat}
                                      </h4>
                                      {/* Estimasi Waktu badge with Clock */}
                                      <Badge className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 text-[10px] px-2 py-0.5 gap-1 font-medium">
                                        <Clock className="h-3 w-3" />
                                        {step.estimasiWaktu}
                                      </Badge>
                                      {/* Step category badge */}
                                      <Badge className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/40 text-[10px] px-2 py-0.5 font-medium hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                                        Langkah {step.nomor}/{activeLayanan.steps.length}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                                      {isDetailed ? step.deskripsi : step.deskripsiSingkat}
                                    </p>
                                  </div>

                                  {isDetailed && (
                                    <motion.div
                                      animate={{ rotate: isExpanded ? 180 : 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="flex-shrink-0 mt-1"
                                    >
                                      <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </motion.div>
                                  )}
                                </div>

                                {/* Expanded Detail (only in detailed mode) */}
                                <AnimatePresence>
                                  {isDetailed && isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3, ease: "easeInOut" }}
                                      className="overflow-hidden"
                                    >
                                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                                        {/* Tips/Warnings */}
                                        {step.tips.length > 0 && (
                                          <div>
                                            <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                              Tips & Peringatan
                                            </h5>
                                            <div className="space-y-2">
                                              {step.tips.map((tip, tipIdx) => (
                                                <TipCallout key={tipIdx} tip={tip} />
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* Document Checklist */}
                                        <div>
                                          <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <FileText className="h-3.5 w-3.5" />
                                            Anda Perlu
                                          </h5>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {step.dokumen.map((doc, docIdx) => (
                                              <motion.div
                                                key={docIdx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: docIdx * 0.05 }}
                                                className="flex items-center gap-2 p-2.5 rounded-lg bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30"
                                              >
                                                <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                                <span className="text-xs text-gray-700 dark:text-gray-300">{doc}</span>
                                              </motion.div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {/* Non-detailed mode: always show documents inline */}
                                {!isDetailed && (
                                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex flex-wrap gap-1.5">
                                      {step.dokumen.slice(0, 3).map((doc, docIdx) => (
                                        <Badge
                                          key={docIdx}
                                          variant="outline"
                                          className="text-[10px] px-2 py-0.5 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30 font-normal"
                                        >
                                          <CheckCircle className="h-2.5 w-2.5 mr-1" />
                                          {doc}
                                        </Badge>
                                      ))}
                                      {step.dokumen.length > 3 && (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] px-2 py-0.5 text-gray-500 dark:text-gray-400 font-normal"
                                        >
                                          +{step.dokumen.length - 3} lainnya
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Completion indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3 mt-8 pl-14"
                >
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-500/25">
                    <CheckCircle className="h-5 w-5 md:h-7 md:w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Selesai!
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Proses layanan {activeLayanan.nama} telah selesai. Jika ada pertanyaan, jangan ragu untuk menghubungi kami.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Floating Tips Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/60 dark:from-amber-900/10 dark:to-orange-900/5 border border-amber-200/80 dark:border-amber-800/30 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/20">
                  <Lightbulb className="h-4.5 w-4.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                    Tips Penting
                  </p>
                  <p className="text-xs text-amber-700/80 dark:text-amber-300/70 mt-1 leading-relaxed">
                    Datang di pagi hari (08:00-10:00 WITA) untuk menghindari antrian panjang.
                    Pastikan semua dokumen dalam kondisi asli (bukan fotokopi) dan data KK sudah sesuai sebelum ke kantor.
                    Bawa bolpen untuk mengisi formulir di lokasi.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Helpful note */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mt-6"
          >
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/10 border border-green-100 dark:border-green-800/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Butuh Bantuan?
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Jika Anda mengalami kendala dalam mengurus layanan, silakan hubungi kami melalui WhatsApp
                    atau datang langsung ke kantor Disdukcapil Kabupaten Ngada. Petugas kami siap membantu Anda.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Shimmer animation */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}
