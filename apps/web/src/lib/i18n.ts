import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'

export const supportedLanguages = ['en', 'ar'] as const
export type SupportedLanguage = (typeof supportedLanguages)[number]

export const defaultLanguage: SupportedLanguage = 'en'

// RTL languages
export const rtlLanguages: SupportedLanguage[] = ['ar']

export const isRTL = (lang: string): boolean => {
  return rtlLanguages.includes(lang as SupportedLanguage)
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../locales/${language}/${namespace}.json`)
    )
  )
  .init({
    fallbackLng: defaultLanguage,
    supportedLngs: supportedLanguages,
    defaultNS: 'common',
    ns: ['common', 'services', 'hse', 'partners', 'careers', 'contact', 'gallery'],

    interpolation: {
      escapeValue: false, // React already escapes
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    react: {
      useSuspense: true,
    },
  })

/**
 * Update document direction and lang attributes.
 * Called on language change and initial load.
 */
function updateDocumentDirection(lng: string) {
  const dir = isRTL(lng) ? 'rtl' : 'ltr'
  document.documentElement.dir = dir
  document.documentElement.lang = lng
}

// Update document direction on language change
i18n.on('languageChanged', updateDocumentDirection)

// Set initial direction after i18n initializes
// This handles the case where language is detected from localStorage on first load
i18n.on('initialized', () => {
  updateDocumentDirection(i18n.language)
})

// Also set immediately if already initialized (for HMR/hot reload)
if (i18n.isInitialized) {
  updateDocumentDirection(i18n.language)
}

export default i18n
