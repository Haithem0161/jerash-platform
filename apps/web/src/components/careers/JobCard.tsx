import { MapPin, Building2, Briefcase } from 'lucide-react'
import { GlowBorder } from '@/components/animations/GlowBorder'
import { cn } from '@/lib/utils'

interface JobCardProps {
  /** Job title (already resolved for current language) */
  title: string
  /** Department (already resolved for current language) */
  department: string
  /** Location (already resolved for current language) */
  location: string
  /** Job type e.g. Full-time (already resolved for current language) */
  type: string
  /** Brief job description (already resolved for current language) */
  description: string
  /** Click handler */
  onClick: () => void
}

/**
 * Glass-styled job card with glow border on hover.
 * Shows job title, department/location/type badges, and brief description.
 */
export function JobCard({ title, department, location, type, description, onClick }: JobCardProps) {
  return (
    <GlowBorder color="orange" intensity={0} className="h-full">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'glass glass-hover flex h-full w-full flex-col items-start gap-4 rounded-2xl p-6 text-start',
          'transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        )}
      >
        <h3 className="text-lg font-semibold text-white">{title}</h3>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
          <span className="inline-flex items-center gap-1">
            <Building2 className="size-4 text-jerash-orange" />
            {department}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-4 text-jerash-orange" />
            {location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Briefcase className="size-4 text-jerash-orange" />
            {type}
          </span>
        </div>

        {/* Brief description */}
        <p className="text-sm leading-relaxed text-white/50 line-clamp-2">
          {description}
        </p>
      </button>
    </GlowBorder>
  )
}
