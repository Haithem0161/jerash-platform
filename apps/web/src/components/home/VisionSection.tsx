import { useTranslation } from 'react-i18next'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'

/**
 * Vision section with 60/40 text-image layout.
 * Text on leading side (start), image on trailing side (end).
 */
export function VisionSection() {
  const { t } = useTranslation()

  return (
    <Section id="vision">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-5 lg:gap-12">
        {/* Text side - 3 columns (60%) */}
        <FadeIn direction="up" className="lg:col-span-3">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t('home.vision.title')}
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t('home.vision.content')}
          </p>
        </FadeIn>

        {/* Image side - 2 columns (40%) */}
        <FadeIn direction="left" className="lg:col-span-2">
          <img
            src="/WhatsApp Image 2026-01-09 at 4.37.36 PM.jpeg"
            alt={t('home.vision.title')}
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        </FadeIn>
      </div>
    </Section>
  )
}
