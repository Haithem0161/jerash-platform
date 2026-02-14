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
      setIsScrolled(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <header
        className={cn(
          'rounded-full transition-all duration-500 ease-out',
          isScrolled
            ? 'max-w-2xl border border-white/15 bg-white/8 shadow-2xl backdrop-blur-xl'
            : 'max-w-3xl border border-white/10 bg-white/5 backdrop-blur-sm',
        )}
      >
        <div className="flex items-center gap-1 px-3 py-2 sm:px-5">
          {/* Logo - only visible when scrolled */}
          <Link
            to="/"
            className={cn(
              'flex shrink-0 items-center transition-all duration-500',
              isScrolled
                ? 'me-2 w-auto scale-100 opacity-100'
                : 'w-0 scale-75 overflow-hidden opacity-0',
            )}
          >
            <img
              src="/Jerash-logo-color.png"
              alt={t('common.siteName', 'Jerash')}
              className="h-7 w-auto"
            />
          </Link>

          {/* Navigation - Desktop */}
          <Navigation />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <MobileMenu />
            <LanguageSwitcher />
          </div>
        </div>
      </header>
    </div>
  )
}
