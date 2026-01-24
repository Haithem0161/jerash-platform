import { useTranslation } from 'react-i18next'
import { Section } from '@/components/layout/Section'
import { AnimatedCounter, StaggerContainer, StaggerItem } from '@/components/animations'

const stats = [
  { key: 'yearsExperience', value: 15, suffix: '+' },
  { key: 'projectsCompleted', value: 500, suffix: '+' },
  { key: 'employees', value: 200, suffix: '+' },
] as const

/**
 * Statistics section with animated counters.
 * Displays years of experience, projects completed, and team members.
 * Counters animate up from zero when scrolled into view.
 */
export function StatsSection() {
  const { t } = useTranslation()

  return (
    <Section id="stats" className="bg-muted/50">
      <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {stats.map((stat) => (
          <StaggerItem key={stat.key} className="text-center">
            <div className="text-5xl font-bold md:text-6xl">
              <AnimatedCounter to={stat.value} suffix={stat.suffix} />
            </div>
            <p className="mt-2 text-lg text-muted-foreground">
              {t(`home.stats.${stat.key}`)}
            </p>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  )
}
