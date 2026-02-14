import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Shield, Award, Scale, Users, Lightbulb, type LucideIcon } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { cn } from '@/lib/utils'

interface ValueConfig {
  key: string
  icon: LucideIcon
  iconColor: string
  dropShadow: string
}

const values: ValueConfig[] = [
  {
    key: 'safety',
    icon: Shield,
    iconColor: 'oklch(0.55 0.15 250)',
    dropShadow: 'drop-shadow(0 0 12px oklch(0.55 0.15 250 / 50%))',
  },
  {
    key: 'excellence',
    icon: Award,
    iconColor: 'oklch(0.70 0.20 50)',
    dropShadow: 'drop-shadow(0 0 12px oklch(0.70 0.20 50 / 50%))',
  },
  {
    key: 'integrity',
    icon: Scale,
    iconColor: 'oklch(0.60 0.15 250)',
    dropShadow: 'drop-shadow(0 0 12px oklch(0.60 0.15 250 / 50%))',
  },
  {
    key: 'teamwork',
    icon: Users,
    iconColor: 'oklch(0.75 0.18 55)',
    dropShadow: 'drop-shadow(0 0 12px oklch(0.75 0.18 55 / 50%))',
  },
  {
    key: 'innovation',
    icon: Lightbulb,
    iconColor: 'oklch(0.55 0.15 250)',
    dropShadow: 'drop-shadow(0 0 12px oklch(0.55 0.15 250 / 50%))',
  },
]

/**
 * Values section with 3D flip cards.
 * Hover (desktop) or tap (mobile) to flip and reveal description.
 */
export function ValuesSection() {
  const { t } = useTranslation()
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)

  const handleClick = (index: number) => {
    setFlippedIndex((prev) => (prev === index ? null : index))
  }

  return (
    <Section id="values">
      <FadeIn direction="up" className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          {t('home.values.title')}
        </h2>
      </FadeIn>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {values.map(({ key, icon: Icon, iconColor, dropShadow }, index) => {
          const isFlipped = flippedIndex === index
          const isLast = index === values.length - 1

          return (
            <FadeIn
              key={key}
              direction="up"
              delay={index * 0.1}
              className={cn(
                isLast && 'col-span-2 mx-auto w-full max-w-[calc(50%-0.625rem)] sm:col-span-1 sm:max-w-none',
              )}
            >
              <div
                className="group cursor-pointer perspective-[1000px]"
                onClick={() => handleClick(index)}
              >
                <div
                  className={cn(
                    'relative h-56 w-full transition-transform duration-500 transform-3d',
                    'group-hover:transform-[rotateY(180deg)]',
                    isFlipped && 'transform-[rotateY(180deg)]',
                  )}
                >
                  {/* Front face — no backdrop-filter (breaks backface-visibility) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[oklch(0.13_0.02_250)] backface-hidden">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <Icon
                        className="h-7 w-7"
                        style={{ color: iconColor, filter: dropShadow }}
                      />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-white">
                      {t(`home.values.${key}.title`)}
                    </h3>
                  </div>

                  {/* Back face — no backdrop-filter (breaks backface-visibility) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[oklch(0.13_0.02_250)] p-5 backface-hidden transform-[rotateY(180deg)]">
                    <Icon
                      className="mb-3 h-6 w-6"
                      style={{ color: iconColor, filter: dropShadow }}
                    />
                    <p className="text-center text-sm leading-relaxed text-white/70">
                      {t(`home.values.${key}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          )
        })}
      </div>
    </Section>
  )
}
