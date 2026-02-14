import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'motion/react'
import { MapPin, Building2, Briefcase, X } from 'lucide-react'
import { useJobs } from '@/hooks/api'
import { useBilingual } from '@/hooks/useBilingual'
import { JobCard } from './JobCard'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Job } from '@/types/api'

/**
 * Skeleton loader for job cards
 */
function JobListingsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="glass rounded-2xl p-6">
          <Skeleton className="mb-4 h-6 w-3/4 bg-white/10" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-2/3 bg-white/10" />
          </div>
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-5 w-20 bg-white/10" />
            <Skeleton className="h-5 w-20 bg-white/10" />
            <Skeleton className="h-5 w-20 bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Job listings grid with expand-in-place detail view.
 * Clicking a card expands it to full width showing the full description.
 */
export function JobListings() {
  const { t } = useTranslation('careers')
  const { data: jobs, isLoading } = useJobs()
  const { resolve } = useBilingual()
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null)

  const handleApply = () => {
    setExpandedJobId(null)
    setTimeout(() => {
      document.getElementById('cv-upload')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="space-y-8">
      <FadeIn className="text-center">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          {t('jobListings.title')}
        </h2>
        <p className="mt-2 text-white/50">
          {t('jobListings.description')}
        </p>
      </FadeIn>

      {isLoading ? (
        <JobListingsSkeleton />
      ) : (
        <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {jobs?.map((job: Job, index: number) => {
              const isExpanded = expandedJobId === job.id
              const hasExpanded = expandedJobId !== null

              return (
                <motion.div
                  key={job.id}
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
                    'h-full',
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
                        onClick={() => setExpandedJobId(null)}
                        className="absolute end-6 top-6 rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label="Close"
                      >
                        <X className="h-5 w-5" />
                      </button>

                      {/* Header */}
                      <h3 className="text-2xl font-bold text-white">
                        {resolve(job.titleEn, job.titleAr)}
                      </h3>

                      {/* Badges row */}
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/50">
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="size-4 text-jerash-orange" />
                          {resolve(job.departmentEn, job.departmentAr)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-4 text-jerash-orange" />
                          {resolve(job.locationEn, job.locationAr)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Briefcase className="size-4 text-jerash-orange" />
                          {resolve(job.typeEn, job.typeAr)}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="my-6 h-px bg-white/10" />

                      {/* Full description */}
                      <AnimatePresence>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.15 }}
                          className="whitespace-pre-line text-base leading-relaxed text-white/60"
                        >
                          {resolve(job.fullDescriptionEn, job.fullDescriptionAr)}
                        </motion.p>
                      </AnimatePresence>

                      {/* Apply button */}
                      <Button
                        onClick={handleApply}
                        className="mt-6 w-full bg-jerash-orange hover:bg-jerash-orange/90 sm:w-auto"
                        size="lg"
                      >
                        {t('modal.applyButton')}
                      </Button>
                    </div>
                  ) : (
                    /* Collapsed card view */
                    <JobCard
                      title={resolve(job.titleEn, job.titleAr)}
                      department={resolve(job.departmentEn, job.departmentAr)}
                      location={resolve(job.locationEn, job.locationAr)}
                      type={resolve(job.typeEn, job.typeAr)}
                      description={resolve(job.descriptionEn, job.descriptionAr)}
                      onClick={() => setExpandedJobId(job.id)}
                    />
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
