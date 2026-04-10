// Types for Disdukcapil Ngada Portal

export interface Berita {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnail?: string;
  category: string;
  isPublished: boolean;
  authorId?: string;
  author?: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Layanan {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  requirements: string;
  procedures: string;
  forms?: string;
  faq?: string;
  processingTime?: string;
  fee?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pengaduan {
  id: string;
  name: string;
  nik?: string;
  email?: string;
  phone?: string;
  subject: string;
  message: string;
  status: "Baru" | "Diproses" | "Selesai";
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pengumuman {
  id: string;
  title: string;
  content: string;
  type: "Info" | "Urgent" | "Maintenance";
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dokumen {
  id: string;
  title: string;
  description?: string;
  category: "Peraturan" | "Laporan" | "SOP" | "Formulir";
  fileUrl: string;
  fileSize?: string;
  fileType?: string;
  downloadCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Statistik {
  id: string;
  label: string;
  value: string;
  icon?: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StrukturOrganisasi {
  id: string;
  name: string;
  position: string;
  photo?: string;
  description?: string;
  parentId?: string;
  parent?: StrukturOrganisasi;
  children?: StrukturOrganisasi[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VisiMisi {
  id: string;
  type: "visi" | "misi";
  content: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sejarah {
  id: string;
  year: string;
  title: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Kontak {
  id: string;
  type: string;
  value: string;
  label?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: string;
  username: string;
  name: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

// Form types
export interface PengaduanFormData {
  name: string;
  nik: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface SearchParams {
  q?: string;
  category?: string;
  page?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
