import { useTranslation } from 'react-i18next'

/**
 * Hook to resolve bilingual fields based on current language
 * Usage: const { resolve } = useBilingual()
 *        resolve(item.titleEn, item.titleAr)
 */
export function useBilingual() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const resolve = <T>(en: T, ar: T): T => {
    return isArabic ? ar : en
  }

  return { resolve, isArabic, language: i18n.language }
}
