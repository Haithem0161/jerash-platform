import { HelmetProvider } from 'react-helmet-async'
import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from './ThemeProvider'
import { I18nProvider } from './I18nProvider'
import { SmoothScrollProvider } from './SmoothScrollProvider'
import { MotionProvider } from '@/components/animations'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <MotionProvider>
      <HelmetProvider>
        <QueryProvider>
          <ThemeProvider>
            <I18nProvider>
              {/* Lenis disabled temporarily to test GSAP pin jump */}
              {children}
            </I18nProvider>
          </ThemeProvider>
        </QueryProvider>
      </HelmetProvider>
    </MotionProvider>
  )
}
