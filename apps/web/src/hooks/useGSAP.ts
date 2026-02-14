import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from './useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

type GSAPCallback = (
  gsapInstance: typeof gsap,
  element: HTMLElement,
) => void

/**
 * Custom hook wrapping GSAP + ScrollTrigger with React lifecycle.
 * Automatically cleans up all GSAP tweens/ScrollTriggers on unmount.
 * Skips animation setup if the user prefers reduced motion.
 */
export function useGSAP<T extends HTMLElement = HTMLDivElement>(
  callback: GSAPCallback,
  deps: React.DependencyList = [],
) {
  const ref = useRef<T>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (prefersReducedMotion || !ref.current) return

    const element = ref.current
    const ctx = gsap.context(() => {
      callback(gsap, element)
    }, ref)

    return () => ctx.revert()
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion, ...deps])

  return ref
}

export { gsap, ScrollTrigger }
