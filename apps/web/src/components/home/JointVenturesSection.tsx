import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { Skeleton } from '@/components/ui/skeleton'
import { isRTL } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useJointVentures } from '@/hooks/api'
import { useBilingual } from '@/hooks/useBilingual'

function JVLogo({
  name,
  logoUrl,
  website,
}: {
  name: string
  logoUrl: string
  website: string | null
}) {
  const content = (
    <div className="flex h-20 items-center justify-center px-6">
      <img
        src={logoUrl}
        alt={name}
        className="max-h-12 w-auto object-contain grayscale transition-all hover:grayscale-0"
        loading="lazy"
      />
    </div>
  )

  if (website) {
    return (
      <a href={website} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return content
}

function JVSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-36 rounded-lg" />
      ))}
    </div>
  )
}

/**
 * Joint Ventures section showing up to 10 JV logos in a static grid.
 */
export function JointVenturesSection() {
  const { t, i18n } = useTranslation()
  const rtl = isRTL(i18n.language)
  const { data: jointVentures, isLoading } = useJointVentures()
  const { resolve } = useBilingual()

  const displayJVs = jointVentures?.slice(0, 10)

  return (
    <Section id="joint-ventures">
      <FadeIn className="mb-12 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          {t('home.jointVentures.title')}
        </h2>
      </FadeIn>

      <FadeIn delay={0.1}>
        {isLoading ? (
          <JVSkeleton />
        ) : displayJVs && displayJVs.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-8">
            {displayJVs.map((jv) => (
              <JVLogo
                key={jv.id}
                name={resolve(jv.nameEn, jv.nameAr)}
                logoUrl={jv.logoUrl}
                website={jv.website}
              />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">
              {t('home.jointVentures.noJointVentures')}
            </p>
          </div>
        )}
      </FadeIn>

      <FadeIn delay={0.2} className="mt-12 text-center">
        <Link
          to="/joint-ventures"
          className="linkHover inline-flex items-center gap-2 text-primary"
        >
          {t('home.jointVentures.seeAll')}
          <ArrowRight className={cn('h-4 w-4', rtl && 'rotate-180')} />
        </Link>
      </FadeIn>
    </Section>
  )
}
