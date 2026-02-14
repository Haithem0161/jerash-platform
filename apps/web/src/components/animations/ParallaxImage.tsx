import { useGSAP } from '@/hooks/useGSAP'
import { usePrefersReducedMotion } from '@/hooks'
import { cn } from '@/lib/utils'

interface ParallaxImageProps {
  src: string
  alt: string
  /** Parallax speed - how far the image translates (default 0.3 = 30%) */
  speed?: number
  className?: string
}

/**
 * Scroll-driven parallax image.
 * Uses GSAP ScrollTrigger to translate the image on Y-axis.
 * Image is scaled up 1.2x to prevent gaps during parallax movement.
 */
export function ParallaxImage({
  src,
  alt,
  speed = 0.3,
  className,
}: ParallaxImageProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  const ref = useGSAP(
    (gsap, element) => {
      const img = element.querySelector('img')
      if (!img) return

      gsap.to(img, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    [speed],
  )

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <img
        src={src}
        alt={alt}
        className={cn(
          'h-full w-full object-cover',
          !prefersReducedMotion && 'scale-[1.2]',
        )}
      />
    </div>
  )
}
