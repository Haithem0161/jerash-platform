import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Shield, Award, Scale, Users, Lightbulb, type LucideIcon } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'
import { FadeIn } from '@/components/animations/FadeIn'
import { useIsMobile } from '@/hooks'
import { cn } from '@/lib/utils'

interface ValueConfig {
  key: string
  icon: LucideIcon
  glowColor: string
  dropShadow: string
}

const values: ValueConfig[] = [
  {
    key: 'safety',
    icon: Shield,
    glowColor: 'oklch(0.40 0.12 250 / 40%)',
    dropShadow: 'drop-shadow(0 0 16px oklch(0.40 0.12 250 / 40%))',
  },
  {
    key: 'excellence',
    icon: Award,
    glowColor: 'oklch(0.65 0.20 50 / 40%)',
    dropShadow: 'drop-shadow(0 0 16px oklch(0.65 0.20 50 / 40%))',
  },
  {
    key: 'integrity',
    icon: Scale,
    glowColor: 'oklch(0.55 0.12 250 / 40%)',
    dropShadow: 'drop-shadow(0 0 16px oklch(0.55 0.12 250 / 40%))',
  },
  {
    key: 'teamwork',
    icon: Users,
    glowColor: 'oklch(0.75 0.18 55 / 40%)',
    dropShadow: 'drop-shadow(0 0 16px oklch(0.75 0.18 55 / 40%))',
  },
  {
    key: 'innovation',
    icon: Lightbulb,
    glowColor: 'oklch(0.30 0.10 250 / 40%)',
    dropShadow: 'drop-shadow(0 0 16px oklch(0.30 0.10 250 / 40%))',
  },
]

/**
 * Values section with hexagonal honeycomb layout.
 * Desktop: 3 hexagons on top, 2 offset below.
 * Mobile: stacked glass cards.
 */
export function ValuesSection() {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Mobile: glass cards
  if (isMobile) {
    return (
      <Section id="values">
        <FadeIn direction="up" className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {t('home.values.title')}
          </h2>
        </FadeIn>
        <StaggerContainer className="grid grid-cols-1 gap-4">
          {values.map(({ key, icon: Icon }) => (
            <StaggerItem key={key}>
              <div className="glass rounded-2xl p-5">
                <Icon className="mb-2 h-8 w-8 text-jerash-orange" />
                <h3 className="text-lg font-semibold text-white">
                  {t(`home.values.${key}.title`)}
                </h3>
                <p className="mt-1 text-sm text-white/60">
                  {t(`home.values.${key}.description`)}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>
    )
  }

  return (
    <Section id="values">
      <FadeIn direction="up" className="mb-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          {t('home.values.title')}
        </h2>
      </FadeIn>

      {/* Honeycomb layout */}
      <StaggerContainer className="flex flex-col items-center gap-4">
        {/* Top row: 3 hexagons */}
        <div className="flex gap-4">
          {values.slice(0, 3).map((value, index) => (
            <HexagonCard
              key={value.key}
              value={value}
              isHovered={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
              t={t}
            />
          ))}
        </div>
        {/* Bottom row: 2 hexagons (offset) */}
        <div className="flex gap-4" style={{ marginTop: -20 }}>
          {values.slice(3, 5).map((value, index) => (
            <HexagonCard
              key={value.key}
              value={value}
              isHovered={hoveredIndex === index + 3}
              onHover={() => setHoveredIndex(index + 3)}
              onLeave={() => setHoveredIndex(null)}
              t={t}
            />
          ))}
        </div>
      </StaggerContainer>
    </Section>
  )
}

function HexagonCard({
  value,
  isHovered,
  onHover,
  onLeave,
  t,
}: {
  value: ValueConfig
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  t: (key: string) => string
}) {
  const { key, icon: Icon, dropShadow } = value

  return (
    <StaggerItem className="relative">
      <div
        className={cn(
          'relative flex cursor-default flex-col items-center justify-center text-center transition-all duration-300',
        )}
        style={{
          width: 200,
          height: 220,
          clipPath:
            'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          filter: isHovered ? dropShadow : 'none',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        {/* Glass background */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl" />
        <div className="relative z-10 flex flex-col items-center px-4">
          <Icon className="h-8 w-8 text-white/80" />
          <h3 className="mt-3 text-sm font-semibold text-white">
            {t(`home.values.${key}.title`)}
          </h3>
        </div>
      </div>

      {/* Description tooltip on hover */}
      {isHovered && (
        <div className="glass absolute left-1/2 top-full z-20 mt-2 w-52 -translate-x-1/2 rounded-xl p-3 text-center">
          <p className="text-xs leading-relaxed text-white/70">
            {t(`home.values.${key}.description`)}
          </p>
        </div>
      )}
    </StaggerItem>
  )
}
