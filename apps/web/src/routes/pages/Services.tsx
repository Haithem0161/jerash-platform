import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/common/SEO'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import {
  CategoryTabs,
  ServicesGrid,
  ServiceModal,
  type FilterCategory,
  type ResolvedService,
  type SelectedService,
} from '@/components/services'
import { useServices } from '@/hooks/api'
import { useBilingual } from '@/hooks/useBilingual'
import { getIcon } from '@/lib/icons'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton loader for services grid
 */
function ServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3 rounded-lg border p-6">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  )
}

/**
 * Services page with category filtering, card grid, and modal details.
 * Displays all 26 services with smooth filter animations.
 */
export function ServicesPage() {
  const { t } = useTranslation('services')
  const { t: tCommon } = useTranslation()
  const { data: categories, isLoading } = useServices()
  const { resolve } = useBilingual()
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all')
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Flatten services from categories and resolve bilingual content
  const resolvedServices = useMemo<ResolvedService[]>(() => {
    if (!categories) return []

    return categories.flatMap((category) =>
      category.services.map((service) => ({
        id: service.id,
        title: resolve(service.titleEn, service.titleAr),
        shortDescription: resolve(service.shortDescriptionEn, service.shortDescriptionAr),
        description: resolve(service.descriptionEn, service.descriptionAr),
        icon: getIcon(service.icon),
        category: category.slug,
      }))
    )
  }, [categories, resolve])

  const handleCategoryChange = useCallback((category: FilterCategory) => {
    setActiveCategory(category)
  }, [])

  const handleServiceClick = useCallback((service: ResolvedService) => {
    setSelectedService({
      title: service.title,
      description: service.description,
      icon: service.icon,
    })
    setModalOpen(true)
  }, [])

  const handleModalOpenChange = useCallback((open: boolean) => {
    setModalOpen(open)
    if (!open) {
      // Clear selected service after modal close animation
      setTimeout(() => setSelectedService(null), 200)
    }
  }, [])

  const filteredServices =
    activeCategory === 'all'
      ? resolvedServices
      : resolvedServices.filter((s) => s.category === activeCategory)

  return (
    <>
      <SEO
        title={tCommon('seo.services.title')}
        description={tCommon('seo.services.description')}
        url="/services"
        image="/images/gallery/jerash-site-01.jpg"
      />

      <Section>
        <FadeIn className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-jerash-blue md:text-4xl lg:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {t('description')}
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mb-12">
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </FadeIn>

        {isLoading ? (
          <ServicesSkeleton />
        ) : (
          <ServicesGrid
            services={filteredServices}
            onServiceClick={handleServiceClick}
          />
        )}
      </Section>

      <ServiceModal
        service={selectedService}
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
      />
    </>
  )
}

export default ServicesPage
