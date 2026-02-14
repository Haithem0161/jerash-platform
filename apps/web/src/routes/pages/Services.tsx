import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/common/SEO'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/animations/FadeIn'
import { TextReveal } from '@/components/animations/TextReveal'
import { ParallaxImage } from '@/components/animations/ParallaxImage'
import {
  CategoryTabs,
  ServicesGrid,
  type FilterCategory,
  type ResolvedService,
} from '@/components/services'
import { useServices } from '@/hooks/api'
import { useBilingual } from '@/hooks/useBilingual'
import { getIcon } from '@/lib/icons'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Glass-styled skeleton loader for services grid
 */
function ServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="glass flex flex-col gap-4 rounded-2xl p-6">
          <Skeleton className="h-12 w-12 rounded-xl bg-white/10" />
          <Skeleton className="h-5 w-32 bg-white/10" />
          <Skeleton className="h-4 w-full bg-white/10" />
          <Skeleton className="h-4 w-3/4 bg-white/10" />
        </div>
      ))}
    </div>
  )
}

/**
 * Services page with parallax hero, glass pill category filtering,
 * and expand-in-place service detail cards.
 */
export function ServicesPage() {
  const { t } = useTranslation('services')
  const { t: tCommon } = useTranslation()
  const { data: categories, isLoading } = useServices()
  const { resolve } = useBilingual()
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all')
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null)

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
    setExpandedServiceId(null)
  }, [])

  const handleExpand = useCallback((id: string | null) => {
    setExpandedServiceId(id)
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
        image="/service1.jpg"
      />

      {/* Hero section */}
      <Section
        fullWidth
        className="relative flex min-h-[60vh] items-center overflow-hidden p-0"
      >
        {/* Parallax background */}
        <div className="absolute inset-0">
          <ParallaxImage
            src="/service1.jpg"
            alt=""
            speed={0.15}
            className="h-full w-full"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[oklch(0.08_0.02_250)] via-black/60 to-black/40" />

        {/* Subtle gradient mesh accent */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 80%, oklch(0.40 0.12 250 / 15%) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 60%, oklch(0.65 0.20 50 / 10%) 0%, transparent 40%)
            `,
          }}
        />

        <Container className="relative z-10 py-24">
          <FadeIn>
            <span className="mb-6 inline-block rounded-full border border-jerash-orange/20 bg-jerash-orange/10 px-4 py-1.5 text-sm font-medium text-jerash-orange">
              {tCommon('nav.services')}
            </span>
          </FadeIn>
          <TextReveal
            as="h1"
            className="max-w-3xl text-4xl font-bold text-white md:text-5xl lg:text-6xl"
          >
            {t('title')}
          </TextReveal>
          <FadeIn delay={0.3}>
            <p className="mt-6 max-w-2xl text-lg text-white/50">
              {t('description')}
            </p>
          </FadeIn>
          <div className="mt-8 h-px w-16 bg-jerash-orange" />
        </Container>
      </Section>

      {/* Services grid section */}
      <Section>
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
            onServiceClick={() => {}}
            expandedServiceId={expandedServiceId}
            onExpand={handleExpand}
          />
        )}
      </Section>
    </>
  )
}

export default ServicesPage
