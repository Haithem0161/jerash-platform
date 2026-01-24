import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Navigation } from './Navigation'
import { MobileMenu } from './MobileMenu'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { cn } from '@/lib/utils'

export function Header() {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Direction is managed at the document level by RootLayout via useLayoutEffect
  // so we don't need a key to force re-render on language change
  return (
    <div
      className={cn(
        'fixed top-0 inset-x-0 z-50 flex justify-center transition-all duration-300',
        isScrolled ? 'px-4' : 'px-0'
      )}
    >
      <header
        className={cn(
          'w-full backdrop-blur transition-all duration-300',
          isScrolled
            ? 'mt-3 max-w-6xl rounded-2xl border bg-background/70 shadow-lg'
            : 'max-w-full border-b bg-background/50'
        )}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/Jerash-logo-color.png"
                alt={t('common.siteName', 'Jerash')}
                className="h-10 w-auto"
              />
            </Link>

            {/* Navigation - Desktop */}
            <Navigation />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <MobileMenu />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
