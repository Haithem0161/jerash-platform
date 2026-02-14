import { useTranslation } from 'react-i18next'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations'
import { TextReveal } from '@/components/animations/TextReveal'
import { ParallaxImage } from '@/components/animations/ParallaxImage'

/**
 * Management philosophy section with parallax image reveal
 * and decorative quotation mark background element.
 */
export function ManagementSection() {
  const { t } = useTranslation()

  return (
    <Section id="management">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        {/* Text content with decorative quote mark */}
        <FadeIn className="relative">
          {/* Decorative quotation mark */}
          <span
            className="pointer-events-none absolute -top-8 start-0 select-none text-[20vw] font-bold leading-none text-jerash-orange/10 md:text-[15vw]"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <div className="relative z-10">
            <TextReveal
              as="h2"
              className="text-3xl font-bold text-white md:text-4xl"
            >
              {t('home.management.title')}
            </TextReveal>
            <p className="mt-4 text-lg leading-relaxed text-white/60">
              {t('home.management.content')}
            </p>
          </div>
        </FadeIn>

        {/* Image with parallax */}
        <FadeIn direction="left">
          <ParallaxImage
            src="/management.jpg"
            alt={t('home.management.title')}
            speed={0.2}
            className="aspect-4/3 w-full rounded-2xl"
          />
        </FadeIn>
      </div>
    </Section>
  )
}
