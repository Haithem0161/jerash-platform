import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { Client } from '@repo/types'
import { clientsApi } from '@/lib/api'
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

const clientFormSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  nameEn: z.string().min(1, 'English name is required'),
  nameAr: z.string().min(1, 'Arabic name is required'),
  descriptionEn: z.string().min(1, 'English description is required'),
  descriptionAr: z.string().min(1, 'Arabic description is required'),
  logoUrl: z.string().min(1, 'Logo is required'),
  website: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean(),
})

type ClientForm = z.infer<typeof clientFormSchema>

export function ClientsPage() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [deletingClient, setDeletingClient] = useState<Client | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: clientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Client created successfully')
      handleCloseDialog()
    },
    onError: () => toast.error('Failed to create client'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
      clientsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Client updated successfully')
      handleCloseDialog()
    },
    onError: () => toast.error('Failed to update client'),
  })

  const deleteMutation = useMutation({
    mutationFn: clientsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Client deleted successfully')
      setDeletingClient(null)
    },
    onError: () => toast.error('Failed to delete client'),
  })

  const form = useForm<ClientForm>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      slug: '',
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      logoUrl: '',
      website: '',
      isActive: true,
    },
  })

  const handleOpenDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client)
      form.reset({
        slug: client.slug,
        nameEn: client.nameEn,
        nameAr: client.nameAr,
        descriptionEn: client.descriptionEn,
        descriptionAr: client.descriptionAr,
        logoUrl: client.logoUrl,
        website: client.website || '',
        isActive: client.isActive,
      })
    } else {
      setEditingClient(null)
      form.reset()
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingClient(null)
    form.reset()
  }

  const onSubmit = (data: ClientForm) => {
    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const columns: ColumnDef<Client>[] = [
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
          onDelete={() => setDeletingClient(row.original)}
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
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-muted-foreground">Manage client organizations</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        searchKey="nameEn"
        searchPlaceholder="Search clients..."
        onAdd={() => handleOpenDialog()}
        addLabel="Add Client"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? 'Edit Client' : 'Add Client'}
            </DialogTitle>
            <DialogDescription>
              {editingClient
                ? 'Update client information'
                : 'Add a new client organization'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...form.register('slug')}
                placeholder="client-slug"
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
              folder="clients"
              required
              error={form.formState.errors.logoUrl?.message}
            />

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...form.register('website')}
                placeholder="https://example.com"
              />
              {form.formState.errors.website && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.website.message}
                </p>
              )}
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
                {editingClient ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingClient}
        onOpenChange={() => setDeletingClient(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingClient?.nameEn}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingClient && deleteMutation.mutate(deletingClient.id)}
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
