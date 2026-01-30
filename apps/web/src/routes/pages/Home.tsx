import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/common/SEO'
import { organizationSchema } from '@/lib/structured-data'
import {
  CTASection,
  HeroSlideshow,
  VisionMissionSection,
  ValuesSection,
  StatsSection,
  ManagementSection,
  OECRibbonSection,
  ServicesPreview,
  PartnersSection,
  JointVenturesSection,
} from '@/components/home'

/**
 * Homepage with all sections assembled.
 * Section order: Hero -> Vision -> Mission -> Values -> Stats -> Management -> Services -> Partners -> JV
 */
export function HomePage() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        url="/"
        image="/WhatsApp Image 2026-01-09 at 4.37.40 PM.jpeg"
        structuredData={organizationSchema}
      />

      <HeroSlideshow />
      <VisionMissionSection />
      <ValuesSection />
      <StatsSection />
      <ManagementSection />
      <PartnersSection />
      <OECRibbonSection />
      <ServicesPreview />
      <JointVenturesSection />
      <CTASection />
    </>
  )
}
