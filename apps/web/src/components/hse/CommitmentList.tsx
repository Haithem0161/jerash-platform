import { useTranslation } from 'react-i18next'
import { Section } from '@/components/layout/Section'
import { StaggerContainer, StaggerItem } from '@/components/animations'
import { Shield } from 'lucide-react'

const COMMITMENT_COUNT = 10

export function CommitmentList() {
  const { t } = useTranslation('hse')
  const commitments = Array.from({ length: COMMITMENT_COUNT }, (_, i) => i + 1)

  return (
    <Section id="commitments">
      {/* Section header with single HSE icon (per CONTEXT.md) */}
      <div className="mb-12 text-center">
        <Shield className="mx-auto h-12 w-12 text-jerash-orange mb-4" />
        <h2 className="text-3xl font-bold text-jerash-blue md:text-4xl">
          {t('commitments.sectionTitle')}
        </h2>
      </div>

      {/* Numbered commitment list */}
      <StaggerContainer className="max-w-3xl mx-auto space-y-6">
        {commitments.map((num) => (
          <StaggerItem key={num} className="flex gap-4 items-start group">
            {/* Numbered bullet with brand color */}
            <span className="text-2xl font-bold text-jerash-blue/40 group-hover:text-jerash-orange tabular-nums shrink-0 transition-colors">
              {num.toString().padStart(2, '0')}
            </span>
            {/* Focus on text content */}
            <p className="flex-1 text-lg leading-relaxed">
              {t(`commitments.${num}`)}
            </p>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  )
}
