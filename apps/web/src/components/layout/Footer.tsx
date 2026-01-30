import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { MapPin, Phone, Mail } from 'lucide-react'
import { Container } from './Container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const navLinks = [
  { to: '/', key: 'nav.home' },
  { to: '/services', key: 'nav.services' },
  { to: '/hse', key: 'nav.hse' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/contact', key: 'nav.contact' },
  { to: '/careers', key: 'nav.careers' },
] as const

const officeKeys = ['basrah', 'erbil', 'baghdad'] as const

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer id="footer" className="bg-muted/30 border-t">
      <Container>
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-jerash-blue">{t('footer.aboutTitle')}</h3>
            <div className="flex items-center gap-2">
              <img
                src="/Jerash-logo-color.png"
                alt={t('common.siteName')}
                className="h-8 w-auto"
              />
              <span className="font-bold">{t('common.siteName')}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.aboutText')}
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-jerash-blue">{t('footer.quickLinks')}</h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-muted-foreground hover:text-jerash-orange transition-colors"
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Offices Section with Tabs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-jerash-blue">{t('footer.officesTitle')}</h3>
            <Tabs defaultValue="basrah" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                {officeKeys.map((office) => (
                  <TabsTrigger key={office} value={office} className="text-xs">
                    {t(`footer.offices.${office}.name`)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {officeKeys.map((office) => (
                <TabsContent key={office} value={office} className="mt-4 space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-jerash-orange" />
                    <span className="text-muted-foreground">
                      {t(`footer.offices.${office}.address`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 shrink-0 text-jerash-orange" />
                    <a
                      href={`tel:${t(`footer.offices.${office}.phone`)}`}
                      className="text-muted-foreground hover:text-jerash-orange transition-colors"
                    >
                      {t(`footer.offices.${office}.phone`)}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 shrink-0 text-jerash-orange" />
                    <a
                      href={`mailto:${t(`footer.offices.${office}.email`)}`}
                      className="text-muted-foreground hover:text-jerash-orange transition-colors"
                    >
                      {t(`footer.offices.${office}.email`)}
                    </a>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Postal Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-jerash-blue">{t('footer.subscriber')}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>{t('footer.poBox')}</p>
              <p>{t('footer.postOffice')}</p>
            </div>
          </div>
        </div>

        {/* Copyright Row */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-jerash-orange/30 to-transparent" />
        <div className="py-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear}{' '}
            <span className="text-jerash-blue font-medium">{t('common.siteName')}</span>.{' '}
            {t('common.allRightsReserved')}
          </p>
        </div>
      </Container>
    </footer>
  )
}
