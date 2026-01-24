import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Eye, Trash2 } from 'lucide-react'
import type { ContactSubmission } from '@repo/types'
import { contactSubmissionsApi } from '@/lib/api'
import { DataTable, DataTableColumnHeader } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  READ: 'bg-yellow-100 text-yellow-800',
  RESPONDED: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-100 text-gray-800',
}

export function ContactSubmissionsPage() {
  const queryClient = useQueryClient()
  const [viewingSubmission, setViewingSubmission] = useState<ContactSubmission | null>(null)
  const [deletingSubmission, setDeletingSubmission] = useState<ContactSubmission | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [notes, setNotes] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['contact-submissions'],
    queryFn: () => contactSubmissionsApi.getAll(),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      contactSubmissionsApi.updateStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] })
      toast.success('Submission updated successfully')
    },
    onError: () => toast.error('Failed to update submission'),
  })

  const deleteMutation = useMutation({
    mutationFn: contactSubmissionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] })
      toast.success('Submission deleted successfully')
      setDeletingSubmission(null)
    },
    onError: () => toast.error('Failed to delete submission'),
  })

  const handleView = (submission: ContactSubmission) => {
    setViewingSubmission(submission)
    setSelectedStatus(submission.status)
    setNotes(submission.notes || '')

    // Mark as read if new
    if (submission.status === 'NEW') {
      updateMutation.mutate({ id: submission.id, status: 'READ' })
    }
  }

  const handleUpdateStatus = () => {
    if (viewingSubmission && selectedStatus) {
      updateMutation.mutate({
        id: viewingSubmission.id,
        status: selectedStatus,
        notes,
      })
    }
  }

  const columns: ColumnDef<ContactSubmission>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'department',
      header: 'Department',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge className={statusColors[row.original.status] || statusColors.NEW}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeletingSubmission(row.original)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
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
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
        <p className="text-muted-foreground">View and manage contact form submissions</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        searchKey="name"
        searchPlaceholder="Search by name..."
      />

      <Dialog
        open={!!viewingSubmission}
        onOpenChange={() => setViewingSubmission(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Submission</DialogTitle>
          </DialogHeader>

          {viewingSubmission && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{viewingSubmission.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{viewingSubmission.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{viewingSubmission.phone || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Department</Label>
                  <p className="font-medium">{viewingSubmission.department}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Message</Label>
                <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-4">
                  {viewingSubmission.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="READ">Read</SelectItem>
                      <SelectItem value="RESPONDED">Responded</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-muted-foreground">Submitted</Label>
                  <p className="font-medium">
                    {new Date(viewingSubmission.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setViewingSubmission(null)}>
                  Close
                </Button>
                <Button onClick={handleUpdateStatus} disabled={updateMutation.isPending}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingSubmission}
        onOpenChange={() => setDeletingSubmission(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this submission from{' '}
              {deletingSubmission?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingSubmission && deleteMutation.mutate(deletingSubmission.id)
              }
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
