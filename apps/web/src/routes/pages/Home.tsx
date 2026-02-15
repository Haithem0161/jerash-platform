import { useRef, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SEO } from '@/components/common/SEO'
import { organizationSchema } from '@/lib/structured-data'
import {
  CertificatesSection,
  CompanyProfileSection,
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

gsap.registerPlugin(ScrollTrigger)

/**
 * Homepage with all sections assembled.
 * GSAP context wraps all sections for proper cleanup on unmount.
 */
export function HomePage() {
  const { t } = useTranslation()
  const mainRef = useRef<HTMLDivElement>(null)

  // GSAP context for proper cleanup of all ScrollTriggers
  useLayoutEffect(() => {
    if (!mainRef.current) return

    const ctx = gsap.context(() => {
      // Individual sections handle their own GSAP setup.
      // This context ensures cleanup when navigating away.
    }, mainRef)

    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [])

  return (
    <>
      <SEO
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        url="/"
        image="/WhatsApp Image 2026-01-09 at 4.37.40 PM.jpeg"
        structuredData={organizationSchema}
      />

      <div ref={mainRef}>
        <HeroSlideshow />
        <VisionMissionSection />
        <ValuesSection />
        <StatsSection />
        <CertificatesSection />
        <ManagementSection />
        <PartnersSection />
        <OECRibbonSection />
        <ServicesPreview />
        <JointVenturesSection />
        <CompanyProfileSection />
        <CTASection />
      </div>
    </>
  )
}
