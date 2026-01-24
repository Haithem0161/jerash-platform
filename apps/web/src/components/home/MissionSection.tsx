import { useTranslation } from 'react-i18next'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'

/**
 * Mission section with 60/40 text-image layout.
 * Image on leading side (start), text on trailing side (end).
 * Uses grid order to flip layout from VisionSection.
 */
export function MissionSection() {
  const { t } = useTranslation()

  return (
    <Section id="mission" className="bg-muted/50">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-5 lg:gap-12">
        {/* Image side - 2 columns (40%), ordered first on lg */}
        <FadeIn direction="right" className="order-2 lg:order-1 lg:col-span-2">
          <img
            src="/WhatsApp Image 2026-01-09 at 4.37.33 PM.jpeg"
            alt={t('home.mission.title')}
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        </FadeIn>

        {/* Text side - 3 columns (60%), ordered second on lg */}
        <FadeIn direction="up" className="order-1 lg:order-2 lg:col-span-3">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t('home.mission.title')}
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t('home.mission.content')}
          </p>
        </FadeIn>
      </div>
    </Section>
  )
}
