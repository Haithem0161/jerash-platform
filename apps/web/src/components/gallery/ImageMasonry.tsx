import { useRef } from 'react'
import Masonry from 'react-masonry-css'
import { motion, useInView } from 'motion/react'

interface ImageMasonryProps {
  children: React.ReactNode
}

/**
 * Container animation variants for stagger effect.
 * Children use itemVariants from GalleryImage.
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // 50ms between images
      delayChildren: 0.1,
    },
  },
}

/**
 * Responsive breakpoints for masonry columns.
 * - Desktop (default): 4 columns
 * - Tablet (1024px): 3 columns
 * - Mobile (640px): 2 columns
 */
const breakpointColumns = {
  default: 4,
  1024: 3,
  640: 2,
}

/**
 * Masonry grid wrapper with responsive breakpoints and stagger animation.
 * Uses CSS-based masonry for better performance (no JavaScript recalculation).
 * Images animate in sequence as they enter viewport.
 *
 * Uses useInView hook instead of whileInView prop to ensure animations
 * trigger properly on page navigation (not just scroll).
 */
export function ImageMasonry({ children }: ImageMasonryProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <motion.div
      ref={ref}
      // style ensures opacity:0 is applied via CSS immediately, preventing FOUC
      style={{ opacity: 0 }}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-2 w-auto"
        columnClassName="pl-2 bg-clip-padding"
      >
        {children}
      </Masonry>
    </motion.div>
  )
}
