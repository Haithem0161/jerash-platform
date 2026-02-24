import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/common/SEO'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { ClientCard } from '@/components/clients/ClientCard'
import { useClients } from '@/hooks/api'
import { useBilingual } from '@/hooks/useBilingual'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton loader for client cards
 */
function ClientsSkeleton() {
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
 * Clients page showcasing strategic business clients.
 * Grid layout supports multiple clients.
 */
export function ClientsPage() {
  const { t } = useTranslation('clients')
  const { data: clients, isLoading } = useClients()
  const { resolve } = useBilingual()

  return (
    <>
      <SEO
        title={t('seo.clientsTitle')}
        description={t('seo.clientsDescription')}
        url="/clients"
        image="/images/gallery/jerash-site-15.jpg"
      />

      <Section className="py-16 md:py-20">
        {/* Page header */}
        <FadeIn className="mb-12 text-center">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            {t('clients.pageTitle')}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {t('clients.pageDescription')}
          </p>
        </FadeIn>

        {/* Clients grid */}
        {isLoading ? (
          <ClientsSkeleton />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clients?.map((client, idx) => (
              <ClientCard
                key={client.id}
                name={resolve(client.nameEn, client.nameAr)}
                description={resolve(client.descriptionEn, client.descriptionAr)}
                logoUrl={client.logoUrl}
                website={client.website}
                delay={idx * 0.1}
              />
            ))}
          </div>
        )}
      </Section>
    </>
  )
}

export default ClientsPage
