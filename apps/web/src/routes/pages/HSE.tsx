import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/common/SEO'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/animations/FadeIn'
import { HSEHero } from '@/components/hse/HSEHero'
import { CommitmentList } from '@/components/hse/CommitmentList'
import { ParallaxImage } from '@/components/hse/ParallaxImage'

export function HSEPage() {
  const { t: tCommon } = useTranslation()
  const { t } = useTranslation('hse')

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

      {/* Introduction section - from company profile */}
      <Section>
        <Container>
          <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed">
            <FadeIn>
              <p>{t('intro.paragraph1')}</p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p>{t('intro.paragraph2')}</p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p>{t('intro.paragraph3')}</p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p>{t('intro.paragraph4')}</p>
            </FadeIn>
          </div>
        </Container>
      </Section>

      {/* First parallax image break */}
      <Section fullWidth className="py-8 md:py-12">
        <Container>
          <ParallaxImage
            src="/images/hse/ppe-equipment.jpg"
            alt="Personal Protective Equipment in the field"
          />
        </Container>
      </Section>

      {/* Commitment points section */}
      <CommitmentList />

      {/* Second parallax image break */}
      <Section fullWidth className="py-8 md:py-12">
        <Container>
          <ParallaxImage
            src="/images/hse/team-safety.jpg"
            alt="Team following safety protocols on site"
          />
        </Container>
      </Section>

      {/* Policy Compliance section */}
      <Section>
        <Container>
          <FadeIn className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-jerash-blue mb-4">
              {t('policy.title')}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t('policy.text')}
            </p>
          </FadeIn>
        </Container>
      </Section>
    </>
  )
}
