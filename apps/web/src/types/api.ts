// API Response wrapper (matches backend)
export interface ApiResponse<T> {
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

// Entity types matching API responses
export interface HeroSlide {
  id: string
  imageUrl: string
  titleEn: string
  titleAr: string
  subtitleEn: string | null
  subtitleAr: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ServiceCategory {
  id: string
  slug: string
  nameEn: string
  nameAr: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  services: Service[]
}

export interface Service {
  id: string
  slug: string
  categoryId: string
  icon: string // Lucide icon name as string
  titleEn: string
  titleAr: string
  shortDescriptionEn: string
  shortDescriptionAr: string
  descriptionEn: string
  descriptionAr: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Partner {
  id: string
  slug: string
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  logoUrl: string
  website: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface JointVenture {
  id: string
  slug: string
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  logoUrl: string
  website: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface GalleryImage {
  id: string
  imageUrl: string
  thumbnailUrl: string | null
  altEn: string
  altAr: string
  width: number
  height: number
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Job {
  id: string
  slug: string
  titleEn: string
  titleAr: string
  departmentEn: string
  departmentAr: string
  locationEn: string
  locationAr: string
  typeEn: string
  typeAr: string
  descriptionEn: string
  descriptionAr: string
  fullDescriptionEn: string
  fullDescriptionAr: string
  isActive: boolean
  publishedAt: string | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Office {
  id: string
  slug: string
  nameEn: string
  nameAr: string
  addressEn: string
  addressAr: string
  phone: string
  phoneDisplay: string
  email: string
  hoursEn: string
  hoursAr: string
  latitude: number
  longitude: number
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SiteSetting {
  id: string
  key: string
  value: string
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON'
  groupName: string
}

// Form submission types
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  department: string
  message: string
}

export interface ApplicationFormData {
  name: string
  email: string
  phone: string
  jobId?: string
  cv: File
}
