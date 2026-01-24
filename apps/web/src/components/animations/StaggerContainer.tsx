import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { staggerContainerVariants, staggerItemVariants } from './variants'

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
}

/**
 * Parent container for staggered child animations.
 * Children wrapped in StaggerItem will animate one after another
 * with a slight delay between each.
 * Triggers when 20% of the container is visible, animates once only.
 *
 * Uses useInView hook instead of whileInView to ensure animations
 * trigger properly on page navigation (not just scroll).
 */
export function StaggerContainer({ children, className }: StaggerContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      className={className}
      // style ensures opacity:0 is applied via CSS immediately, preventing FOUC
      style={{ opacity: 0 }}
      variants={staggerContainerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

/**
 * Child item for StaggerContainer.
 * Inherits animation state from parent StaggerContainer.
 * Each item fades up with staggered timing.
 */
export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      // style ensures opacity:0 is applied via CSS immediately, preventing FOUC
      style={{ opacity: 0 }}
      variants={staggerItemVariants}
    >
      {children}
    </motion.div>
  )
}
