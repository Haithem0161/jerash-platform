import type { LucideIcon } from 'lucide-react'
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
 * Individual service card for the Services grid.
 * Displays icon, title, and short description.
 * Styled as a clickable button with hover effects.
 */
export function ServiceCard({ title, shortDescription, icon: Icon, onClick }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border p-6 text-center',
        'transition-colors hover:border-jerash-orange hover:bg-muted/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      )}
    >
      <Icon className="h-10 w-10 text-jerash-orange" />
      <h3 className="font-medium text-jerash-blue">{title}</h3>
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {shortDescription}
      </p>
    </button>
  )
}
