import type { Variants, Transition } from 'motion/react'

// Default transition (300ms ease-out) - main reveal animations
export const defaultTransition: Transition = {
  duration: 0.3,
  ease: 'easeOut',
}

// Fast transition (200ms) - page transitions
export const fastTransition: Transition = {
  duration: 0.2,
  ease: 'easeOut',
}

// Instant transition (100ms) - hover responses
export const instantTransition: Transition = {
  duration: 0.1,
  ease: 'linear',
}

// Fade up variants - default scroll reveal
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
}

// Fade only variants - page transitions
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: fastTransition },
  exit: { opacity: 0, transition: fastTransition },
}

// Stagger container variants - parent for staggered children
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

// Stagger item variants - children of stagger container
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
}
