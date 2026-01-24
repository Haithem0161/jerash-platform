import { useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { Skeleton } from '@/components/ui/skeleton'
import { isRTL } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { usePartners } from '@/hooks/api'
import { useBilingual } from '@/hooks/useBilingual'

/**
 * Skeleton loader for partner card
 */
function PartnerSkeleton() {
  return (
    <div className="rounded-lg border p-6 text-center max-w-md">
      <Skeleton className="mx-auto mb-4 h-16 w-32" />
      <Skeleton className="mx-auto mb-2 h-6 w-40" />
      <Skeleton className="mx-auto h-16 w-full" />
    </div>
  )
}

/**
 * Partners section showcasing strategic business partnerships.
 * Displays first partner from API as featured partner.
 */
export function PartnersSection() {
  const { t, i18n } = useTranslation()
  const rtl = isRTL(i18n.language)
  const { data: partners, isLoading } = usePartners()
  const { resolve } = useBilingual()
  const [logoError, setLogoError] = useState(false)

  // Get first partner to display
  const featuredPartner = partners?.[0]

  return (
    <Section id="partners">
      <FadeIn className="text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          {t('home.partners.title')}
        </h2>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-12 flex justify-center">
        {isLoading ? (
          <PartnerSkeleton />
        ) : featuredPartner ? (
          <div className="rounded-lg border p-6 text-center max-w-md">
            {/* Logo with fallback */}
            <div className="mb-4 flex justify-center">
              {logoError ? (
                <div className="flex h-16 w-32 items-center justify-center rounded bg-muted text-muted-foreground text-sm">
                  Logo
                </div>
              ) : (
                <img
                  src={featuredPartner.logoUrl}
                  alt={resolve(featuredPartner.nameEn, featuredPartner.nameAr)}
                  className="h-16 w-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              )}
            </div>
            <h3 className="text-xl font-semibold">
              {resolve(featuredPartner.nameEn, featuredPartner.nameAr)}
            </h3>
            <p className="mt-2 text-muted-foreground">
              {resolve(featuredPartner.descriptionEn, featuredPartner.descriptionAr)}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border p-6 text-center max-w-md">
            <p className="text-muted-foreground">{t('home.partners.noPartners')}</p>
          </div>
        )}
      </FadeIn>

      <FadeIn delay={0.2} className="mt-12 text-center">
        <Link
          to="/partners"
          className="linkHover inline-flex items-center gap-2 text-primary"
        >
          {t('home.partners.seeAll')}
          <ArrowRight className={cn('h-4 w-4', rtl && 'rotate-180')} />
        </Link>
      </FadeIn>
    </Section>
  )
}
