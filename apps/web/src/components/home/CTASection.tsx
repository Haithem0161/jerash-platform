import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/animations/FadeIn'
import { isRTL } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/**
 * Full-bleed CTA section with background image and dark overlay.
 * Placed near the bottom of the homepage to drive contact conversions.
 */
export function CTASection() {
  const { t, i18n } = useTranslation()
  const rtl = isRTL(i18n.language)

  return (
    <Section id="cta" fullWidth className="relative overflow-hidden">
      {/* Background image */}
      <img
        src="/cta.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <Container className="relative z-10 text-center">
        <FadeIn>
          <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {t('home.cta.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            {t('home.cta.subtitle')}
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-jerash-orange px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-jerash-orange/90"
          >
            {t('home.cta.button')}
            <ArrowRight className={cn('h-4 w-4', rtl && 'rotate-180')} />
          </Link>
        </FadeIn>
      </Container>
    </Section>
  )
}
