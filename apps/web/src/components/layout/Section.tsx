import { cn } from '@/lib/utils'
import { Container } from './Container'

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  fullWidth?: boolean
}

/**
 * Reusable section wrapper with consistent vertical spacing.
 * By default, content is constrained to max-width via Container.
 * Use fullWidth={true} for hero or full-bleed sections.
 */
export function Section({ children, className, id, fullWidth = false }: SectionProps) {
  const content = fullWidth ? children : <Container>{children}</Container>

  return (
    <section
      id={id}
      className={cn(
        'py-16 md:py-20',
        className
      )}
    >
      {content}
    </section>
  )
}
