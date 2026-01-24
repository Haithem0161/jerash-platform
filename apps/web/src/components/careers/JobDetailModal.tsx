import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { MapPin, Building2, Briefcase } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export interface SelectedJob {
  title: string
  department: string
  location: string
  type: string
  fullDescription: string
}

interface JobDetailModalProps {
  job: SelectedJob | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Modal displaying full job details with Apply button.
 * Apply button closes modal and scrolls to CV upload form.
 * Uses motion.div for content animation.
 */
export function JobDetailModal({ job, open, onOpenChange }: JobDetailModalProps) {
  const { t } = useTranslation('careers')

  const handleApply = () => {
    // Close modal first
    onOpenChange(false)
    // Small delay to let modal close animation start, then scroll
    setTimeout(() => {
      document.getElementById('cv-upload')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  if (!job) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-jerash-blue">{job.title}</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Building2 className="size-4 text-jerash-orange" />
              {job.department}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-4 text-jerash-orange" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Briefcase className="size-4 text-jerash-orange" />
              {job.type}
            </span>
          </div>

          {/* Full description with preserved whitespace for newlines */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-line">{job.fullDescription}</p>
          </div>

          {/* Apply button */}
          <Button onClick={handleApply} className="w-full bg-jerash-orange hover:bg-jerash-orange/90" size="lg">
            {t('modal.applyButton')}
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
