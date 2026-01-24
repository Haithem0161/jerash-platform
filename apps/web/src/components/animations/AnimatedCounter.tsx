import { useEffect, useRef } from 'react'
import { animate, useInView, useMotionValue, useTransform, motion } from 'motion/react'

interface AnimatedCounterProps {
  from?: number
  to: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

/**
 * Animated counter that counts up from zero when scrolled into view.
 * Uses useMotionValue to avoid React re-renders on every frame.
 * Animation triggers only once (once: true) when 50% of element is visible.
 */
export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  suffix = '',
  prefix = '',
  className,
}: AnimatedCounterProps) {
  const count = useMotionValue(from)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, {
        duration,
        ease: 'easeOut',
      })
      return () => controls.stop()
    }
  }, [isInView, count, to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}
