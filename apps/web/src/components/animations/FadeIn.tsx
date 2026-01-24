import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { isRTL } from '@/lib/i18n'

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

/**
 * Scroll-triggered fade reveal component with RTL-aware directional support.
 * Elements fade in and move from the specified direction when scrolling into view.
 * Animates once only (stays visible after first reveal).
 *
 * Uses whileInView for reliable viewport detection that works well with
 * smooth scroll libraries like Lenis.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  direction = 'up',
}: FadeInProps) {
  const { i18n } = useTranslation()
  const rtl = isRTL(i18n.language)
  const prefersReducedMotion = useReducedMotion()

  // Calculate initial offset based on direction and RTL
  const getOffset = () => {
    const offset = 20 // pixels
    switch (direction) {
      case 'up':
        return { y: offset }
      case 'down':
        return { y: -offset }
      case 'left':
        // "from left" means element comes from the left
        // In RTL, left side is the trailing side, so flip the direction
        return { x: rtl ? offset : -offset }
      case 'right':
        // "from right" means element comes from the right
        // In RTL, right side is the leading side, so flip the direction
        return { x: rtl ? -offset : offset }
    }
  }

  // Skip animation if user prefers reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  const initialOffset = getOffset()

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.3,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  )
}
