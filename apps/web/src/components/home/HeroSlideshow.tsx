import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isRTL } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useHeroSlides } from '@/hooks/api'
import { useBilingual } from '@/hooks/useBilingual'
import { usePrefersReducedMotion } from '@/hooks'
import { Skeleton } from '@/components/ui/skeleton'

gsap.registerPlugin(ScrollTrigger)

const SLIDE_INTERVAL = 7000

function HeroSkeleton() {
  return (
    <section className="relative h-[200vh]">
      <div className="flex h-screen w-full items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    </section>
  )
}

export function HeroSlideshow() {
  const { t, i18n } = useTranslation()
  const rtl = isRTL(i18n.language)
  const { data: slides, isLoading } = useHeroSlides()
  const { resolve } = useBilingual()
  const [currentSlide, setCurrentSlide] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const accentRef = useRef<HTMLDivElement>(null)

  const resolvedSlides = useMemo(() => {
    if (!slides) return []
    return slides.map((slide) => ({
      id: slide.id,
      imageUrl: slide.imageUrl,
      title: resolve(slide.titleEn, slide.titleAr),
      subtitle: resolve(slide.subtitleEn, slide.subtitleAr),
    }))
  }, [slides, resolve])

  const slideCount = resolvedSlides.length

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const goToPrevious = useCallback(() => {
    if (slideCount === 0) return
    setCurrentSlide((prev) => (prev === 0 ? slideCount - 1 : prev - 1))
  }, [slideCount])

  const goToNext = useCallback(() => {
    if (slideCount === 0) return
    setCurrentSlide((prev) => (prev === slideCount - 1 ? 0 : prev + 1))
  }, [slideCount])

  // Auto-advance slides
  useEffect(() => {
    if (slideCount === 0) return
    const interval = setInterval(goToNext, SLIDE_INTERVAL)
    return () => clearInterval(interval)
  }, [goToNext, slideCount])

  // Preload first two hero images
  useEffect(() => {
    if (!resolvedSlides.length) return
    resolvedSlides.slice(0, 2).forEach((slide) => {
      const img = new Image()
      img.src = slide.imageUrl
    })
  }, [resolvedSlides])

  // GSAP scroll-reveal animation
  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return

    const section = sectionRef.current
    const title = titleRef.current
    const overlay = overlayRef.current
    const imgContainer = imageContainerRef.current
    const subtitle = subtitleRef.current
    const accent = accentRef.current

    if (!title || !overlay || !imgContainer || !subtitle || !accent) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 1,
          pinSpacing: true,
        },
      })

      // Title shrinks, rises, and fades
      tl.fromTo(
        title,
        { scale: 1, y: 0, opacity: 1 },
        { scale: 0.4, y: '-30vh', opacity: 0, ease: 'none' },
        0,
      )

      // Background image unblurs and unscales
      tl.fromTo(
        imgContainer,
        { filter: 'blur(8px)', scale: 1.1 },
        { filter: 'blur(0px)', scale: 1, ease: 'none' },
        0,
      )

      // Overlay fades partially
      tl.fromTo(
        overlay,
        { opacity: 0.85 },
        { opacity: 0.3, ease: 'none' },
        0,
      )

      // Subtitle fades in during last 40% of scroll
      tl.fromTo(
        subtitle,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: 'power2.out' },
        0.6,
      )

      // Accent line animates width
      tl.fromTo(
        accent,
        { width: 0 },
        { width: 64, ease: 'power2.out' },
        0.6,
      )
    }, section)

    return () => ctx.revert()
  }, [prefersReducedMotion, resolvedSlides.length])

  if (isLoading || resolvedSlides.length === 0) {
    return <HeroSkeleton />
  }

  const currentSlideData = resolvedSlides[currentSlide]

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      {/* Background slide images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
          ref={imageContainerRef}
        >
          <img
            src={currentSlideData.imageUrl}
            alt={currentSlideData.title}
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
            style={
              prefersReducedMotion
                ? undefined
                : { filter: 'blur(8px)', transform: 'scale(1.1)' }
            }
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-linear-to-t from-[oklch(0.08_0.02_250)] via-black/50 to-black/30"
        style={prefersReducedMotion ? { opacity: 0.5 } : { opacity: 0.85 }}
      />

      {/* Centered title - large, transforms on scroll */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1
          ref={titleRef}
          className="max-w-4xl px-8 text-center text-[10vw] font-bold leading-none tracking-tighter text-white md:text-[8vw] lg:text-[6vw]"
        >
          {currentSlideData.title}
        </h1>
      </div>

      {/* Subtitle + accent (revealed during scroll) */}
      <div className="absolute inset-x-0 bottom-28 flex flex-col items-center text-center">
        <div
          ref={subtitleRef}
          style={prefersReducedMotion ? undefined : { opacity: 0 }}
        >
          {currentSlideData.subtitle && (
            <p className="mx-auto max-w-xl px-8 text-sm text-white/70 md:text-base">
              {currentSlideData.subtitle}
            </p>
          )}
        </div>
        <div
          ref={accentRef}
          className="mt-4 h-px bg-jerash-orange"
          style={prefersReducedMotion ? { width: 64 } : { width: 0 }}
        />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={rtl ? goToNext : goToPrevious}
        aria-label={t('home.hero.previous')}
        className={cn(
          'absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20',
          'start-4',
        )}
      >
        <ChevronLeft className={cn('h-5 w-5', rtl && 'rotate-180')} />
      </button>
      <button
        onClick={rtl ? goToPrevious : goToNext}
        aria-label={t('home.hero.next')}
        className={cn(
          'absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20',
          'end-4',
        )}
      >
        <ChevronRight className={cn('h-5 w-5', rtl && 'rotate-180')} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {resolvedSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={t('home.hero.goToSlide', { number: index + 1 })}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              currentSlide === index
                ? 'w-6 bg-jerash-orange'
                : 'w-1.5 bg-white/40 hover:bg-white/60',
            )}
          />
        ))}
      </div>
    </section>
  )
}
