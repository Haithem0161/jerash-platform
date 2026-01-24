import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2, GripVertical } from 'lucide-react'
import type { GalleryImage } from '@repo/types'
import { galleryApi } from '@/lib/api'
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

const imageSchema = z.object({
  imageUrl: z.string().min(1, 'Image is required'),
  altEn: z.string().min(1, 'English alt text is required'),
  altAr: z.string().min(1, 'Arabic alt text is required'),
  isActive: z.boolean(),
})

type ImageForm = z.infer<typeof imageSchema>

export function GalleryPage() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [deletingImage, setDeletingImage] = useState<GalleryImage | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => galleryApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: galleryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
      toast.success('Image added successfully')
      handleCloseDialog()
    },
    onError: () => toast.error('Failed to add image'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GalleryImage> }) =>
      galleryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
      toast.success('Image updated successfully')
      handleCloseDialog()
    },
    onError: () => toast.error('Failed to update image'),
  })

  const deleteMutation = useMutation({
    mutationFn: galleryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
      toast.success('Image deleted successfully')
      setDeletingImage(null)
    },
    onError: () => toast.error('Failed to delete image'),
  })

  const form = useForm<ImageForm>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      imageUrl: '',
      altEn: '',
      altAr: '',
      isActive: true,
    },
  })

  const handleOpenDialog = (image?: GalleryImage) => {
    if (image) {
      setEditingImage(image)
      form.reset({
        imageUrl: image.imageUrl,
        altEn: image.altEn,
        altAr: image.altAr,
        isActive: image.isActive,
      })
    } else {
      setEditingImage(null)
      form.reset()
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingImage(null)
    form.reset()
  }

  const onSubmit = (data: ImageForm) => {
    if (editingImage) {
      updateMutation.mutate({ id: editingImage.id, data })
    } else {
      createMutation.mutate({ ...data, width: 0, height: 0 })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground">Manage gallery images</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Image
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.data?.map((image: GalleryImage) => (
          <div
            key={image.id}
            className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
          >
            <img
              src={image.thumbnailUrl || image.imageUrl}
              alt={image.altEn}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="absolute top-2 left-2">
                <GripVertical className="h-5 w-5 text-white cursor-grab" />
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleOpenDialog(image)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeletingImage(image)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {!image.isActive && (
                <div className="absolute bottom-2 left-2">
                  <span className="rounded bg-yellow-500 px-2 py-1 text-xs font-medium text-white">
                    Inactive
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {(!data?.data || data.data.length === 0) && (
        <div className="text-center py-12 text-muted-foreground">
          No images yet. Add your first image to get started.
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingImage ? 'Edit Image' : 'Add Image'}
            </DialogTitle>
            <DialogDescription>
              {editingImage
                ? 'Update image details'
                : 'Add a new image to the gallery'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ImageUploader
              label="Image"
              value={form.watch('imageUrl')}
              onChange={(url) => form.setValue('imageUrl', url)}
              folder="gallery"
              required
              error={form.formState.errors.imageUrl?.message}
            />

            <BilingualInput
              name="alt"
              label="Alt Text"
              register={form.register}
              errors={form.formState.errors}
              required
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
                {editingImage ? 'Update' : 'Add'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingImage}
        onOpenChange={() => setDeletingImage(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingImage && deleteMutation.mutate(deletingImage.id)}
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
