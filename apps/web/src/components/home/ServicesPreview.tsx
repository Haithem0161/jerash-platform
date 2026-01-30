import { useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowRight,
  Cog,
  Droplet,
  Layers,
  FlaskConical,
  Pipette,
  Plus,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { isRTL } from '@/lib/i18n'
import { cn } from '@/lib/utils'

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
    image: '/service1.jpg',
  },
  {
    key: 'drillingFluid',
    icon: Droplet,
    titleKey: 'home.services.items.drillingFluid.title',
    descKey: 'home.services.items.drillingFluid.description',
    image: '/service2.jpg',
  },
  {
    key: 'cementing',
    icon: Layers,
    titleKey: 'home.services.items.cementing.title',
    descKey: 'home.services.items.cementing.description',
    image: '/service3.jpg',
  },
  {
    key: 'nitrogen',
    icon: FlaskConical,
    titleKey: 'home.services.items.nitrogen.title',
    descKey: 'home.services.items.nitrogen.description',
    image: '/service4.jpg',
  },
  {
    key: 'filtration',
    icon: Pipette,
    titleKey: 'home.services.items.filtration.title',
    descKey: 'home.services.items.filtration.description',
    image: '/service5.jpg',
  },
]

function AccordionItem({
  icon: Icon,
  title,
  description,
  isOpen,
  onToggle,
}: {
  icon: LucideIcon
  title: string
  description: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-4 py-5 text-start"
      >
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors',
            isOpen
              ? 'border-jerash-orange/20 bg-jerash-orange/10'
              : 'border-border bg-muted/50'
          )}
        >
          <Icon
            className={cn(
              'h-5 w-5 transition-colors',
              isOpen ? 'text-jerash-orange' : 'text-muted-foreground'
            )}
          />
        </div>
        <span className="flex-1 text-lg font-semibold text-foreground">
          {title}
        </span>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center">
          {isOpen ? (
            <X className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Plus className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 ps-14 text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Services section for homepage.
 * Split layout: image (left) + accordion (right).
 * Clicking an accordion item crossfades the image.
 */
export function ServicesPreview() {
  const { t, i18n } = useTranslation()
  const rtl = isRTL(i18n.language)
  const [activeIndex, setActiveIndex] = useState(0)

  const activeImage =
    activeIndex >= 0
      ? SERVICES[activeIndex].image
      : SERVICES[0].image

  return (
    <Section id="services">
      <FadeIn className="mb-12 text-center">
        <span className="mb-4 inline-block rounded-full border border-jerash-orange/20 bg-jerash-orange/10 px-4 py-1.5 text-sm font-medium text-jerash-orange">
          {t('nav.services')}
        </span>
        <h2 className="text-3xl font-bold md:text-4xl">
          {t('home.services.title')}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          {t('home.services.subtitle')}
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
        {/* Image with crossfade */}
        <FadeIn direction="up" className="order-1">
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl lg:aspect-auto lg:h-full lg:min-h-[480px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={activeImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
            </AnimatePresence>
          </div>
        </FadeIn>

        {/* Accordion */}
        <FadeIn direction="up" delay={0.1} className="order-2">
          <div className="flex flex-col border-t border-border">
            {SERVICES.map((cat, i) => (
              <AccordionItem
                key={cat.key}
                icon={cat.icon}
                title={t(cat.titleKey)}
                description={t(cat.descKey)}
                isOpen={activeIndex === i}
                onToggle={() =>
                  setActiveIndex(i === activeIndex ? -1 : i)
                }
              />
            ))}
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.2} className="mt-12 text-center">
        <Link
          to="/services"
          className="linkHover inline-flex items-center gap-2 text-primary"
        >
          {t('home.services.seeAll')}
          <ArrowRight className={cn('h-4 w-4', rtl && 'rotate-180')} />
        </Link>
      </FadeIn>
    </Section>
  )
}
