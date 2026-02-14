import { useRef } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/animations/FadeIn'
import { TextReveal } from '@/components/animations/TextReveal'
import { isRTL } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/**
 * Dramatic CTA with animated gradient mesh background
 * and magnetic cursor-following button.
 */
export function CTASection() {
  const { t, i18n } = useTranslation()
  const rtl = isRTL(i18n.language)
  const buttonRef = useRef<HTMLAnchorElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distX = e.clientX - centerX
    const distY = e.clientY - centerY
    // Max 8px offset
    x.set(Math.max(-8, Math.min(8, distX * 0.1)))
    y.set(Math.max(-8, Math.min(8, distY * 0.1)))
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <Section
      id="cta"
      fullWidth
      className="relative flex min-h-[80vh] items-center overflow-hidden"
    >
      {/* Animated gradient mesh background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, oklch(0.40 0.12 250 / 25%) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, oklch(0.65 0.20 50 / 15%) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, oklch(0.30 0.10 250 / 20%) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 60%, oklch(0.55 0.20 45 / 10%) 0%, transparent 40%),
            oklch(0.08 0.02 250)
          `,
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 20s ease infinite',
        }}
      />

      {/* Content */}
      <Container className="relative z-10 text-center">
        <FadeIn>
          <TextReveal
            as="h2"
            className="mx-auto max-w-3xl text-5xl font-bold md:text-6xl lg:text-7xl"
          >
            {t('home.cta.title')}
          </TextReveal>
          {/* Apply gradient after reveal */}
          <div className="mt-2 text-gradient-orange text-5xl font-bold md:text-6xl lg:text-7xl opacity-0 pointer-events-none select-none h-0 overflow-hidden" aria-hidden="true">
            {t('home.cta.title')}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/50">
            {t('home.cta.subtitle')}
          </p>

          {/* Magnetic button */}
          <div
            className="mt-10 inline-block"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div style={{ x: springX, y: springY }}>
              <Link
                ref={buttonRef}
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-jerash-orange px-10 py-4 text-base font-semibold text-white transition-colors hover:bg-jerash-orange/90"
              >
                {t('home.cta.button')}
                <ArrowRight
                  className={cn('h-5 w-5', rtl && 'rotate-180')}
                />
              </Link>
            </motion.div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  )
}
