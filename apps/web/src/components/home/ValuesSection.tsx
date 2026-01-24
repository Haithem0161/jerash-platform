import { useTranslation } from 'react-i18next'
import { Shield, Award, Scale, Users, Lightbulb } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'

const values = [
  { key: 'safety', icon: Shield, iconColor: 'text-jerash-blue', hoverBorder: 'hover:border-jerash-blue' },
  { key: 'excellence', icon: Award, iconColor: 'text-jerash-orange', hoverBorder: 'hover:border-jerash-orange' },
  { key: 'integrity', icon: Scale, iconColor: 'text-jerash-blue-light', hoverBorder: 'hover:border-jerash-blue-light' },
  { key: 'teamwork', icon: Users, iconColor: 'text-jerash-orange-light', hoverBorder: 'hover:border-jerash-orange-light' },
  { key: 'innovation', icon: Lightbulb, iconColor: 'text-jerash-blue-dark', hoverBorder: 'hover:border-jerash-blue-dark' },
] as const

/**
 * Values section displaying company core values as icon cards.
 * Uses staggered animation for reveal effect.
 */
export function ValuesSection() {
  const { t } = useTranslation()

  return (
    <Section id="values">
      {/* Centered title */}
      <FadeIn direction="up" className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {t('home.values.title')}
        </h2>
      </FadeIn>

      {/* Values grid with staggered animation */}
      <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
        {values.map(({ key, icon: Icon, iconColor, hoverBorder }, index) => (
          <StaggerItem
            key={key}
            className={index === 0 ? 'lg:row-span-2' : ''}
          >
            <div className={`h-full rounded-2xl border bg-card p-6 text-center transition-colors ${hoverBorder}`}>
              <Icon className={`mx-auto h-10 w-10 ${iconColor}`} />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {t(`home.values.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`home.values.${key}.description`)}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  )
}
