import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ServiceCard } from './ServiceCard'
import { cn } from '@/lib/utils'

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
  expandedServiceId: string | null
  onExpand: (id: string | null) => void
}

/**
 * Animated grid of service cards with expand-in-place detail view.
 * Clicking a card expands it to full width showing the full description.
 */
export function ServicesGrid({
  services,
  onServiceClick,
  expandedServiceId,
  onExpand,
}: ServicesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {services.map((service, index) => {
          const isExpanded = expandedServiceId === service.id
          const hasExpanded = expandedServiceId !== null
          const Icon = service.icon

          return (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: hasExpanded && !isExpanded ? 0.4 : 1,
                y: 0,
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.4,
                delay: Math.min(index * 0.05, 0.4),
                ease: 'easeOut',
                layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
              }}
              className={cn(
                isExpanded && 'col-span-full',
                hasExpanded && !isExpanded && 'pointer-events-none',
              )}
            >
              {isExpanded ? (
                /* Expanded detail view */
                <div className="glass relative rounded-2xl p-8">
                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => onExpand(null)}
                    className="absolute end-6 top-6 rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  {/* Header */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-jerash-orange/20 bg-jerash-orange/10">
                      <Icon
                        className="h-7 w-7 text-jerash-orange"
                        style={{
                          filter: 'drop-shadow(0 0 8px oklch(0.65 0.20 50 / 50%))',
                        }}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {service.title}
                    </h3>
                  </div>

                  {/* Divider */}
                  <div className="my-6 h-px bg-white/10" />

                  {/* Description */}
                  <AnimatePresence>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.15 }}
                      className="text-base leading-relaxed text-white/60"
                    >
                      {service.description}
                    </motion.p>
                  </AnimatePresence>
                </div>
              ) : (
                /* Collapsed card view */
                <ServiceCard
                  title={service.title}
                  shortDescription={service.shortDescription}
                  icon={service.icon}
                  onClick={() => {
                    onServiceClick(service)
                    onExpand(service.id)
                  }}
                />
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
