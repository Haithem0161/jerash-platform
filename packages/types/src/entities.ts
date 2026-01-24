// Content Entity Types

// Base type with common fields
interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

interface OrderableEntity {
  order: number
  isActive: boolean
}

// Hero Slides
export interface HeroSlide extends BaseEntity, OrderableEntity {
  imageUrl: string
  titleEn: string
  titleAr: string
  subtitleEn: string | null
  subtitleAr: string | null
}

export interface HeroSlidePublic {
  id: string
  imageUrl: string
  title: string
  subtitle: string | null
  order: number
}

export interface HeroSlideFormData {
  imageUrl: string
  titleEn: string
  titleAr: string
  subtitleEn?: string
  subtitleAr?: string
  order?: number
  isActive?: boolean
}

// Site Settings
export type SettingType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON'

export interface SiteSetting {
  id: string
  key: string
  value: string
  type: SettingType
  groupName: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface SiteSettingUpdate {
  value: string
}

// Partners
export interface Partner extends BaseEntity, OrderableEntity {
  slug: string
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  logoUrl: string
  website: string | null
}

export interface PartnerPublic {
  id: string
  slug: string
  name: string
  description: string
  logo: string
  website: string | null
}

export interface PartnerFormData {
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  logoUrl: string
  website?: string
  order?: number
  isActive?: boolean
}

// Joint Ventures (same structure as Partner)
export interface JointVenture extends BaseEntity, OrderableEntity {
  slug: string
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  logoUrl: string
  website: string | null
}

export interface JointVenturePublic {
  id: string
  slug: string
  name: string
  description: string
  logo: string
  website: string | null
}

export interface JointVentureFormData {
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  logoUrl: string
  website?: string
  order?: number
  isActive?: boolean
}

// Offices
export interface Office extends BaseEntity, OrderableEntity {
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
}

export interface OfficePublic {
  id: string
  slug: string
  name: string
  address: string
  phone: string
  phoneDisplay: string
  email: string
  hours: string
  latitude: number
  longitude: number
}

export interface OfficeFormData {
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
  order?: number
  isActive?: boolean
}

// Service Categories
export interface ServiceCategory extends BaseEntity {
  slug: string
  nameEn: string
  nameAr: string
  order: number
  isActive: boolean
}

export interface ServiceCategoryPublic {
  id: string
  slug: string
  name: string
}

export interface ServiceCategoryFormData {
  nameEn: string
  nameAr: string
  order?: number
  isActive?: boolean
}

// Services
export interface Service extends BaseEntity, OrderableEntity {
  slug: string
  categoryId: string
  icon: string
  titleEn: string
  titleAr: string
  shortDescriptionEn: string
  shortDescriptionAr: string
  descriptionEn: string
  descriptionAr: string
  category?: ServiceCategory
}

export interface ServicePublic {
  id: string
  slug: string
  icon: string
  title: string
  shortDescription: string
  description: string
  category: ServiceCategoryPublic
}

export interface ServiceFormData {
  categoryId: string
  icon: string
  titleEn: string
  titleAr: string
  shortDescriptionEn: string
  shortDescriptionAr: string
  descriptionEn: string
  descriptionAr: string
  order?: number
  isActive?: boolean
}

// Gallery Images
export interface GalleryImage extends BaseEntity, OrderableEntity {
  imageUrl: string
  thumbnailUrl: string | null
  altEn: string
  altAr: string
  width: number
  height: number
}

export interface GalleryImagePublic {
  id: string
  src: string
  thumbnail: string | null
  alt: string
  width: number
  height: number
}

export interface GalleryImageFormData {
  imageUrl: string
  thumbnailUrl?: string
  altEn: string
  altAr: string
  width: number
  height: number
  order?: number
  isActive?: boolean
}

// Jobs
export interface Job extends BaseEntity {
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
}

export interface JobPublic {
  id: string
  slug: string
  title: string
  department: string
  location: string
  type: string
  description: string
  fullDescription: string
}

export interface JobFormData {
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
  isActive?: boolean
  publishedAt?: string
  expiresAt?: string
}

// Media Files
export interface MediaFile extends BaseEntity {
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  thumbnailUrl: string | null
  width: number | null
  height: number | null
  folder: string
  altEn: string | null
  altAr: string | null
}

export interface MediaFileFormData {
  altEn?: string
  altAr?: string
  folder?: string
}

// Audit Logs
export interface AuditLog {
  id: string
  userId: string | null
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  entityType: string
  entityId: string
  oldValue: Record<string, unknown> | null
  newValue: Record<string, unknown> | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}
