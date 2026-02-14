import type { ReactNode } from 'react'
import { isRTL } from '@/lib/i18n'
import { useTranslation } from 'react-i18next'
import { usePrefersReducedMotion } from '@/hooks'
import { cn } from '@/lib/utils'

interface MarqueeProps {
  children: ReactNode
  /** Animation duration in seconds (default 30) */
  speed?: number
  /** Pause animation on hover */
  pauseOnHover?: boolean
  className?: string
}

/**
 * Continuous horizontal scroll ticker.
 * Renders children 2x for seamless loop.
 * RTL-aware direction swap.
 */
export function Marquee({
  children,
  speed = 30,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const { i18n } = useTranslation()
  const rtl = isRTL(i18n.language)
  const prefersReducedMotion = usePrefersReducedMotion()

  const animationName = rtl ? 'marquee-rtl' : 'marquee'

  return (
    <div
      className={cn('overflow-hidden', className)}
      style={pauseOnHover ? undefined : undefined}
    >
      <div
        className={cn(
          'flex w-max',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
        style={
          prefersReducedMotion
            ? undefined
            : {
                animation: `${animationName} ${speed}s linear infinite`,
              }
        }
      >
        {/* Original */}
        <div className="flex shrink-0">{children}</div>
        {/* Duplicate for seamless loop */}
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
