import { useTranslation } from 'react-i18next'
import { ShieldCheck, ExternalLink } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { GlowBorder } from '@/components/animations/GlowBorder'

const certificates = [
  {
    key: 'iso9001',
    number: '9001',
    iconColor: 'oklch(0.65 0.20 50)',
    dropShadow: 'drop-shadow(0 0 16px oklch(0.65 0.20 50 / 50%))',
    documentUrl: '/certificates/iso-9001.pdf',
  },
  {
    key: 'iso14001',
    number: '14001',
    iconColor: 'oklch(0.55 0.15 250)',
    dropShadow: 'drop-shadow(0 0 16px oklch(0.55 0.15 250 / 50%))',
    documentUrl: '/certificates/iso-14001.pdf',
  },
  {
    key: 'iso45001',
    number: '45001',
    iconColor: 'oklch(0.75 0.18 55)',
    dropShadow: 'drop-shadow(0 0 16px oklch(0.75 0.18 55 / 50%))',
    documentUrl: '/certificates/iso-45001.pdf',
  },
] as const

/**
 * ISO Certifications section — "Shield Wall" layout.
 * 3 glass cards with glowing shield icons, large ISO numbers,
 * and certificate names. Clicking opens the document in a new tab.
 */
export function CertificatesSection() {
  const { t } = useTranslation()

  return (
    <Section id="certifications">
      <FadeIn direction="up" className="mb-12 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-jerash-orange">
          {t('home.certificates.subtitle')}
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
          {t('home.certificates.title')}
        </h2>
      </FadeIn>

      <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-3">
        {certificates.map(({ key, number, iconColor, dropShadow, documentUrl }, index) => (
          <FadeIn key={key} direction="up" delay={index * 0.1}>
            <GlowBorder color="orange" intensity={0} className="h-full">
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass glass-hover flex h-full flex-col items-center justify-center gap-5 rounded-2xl p-8 text-center transition-all duration-300"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <ShieldCheck
                    className="h-9 w-9"
                    style={{ color: iconColor, filter: dropShadow }}
                  />
                </div>

                <div>
                  <span
                    className="block text-5xl font-bold tracking-tight text-white"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {number}
                  </span>
                  <span className="mt-1 block text-xs font-medium uppercase tracking-widest text-white/40">
                    ISO
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-white/60">
                  {t(`home.certificates.${key}.name`)}
                </p>

                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-jerash-orange transition-colors">
                  {t('home.certificates.viewCertificate')}
                  <ExternalLink className="h-3 w-3" />
                </span>
              </a>
            </GlowBorder>
          </FadeIn>
        ))}
      </div>
    </Section>
  )
}
