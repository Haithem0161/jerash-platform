import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2, GripVertical } from 'lucide-react'
import type { HeroSlide } from '@repo/types'
import { heroSlidesApi } from '@/lib/api'
import { BilingualInput, ImageUploader } from '@/components/forms'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
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

const slideSchema = z.object({
  imageUrl: z.string().min(1, 'Image is required'),
  titleEn: z.string().min(1, 'English title is required'),
  titleAr: z.string().min(1, 'Arabic title is required'),
  subtitleEn: z.string().optional(),
  subtitleAr: z.string().optional(),
  isActive: z.boolean(),
})

type SlideForm = z.infer<typeof slideSchema>

export function HeroSlidesPage() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [deletingSlide, setDeletingSlide] = useState<HeroSlide | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['hero-slides'],
    queryFn: () => heroSlidesApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: heroSlidesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] })
      toast.success('Slide created successfully')
      handleCloseDialog()
    },
    onError: () => toast.error('Failed to create slide'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HeroSlide> }) =>
      heroSlidesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] })
      toast.success('Slide updated successfully')
      handleCloseDialog()
    },
    onError: () => toast.error('Failed to update slide'),
  })

  const deleteMutation = useMutation({
    mutationFn: heroSlidesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] })
      toast.success('Slide deleted successfully')
      setDeletingSlide(null)
    },
    onError: () => toast.error('Failed to delete slide'),
  })

  const form = useForm<SlideForm>({
    resolver: zodResolver(slideSchema),
    defaultValues: {
      imageUrl: '',
      titleEn: '',
      titleAr: '',
      subtitleEn: '',
      subtitleAr: '',
      isActive: true,
    },
  })

  const handleOpenDialog = (slide?: HeroSlide) => {
    if (slide) {
      setEditingSlide(slide)
      form.reset({
        imageUrl: slide.imageUrl,
        titleEn: slide.titleEn,
        titleAr: slide.titleAr,
        subtitleEn: slide.subtitleEn || '',
        subtitleAr: slide.subtitleAr || '',
        isActive: slide.isActive,
      })
    } else {
      setEditingSlide(null)
      form.reset()
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingSlide(null)
    form.reset()
  }

  const onSubmit = (data: SlideForm) => {
    if (editingSlide) {
      updateMutation.mutate({ id: editingSlide.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-video" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hero Slides</h1>
          <p className="text-muted-foreground">Manage homepage hero slideshow</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Slide
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.data?.map((slide: HeroSlide) => (
          <div
            key={slide.id}
            className="group relative aspect-video overflow-hidden rounded-lg border bg-muted"
          >
            <img
              src={slide.imageUrl}
              alt={slide.titleEn}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-bold">{slide.titleEn}</h3>
                {slide.subtitleEn && (
                  <p className="text-sm opacity-80">{slide.subtitleEn}</p>
                )}
              </div>
            </div>
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-5 w-5 text-white cursor-grab" />
            </div>
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleOpenDialog(slide)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setDeletingSlide(slide)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {!slide.isActive && (
              <div className="absolute bottom-2 right-2">
                <span className="rounded bg-yellow-500 px-2 py-1 text-xs font-medium text-white">
                  Inactive
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {(!data?.data || data.data.length === 0) && (
        <div className="text-center py-12 text-muted-foreground">
          No slides yet. Add your first slide to get started.
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSlide ? 'Edit Slide' : 'Add Slide'}
            </DialogTitle>
            <DialogDescription>
              {editingSlide
                ? 'Update slide content'
                : 'Add a new slide to the hero section'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ImageUploader
              label="Background Image"
              value={form.watch('imageUrl')}
              onChange={(url) => form.setValue('imageUrl', url)}
              folder="hero"
              required
              error={form.formState.errors.imageUrl?.message}
            />

            <BilingualInput
              name="title"
              label="Title"
              register={form.register}
              errors={form.formState.errors}
              required
            />

            <BilingualInput
              name="subtitle"
              label="Subtitle"
              register={form.register}
              errors={form.formState.errors}
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
                {editingSlide ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingSlide}
        onOpenChange={() => setDeletingSlide(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Slide</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingSlide?.titleEn}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingSlide && deleteMutation.mutate(deletingSlide.id)}
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
