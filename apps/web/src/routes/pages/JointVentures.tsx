import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/common/SEO'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { JointVentureCard } from '@/components/joint-ventures/JointVentureCard'
import { useJointVentures } from '@/hooks/api'
import { useBilingual } from '@/hooks/useBilingual'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton loader for JV cards
 */
function JointVenturesSkeleton() {
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
 * Joint Ventures page showcasing strategic JV partnerships.
 * Grid layout supports multiple JVs.
 */
export function JointVenturesPage() {
  const { t } = useTranslation('partners')
  const { data: jointVentures, isLoading } = useJointVentures()
  const { resolve } = useBilingual()

  return (
    <>
      <SEO
        title={t('seo.jvTitle')}
        description={t('seo.jvDescription')}
        url="/joint-ventures"
        image="/images/gallery/jerash-site-20.jpg"
      />

      <Section className="py-16 md:py-20">
        {/* Page header */}
        <FadeIn className="mb-12 text-center">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            {t('jointVentures.pageTitle')}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {t('jointVentures.pageDescription')}
          </p>
        </FadeIn>

        {/* Joint Ventures grid */}
        {isLoading ? (
          <JointVenturesSkeleton />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jointVentures?.map((jv, idx) => (
              <JointVentureCard
                key={jv.id}
                name={resolve(jv.nameEn, jv.nameAr)}
                description={resolve(jv.descriptionEn, jv.descriptionAr)}
                logoUrl={jv.logoUrl}
                website={jv.website}
                delay={idx * 0.1}
              />
            ))}
          </div>
        )}
      </Section>
    </>
  )
}

export default JointVenturesPage
