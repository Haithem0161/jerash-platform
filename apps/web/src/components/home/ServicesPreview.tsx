import { useMemo } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'
import { Skeleton } from '@/components/ui/skeleton'
import { isRTL } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useServices } from '@/hooks/api'
import { useBilingual } from '@/hooks/useBilingual'
import { getIcon } from '@/lib/icons'

const PREVIEW_COUNT = 8

/**
 * Skeleton loader for services preview
 */
function ServicesPreviewSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3 rounded-lg border p-6">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-5 w-24" />
        </div>
      ))}
    </div>
  )
}

/**
 * Services preview section for homepage.
 * Displays first 8 services from API in a responsive grid with icons.
 * Links to the full services page.
 */
export function ServicesPreview() {
  const { t, i18n } = useTranslation()
  const rtl = isRTL(i18n.language)
  const { data: categories, isLoading } = useServices()
  const { resolve } = useBilingual()

  // Flatten services from categories and take first 8
  const previewServices = useMemo(() => {
    if (!categories) return []

    const allServices = categories.flatMap((category) =>
      category.services.map((service) => ({
        id: service.id,
        title: resolve(service.titleEn, service.titleAr),
        icon: getIcon(service.icon),
      }))
    )

    return allServices.slice(0, PREVIEW_COUNT)
  }, [categories, resolve])

  return (
    <Section id="services-preview">
      <FadeIn className="mb-12 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          {t('home.services.title')}
        </h2>
      </FadeIn>

      {isLoading ? (
        <ServicesPreviewSkeleton />
      ) : (
        <StaggerContainer className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {previewServices.map(({ id, title, icon: Icon }) => (
            <StaggerItem key={id}>
              <div className="flex flex-col items-center gap-3 rounded-lg border p-6 text-center transition-colors hover:border-jerash-orange">
                <Icon className="h-10 w-10 text-jerash-orange" />
                <span className="font-medium text-jerash-blue">{title}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      <FadeIn delay={0.2} className="mt-12 text-center">
        <Link
          to="/services"
          className="linkHover inline-flex items-center gap-2 text-primary"
        >
          {t('home.services.seeAll')}
          <ArrowRight className={cn('h-4 w-4', rtl && 'rotate-180')} />
        </Link>
      </FadeIn>
    </Section>
  )
}
