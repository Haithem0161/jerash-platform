import { useTranslation } from 'react-i18next'
import type { LucideIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { isRTL } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export interface SelectedService {
  /** Service title (already resolved for current language) */
  title: string
  /** Full description (already resolved for current language) */
  description: string
  /** Lucide icon component */
  icon: LucideIcon
}

interface ServiceModalProps {
  service: SelectedService | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Modal dialog for displaying full service details.
 * Handles RTL layout for icon positioning.
 */
export function ServiceModal({ service, open, onOpenChange }: ServiceModalProps) {
  const { i18n } = useTranslation()
  const rtl = isRTL(i18n.language)

  if (!service) return null

  const Icon = service.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div
            className={cn(
              'flex items-center gap-3',
              rtl && 'flex-row-reverse'
            )}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl">
              {service.title}
            </DialogTitle>
          </div>
        </DialogHeader>
        <DialogDescription className="text-base leading-relaxed">
          {service.description}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
