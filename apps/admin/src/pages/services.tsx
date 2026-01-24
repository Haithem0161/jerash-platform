import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { Service, ServiceCategory } from '@repo/types'
import { servicesApi, serviceCategoriesApi } from '@/lib/api'
import { DataTable, DataTableColumnHeader, DataTableRowActions } from '@/components/data-table'
import { BilingualInput, BilingualTextarea } from '@/components/forms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

const serviceSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  categoryId: z.string().min(1, 'Category is required'),
  icon: z.string().min(1, 'Icon is required'),
  titleEn: z.string().min(1, 'English title is required'),
  titleAr: z.string().min(1, 'Arabic title is required'),
  shortDescriptionEn: z.string().min(1, 'English short description is required'),
  shortDescriptionAr: z.string().min(1, 'Arabic short description is required'),
  descriptionEn: z.string().min(1, 'English description is required'),
  descriptionAr: z.string().min(1, 'Arabic description is required'),
  isActive: z.boolean(),
})

type ServiceForm = z.infer<typeof serviceSchema>

export function ServicesPage() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deletingService, setDeletingService] = useState<Service | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.getAll(),
  })

  const { data: categories } = useQuery({
    queryKey: ['service-categories'],
    queryFn: () => serviceCategoriesApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: servicesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service created successfully')
      handleCloseDialog()
    },
    onError: () => toast.error('Failed to create service'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) =>
      servicesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service updated successfully')
      handleCloseDialog()
    },
    onError: () => toast.error('Failed to update service'),
  })

  const deleteMutation = useMutation({
    mutationFn: servicesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service deleted successfully')
      setDeletingService(null)
    },
    onError: () => toast.error('Failed to delete service'),
  })

  const form = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      slug: '',
      categoryId: '',
      icon: '',
      titleEn: '',
      titleAr: '',
      shortDescriptionEn: '',
      shortDescriptionAr: '',
      descriptionEn: '',
      descriptionAr: '',
      isActive: true,
    },
  })

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service)
      form.reset({
        slug: service.slug,
        categoryId: service.categoryId,
        icon: service.icon,
        titleEn: service.titleEn,
        titleAr: service.titleAr,
        shortDescriptionEn: service.shortDescriptionEn,
        shortDescriptionAr: service.shortDescriptionAr,
        descriptionEn: service.descriptionEn,
        descriptionAr: service.descriptionAr,
        isActive: service.isActive,
      })
    } else {
      setEditingService(null)
      form.reset()
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingService(null)
    form.reset()
  }

  const onSubmit = (data: ServiceForm) => {
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories?.data?.find((c: ServiceCategory) => c.id === categoryId)
    return category?.nameEn || 'Unknown'
  }

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: 'icon',
      header: 'Icon',
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.icon}</span>
      ),
    },
    {
      accessorKey: 'titleEn',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title (EN)" />
      ),
    },
    {
      accessorKey: 'categoryId',
      header: 'Category',
      cell: ({ row }) => getCategoryName(row.original.categoryId),
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
          onDelete={() => setDeletingService(row.original)}
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
        <h1 className="text-3xl font-bold">Services</h1>
        <p className="text-muted-foreground">Manage service offerings</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        searchKey="titleEn"
        searchPlaceholder="Search services..."
        onAdd={() => handleOpenDialog()}
        addLabel="Add Service"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Add Service'}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? 'Update service information'
                : 'Add a new service offering'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  {...form.register('slug')}
                  placeholder="service-slug"
                />
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Lucide name)</Label>
                <Input
                  id="icon"
                  {...form.register('icon')}
                  placeholder="Wrench"
                />
                {form.formState.errors.icon && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.icon.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.watch('categoryId')}
                onValueChange={(value) => form.setValue('categoryId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.data?.map((category: ServiceCategory) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.categoryId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.categoryId.message}
                </p>
              )}
            </div>

            <BilingualInput
              name="title"
              label="Title"
              register={form.register}
              errors={form.formState.errors}
              required
            />

            <BilingualTextarea
              name="shortDescription"
              label="Short Description"
              register={form.register}
              errors={form.formState.errors}
              required
              rows={2}
            />

            <BilingualTextarea
              name="description"
              label="Full Description"
              register={form.register}
              errors={form.formState.errors}
              required
              rows={4}
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
                {editingService ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingService}
        onOpenChange={() => setDeletingService(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingService?.titleEn}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingService && deleteMutation.mutate(deletingService.id)}
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
