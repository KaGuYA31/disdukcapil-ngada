// Data Kependudukan Kabupaten Ngada
// Periode: Februari 2025
// Sumber: Disdukcapil Kabupaten Ngada

export const statistikUtama = {
  totalPenduduk: 171027,
  pendudukLakiLaki: 84471,
  pendudukPerempuan: 86556,
  rasioJenisKelamin: 97.59, // L per 100 P
  jumlahKelahiran: 795,
  angkaKelahiranKasar: 4.67, // per 1000
  jumlahKematian: 1560,
  angkaKematianKasar: 9.17, // per 1000
  pertumbuhanAlami: -765,
  lajuPertumbuhanAlami: -4.47, // per 1000
  jumlahPerkawinan: 1939,
  jumlahPerceraian: 339,
  cakupanAktaKelahiran: 48.65, // persen
  totalDisabilitas: 1810,
  periode: "Februari 2025",
  tanggalUpdate: "8 Maret 2025",
};

export const dataKecamatan = [
  { no: 1, nama: "BAJAWA", lakiLaki: 19925, perempuan: 20484, total: 40409, persentase: 23.63, rasioJK: 97.27 },
  { no: 2, nama: "GOLEWA", lakiLaki: 9701, perempuan: 9992, total: 19693, persentase: 11.51, rasioJK: 97.09 },
  { no: 3, nama: "RIUNG", lakiLaki: 8556, perempuan: 8614, total: 17170, persentase: 10.04, rasioJK: 99.33 },
  { no: 4, nama: "SOA", lakiLaki: 7278, perempuan: 7633, total: 14911, persentase: 8.72, rasioJK: 95.35 },
  { no: 5, nama: "GOLEWA SELATAN", lakiLaki: 6009, perempuan: 6339, total: 12348, persentase: 7.22, rasioJK: 94.79 },
  { no: 6, nama: "GOLEWA BARAT", lakiLaki: 5707, perempuan: 6023, total: 11730, persentase: 6.86, rasioJK: 94.75 },
  { no: 7, nama: "BAJAWA UTARA", lakiLaki: 5558, perempuan: 5519, total: 11077, persentase: 6.48, rasioJK: 100.71 },
  { no: 8, nama: "AIMERE", lakiLaki: 5449, perempuan: 5509, total: 10958, persentase: 6.41, rasioJK: 98.91 },
  { no: 9, nama: "RIUNG BARAT", lakiLaki: 5040, perempuan: 4776, total: 9816, persentase: 5.74, rasioJK: 105.53 },
  { no: 10, nama: "INERIE", lakiLaki: 4117, perempuan: 4329, total: 8446, persentase: 4.94, rasioJK: 95.10 },
  { no: 11, nama: "JEREBUU", lakiLaki: 3615, perempuan: 3841, total: 7456, persentase: 4.36, rasioJK: 94.12 },
  { no: 12, nama: "WOLOMEZE", lakiLaki: 3516, perempuan: 3497, total: 7013, persentase: 4.10, rasioJK: 100.54 },
];

export const dataAgama = [
  { no: 1, nama: "Katholik", lakiLaki: 77894, perempuan: 80021, total: 157915, persentase: 92.33 },
  { no: 2, nama: "Islam", lakiLaki: 5084, perempuan: 5127, total: 10211, persentase: 5.97 },
  { no: 3, nama: "Kristen", lakiLaki: 1437, perempuan: 1363, total: 2800, persentase: 1.64 },
  { no: 4, nama: "Hindu", lakiLaki: 54, perempuan: 44, total: 98, persentase: 0.06 },
  { no: 5, nama: "Kepercayaan", lakiLaki: 1, perempuan: 1, total: 2, persentase: 0.001 },
  { no: 6, nama: "Buddha", lakiLaki: 1, perempuan: 0, total: 1, persentase: 0.001 },
];

export const dataPendidikan = [
  { no: 1, tingkat: "Tamat SD/Sederajat", lakiLaki: 23272, perempuan: 24819, total: 48091, persentase: 28.12 },
  { no: 2, tingkat: "SLTA/Sederajat", lakiLaki: 22811, perempuan: 23327, total: 46138, persentase: 26.98 },
  { no: 3, tingkat: "Belum Tamat SD/Sederajat", lakiLaki: 11994, perempuan: 10727, total: 22721, persentase: 13.29 },
  { no: 4, tingkat: "SLTP/Sederajat", lakiLaki: 10678, perempuan: 8879, total: 19557, persentase: 11.44 },
  { no: 5, tingkat: "Tidak/Belum Sekolah", lakiLaki: 9869, perempuan: 9270, total: 19139, persentase: 11.19 },
  { no: 6, tingkat: "Diploma IV/Strata I", lakiLaki: 4683, perempuan: 7119, total: 11802, persentase: 6.90 },
  { no: 7, tingkat: "Akademi/Diploma III/S. Muda", lakiLaki: 751, perempuan: 1848, total: 2599, persentase: 1.52 },
  { no: 8, tingkat: "Diploma I/II", lakiLaki: 241, perempuan: 444, total: 685, persentase: 0.40 },
  { no: 9, tingkat: "Strata II", lakiLaki: 164, perempuan: 120, total: 284, persentase: 0.17 },
  { no: 10, tingkat: "Strata III", lakiLaki: 8, perempuan: 3, total: 11, persentase: 0.01 },
];

export const dataPekerjaan = [
  { no: 1, jenis: "Petani/Pekebun", lakiLaki: 37658, perempuan: 35764, total: 73422, persentase: 42.93 },
  { no: 2, jenis: "Pelajar/Mahasiswa", lakiLaki: 23881, perempuan: 25030, total: 48911, persentase: 28.60 },
  { no: 3, jenis: "Belum/Tidak Bekerja", lakiLaki: 10320, perempuan: 10054, total: 20374, persentase: 11.91 },
  { no: 4, jenis: "Mengurus Rumah Tangga", lakiLaki: 1, perempuan: 6158, total: 6159, persentase: 3.60 },
  { no: 5, jenis: "Wiraswasta", lakiLaki: 3397, perempuan: 1084, total: 4481, persentase: 2.62 },
  { no: 6, jenis: "Guru", lakiLaki: 976, perempuan: 2375, total: 3351, persentase: 1.96 },
  { no: 7, jenis: "Karyawan Swasta", lakiLaki: 1643, perempuan: 1267, total: 2910, persentase: 1.70 },
  { no: 8, jenis: "Pegawai Negeri Sipil", lakiLaki: 1177, perempuan: 1615, total: 2792, persentase: 1.63 },
  { no: 9, jenis: "Karyawan Honorer", lakiLaki: 861, perempuan: 1194, total: 2055, persentase: 1.20 },
  { no: 10, jenis: "Pensiunan", lakiLaki: 1085, perempuan: 483, total: 1568, persentase: 0.92 },
  { no: 11, jenis: "Sopir", lakiLaki: 1094, perempuan: 0, total: 1094, persentase: 0.64 },
  { no: 12, jenis: "Nelayan/Perikanan", lakiLaki: 947, perempuan: 39, total: 986, persentase: 0.58 },
];

export const dataDisabilitas = [
  { no: 1, jenis: "Disabilitas Mental/Jiwa", lakiLaki: 538, perempuan: 354, total: 892, persentase: 49.28 },
  { no: 2, jenis: "Disabilitas Fisik", lakiLaki: 249, perempuan: 206, total: 455, persentase: 25.14 },
  { no: 3, jenis: "Disabilitas Rungu/Wicara", lakiLaki: 101, perempuan: 113, total: 214, persentase: 11.82 },
  { no: 4, jenis: "Disabilitas Netra/Buta", lakiLaki: 54, perempuan: 47, total: 101, persentase: 5.58 },
  { no: 5, jenis: "Disabilitas Fisik dan Mental", lakiLaki: 51, perempuan: 46, total: 97, persentase: 5.36 },
  { no: 6, jenis: "Disabilitas Lainnya", lakiLaki: 28, perempuan: 23, total: 51, persentase: 2.82 },
];
