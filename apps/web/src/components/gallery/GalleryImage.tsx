import { useState } from 'react'
import { motion, type Variants } from 'motion/react'
import { cn } from '@/lib/utils'

interface GalleryImageProps {
  src: string
  alt: string
  width: number
  height: number
  onClick: () => void
}

/**
 * Item animation variants for stagger effect.
 * Used by parent masonry container to animate children.
 */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
}

/**
 * Single gallery image with skeleton loading state and hover brightness effect.
 * Handles loading states with pulsing skeleton placeholder.
 */
export function GalleryImage({
  src,
  alt,
  width,
  height,
  onClick,
}: GalleryImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.div
      variants={itemVariants}
      // style ensures opacity:0 is applied via CSS immediately, preventing FOUC
      style={{ opacity: 0 }}
      className="mb-2 cursor-pointer group relative"
      role="button"
      tabIndex={0}
      aria-label={alt}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* Skeleton placeholder - shows while image loads */}
      {!loaded && (
        <div
          style={{ aspectRatio: `${width} / ${height}` }}
          className={cn(
            'w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse'
          )}
          aria-busy="true"
          aria-label="Loading image"
        />
      )}

      {/* Actual image - positioned over skeleton during transition */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- img is inside role="button" container */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          'w-full h-auto rounded ring-1 ring-jerash-blue/10 transition-all duration-300 group-hover:ring-jerash-orange group-hover:brightness-105',
          loaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
        )}
      />
    </motion.div>
  )
}
