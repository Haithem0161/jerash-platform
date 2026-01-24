import { useTranslation } from 'react-i18next'
import { Section } from '@/components/layout/Section'
import { AnimatedCounter } from '@/components/animations/AnimatedCounter'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'

/**
 * @deprecated HIDDEN - Component not currently rendered in HSEPage.
 *
 * REASON: Safety metrics values (1M+ hours, 50K+ training, 95% certified) were
 * fabricated placeholders from Phase 5 development. These values are NOT from
 * the company profile document and cannot be verified.
 *
 * TODO: Re-enable this component when client provides verified safety metrics:
 * - Actual incident-free work hours
 * - Actual training hours completed
 * - Actual percentage of certified personnel
 *
 * Once verified values are available, update the metrics array below and
 * re-import this component in src/routes/pages/HSE.tsx
 */

// PLACEHOLDER VALUES - DO NOT USE WITHOUT CLIENT VERIFICATION
const metrics = [
  { key: 'incidentFreeHours', value: 1000000, suffix: '+' },
  { key: 'trainingHours', value: 50000, suffix: '+' },
  { key: 'certifiedPersonnel', value: 95, suffix: '%' },
] as const

/**
 * Safety metrics section with animated counters.
 * Displays incident-free hours, training hours, and certification rate.
 * Positioned at page bottom as final impression (per CONTEXT.md).
 */
export function SafetyMetrics() {
  const { t } = useTranslation('hse')

  return (
    <Section id="safety-metrics" className="bg-muted/50">
      {/* Section header */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          {t('metrics.sectionTitle')}
        </h2>
      </div>

      {/* Metrics grid with animated counters */}
      <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {metrics.map((metric) => (
          <StaggerItem key={metric.key} className="text-center">
            <div className="text-5xl font-bold md:text-6xl lg:text-7xl">
              <AnimatedCounter to={metric.value} suffix={metric.suffix} />
            </div>
            <p className="mt-3 text-lg md:text-xl text-muted-foreground">
              {t(`metrics.${metric.key}`)}
            </p>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  )
}
