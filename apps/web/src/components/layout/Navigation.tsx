import { NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', key: 'nav.home' },
  { to: '/services', key: 'nav.services' },
  { to: '/hse', key: 'nav.hse' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/contact', key: 'nav.contact' },
  { to: '/careers', key: 'nav.careers' },
] as const

export function Navigation() {
  const { t } = useTranslation()

  return (
    <nav
      aria-label={t('accessibility.mainNavigation', 'Main navigation')}
      className="hidden items-center gap-1 md:flex"
    >
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={({ isActive }) =>
            cn(
              'relative px-3 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'text-white'
                : 'text-white/60 hover:text-white',
            )
          }
        >
          {({ isActive }) => (
            <>
              {t(link.key)}
              {/* Active dot indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-jerash-orange" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
