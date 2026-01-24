import { useTranslation } from 'react-i18next'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { Eye, Target } from 'lucide-react'

/**
 * Combined Vision & Mission section with bento grid layout.
 * Uses borders and brand color accents.
 */
export function VisionMissionSection() {
  const { t } = useTranslation()

  return (
    <Section id="vision-mission" className="overflow-hidden">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
        {/* Vision Card - Large */}
        <FadeIn
          direction="up"
          className="relative overflow-hidden rounded-3xl border bg-card p-6 lg:col-span-2 lg:row-span-1"
        >
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-jerash-blue/20 bg-jerash-blue/10">
                <Eye className="h-5 w-5 text-jerash-blue" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {t('home.vision.title')}
              </h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">
              {t('home.vision.content')}
            </p>
          </div>
        </FadeIn>

        {/* Vision Image */}
        <FadeIn
          direction="left"
          delay={0.1}
          className="relative overflow-hidden rounded-3xl lg:row-span-2"
        >
          <img
            src="/WhatsApp Image 2026-01-09 at 4.37.36 PM.jpeg"
            alt={t('home.vision.title')}
            className="h-full min-h-[180px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </FadeIn>

        {/* Mission Image */}
        <FadeIn
          direction="right"
          delay={0.2}
          className="relative overflow-hidden rounded-3xl"
        >
          <img
            src="/WhatsApp Image 2026-01-09 at 4.37.33 PM.jpeg"
            alt={t('home.mission.title')}
            className="h-full min-h-[140px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </FadeIn>

        {/* Mission Card - Large */}
        <FadeIn
          direction="up"
          delay={0.15}
          className="relative overflow-hidden rounded-3xl border bg-card p-6"
        >
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-jerash-orange/20 bg-jerash-orange/10">
                <Target className="h-5 w-5 text-jerash-orange" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {t('home.mission.title')}
              </h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">
              {t('home.mission.content')}
            </p>
          </div>
        </FadeIn>
      </div>
    </Section>
  )
}
