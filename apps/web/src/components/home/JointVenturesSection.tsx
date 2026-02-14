import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { OrbitalLogos } from '@/components/animations/OrbitalLogos'
import { Skeleton } from '@/components/ui/skeleton'
import { isRTL } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useJointVentures } from '@/hooks/api'
import { useBilingual } from '@/hooks/useBilingual'

function JVSkeleton() {
  return (
    <div className="flex items-center justify-center py-20">
      <Skeleton className="h-[400px] w-[400px] rounded-full" />
    </div>
  )
}

/**
 * Joint Ventures section with orbital logo arrangement.
 * Same pattern as Partners but different orbit speed/direction.
 */
export function JointVenturesSection() {
  const { t, i18n } = useTranslation()
  const rtl = isRTL(i18n.language)
  const { data: jointVentures, isLoading } = useJointVentures()
  const { resolve } = useBilingual()

  const displayJVs = jointVentures?.slice(0, 10)

  const orbitalLogos =
    displayJVs?.map((jv) => ({
      name: resolve(jv.nameEn, jv.nameAr),
      logoUrl: jv.logoUrl,
      website: jv.website,
    })) ?? []

  return (
    <Section id="joint-ventures">
      <FadeIn className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          {t('home.jointVentures.title')}
        </h2>
      </FadeIn>

      <FadeIn delay={0.1}>
        {isLoading ? (
          <JVSkeleton />
        ) : orbitalLogos.length > 0 ? (
          <OrbitalLogos
            logos={orbitalLogos}
            centerContent={
              <img
                src="/Jerash-logo-color.png"
                alt="Jerash"
                className="h-14 w-auto"
                style={{
                  filter:
                    'drop-shadow(0 0 20px oklch(0.40 0.12 250 / 30%))',
                }}
              />
            }
            orbitDuration={50}
          />
        ) : (
          <div className="text-center">
            <p className="text-white/50">
              {t('home.jointVentures.noJointVentures')}
            </p>
          </div>
        )}
      </FadeIn>

      <FadeIn delay={0.2} className="mt-8 text-center">
        <Link
          to="/joint-ventures"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-jerash-orange"
        >
          {t('home.jointVentures.seeAll')}
          <ArrowRight className={cn('h-4 w-4', rtl && 'rotate-180')} />
        </Link>
      </FadeIn>
    </Section>
  )
}
