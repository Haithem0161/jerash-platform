import { useTranslation } from 'react-i18next'
import { Section } from '@/components/layout/Section'
import { AnimatedCounter } from '@/components/animations'
import { Marquee } from '@/components/animations/Marquee'
import { FadeIn } from '@/components/animations/FadeIn'

const stats = [
  { key: 'yearsExperience', value: 15, suffix: '+' },
  { key: 'projectsCompleted', value: 500, suffix: '+' },
  { key: 'employees', value: 200, suffix: '+' },
] as const

/**
 * Statistics section with horizontal marquee ticker.
 * Oversized orange numbers scroll continuously across the viewport.
 */
export function StatsSection() {
  const { t } = useTranslation()

  return (
    <Section id="stats" fullWidth className="py-8 md:py-12">
      <FadeIn>
        <div className="border-y border-white/10">
          <Marquee speed={35} pauseOnHover>
            <div className="flex items-baseline gap-16 px-8 py-6">
              {stats.map((stat) => (
                <div key={stat.key} className="flex items-baseline gap-4">
                  <span className="text-[10vw] font-bold leading-none text-jerash-orange lg:text-[7vw]">
                    <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-sm font-medium uppercase tracking-widest text-white/40">
                    {t(`home.stats.${stat.key}`)}
                  </span>
                </div>
              ))}
              <span className="h-2 w-2 shrink-0 rounded-full bg-jerash-orange/50" />
            </div>
          </Marquee>
        </div>
      </FadeIn>
    </Section>
  )
}
