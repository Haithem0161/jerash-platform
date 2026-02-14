import { useTranslation } from 'react-i18next'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { TextReveal } from '@/components/animations/TextReveal'
import { ParallaxImage } from '@/components/animations/ParallaxImage'

/**
 * Full-screen HSE hero with parallax background, gradient overlay,
 * badge, TextReveal title, and subtitle.
 */
export function HSEHero() {
  const { t } = useTranslation('hse')

  return (
    <Section
      fullWidth
      className="relative flex min-h-[70vh] items-center overflow-hidden p-0"
    >
      {/* Parallax background */}
      <div className="absolute inset-0">
        <ParallaxImage
          src="/images/hse/hse-hero.jpg"
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
            radial-gradient(ellipse at 30% 70%, oklch(0.40 0.12 250 / 15%) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 30%, oklch(0.65 0.20 50 / 10%) 0%, transparent 40%)
          `,
        }}
      />

      {/* Content */}
      <Container className="relative z-10 py-24">
        <FadeIn>
          <span className="mb-6 inline-block rounded-full border border-jerash-orange/20 bg-jerash-orange/10 px-4 py-1.5 text-sm font-medium text-jerash-orange">
            HSE
          </span>
        </FadeIn>
        <TextReveal
          as="h1"
          className="max-w-3xl text-4xl font-bold text-white md:text-5xl lg:text-6xl"
        >
          {t('hero.title')}
        </TextReveal>
        <FadeIn delay={0.3}>
          <p className="mt-6 max-w-2xl text-lg text-white/50">
            {t('hero.subtitle')}
          </p>
        </FadeIn>
        <div className="mt-8 h-px w-16 bg-jerash-orange" />
      </Container>
    </Section>
  )
}
