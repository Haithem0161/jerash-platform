import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { contactSchema, type ContactFormData } from './schemas/contact-schema'
import { useSubmitContact } from '@/hooks/api'

/**
 * Contact inquiry form with validation and API submission.
 * Error messages are translation keys that get translated in the component
 * to ensure they update when the language changes.
 */
export function ContactForm() {
  const { t } = useTranslation('contact')
  const [showSuccess, setShowSuccess] = useState(false)
  const submitContact = useSubmitContact()

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      department: 'general',
      message: '',
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContact.mutateAsync(data)

      // Show success message
      setShowSuccess(true)

      // Reset form after showing success
      form.reset()
    } catch (error) {
      // Error is handled by the mutation, but we can log it
      console.error('Contact form submission failed:', error)
    }
  }

  const departments = ['general', 'technical', 'careers', 'other'] as const

  return (
    <AnimatePresence mode="wait">
      {!showSuccess ? (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Error Alert */}
              {submitContact.isError && (
                <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{t('error.submission')}</span>
                </div>
              )}

              {/* Row 1: Name + Email */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-jerash-blue">{t('form.name')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('form.namePlaceholder')}
                          className="focus-visible:ring-jerash-orange"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>
                          {t(`validation.${fieldState.error.message?.split('.')[1]}`)}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-jerash-blue">{t('form.email')}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t('form.emailPlaceholder')}
                          className="focus-visible:ring-jerash-orange"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>
                          {t(`validation.${fieldState.error.message?.split('.')[1]}`)}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2: Department + Phone */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Department Field */}
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-jerash-blue">{t('form.department')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full focus:ring-jerash-orange">
                            <SelectValue
                              placeholder={t('form.departmentPlaceholder')}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {t(`form.departments.${dept}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Phone Field (Optional) */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-jerash-blue">{t('form.phone')}</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder={t('form.phonePlaceholder')}
                          className="focus-visible:ring-jerash-orange"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Message Field - Full Width */}
              <FormField
                control={form.control}
                name="message"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-jerash-blue">{t('form.message')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('form.messagePlaceholder')}
                        className="min-h-32 resize-none focus-visible:ring-jerash-orange"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>
                        {t(`validation.${fieldState.error.message?.split('.')[1]}`)}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-jerash-orange hover:bg-jerash-orange/90"
                disabled={isSubmitting || submitContact.isPending}
              >
                {(isSubmitting || submitContact.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('form.submitting')}
                  </>
                ) : (
                  t('form.submit')
                )}
              </Button>
            </form>
          </Form>
        </motion.div>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <CheckCircle className="mb-4 h-16 w-16 text-jerash-orange" />
          <h3 className="mb-2 text-xl font-semibold text-jerash-blue">{t('success.title')}</h3>
          <p className="text-muted-foreground">{t('success.message')}</p>
          <Button
            variant="outline"
            className="mt-6 border-jerash-orange text-jerash-orange hover:bg-jerash-orange hover:text-white"
            onClick={() => setShowSuccess(false)}
          >
            {t('form.submit')}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
