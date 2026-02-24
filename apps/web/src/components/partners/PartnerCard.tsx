import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'

interface JointVentureCardProps {
  /** JV name (already resolved for current language) */
  name: string
  /** JV description (already resolved for current language) */
  description: string
  /** URL to JV logo */
  logoUrl: string
  /** Optional external website URL */
  website?: string | null
  /** Animation delay */
  delay?: number
}

/**
 * Joint Venture profile card displaying logo, name, description, and optional website link.
 * Logo gracefully falls back to placeholder if image fails to load.
 */
export function JointVentureCard({ name, description, logoUrl, website, delay = 0 }: JointVentureCardProps) {
  const { t } = useTranslation('partners')
  const [logoError, setLogoError] = useState(false)

  return (
    <FadeIn delay={delay}>
      <div className="group rounded-lg border bg-card p-6 text-center transition-shadow duration-200 hover:shadow-lg">
        {/* Logo with fallback */}
        <div className="mb-4 flex justify-center">
          {logoError ? (
            <div className="flex h-20 w-40 items-center justify-center rounded bg-muted text-muted-foreground text-sm">
              Logo
            </div>
          ) : (
            <img
              src={logoUrl}
              alt={name}
              className="h-20 w-auto object-contain"
              onError={() => setLogoError(true)}
            />
          )}
        </div>

        {/* Company name */}
        <h3 className="text-xl font-semibold">{name}</h3>

        {/* Description */}
        <p className="mt-2 text-muted-foreground">{description}</p>

        {/* Website link (optional) or Coming Soon */}
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
          >
            {t('partners.visitWebsite')}
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            {t('jointVentures.comingSoon')}
          </p>
        )}
      </div>
    </FadeIn>
  )
}
