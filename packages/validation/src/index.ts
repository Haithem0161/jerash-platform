import { z } from 'zod'

// ============ Auth Schemas ============

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const userCreateSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER']).optional(),
})

export const userUpdateSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER']).optional(),
  isActive: z.boolean().optional(),
})

// ============ Hero Slide Schemas ============

export const heroSlideSchema = z.object({
  imageUrl: z.string().url('Invalid image URL'),
  titleEn: z.string().min(1, 'English title is required'),
  titleAr: z.string().min(1, 'Arabic title is required'),
  subtitleEn: z.string().optional(),
  subtitleAr: z.string().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export const heroSlideUpdateSchema = heroSlideSchema.partial()

// ============ Partner Schemas ============

export const partnerSchema = z.object({
  nameEn: z.string().min(1, 'English name is required').max(200),
  nameAr: z.string().min(1, 'Arabic name is required').max(200),
  descriptionEn: z.string().min(10, 'English description must be at least 10 characters'),
  descriptionAr: z.string().min(10, 'Arabic description must be at least 10 characters'),
  logoUrl: z.string().url('Invalid logo URL'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export const partnerUpdateSchema = partnerSchema.partial()

// ============ Joint Venture Schemas ============

export const jointVentureSchema = partnerSchema
export const jointVentureUpdateSchema = partnerUpdateSchema

// ============ Office Schemas ============

export const officeSchema = z.object({
  nameEn: z.string().min(1, 'English name is required'),
  nameAr: z.string().min(1, 'Arabic name is required'),
  addressEn: z.string().min(1, 'English address is required'),
  addressAr: z.string().min(1, 'Arabic address is required'),
  phone: z.string().min(1, 'Phone number is required'),
  phoneDisplay: z.string().min(1, 'Display phone number is required'),
  email: z.string().email('Invalid email address'),
  hoursEn: z.string().min(1, 'English hours is required'),
  hoursAr: z.string().min(1, 'Arabic hours is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export const officeUpdateSchema = officeSchema.partial()

// ============ Service Category Schemas ============

export const serviceCategorySchema = z.object({
  nameEn: z.string().min(1, 'English name is required'),
  nameAr: z.string().min(1, 'Arabic name is required'),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export const serviceCategoryUpdateSchema = serviceCategorySchema.partial()

// ============ Service Schemas ============

export const serviceSchema = z.object({
  categoryId: z.string().cuid('Invalid category ID'),
  icon: z.string().min(1, 'Icon is required'),
  titleEn: z.string().min(1, 'English title is required'),
  titleAr: z.string().min(1, 'Arabic title is required'),
  shortDescriptionEn: z.string().min(10, 'English short description must be at least 10 characters'),
  shortDescriptionAr: z.string().min(10, 'Arabic short description must be at least 10 characters'),
  descriptionEn: z.string().min(20, 'English description must be at least 20 characters'),
  descriptionAr: z.string().min(20, 'Arabic description must be at least 20 characters'),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export const serviceUpdateSchema = serviceSchema.partial()

// ============ Gallery Image Schemas ============

export const galleryImageSchema = z.object({
  imageUrl: z.string().url('Invalid image URL'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional(),
  altEn: z.string().min(1, 'English alt text is required'),
  altAr: z.string().min(1, 'Arabic alt text is required'),
  width: z.number().int().positive('Width must be positive'),
  height: z.number().int().positive('Height must be positive'),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export const galleryImageUpdateSchema = galleryImageSchema.partial()

// ============ Job Schemas ============

export const jobSchema = z.object({
  titleEn: z.string().min(1, 'English title is required'),
  titleAr: z.string().min(1, 'Arabic title is required'),
  departmentEn: z.string().min(1, 'English department is required'),
  departmentAr: z.string().min(1, 'Arabic department is required'),
  locationEn: z.string().min(1, 'English location is required'),
  locationAr: z.string().min(1, 'Arabic location is required'),
  typeEn: z.string().min(1, 'English type is required'),
  typeAr: z.string().min(1, 'Arabic type is required'),
  descriptionEn: z.string().min(10, 'English description must be at least 10 characters'),
  descriptionAr: z.string().min(10, 'Arabic description must be at least 10 characters'),
  fullDescriptionEn: z.string().min(20, 'English full description must be at least 20 characters'),
  fullDescriptionAr: z.string().min(20, 'Arabic full description must be at least 20 characters'),
  isActive: z.boolean().optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
})

export const jobUpdateSchema = jobSchema.partial()

// ============ Contact Form Schemas ============

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  department: z.enum(['general', 'technical', 'careers', 'other']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export const contactSubmissionUpdateSchema = z.object({
  status: z.enum(['NEW', 'READ', 'RESPONDED', 'ARCHIVED']).optional(),
  notes: z.string().optional(),
})

// ============ Job Application Schemas ============

export const jobApplicationFormSchema = z.object({
  jobId: z.string().cuid('Invalid job ID').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
})

export const jobApplicationUpdateSchema = z.object({
  status: z.enum(['NEW', 'REVIEWING', 'SHORTLISTED', 'INTERVIEWED', 'REJECTED', 'HIRED', 'ARCHIVED']).optional(),
  notes: z.string().optional(),
})

// ============ Site Setting Schemas ============

export const siteSettingUpdateSchema = z.object({
  value: z.string(),
})

// ============ Media Schemas ============

export const mediaUpdateSchema = z.object({
  altEn: z.string().optional(),
  altAr: z.string().optional(),
  folder: z.string().optional(),
})

// ============ Reorder Schema ============

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number().int().min(0),
    })
  ),
})

// ============ Pagination Schemas ============

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

// Export types inferred from schemas
export type LoginInput = z.infer<typeof loginSchema>
export type UserCreateInput = z.infer<typeof userCreateSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
export type HeroSlideInput = z.infer<typeof heroSlideSchema>
export type PartnerInput = z.infer<typeof partnerSchema>
export type JointVentureInput = z.infer<typeof jointVentureSchema>
export type OfficeInput = z.infer<typeof officeSchema>
export type ServiceCategoryInput = z.infer<typeof serviceCategorySchema>
export type ServiceInput = z.infer<typeof serviceSchema>
export type GalleryImageInput = z.infer<typeof galleryImageSchema>
export type JobInput = z.infer<typeof jobSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
export type JobApplicationInput = z.infer<typeof jobApplicationFormSchema>
export type ReorderInput = z.infer<typeof reorderSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
