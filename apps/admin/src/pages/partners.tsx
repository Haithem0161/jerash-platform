import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { JointVenture } from '@repo/types'
import { jointVenturesApi } from '@/lib/api'
import { DataTable, DataTableColumnHeader, DataTableRowActions } from '@/components/data-table'
import { BilingualInput, BilingualTextarea, ImageUploader } from '@/components/forms'
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

const jvSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  nameEn: z.string().min(1, 'English name is required'),
  nameAr: z.string().min(1, 'Arabic name is required'),
  descriptionEn: z.string().min(1, 'English description is required'),
  descriptionAr: z.string().min(1, 'Arabic description is required'),
  logoUrl: z.string().min(1, 'Logo is required'),
  isActive: z.boolean(),
})

type JVForm = z.infer<typeof jvSchema>

export function JointVenturesPage() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingJV, setEditingJV] = useState<JointVenture | null>(null)
  const [deletingJV, setDeletingJV] = useState<JointVenture | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['joint-ventures'],
    queryFn: () => jointVenturesApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: jointVenturesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['joint-ventures'] })
      toast.success('Joint venture created successfully')
      handleCloseDialog()
    },
    onError: () => toast.error('Failed to create joint venture'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JointVenture> }) =>
      jointVenturesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['joint-ventures'] })
      toast.success('Joint venture updated successfully')
      handleCloseDialog()
    },
    onError: () => toast.error('Failed to update joint venture'),
  })

  const deleteMutation = useMutation({
    mutationFn: jointVenturesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['joint-ventures'] })
      toast.success('Joint venture deleted successfully')
      setDeletingJV(null)
    },
    onError: () => toast.error('Failed to delete joint venture'),
  })

  const form = useForm<JVForm>({
    resolver: zodResolver(jvSchema),
    defaultValues: {
      slug: '',
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      logoUrl: '',
      isActive: true,
    },
  })

  const handleOpenDialog = (jv?: JointVenture) => {
    if (jv) {
      setEditingJV(jv)
      form.reset({
        slug: jv.slug,
        nameEn: jv.nameEn,
        nameAr: jv.nameAr,
        descriptionEn: jv.descriptionEn,
        descriptionAr: jv.descriptionAr,
        logoUrl: jv.logoUrl,
        isActive: jv.isActive,
      })
    } else {
      setEditingJV(null)
      form.reset()
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingJV(null)
    form.reset()
  }

  const onSubmit = (data: JVForm) => {
    if (editingJV) {
      updateMutation.mutate({ id: editingJV.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const columns: ColumnDef<JointVenture>[] = [
    {
      accessorKey: 'logoUrl',
      header: 'Logo',
      cell: ({ row }) => (
        <img
          src={row.original.logoUrl}
          alt={row.original.nameEn}
          className="h-10 w-10 rounded object-contain"
        />
      ),
    },
    {
      accessorKey: 'nameEn',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name (EN)" />
      ),
    },
    {
      accessorKey: 'nameAr',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name (AR)" />
      ),
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
          onDelete={() => setDeletingJV(row.original)}
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
        <h1 className="text-3xl font-bold">Joint Ventures</h1>
        <p className="text-muted-foreground">Manage joint venture partnerships</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        searchKey="nameEn"
        searchPlaceholder="Search joint ventures..."
        onAdd={() => handleOpenDialog()}
        addLabel="Add Joint Venture"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingJV ? 'Edit Joint Venture' : 'Add Joint Venture'}
            </DialogTitle>
            <DialogDescription>
              {editingJV
                ? 'Update joint venture information'
                : 'Add a new joint venture partnership'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...form.register('slug')}
                placeholder="joint-venture-slug"
              />
              {form.formState.errors.slug && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>

            <BilingualInput
              name="name"
              label="Name"
              register={form.register}
              errors={form.formState.errors}
              required
            />

            <BilingualTextarea
              name="description"
              label="Description"
              register={form.register}
              errors={form.formState.errors}
              required
            />

            <ImageUploader
              label="Logo"
              value={form.watch('logoUrl')}
              onChange={(url) => form.setValue('logoUrl', url)}
              folder="joint-ventures"
              required
              error={form.formState.errors.logoUrl?.message}
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
                {editingJV ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingJV}
        onOpenChange={() => setDeletingJV(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Joint Venture</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingJV?.nameEn}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingJV && deleteMutation.mutate(deletingJV.id)}
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
