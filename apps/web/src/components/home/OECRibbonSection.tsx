import { useTranslation } from 'react-i18next'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/animations/FadeIn'
import { ParallaxImage } from '@/components/animations/ParallaxImage'
import { TextReveal } from '@/components/animations/TextReveal'

/**
 * Full-bleed cinematic ribbon highlighting the OEC / Oil Ministry relationship.
 * Parallax background image with gradient overlay.
 * Ministry logo with animated glow pulse.
 */
export function OECRibbonSection() {
  const { t } = useTranslation()

  return (
    <Section fullWidth className="relative min-h-[50vh] overflow-hidden py-12 md:py-16">
      {/* Parallax background */}
      <div className="absolute inset-0">
        <ParallaxImage
          src="/omb.jpg"
          alt=""
          speed={0.15}
          className="h-full w-full"
        />
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-jerash-blue-dark/80 via-black/60 to-black/80" />

      {/* Content */}
      <Container className="relative z-10">
        <FadeIn>
          <div className="flex flex-col items-center gap-6 md:flex-row md:gap-10">
            {/* Ministry of Oil logo with glow */}
            <img
              src="/oilministry.png"
              alt="Ministry of Oil - Iraq"
              className="h-24 w-auto shrink-0 md:h-28"
              style={{
                filter: 'drop-shadow(0 0 30px oklch(0.65 0.20 50 / 30%))',
                animation: 'glow-pulse 3s ease-in-out infinite',
              }}
            />

            {/* Text */}
            <div className="text-center md:text-start">
              <p className="text-sm font-medium uppercase tracking-wider text-jerash-orange">
                {t('home.oec.title')}
              </p>
              <TextReveal
                as="h3"
                className="mt-1 text-2xl font-bold text-white md:text-3xl"
              >
                {t('home.oec.name')}
              </TextReveal>
              <p className="mt-2 max-w-xl text-base text-white/60">
                {t('home.oec.subtitle')}
              </p>
            </div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  )
}
