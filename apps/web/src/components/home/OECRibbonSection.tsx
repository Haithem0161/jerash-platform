import { useTranslation } from 'react-i18next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/animations/FadeIn'

/**
 * Full-bleed ribbon highlighting the OEC / Oil Ministry relationship.
 * Background image with dark overlay, Ministry of Oil logo, and text.
 */
export function OECRibbonSection() {
  const { t } = useTranslation()

  return (
    <Section fullWidth className="relative overflow-hidden py-12 md:py-16">
      {/* Background image */}
      <img
        src="/omb.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <Container className="relative z-10">
        <FadeIn>
          <div className="flex flex-col items-center gap-6 md:flex-row md:gap-10">
            {/* Ministry of Oil logo */}
            <img
              src="/oilministry.png"
              alt="Ministry of Oil - Iraq"
              className="h-24 w-auto shrink-0 drop-shadow-lg md:h-28"
            />

            {/* Text */}
            <div className="text-center md:text-start">
              <p className="text-sm font-medium uppercase tracking-wider text-jerash-orange">
                {t('home.oec.title')}
              </p>
              <h3 className="mt-1 text-2xl font-bold text-white md:text-3xl">
                {t('home.oec.name')}
              </h3>
              <p className="mt-2 max-w-xl text-base text-white/75">
                {t('home.oec.subtitle')}
              </p>
            </div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  )
}
