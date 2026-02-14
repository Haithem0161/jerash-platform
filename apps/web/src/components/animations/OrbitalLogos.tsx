import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { isRTL } from '@/lib/i18n'
import { usePrefersReducedMotion, useIsMobile } from '@/hooks'
import { cn } from '@/lib/utils'

interface OrbitalLogo {
  name: string
  logoUrl: string
  website?: string | null
}

interface OrbitalLogosProps {
  logos: OrbitalLogo[]
  /** Content to display in the center of the orbit */
  centerContent?: ReactNode
  /** Full orbit rotation duration in seconds (default 60) */
  orbitDuration?: number
  /** Orbit radius in pixels (default 200) */
  radius?: number
  className?: string
}

/**
 * Reusable circular logo orbit arrangement.
 * Logos are distributed at equal angles around a central element.
 * Hover pauses rotation and highlights the hovered logo.
 * Mobile (<640px) falls back to a simple flex-wrap grid.
 * RTL reverses orbit direction.
 */
export function OrbitalLogos({
  logos,
  centerContent,
  orbitDuration = 60,
  radius = 200,
  className,
}: OrbitalLogosProps) {
  const { i18n } = useTranslation()
  const rtl = isRTL(i18n.language)
  const prefersReducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()

  // Mobile fallback: simple grid
  if (isMobile) {
    return (
      <div className={cn('flex flex-wrap items-center justify-center gap-6', className)}>
        {logos.map((logo) => {
          const content = (
            <div className="glass glass-hover flex h-20 w-28 items-center justify-center rounded-xl p-3">
              <img
                src={logo.logoUrl}
                alt={logo.name}
                className="h-12 w-auto max-w-full object-contain grayscale transition-all duration-300 hover:grayscale-0"
              />
            </div>
          )
          if (logo.website) {
            return (
              <a key={logo.name} href={logo.website} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            )
          }
          return <div key={logo.name}>{content}</div>
        })}
      </div>
    )
  }

  const angleStep = 360 / logos.length
  const containerSize = radius * 2 + 120 // Extra space for logo size

  return (
    <div
      className={cn('flex items-center justify-center', className)}
    >
      <div
        className="group relative"
        style={{
          width: containerSize,
          height: containerSize,
        }}
      >
        {/* Orbital ring */}
        <div
          className="absolute rounded-full border border-white/5"
          style={{
            width: radius * 2,
            height: radius * 2,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Center content */}
        {centerContent && (
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            {centerContent}
          </div>
        )}

        {/* Rotating orbit container */}
        <div
          className="absolute inset-0 group-hover:[animation-play-state:paused]"
          style={
            prefersReducedMotion
              ? undefined
              : {
                  animation: `orbit ${orbitDuration}s linear infinite`,
                  animationDirection: rtl ? 'reverse' : 'normal',
                }
          }
        >
          {logos.map((logo, index) => {
            const angle = angleStep * index
            const content = (
              <img
                src={logo.logoUrl}
                alt={logo.name}
                className="h-10 w-auto max-w-[80px] object-contain brightness-75 grayscale transition-all duration-300 hover:scale-[1.3] hover:brightness-100 hover:grayscale-0"
              />
            )

            const logoElement = (
              <div
                key={logo.name}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`,
                  marginLeft: -40,
                  marginTop: -24,
                }}
              >
                {/* Counter-rotate to keep logos upright during orbit */}
                <div
                  className="flex h-12 w-20 items-center justify-center"
                  style={
                    prefersReducedMotion
                      ? undefined
                      : {
                          animation: `orbit ${orbitDuration}s linear infinite`,
                          animationDirection: rtl ? 'normal' : 'reverse',
                        }
                  }
                >
                  {logo.website ? (
                    <a href={logo.website} target="_blank" rel="noopener noreferrer">
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </div>
              </div>
            )

            return logoElement
          })}
        </div>
      </div>
    </div>
  )
}
