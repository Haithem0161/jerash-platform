import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowRight,
  Cable,
  Cog,
  Droplet,
  Layers,
  FlaskConical,
  Pipette,
  type LucideIcon,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { isRTL } from '@/lib/i18n'
import { usePrefersReducedMotion, useIsDesktop } from '@/hooks'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface ServiceItem {
  key: string
  icon: LucideIcon
  titleKey: string
  descKey: string
  image: string
}

const SERVICES: ServiceItem[] = [
  {
    key: 'coiledTubing',
    icon: Cog,
    titleKey: 'home.services.items.coiledTubing.title',
    descKey: 'home.services.items.coiledTubing.description',
    image: '/service1.webp',
  },
  {
    key: 'drillingFluid',
    icon: Droplet,
    titleKey: 'home.services.items.drillingFluid.title',
    descKey: 'home.services.items.drillingFluid.description',
    image: '/service2.webp',
  },
  {
    key: 'cementing',
    icon: Layers,
    titleKey: 'home.services.items.cementing.title',
    descKey: 'home.services.items.cementing.description',
    image: '/service3.webp',
  },
  {
    key: 'nitrogen',
    icon: FlaskConical,
    titleKey: 'home.services.items.nitrogen.title',
    descKey: 'home.services.items.nitrogen.description',
    image: '/service4.webp',
  },
  {
    key: 'filtration',
    icon: Pipette,
    titleKey: 'home.services.items.filtration.title',
    descKey: 'home.services.items.filtration.description',
    image: '/service5.webp',
  },
  {
    key: 'pipelines',
    icon: Cable,
    titleKey: 'home.services.items.pipelines.title',
    descKey: 'home.services.items.pipelines.description',
    image: '/service6.webp',
  },
]

/**
 * Full-screen tabbed services showcase.
 * Desktop: GSAP ScrollTrigger pins section, snaps between 6 service panels.
 * Mobile: Stacked cards with FadeIn reveals.
 */
export function ServicesPreview() {
  const { t, i18n } = useTranslation()
  const rtl = isRTL(i18n.language)
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()
  const isDesktop = useIsDesktop()
  const sectionRef = useRef<HTMLElement>(null)

  // GSAP ScrollTrigger for desktop snap-scroll
  // Deferred to ensure HeroSlideshow's pin (async, depends on API data)
  // has been created first. Without this delay, ServicesPreview's trigger
  // positions are calculated before the Hero's pin-spacer exists (~963px off).
  useEffect(() => {
    if (!isDesktop || prefersReducedMotion || !sectionRef.current) return

    const section = sectionRef.current
    const totalPanels = SERVICES.length
    let ctx: gsap.Context | null = null

    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh()

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: `+=${(totalPanels - 1) * 150}%`,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          scrub: 0.5,
          snap: {
            snapTo: 1 / (totalPanels - 1),
            duration: 0.5,
            ease: 'power2.inOut',
          },
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (totalPanels - 1))
            setActiveIndex(idx)
          },
        })
      }, section)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
      ctx?.revert()
    }
  }, [isDesktop, prefersReducedMotion])

  // Desktop full-screen view
  if (isDesktop && !prefersReducedMotion) {
    const activeService = SERVICES[activeIndex]
    const ActiveIcon = activeService.icon

    return (
      <section
        id="services"
        ref={sectionRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* Background image with crossfade */}
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={activeService.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content card - bottom start */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={cn(
              'glass absolute bottom-16 max-w-lg rounded-2xl p-8',
              'start-16',
            )}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-jerash-orange/20 bg-jerash-orange/10">
              <ActiveIcon className="h-6 w-6 text-jerash-orange" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {t(activeService.titleKey)}
            </h3>
            <p className="mt-3 leading-relaxed text-white/60">
              {t(activeService.descKey)}
            </p>
            {activeIndex === SERVICES.length - 1 && (
              <Link
                to="/services"
                className="mt-6 inline-flex items-center gap-2 text-sm text-jerash-orange transition-colors hover:text-jerash-orange-light"
              >
                {t('home.services.seeAll')}
                <ArrowRight
                  className={cn('h-4 w-4', rtl && 'rotate-180')}
                />
              </Link>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Vertical dot indicators - end side */}
        <div
          className={cn(
            'absolute top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3',
            'end-8',
          )}
        >
          {SERVICES.map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-2 w-2 rounded-full transition-all duration-300',
                activeIndex === index
                  ? 'scale-125 bg-jerash-orange'
                  : 'bg-white/30',
              )}
            />
          ))}
        </div>

        {/* Service badge */}
        <div className="absolute start-16 top-16">
          <span className="rounded-full border border-jerash-orange/20 bg-jerash-orange/10 px-4 py-1.5 text-sm font-medium text-jerash-orange">
            {t('nav.services')}
          </span>
        </div>
      </section>
    )
  }

  // Mobile / reduced motion: stacked cards
  return (
    <Section id="services">
      <FadeIn className="mb-12 text-center">
        <span className="mb-4 inline-block rounded-full border border-jerash-orange/20 bg-jerash-orange/10 px-4 py-1.5 text-sm font-medium text-jerash-orange">
          {t('nav.services')}
        </span>
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          {t('home.services.title')}
        </h2>
      </FadeIn>

      <div className="space-y-6">
        {SERVICES.map((service) => {
          const Icon = service.icon
          return (
            <FadeIn key={service.key}>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={service.image}
                  alt=""
                  className="h-64 w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-jerash-orange/20 bg-jerash-orange/10">
                    <Icon className="h-5 w-5 text-jerash-orange" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {t(service.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm text-white/60">
                    {t(service.descKey)}
                  </p>
                </div>
              </div>
            </FadeIn>
          )
        })}
      </div>

      <FadeIn delay={0.2} className="mt-12 text-center">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-jerash-orange"
        >
          {t('home.services.seeAll')}
          <ArrowRight className={cn('h-4 w-4', rtl && 'rotate-180')} />
        </Link>
      </FadeIn>
    </Section>
  )
}
