import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useFirstVisit } from '@/hooks/useFirstVisit'
import { usePrefersReducedMotion } from '@/hooks'

/**
 * Cinematic logo reveal intro.
 * Full-screen dark background with logo fade-in, orange glow pulse,
 * and vertical curtain split to reveal the page.
 * Only shows on first session visit. Skips on reduced motion.
 */
export function LoadingOverlay() {
  const { isFirstVisit, markVisited } = useFirstVisit()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [showOverlay, setShowOverlay] = useState(
    isFirstVisit && !prefersReducedMotion,
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const leftCurtainRef = useRef<HTMLDivElement>(null)
  const rightCurtainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showOverlay) {
      markVisited()
      return
    }

    const logo = logoRef.current
    const glow = glowRef.current
    const leftCurtain = leftCurtainRef.current
    const rightCurtain = rightCurtainRef.current

    if (!logo || !glow || !leftCurtain || !rightCurtain) return

    // Prevent scrolling during intro
    document.body.style.overflow = 'hidden'

    const tl = gsap.timeline({
      onComplete: () => {
        setShowOverlay(false)
        markVisited()
        document.body.style.overflow = ''
      },
    })

    // Phase 1: Logo fade in + scale (0 -> 0.8s)
    tl.fromTo(
      logo,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' },
    )

    // Phase 2: Glow pulse appears (0.6 -> 1.3s)
    tl.fromTo(
      glow,
      { opacity: 0, scale: 0.5 },
      { opacity: 0.6, scale: 1, duration: 0.7, ease: 'power2.out' },
      0.6,
    )

    // Phase 3: Curtain split (1.5 -> 2.3s)
    tl.to(
      leftCurtain,
      { xPercent: -100, duration: 0.8, ease: 'power3.inOut' },
      1.5,
    )
    tl.to(
      rightCurtain,
      { xPercent: 100, duration: 0.8, ease: 'power3.inOut' },
      1.5,
    )
    // Fade out logo and glow during split
    tl.to(
      [logo, glow],
      { opacity: 0, duration: 0.3, ease: 'power2.in' },
      1.5,
    )

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [showOverlay, markVisited])

  if (!showOverlay) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-100"
      aria-hidden="true"
    >
      {/* Left curtain */}
      <div
        ref={leftCurtainRef}
        className="absolute inset-y-0 left-0 w-1/2"
        style={{ background: 'oklch(0.06 0.02 250)' }}
      />
      {/* Right curtain */}
      <div
        ref={rightCurtainRef}
        className="absolute inset-y-0 right-0 w-1/2"
        style={{ background: 'oklch(0.06 0.02 250)' }}
      />

      {/* Orange glow behind logo */}
      <div
        ref={glowRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 400,
          height: 400,
          background:
            'radial-gradient(circle, oklch(0.65 0.20 50 / 30%) 0%, transparent 70%)',
          opacity: 0,
        }}
      />

      {/* Centered logo */}
      <img
        ref={logoRef}
        src="/Jerash-logo-color.png"
        alt="Jerash"
        className="absolute left-1/2 top-1/2 h-32 w-auto -translate-x-1/2 -translate-y-1/2 md:h-40"
        style={{ opacity: 0 }}
      />
    </div>
  )
}
