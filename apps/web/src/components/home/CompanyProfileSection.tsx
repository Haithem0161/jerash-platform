import { useTranslation } from 'react-i18next'
import { FileDown, Download } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'

/**
 * Compact download banner for the company profile PDF.
 * Glass card with gradient left accent, icon, text, and download button.
 */
export function CompanyProfileSection() {
  const { t } = useTranslation()

  return (
    <Section id="company-profile" className="py-10 md:py-12">
      <FadeIn direction="up">
        <div className="glass relative overflow-hidden rounded-2xl">
          {/* Left accent gradient bar */}
          <div
            className="absolute inset-y-0 start-0 w-1"
            style={{
              background: 'linear-gradient(to bottom, oklch(0.65 0.20 50), oklch(0.55 0.20 45))',
            }}
          />

          <div className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:gap-8">
            {/* Icon */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <FileDown
                className="h-7 w-7"
                style={{
                  color: 'oklch(0.65 0.20 50)',
                  filter: 'drop-shadow(0 0 12px oklch(0.65 0.20 50 / 50%))',
                }}
              />
            </div>

            {/* Text */}
            <div className="flex-1 text-center sm:text-start">
              <p className="text-xs font-medium uppercase tracking-wider text-jerash-orange">
                {t('home.companyProfile.label')}
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                {t('home.companyProfile.title')}
              </p>
              <p className="mt-1 text-sm text-white/50">
                {t('home.companyProfile.description')}
              </p>
            </div>

            {/* Download button */}
            <a
              href="/06 Jerash Profile.pdf"
              download
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-jerash-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-jerash-orange/90"
            >
              <Download className="h-4 w-4" />
              {t('home.companyProfile.button')}
            </a>
          </div>
        </div>
      </FadeIn>
    </Section>
  )
}
