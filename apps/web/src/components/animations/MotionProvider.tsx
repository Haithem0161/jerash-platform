import { MotionConfig } from 'motion/react'
import { defaultTransition } from './variants'

interface MotionProviderProps {
  children: React.ReactNode
}

/**
 * Global motion configuration provider.
 * - reducedMotion="user" respects prefers-reduced-motion system preference
 * - When reduced motion is enabled, transforms become instant while opacity still animates
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig reducedMotion="user" transition={defaultTransition}>
      {children}
    </MotionConfig>
  )
}
