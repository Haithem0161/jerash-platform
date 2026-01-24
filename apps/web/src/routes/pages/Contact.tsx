import { useTranslation } from 'react-i18next'
import { Phone, Mail } from 'lucide-react'

import { SEO } from '@/components/common/SEO'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/animations/FadeIn'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ContactForm, OfficeLocations } from '@/components/contact'

/**
 * Office data for quick contact sidebar.
 * Uses E.164 format for phone links.
 */
const offices = [
  {
    id: 'basrah',
    phone: '+964XXXXXXXXXX',
    phoneDisplay: '+964 XXX XXX XXXX',
    email: 'basrah@jerash.com',
  },
  {
    id: 'erbil',
    phone: '+964XXXXXXXXXX',
    phoneDisplay: '+964 XXX XXX XXXX',
    email: 'erbil@jerash.com',
  },
  {
    id: 'baghdad',
    phone: '+964XXXXXXXXXX',
    phoneDisplay: '+964 XXX XXX XXXX',
    email: 'baghdad@jerash.com',
  },
]

/**
 * Contact page with inquiry form and office locations.
 * Layout: Two-column grid (form left, quick contact right) + tabbed offices below.
 */
export function ContactPage() {
  const { t } = useTranslation('contact')

  return (
    <>
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        url="/contact"
        image="/Jerash-logo-color.png"
      />

      {/* Page Header */}
      <Section className="pb-8 pt-16 md:pb-12 md:pt-20">
        <FadeIn className="text-center">
          <h1 className="text-3xl font-bold text-jerash-blue md:text-4xl lg:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {t('description')}
          </p>
        </FadeIn>
      </Section>

      {/* Form + Quick Contact Grid */}
      <Section className="py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
          {/* Left: Contact Form */}
          <FadeIn direction="left">
            <Card>
              <CardHeader>
                <CardTitle className="text-jerash-blue">{t('form.title')}</CardTitle>
                <CardDescription>{t('form.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </FadeIn>

          {/* Right: Quick Contact Sidebar */}
          <FadeIn direction="right">
            <Card>
              <CardHeader>
                <CardTitle className="text-jerash-blue">{t('quickContact.title')}</CardTitle>
                <CardDescription>{t('quickContact.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {offices.map((office) => (
                  <div key={office.id} className="space-y-2">
                    <h4 className="font-semibold text-jerash-blue">
                      {t(`offices.${office.id}.name`)}
                    </h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-jerash-orange" />
                      <a
                        href={`tel:${office.phone}`}
                        className="text-muted-foreground hover:text-jerash-orange transition-colors"
                      >
                        {office.phoneDisplay}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-jerash-orange" />
                      <a
                        href={`mailto:${office.email}`}
                        className="text-muted-foreground hover:text-jerash-orange transition-colors"
                      >
                        {office.email}
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </Section>

      {/* Office Locations with Tabs */}
      <Section className="py-8 md:py-12">
        <Container>
          <FadeIn>
            <OfficeLocations />
          </FadeIn>
        </Container>
      </Section>
    </>
  )
}

export default ContactPage
