import { z } from 'zod'

// Constants for file validation
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png',
]

export const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']

// CV Upload Form Schema
// Uses translation keys for error messages (not translated strings)
// to support language switching
export const cvUploadSchema = z.object({
  name: z.string().min(1, { message: 'validation.nameRequired' }),
  email: z.string().email({ message: 'validation.emailInvalid' }),
  phone: z.string().min(1, { message: 'validation.phoneRequired' }),
  cv: z
    .instanceof(File, { message: 'validation.fileRequired' })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'validation.fileTooLarge',
    })
    .refine((file) => ACCEPTED_TYPES.includes(file.type), {
      message: 'validation.fileInvalidType',
    })
    .refine(
      (file) => {
        const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
        return ACCEPTED_EXTENSIONS.includes(ext)
      },
      {
        message: 'validation.fileInvalidExtension',
      }
    ),
})

export type CVUploadFormData = z.infer<typeof cvUploadSchema>
