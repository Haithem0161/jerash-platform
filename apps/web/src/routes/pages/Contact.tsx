import { useTranslation } from 'react-i18next'
import { Phone, Mail } from 'lucide-react'

import { SEO } from '@/components/common/SEO'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/animations/FadeIn'
import { TextReveal } from '@/components/animations/TextReveal'
import { ParallaxImage } from '@/components/animations/ParallaxImage'
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
 * Contact page with parallax hero, inquiry form, and office locations.
 * Layout: Hero → Two-column grid (form left, quick contact right) → tabbed offices below.
 */
export function ContactPage() {
  const { t } = useTranslation('contact')
  const { t: tCommon } = useTranslation()

  return (
    <>
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        url="/contact"
        image="/Jerash-logo-color.png"
      />

      {/* Hero section */}
      <Section
        fullWidth
        className="relative flex min-h-[60vh] items-center overflow-hidden p-0"
      >
        {/* Parallax background */}
        <div className="absolute inset-0">
          <ParallaxImage
            src="/cta.jpg"
            alt=""
            speed={0.15}
            className="h-full w-full"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[oklch(0.08_0.02_250)] via-black/60 to-black/40" />

        {/* Subtle gradient mesh accent */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 80%, oklch(0.40 0.12 250 / 15%) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 60%, oklch(0.65 0.20 50 / 10%) 0%, transparent 40%)
            `,
          }}
        />

        <Container className="relative z-10 py-24">
          <FadeIn>
            <span className="mb-6 inline-block rounded-full border border-jerash-orange/20 bg-jerash-orange/10 px-4 py-1.5 text-sm font-medium text-jerash-orange">
              {tCommon('nav.contact')}
            </span>
          </FadeIn>
          <TextReveal
            as="h1"
            className="max-w-3xl text-4xl font-bold text-white md:text-5xl lg:text-6xl"
          >
            {t('title')}
          </TextReveal>
          <FadeIn delay={0.3}>
            <p className="mt-6 max-w-2xl text-lg text-white/50">
              {t('description')}
            </p>
          </FadeIn>
          <div className="mt-8 h-px w-16 bg-jerash-orange" />
        </Container>
      </Section>

      {/* Form + Quick Contact Grid */}
      <Section className="py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
          {/* Left: Contact Form */}
          <FadeIn direction="left">
            <div className="glass rounded-2xl">
              <div className="p-6 pb-0">
                <h2 className="font-semibold leading-none text-white">{t('form.title')}</h2>
                <p className="mt-2 text-sm text-white/50">{t('form.description')}</p>
              </div>
              <div className="p-6">
                <ContactForm />
              </div>
            </div>
          </FadeIn>

          {/* Right: Quick Contact Sidebar */}
          <FadeIn direction="right">
            <div className="glass rounded-2xl">
              <div className="p-6 pb-0">
                <h2 className="font-semibold leading-none text-white">{t('quickContact.title')}</h2>
                <p className="mt-2 text-sm text-white/50">{t('quickContact.description')}</p>
              </div>
              <div className="space-y-6 p-6">
                {offices.map((office) => (
                  <div key={office.id} className="space-y-2">
                    <h4 className="font-semibold text-white">
                      {t(`offices.${office.id}.name`)}
                    </h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-jerash-orange" />
                      <a
                        href={`tel:${office.phone}`}
                        className="text-white/50 hover:text-jerash-orange transition-colors"
                      >
                        {office.phoneDisplay}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-jerash-orange" />
                      <a
                        href={`mailto:${office.email}`}
                        className="text-white/50 hover:text-jerash-orange transition-colors"
                      >
                        {office.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
