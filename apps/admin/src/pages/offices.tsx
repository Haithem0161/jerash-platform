import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { Office } from '@repo/types'
import { officesApi } from '@/lib/api'
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

const officeSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  nameEn: z.string().min(1, 'English name is required'),
  nameAr: z.string().min(1, 'Arabic name is required'),
  addressEn: z.string().min(1, 'English address is required'),
  addressAr: z.string().min(1, 'Arabic address is required'),
  phone: z.string().min(1, 'Phone is required'),
  phoneDisplay: z.string().min(1, 'Display phone is required'),
  email: z.string().email('Invalid email'),
  hoursEn: z.string().min(1, 'English hours is required'),
  hoursAr: z.string().min(1, 'Arabic hours is required'),
  latitude: z.number(),
  longitude: z.number(),
  isActive: z.boolean(),
})

type OfficeForm = z.infer<typeof officeSchema>

export function OfficesPage() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOffice, setEditingOffice] = useState<Office | null>(null)
  const [deletingOffice, setDeletingOffice] = useState<Office | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['offices'],
    queryFn: () => officesApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: officesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offices'] })
      toast.success('Office created successfully')
      handleCloseDialog()
    },
    onError: () => toast.error('Failed to create office'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Office> }) =>
      officesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offices'] })
      toast.success('Office updated successfully')
      handleCloseDialog()
    },
    onError: () => toast.error('Failed to update office'),
  })

  const deleteMutation = useMutation({
    mutationFn: officesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offices'] })
      toast.success('Office deleted successfully')
      setDeletingOffice(null)
    },
    onError: () => toast.error('Failed to delete office'),
  })

  const form = useForm<OfficeForm>({
    resolver: zodResolver(officeSchema),
    defaultValues: {
      slug: '',
      nameEn: '',
      nameAr: '',
      addressEn: '',
      addressAr: '',
      phone: '',
      phoneDisplay: '',
      email: '',
      hoursEn: '',
      hoursAr: '',
      latitude: 0,
      longitude: 0,
      isActive: true,
    },
  })

  const handleOpenDialog = (office?: Office) => {
    if (office) {
      setEditingOffice(office)
      form.reset({
        slug: office.slug,
        nameEn: office.nameEn,
        nameAr: office.nameAr,
        addressEn: office.addressEn,
        addressAr: office.addressAr,
        phone: office.phone,
        phoneDisplay: office.phoneDisplay,
        email: office.email,
        hoursEn: office.hoursEn,
        hoursAr: office.hoursAr,
        latitude: office.latitude,
        longitude: office.longitude,
        isActive: office.isActive,
      })
    } else {
      setEditingOffice(null)
      form.reset()
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingOffice(null)
    form.reset()
  }

  const onSubmit = (data: OfficeForm) => {
    if (editingOffice) {
      updateMutation.mutate({ id: editingOffice.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const columns: ColumnDef<Office>[] = [
    {
      accessorKey: 'nameEn',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name (EN)" />
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phoneDisplay',
      header: 'Phone',
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
          onDelete={() => setDeletingOffice(row.original)}
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
        <h1 className="text-3xl font-bold">Offices</h1>
        <p className="text-muted-foreground">Manage office locations</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        searchKey="nameEn"
        searchPlaceholder="Search offices..."
        onAdd={() => handleOpenDialog()}
        addLabel="Add Office"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingOffice ? 'Edit Office' : 'Add Office'}
            </DialogTitle>
            <DialogDescription>
              {editingOffice
                ? 'Update office information'
                : 'Add a new office location'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...form.register('slug')}
                placeholder="office-slug"
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
              name="address"
              label="Address"
              register={form.register}
              errors={form.formState.errors}
              required
              rows={2}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...form.register('phone')}
                  placeholder="+964..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneDisplay">Display Phone</Label>
                <Input
                  id="phoneDisplay"
                  {...form.register('phoneDisplay')}
                  placeholder="+964 XXX XXX XXXX"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="office@jerash.com"
              />
            </div>

            <BilingualInput
              name="hours"
              label="Hours"
              register={form.register}
              errors={form.formState.errors}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  {...form.register('latitude')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  {...form.register('longitude')}
                />
              </div>
            </div>

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
                {editingOffice ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingOffice}
        onOpenChange={() => setDeletingOffice(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Office</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingOffice?.nameEn}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingOffice && deleteMutation.mutate(deletingOffice.id)}
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
