import { motion, AnimatePresence, LayoutGroup } from 'motion/react'
import type { LucideIcon } from 'lucide-react'
import { ServiceCard } from './ServiceCard'

export interface ResolvedService {
  id: string
  title: string
  shortDescription: string
  description: string
  icon: LucideIcon
  category: string
}

interface ServicesGridProps {
  services: ResolvedService[]
  onServiceClick: (service: ResolvedService) => void
}

/**
 * Animated grid of service cards with filter transitions.
 * Uses AnimatePresence for smooth entry/exit when filtering.
 * LayoutGroup ensures smooth height transitions when filtering.
 */
export function ServicesGrid({ services, onServiceClick }: ServicesGridProps) {
  return (
    <LayoutGroup>
      <motion.div
        layout
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        transition={{
          layout: {
            duration: 0.4,
            ease: 'easeInOut',
          },
        }}
      >
        <AnimatePresence mode="sync">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
                layout: {
                  duration: 0.4,
                  ease: 'easeInOut',
                },
                delay: Math.min(index * 0.03, 0.3),
              }}
            >
              <ServiceCard
                title={service.title}
                shortDescription={service.shortDescription}
                icon={service.icon}
                onClick={() => onServiceClick(service)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  )
}
