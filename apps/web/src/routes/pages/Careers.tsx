import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/common/SEO'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/animations/FadeIn'
import { JobListings, CVUploadForm } from '@/components/careers'

/**
 * Careers page with job listings and CV upload form.
 * Users can browse open positions and submit their CVs.
 */
export function CareersPage() {
  const { t } = useTranslation('careers')

  return (
    <>
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        url="/careers"
        image="/images/gallery/jerash-site-10.jpg"
      />

      {/* Page Header */}
      <Section className="pb-8 pt-16 md:pb-12 md:pt-20">
        <Container>
          <FadeIn className="text-center">
            <h1 className="text-3xl font-bold text-jerash-blue md:text-4xl lg:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('description')}
            </p>
          </FadeIn>
        </Container>
      </Section>

      {/* Job Listings Section */}
      <Section className="py-8 md:py-12 bg-muted/30">
        <Container>
          <JobListings />
        </Container>
      </Section>

      {/* CV Upload Section */}
      <Section className="py-12 md:py-16">
        <Container className="max-w-2xl">
          <FadeIn>
            <CVUploadForm />
          </FadeIn>
        </Container>
      </Section>
    </>
  )
}

export default CareersPage
