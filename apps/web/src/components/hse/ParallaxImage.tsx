import { useRef } from 'react'
import { useScroll, useTransform, useSpring, motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  /** Parallax intensity in pixels (default: 100) */
  intensity?: number
}

/**
 * Image with subtle parallax scroll effect.
 * Uses spring easing for smooth animation.
 * Only animates transform (GPU-accelerated) for performance.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  intensity = 100
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Track scroll progress for this specific element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"] // Start when element enters viewport, end when it leaves
  })

  // Transform scroll progress to parallax offset
  const rawY = useTransform(scrollYProgress, [0, 1], [intensity, -intensity])

  // Apply spring easing for smoothness (prevents stuttering on fast scroll)
  const y = useSpring(rawY, { stiffness: 300, damping: 30 })

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-80 md:h-96 overflow-hidden rounded-lg border border-jerash-blue/10",
        className
      )}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy" // Native lazy loading for images below fold
        style={{ y }}
        className="h-[120%] w-full object-cover" // Extra height for parallax movement
      />
    </div>
  )
}
