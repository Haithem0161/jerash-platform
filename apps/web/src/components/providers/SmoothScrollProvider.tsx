import { useEffect, useRef } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import type { LenisRef } from 'lenis/react'
import { cancelFrame, frame } from 'motion/react'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

/**
 * Smooth scroll provider using Lenis with Framer Motion sync.
 *
 * Features:
 * - Butter-smooth momentum scrolling
 * - Synced with Framer Motion's frame loop for perfect animation coordination
 * - Respects prefers-reduced-motion automatically
 * - Optimized lerp and duration for natural feel
 * - Prevents smooth scroll on modals/dialogs
 *
 * Configuration rationale:
 * - lerp: 0.1 - Smooth but responsive (lower = smoother but laggier)
 * - duration: 1.2 - Natural momentum duration
 * - wheelMultiplier: 1 - Standard wheel speed
 * - touchMultiplier: 2 - Better touch response on mobile
 * - smoothWheel: true - Enable smooth wheel scrolling
 * - syncTouch: false - Keep native touch for better mobile UX
 * - autoRaf: false - We sync with Framer Motion's frame loop instead
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<LenisRef>(null)

  // Sync Lenis with Framer Motion's frame loop for perfect animation coordination
  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp)
    }

    // Subscribe to Framer Motion's frame updates
    // The `true` argument means this runs every frame
    frame.update(update, true)

    return () => cancelFrame(update)
  }, [])

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        // Disable internal RAF - we use Framer Motion's frame loop
        autoRaf: false,

        // Lerp (Linear Interpolation) - lower = smoother but more delayed
        // 0.1 is a good balance between smoothness and responsiveness
        lerp: 0.1,

        // Duration of the scroll animation
        // 1.2s feels natural without being too slow
        duration: 1.2,

        // Easing function - exponential decay for natural momentum
        // This is the default Lenis easing, feels very natural
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

        // Wheel settings
        smoothWheel: true,
        wheelMultiplier: 1,

        // Touch settings - keep native for better mobile UX
        // syncTouch enables smooth scrolling on touch devices (can feel weird)
        syncTouch: false,
        touchMultiplier: 2,

        // Prevent smooth scroll on elements with these classes
        // Useful for modals, dropdowns, and other scrollable containers
        prevent: (node) => {
          // Prevent on dialog/modal elements
          if (node.closest('[role="dialog"]')) return true
          if (node.closest('[data-radix-popper-content-wrapper]')) return true
          if (node.closest('.lightbox-container')) return true
          // Prevent on elements with overflow scroll
          const style = window.getComputedStyle(node)
          if (
            style.overflowY === 'scroll' ||
            style.overflowY === 'auto'
          ) {
            // Only prevent if element is actually scrollable
            return node.scrollHeight > node.clientHeight
          }
          return false
        },

        // Enable anchor link scrolling
        anchors: {
          offset: 80, // Account for fixed header
        },
      }}
    >
      {children}
    </ReactLenis>
  )
}

/**
 * Hook to access Lenis instance and scroll state.
 * Re-exports useLenis for convenience.
 *
 * @example
 * ```tsx
 * function Component() {
 *   const lenis = useSmoothScroll((scroll) => {
 *     console.log(scroll.progress) // 0 to 1
 *     console.log(scroll.velocity)
 *     console.log(scroll.direction) // 1 or -1
 *   })
 *
 *   // Programmatic scroll
 *   lenis?.scrollTo('#section', { offset: -100 })
 * }
 * ```
 */
export { useLenis as useSmoothScroll }
