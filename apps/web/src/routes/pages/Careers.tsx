import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/common/SEO'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/animations/FadeIn'
import { TextReveal } from '@/components/animations/TextReveal'
import { ParallaxImage } from '@/components/animations/ParallaxImage'
import { JobListings, CVUploadForm } from '@/components/careers'

/**
 * Careers page with parallax hero, job listings with expand-in-place, and CV upload form.
 * Users can browse open positions and submit their CVs.
 */
export function CareersPage() {
  const { t } = useTranslation('careers')
  const { t: tCommon } = useTranslation()

  return (
    <>
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        url="/careers"
        image="/images/gallery/jerash-site-10.jpg"
      />

      {/* Hero section */}
      <Section
        fullWidth
        className="relative flex min-h-[60vh] items-center overflow-hidden p-0"
      >
        {/* Parallax background */}
        <div className="absolute inset-0">
          <ParallaxImage
            src="/images/gallery/jerash-site-10.jpg"
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
              {tCommon('nav.careers')}
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

      {/* Job Listings Section */}
      <Section className="py-8 md:py-12">
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
