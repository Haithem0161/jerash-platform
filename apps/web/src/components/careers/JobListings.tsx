import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useJobs } from '@/hooks/api'
import { useBilingual } from '@/hooks/useBilingual'
import { JobCard } from './JobCard'
import { JobDetailModal, type SelectedJob } from './JobDetailModal'
import { FadeIn } from '@/components/animations/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'
import { Skeleton } from '@/components/ui/skeleton'
import type { Job } from '@/types/api'

/**
 * Skeleton loader for job cards
 */
function JobListingsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-lg border bg-card p-6">
          <Skeleton className="mb-4 h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Job listings grid component.
 * Displays all available jobs as cards in a responsive grid.
 * Clicking a card opens the job detail modal.
 */
export function JobListings() {
  const { t } = useTranslation('careers')
  const { data: jobs, isLoading } = useJobs()
  const { resolve } = useBilingual()
  const [selectedJob, setSelectedJob] = useState<SelectedJob | null>(null)

  // Convert API job to SelectedJob format for the modal
  const handleJobClick = (job: Job) => {
    setSelectedJob({
      title: resolve(job.titleEn, job.titleAr),
      department: resolve(job.departmentEn, job.departmentAr),
      location: resolve(job.locationEn, job.locationAr),
      type: resolve(job.typeEn, job.typeAr),
      fullDescription: resolve(job.fullDescriptionEn, job.fullDescriptionAr),
    })
  }

  return (
    <div className="space-y-8">
      <FadeIn className="text-center">
        <h2 className="text-2xl font-bold text-jerash-blue md:text-3xl">
          {t('jobListings.title')}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {t('jobListings.description')}
        </p>
      </FadeIn>

      {isLoading ? (
        <JobListingsSkeleton />
      ) : (
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs?.map((job) => (
            <StaggerItem key={job.id}>
              <JobCard
                title={resolve(job.titleEn, job.titleAr)}
                department={resolve(job.departmentEn, job.departmentAr)}
                location={resolve(job.locationEn, job.locationAr)}
                type={resolve(job.typeEn, job.typeAr)}
                description={resolve(job.descriptionEn, job.descriptionAr)}
                onClick={() => handleJobClick(job)}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      <JobDetailModal
        job={selectedJob}
        open={selectedJob !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedJob(null)
        }}
      />
    </div>
  )
}
