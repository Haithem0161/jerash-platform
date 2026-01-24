import { Suspense } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'

interface I18nProviderProps {
  children: React.ReactNode
}

// Direction management is handled by:
// 1. i18n.ts - on languageChanged and initialized events
// 2. RootLayout - useLayoutEffect for navigation safety

export function I18nProvider({ children }: I18nProviderProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
        {children}
      </Suspense>
    </I18nextProvider>
  )
}
