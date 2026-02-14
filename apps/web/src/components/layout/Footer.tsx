import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Mail } from 'lucide-react'
import { Container } from './Container'

const navLinks = [
  { to: '/', key: 'nav.home' },
  { to: '/services', key: 'nav.services' },
  { to: '/hse', key: 'nav.hse' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/contact', key: 'nav.contact' },
  { to: '/careers', key: 'nav.careers' },
] as const

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer id="footer" className="border-t border-white/5">
      <Container>
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-3">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/Jerash-logo-color.png"
                alt={t('common.siteName')}
                className="h-8 w-auto"
              />
              <span className="font-bold text-white">{t('common.siteName')}</span>
            </div>
            <p className="text-sm leading-relaxed text-white/50">
              {t('footer.aboutText')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-jerash-orange">{t('footer.quickLinks')}</h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-white/50 transition-colors hover:text-jerash-orange"
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-jerash-orange">{t('footer.contactTitle')}</h3>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 shrink-0 text-jerash-orange" />
              <a
                href={`mailto:${t('footer.email')}`}
                className="text-white/50 transition-colors hover:text-jerash-orange"
              >
                {t('footer.email')}
              </a>
            </div>
            <div className="space-y-1 text-sm text-white/50">
              <p>{t('footer.poBox')}</p>
              <p>{t('footer.postOffice')}</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-jerash-orange/30 to-transparent" />
        <div className="py-6 text-center">
          <p className="text-sm text-white/50">
            &copy; {currentYear}{' '}
            <span className="font-medium text-white">{t('common.siteName')}</span>.{' '}
            {t('common.allRightsReserved')}
          </p>
        </div>
      </Container>
    </footer>
  )
}
