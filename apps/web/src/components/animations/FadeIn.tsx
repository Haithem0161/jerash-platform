import { useRef } from 'react'
import { motion, useReducedMotion, useInView } from 'motion/react'
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
 * Uses useInView hook with initial:true to ensure elements that are already
 * in the viewport on page load will animate properly.
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
  const ref = useRef(null)

  // useInView with once:true ensures animation only happens once
  // amount:0.1 means 10% of element needs to be visible
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1,
  })

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
      ref={ref}
      className={className}
      // style ensures opacity:0 is applied via CSS immediately, preventing FOUC
      style={{ opacity: 0 }}
      initial={{ opacity: 0, ...initialOffset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...initialOffset }}
      transition={{
        duration: 0.3,
        delay: isInView ? delay : 0,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  )
}
