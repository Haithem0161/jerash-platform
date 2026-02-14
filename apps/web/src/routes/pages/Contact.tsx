import { useTranslation } from 'react-i18next'
import { Mail } from 'lucide-react'

import { SEO } from '@/components/common/SEO'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/animations/FadeIn'
import { TextReveal } from '@/components/animations/TextReveal'
import { ParallaxImage } from '@/components/animations/ParallaxImage'
import { ContactForm } from '@/components/contact'

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
        <div className="absolute inset-0">
          <ParallaxImage
            src="/cta.jpg"
            alt=""
            speed={0.15}
            className="h-full w-full"
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-[oklch(0.08_0.02_250)] via-black/60 to-black/40" />

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

      {/* Contact Form + Email */}
      <Section className="py-8 md:py-12">
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <div className="glass rounded-2xl">
              <div className="p-6 pb-0">
                <h2 className="font-semibold leading-none text-white">{t('form.title')}</h2>
                <p className="mt-2 text-sm text-white/50">{t('form.description')}</p>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-jerash-orange" />
                  <a
                    href="mailto:info@jerash.com"
                    className="text-white/50 transition-colors hover:text-jerash-orange"
                  >
                    info@jerash.com
                  </a>
                </div>
              </div>
              <div className="p-6">
                <ContactForm />
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  )
}

export default ContactPage
