import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { OrbitalLogos } from '@/components/animations/OrbitalLogos'
import { Skeleton } from '@/components/ui/skeleton'
import { isRTL } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { usePartners } from '@/hooks/api'
import { useBilingual } from '@/hooks/useBilingual'

function PartnersSkeleton() {
  return (
    <div className="flex items-center justify-center py-20">
      <Skeleton className="h-[400px] w-[400px] rounded-full" />
    </div>
  )
}

/**
 * Partners section with orbital logo arrangement.
 * Logos orbit around the central Jerash logo.
 */
export function PartnersSection() {
  const { t, i18n } = useTranslation()
  const rtl = isRTL(i18n.language)
  const { data: partners, isLoading } = usePartners()
  const { resolve } = useBilingual()

  const displayPartners = partners?.slice(0, 10)

  const orbitalLogos =
    displayPartners?.map((partner) => ({
      name: resolve(partner.nameEn, partner.nameAr),
      logoUrl: partner.logoUrl,
      website: partner.website,
    })) ?? []

  return (
    <Section id="partners">
      <FadeIn className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          {t('home.partners.title')}
        </h2>
      </FadeIn>

      <FadeIn delay={0.1}>
        {isLoading ? (
          <PartnersSkeleton />
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
                    'drop-shadow(0 0 20px oklch(0.65 0.20 50 / 30%))',
                }}
              />
            }
            orbitDuration={60}
          />
        ) : (
          <div className="text-center">
            <p className="text-white/50">{t('home.partners.noPartners')}</p>
          </div>
        )}
      </FadeIn>

      <FadeIn delay={0.2} className="mt-8 text-center">
        <Link
          to="/partners"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-jerash-orange"
        >
          {t('home.partners.seeAll')}
          <ArrowRight className={cn('h-4 w-4', rtl && 'rotate-180')} />
        </Link>
      </FadeIn>
    </Section>
  )
}
