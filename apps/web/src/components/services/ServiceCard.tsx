import type { LucideIcon } from 'lucide-react'
import { GlowBorder } from '@/components/animations/GlowBorder'
import { cn } from '@/lib/utils'

interface ServiceCardProps {
  /** Service title (already resolved for current language) */
  title: string
  /** Short description (already resolved for current language) */
  shortDescription: string
  /** Lucide icon component */
  icon: LucideIcon
  /** Click handler */
  onClick: () => void
}

/**
 * Glass-styled service card with glow border on hover.
 * Displays icon, title, and short description.
 */
export function ServiceCard({ title, shortDescription, icon: Icon, onClick }: ServiceCardProps) {
  return (
    <GlowBorder color="orange" intensity={0} className="h-full">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'glass glass-hover flex h-full flex-col items-start gap-4 rounded-2xl p-6 text-start',
          'transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-jerash-orange/20 bg-jerash-orange/10">
          <Icon
            className="h-6 w-6 text-jerash-orange"
            style={{
              filter: 'drop-shadow(0 0 8px oklch(0.65 0.20 50 / 50%))',
            }}
          />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-white/50">
          {shortDescription}
        </p>
      </button>
    </GlowBorder>
  )
}
