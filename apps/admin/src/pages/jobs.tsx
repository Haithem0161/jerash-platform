import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { Job } from '@repo/types'
import { jobsApi } from '@/lib/api'
import { DataTable, DataTableColumnHeader, DataTableRowActions } from '@/components/data-table'
import { BilingualInput, BilingualTextarea } from '@/components/forms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'

const jobSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  titleEn: z.string().min(1, 'English title is required'),
  titleAr: z.string().min(1, 'Arabic title is required'),
  departmentEn: z.string().min(1, 'English department is required'),
  departmentAr: z.string().min(1, 'Arabic department is required'),
  locationEn: z.string().min(1, 'English location is required'),
  locationAr: z.string().min(1, 'Arabic location is required'),
  typeEn: z.string().min(1, 'English type is required'),
  typeAr: z.string().min(1, 'Arabic type is required'),
  descriptionEn: z.string().min(1, 'English description is required'),
  descriptionAr: z.string().min(1, 'Arabic description is required'),
  fullDescriptionEn: z.string().min(1, 'English full description is required'),
  fullDescriptionAr: z.string().min(1, 'Arabic full description is required'),
  isActive: z.boolean(),
})

type JobForm = z.infer<typeof jobSchema>

export function JobsPage() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [deletingJob, setDeletingJob] = useState<Job | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: jobsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job created successfully')
      handleCloseDialog()
    },
    onError: () => toast.error('Failed to create job'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Job> }) =>
      jobsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job updated successfully')
      handleCloseDialog()
    },
    onError: () => toast.error('Failed to update job'),
  })

  const deleteMutation = useMutation({
    mutationFn: jobsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job deleted successfully')
      setDeletingJob(null)
    },
    onError: () => toast.error('Failed to delete job'),
  })

  const form = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      slug: '',
      titleEn: '',
      titleAr: '',
      departmentEn: '',
      departmentAr: '',
      locationEn: '',
      locationAr: '',
      typeEn: '',
      typeAr: '',
      descriptionEn: '',
      descriptionAr: '',
      fullDescriptionEn: '',
      fullDescriptionAr: '',
      isActive: true,
    },
  })

  const handleOpenDialog = (job?: Job) => {
    if (job) {
      setEditingJob(job)
      form.reset({
        slug: job.slug,
        titleEn: job.titleEn,
        titleAr: job.titleAr,
        departmentEn: job.departmentEn,
        departmentAr: job.departmentAr,
        locationEn: job.locationEn,
        locationAr: job.locationAr,
        typeEn: job.typeEn,
        typeAr: job.typeAr,
        descriptionEn: job.descriptionEn,
        descriptionAr: job.descriptionAr,
        fullDescriptionEn: job.fullDescriptionEn,
        fullDescriptionAr: job.fullDescriptionAr,
        isActive: job.isActive,
      })
    } else {
      setEditingJob(null)
      form.reset()
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingJob(null)
    form.reset()
  }

  const onSubmit = (data: JobForm) => {
    if (editingJob) {
      updateMutation.mutate({ id: editingJob.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: 'titleEn',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title (EN)" />
      ),
    },
    {
      accessorKey: 'departmentEn',
      header: 'Department',
    },
    {
      accessorKey: 'locationEn',
      header: 'Location',
    },
    {
      accessorKey: 'typeEn',
      header: 'Type',
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
            row.original.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {row.original.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          onEdit={() => handleOpenDialog(row.original)}
          onDelete={() => setDeletingJob(row.original)}
        />
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Jobs</h1>
        <p className="text-muted-foreground">Manage job listings</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        searchKey="titleEn"
        searchPlaceholder="Search jobs..."
        onAdd={() => handleOpenDialog()}
        addLabel="Add Job"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job' : 'Add Job'}</DialogTitle>
            <DialogDescription>
              {editingJob ? 'Update job listing' : 'Add a new job posting'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...form.register('slug')}
                placeholder="job-slug"
              />
            </div>

            <BilingualInput
              name="title"
              label="Title"
              register={form.register}
              errors={form.formState.errors}
              required
            />

            <BilingualInput
              name="department"
              label="Department"
              register={form.register}
              errors={form.formState.errors}
              required
            />

            <BilingualInput
              name="location"
              label="Location"
              register={form.register}
              errors={form.formState.errors}
              required
            />

            <BilingualInput
              name="type"
              label="Job Type"
              register={form.register}
              errors={form.formState.errors}
              required
            />

            <BilingualTextarea
              name="description"
              label="Short Description"
              register={form.register}
              errors={form.formState.errors}
              required
              rows={3}
            />

            <BilingualTextarea
              name="fullDescription"
              label="Full Description"
              register={form.register}
              errors={form.formState.errors}
              required
              rows={6}
            />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={form.watch('isActive')}
                onCheckedChange={(checked) =>
                  form.setValue('isActive', checked === true)
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingJob ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingJob} onOpenChange={() => setDeletingJob(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingJob?.titleEn}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingJob && deleteMutation.mutate(deletingJob.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
