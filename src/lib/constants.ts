// Site Configuration for Disdukcapil Ngada
// Single source of truth for all site-wide constants

export const SITE_CONFIG = {
  name: "Disdukcapil Kabupaten Ngada",
  shortName: "Disdukcapil Ngada",
  description: "Dinas Kependudukan dan Pencatatan Sipil Kabupaten Ngada - Melayani Administrasi Kependudukan dengan Hati",
  url: "https://disdukcapil-ngada.vercel.app",
  logo: "/images/logo.svg",
};

export const CONTACT_INFO = {
  phone: "(0382) 21073",
  phoneRaw: "038221073",
  whatsapp: "6238221073",
  whatsappDisplay: "0822-2107-3",
  whatsappUrl: "https://wa.me/6238221073",
  email: "disdukcapil@ngadakab.go.id",
  address: "Jl. Ahmad Yani No.1, Bajawa, Kabupaten Ngada, NTT",
};

export const OPERATING_HOURS = {
  weekdays: {
    days: "Senin - Kamis",
    hours: "08.00 - 15.30 WITA",
    shortHours: "08.00 - 15.30",
  },
  friday: {
    days: "Jumat",
    hours: "08.00 - 16.00 WITA",
    shortHours: "08.00 - 16.00",
  },
  saturday: {
    days: "Sabtu",
    hours: "Tutup",
    shortHours: "Tutup",
  },
  sunday: {
    days: "Minggu",
    hours: "Tutup",
    shortHours: "Tutup",
  },
  fullText: "Senin - Kamis: 08.00 - 15.30 WITA, Jumat: 08.00 - 16.00 WITA",
};

export const SOCIAL_MEDIA = {
  facebook: "https://facebook.com/disdukcapilngada",
  instagram: "https://instagram.com/disdukcapilngada",
  twitter: "https://twitter.com/disdukcapilngada",
  tiktok: "https://tiktok.com/@disdukcapilngada",
  youtube: "https://youtube.com/@disdukcapilngada",
};

export const LOCATION = {
  name: "Kantor Disdukcapil Kabupaten Ngada",
  address: "Jl. Ahmad Yani No.1, Bajawa",
  regency: "Kabupaten Ngada, Nusa Tenggara Timur",
  postalCode: "86411",
  coordinates: { latitude: -8.8489, longitude: 121.0731 },
  googleMapsUrl: "https://maps.google.com/?q=-8.8489,121.0731",
};

export const LAYANAN_CATEGORIES = {
  "Pendaftaran Penduduk": {
    label: "Pendaftaran Penduduk",
    description: "KTP, KK, dan data penduduk",
    icon: "Users",
    color: "emerald",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
  },
  "Pencatatan Sipil": {
    label: "Pencatatan Sipil",
    description: "Akta nikah, cerai, kelahiran",
    icon: "Heart",
    color: "amber",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
} as const;
