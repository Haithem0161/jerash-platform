import { MapPin, Building2, Briefcase } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
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
 * Individual job card for the job listings grid.
 * Shows job title, department, location, type, and brief description.
 * Hover effect uses brightness-110 consistent with gallery pattern.
 */
export function JobCard({ title, department, location, type, description, onClick }: JobCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200',
        'hover:border-jerash-orange hover:shadow-md'
      )}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg text-jerash-blue">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
