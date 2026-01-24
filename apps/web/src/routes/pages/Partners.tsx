import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/common/SEO'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { PartnerCard } from '@/components/partners/PartnerCard'
import { usePartners } from '@/hooks/api'
import { useBilingual } from '@/hooks/useBilingual'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton loader for partner cards
 */
function PartnersSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border bg-card p-6 text-center">
          <Skeleton className="mx-auto mb-4 h-20 w-40" />
          <Skeleton className="mx-auto mb-2 h-6 w-32" />
          <Skeleton className="mx-auto h-16 w-full" />
        </div>
      ))}
    </div>
  )
}

/**
 * Partners page showcasing strategic business partnerships.
 * Grid layout supports multiple partners.
 */
export function PartnersPage() {
  const { t } = useTranslation('partners')
  const { data: partners, isLoading } = usePartners()
  const { resolve } = useBilingual()

  return (
    <>
      <SEO
        title={t('seo.partnersTitle')}
        description={t('seo.partnersDescription')}
        url="/partners"
        image="/images/gallery/jerash-site-15.jpg"
      />

      <Section className="py-16 md:py-20">
        {/* Page header */}
        <FadeIn className="mb-12 text-center">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            {t('partners.pageTitle')}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {t('partners.pageDescription')}
          </p>
        </FadeIn>

        {/* Partners grid */}
        {isLoading ? (
          <PartnersSkeleton />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {partners?.map((partner, idx) => (
              <PartnerCard
                key={partner.id}
                name={resolve(partner.nameEn, partner.nameAr)}
                description={resolve(partner.descriptionEn, partner.descriptionAr)}
                logoUrl={partner.logoUrl}
                website={partner.website}
                delay={idx * 0.1}
              />
            ))}
          </div>
        )}
      </Section>
    </>
  )
}

export default PartnersPage
