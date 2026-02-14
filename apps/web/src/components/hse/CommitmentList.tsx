import { useTranslation } from 'react-i18next'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { TextReveal } from '@/components/animations/TextReveal'
import { StaggerContainer, StaggerItem } from '@/components/animations'
import { Shield } from 'lucide-react'

const COMMITMENT_COUNT = 10

/**
 * HSE commitment list with numbered glass cards.
 * Each commitment has a large orange number and description text.
 */
export function CommitmentList() {
  const { t } = useTranslation('hse')
  const commitments = Array.from({ length: COMMITMENT_COUNT }, (_, i) => i + 1)

  return (
    <Section id="commitments">
      {/* Section header */}
      <FadeIn className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-jerash-orange/20 bg-jerash-orange/10">
          <Shield
            className="h-7 w-7 text-jerash-orange"
            style={{
              filter: 'drop-shadow(0 0 8px oklch(0.65 0.20 50 / 50%))',
            }}
          />
        </div>
        <TextReveal
          as="h2"
          className="text-3xl font-bold text-white md:text-4xl"
        >
          {t('commitments.sectionTitle')}
        </TextReveal>
      </FadeIn>

      {/* Numbered commitment list */}
      <StaggerContainer className="mx-auto max-w-3xl space-y-4">
        {commitments.map((num) => (
          <StaggerItem
            key={num}
            className="glass group flex items-start gap-5 rounded-2xl p-5 transition-all duration-300 hover:bg-white/8"
          >
            {/* Large number */}
            <span className="text-3xl font-bold tabular-nums text-jerash-orange/30 transition-colors group-hover:text-jerash-orange">
              {num.toString().padStart(2, '0')}
            </span>
            {/* Commitment text */}
            <p className="flex-1 text-base leading-relaxed text-white/60 group-hover:text-white/80 transition-colors">
              {t(`commitments.${num}`)}
            </p>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  )
}
