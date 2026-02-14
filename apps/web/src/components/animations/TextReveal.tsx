import { useRef, type ElementType } from 'react'
import { useGSAP } from '@/hooks/useGSAP'
import { usePrefersReducedMotion } from '@/hooks'
import { cn } from '@/lib/utils'

interface TextRevealProps {
  children: string
  /** HTML element to render as */
  as?: ElementType
  /** Animation trigger: 'scroll' for on-scroll, 'immediate' for on-mount */
  trigger?: 'scroll' | 'immediate'
  className?: string
}

/**
 * GSAP-powered word-by-word stagger reveal animation.
 * Splits text into individual words, each fading up with stagger.
 * Falls back to plain text when reduced motion is preferred.
 */
export function TextReveal({
  children,
  as: Component = 'span',
  trigger = 'scroll',
  className,
}: TextRevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const containerRef = useRef<HTMLElement>(null)

  const ref = useGSAP(
    (gsap, element) => {
      const words = element.querySelectorAll('.word-reveal')
      if (!words.length) return

      gsap.set(words, { opacity: 0, y: 20 })

      const tween = {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power2.out',
      }

      if (trigger === 'scroll') {
        gsap.to(words, {
          ...tween,
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            once: true,
          },
        })
      } else {
        gsap.to(words, tween)
      }
    },
    [children, trigger],
  )

  // Reduced motion: render plain text
  if (prefersReducedMotion) {
    return <Component className={className}>{children}</Component>
  }

  const words = children.split(/(\s+)/)

  return (
    <Component
      ref={(el: HTMLElement | null) => {
        // Assign both refs
        ;(ref as React.MutableRefObject<HTMLElement | null>).current = el
        ;(containerRef as React.MutableRefObject<HTMLElement | null>).current =
          el
      }}
      className={cn('inline', className)}
    >
      {words.map((word, i) =>
        /^\s+$/.test(word) ? (
          <span key={i}>{word}</span>
        ) : (
          <span
            key={i}
            className="word-reveal inline-block"
            style={{ opacity: 0 }}
          >
            {word}
          </span>
        ),
      )}
    </Component>
  )
}
