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
    <nav aria-label={t('accessibility.mainNavigation', 'Main navigation')} className="hidden md:flex items-center gap-6">
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={({ isActive }) =>
            cn(
              'relative text-sm font-medium transition-colors hover:text-jerash-blue',
              // Underline pseudo-element styles
              'after:absolute after:-bottom-0.5 after:start-0',
              'after:h-px after:bg-jerash-orange',
              'after:transition-all after:duration-300',
              // Hover and active state for underline
              isActive
                ? 'text-jerash-blue after:w-full'
                : 'after:w-0 hover:after:w-full'
            )
          }
        >
          {t(link.key)}
        </NavLink>
      ))}
    </nav>
  )
}
