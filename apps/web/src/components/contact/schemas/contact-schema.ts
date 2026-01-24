import { z } from 'zod'

/**
 * Contact form validation schema.
 * Error messages are translation keys, not translated strings.
 * This prevents frozen error messages when language changes.
 */
export const contactSchema = z.object({
  name: z.string().min(1, { message: 'validation.nameRequired' }),
  email: z.email({ message: 'validation.emailInvalid' }),
  phone: z.string().optional(),
  department: z.enum(['general', 'technical', 'careers', 'other']),
  message: z.string().min(10, { message: 'validation.messageTooShort' }),
})

export type ContactFormData = z.infer<typeof contactSchema>
