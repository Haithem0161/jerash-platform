import { motion, AnimatePresence } from 'motion/react'
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
 */
export function ServicesGrid({ services, onServiceClick }: ServicesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.3,
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
    </div>
  )
}
