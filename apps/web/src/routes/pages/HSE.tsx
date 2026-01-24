import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/common/SEO'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { HSEHero } from '@/components/hse/HSEHero'
import { CommitmentList } from '@/components/hse/CommitmentList'
import { ParallaxImage } from '@/components/hse/ParallaxImage'
// SafetyMetrics removed - values were fabricated placeholders not from company profile
// TODO: Re-add SafetyMetrics component when real verified metrics are available from client

export function HSEPage() {
  const { t: tCommon } = useTranslation()

  return (
    <>
      <SEO
        title={tCommon('seo.hse.title')}
        description={tCommon('seo.hse.description')}
        url="/hse"
        image="/images/hse/hse-hero.jpg"
      />

      {/* Full-screen hero */}
      <HSEHero />

      {/* Commitment points section */}
      <CommitmentList />

      {/* First parallax image break - PPE/safety equipment */}
      <Section fullWidth className="py-8 md:py-12">
        <Container>
          <ParallaxImage
            src="/images/hse/ppe-equipment.jpg"
            alt="Personal Protective Equipment in the field"
          />
        </Container>
      </Section>

      {/* Second parallax image break - Team in action */}
      <Section fullWidth className="py-8 md:py-12">
        <Container>
          <ParallaxImage
            src="/images/hse/team-safety.jpg"
            alt="Team following safety protocols on site"
          />
        </Container>
      </Section>

      {/* Third parallax image break - Safety signs/procedures */}
      <Section fullWidth className="py-8 md:py-12">
        <Container>
          <ParallaxImage
            src="/images/hse/safety-signs.jpg"
            alt="Safety signage and procedures"
          />
        </Container>
      </Section>

      {/* SafetyMetrics removed - values were fabricated placeholders not verified from company profile */}
      {/* TODO: Re-add SafetyMetrics when client provides verified incident-free hours, training hours, certification % */}
    </>
  )
}
