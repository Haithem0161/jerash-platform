import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Eye, Trash2, Download } from 'lucide-react'
import type { JobApplication } from '@repo/types'
import { jobApplicationsApi } from '@/lib/api'
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
  REVIEWING: 'bg-yellow-100 text-yellow-800',
  SHORTLISTED: 'bg-purple-100 text-purple-800',
  INTERVIEWED: 'bg-orange-100 text-orange-800',
  OFFERED: 'bg-green-100 text-green-800',
  HIRED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
}

export function JobApplicationsPage() {
  const queryClient = useQueryClient()
  const [viewingApplication, setViewingApplication] = useState<JobApplication | null>(null)
  const [deletingApplication, setDeletingApplication] = useState<JobApplication | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [notes, setNotes] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['job-applications'],
    queryFn: () => jobApplicationsApi.getAll(),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      jobApplicationsApi.updateStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] })
      toast.success('Application updated successfully')
    },
    onError: () => toast.error('Failed to update application'),
  })

  const deleteMutation = useMutation({
    mutationFn: jobApplicationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] })
      toast.success('Application deleted successfully')
      setDeletingApplication(null)
    },
    onError: () => toast.error('Failed to delete application'),
  })

  const handleView = (application: JobApplication) => {
    setViewingApplication(application)
    setSelectedStatus(application.status)
    setNotes(application.notes || '')

    // Mark as reviewing if new
    if (application.status === 'NEW') {
      updateMutation.mutate({ id: application.id, status: 'REVIEWING' })
    }
  }

  const handleUpdateStatus = () => {
    if (viewingApplication && selectedStatus) {
      updateMutation.mutate({
        id: viewingApplication.id,
        status: selectedStatus,
        notes,
      })
    }
  }

  const columns: ColumnDef<JobApplication>[] = [
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
      accessorKey: 'phone',
      header: 'Phone',
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
      id: 'cv',
      header: 'CV',
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" asChild>
          <a
            href={row.original.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <Download className="h-4 w-4" />
          </a>
        </Button>
      ),
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
            onClick={() => setDeletingApplication(row.original)}
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
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <p className="text-muted-foreground">View and manage job applications</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        searchKey="name"
        searchPlaceholder="Search by name..."
      />

      <Dialog
        open={!!viewingApplication}
        onOpenChange={() => setViewingApplication(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Job Application</DialogTitle>
          </DialogHeader>

          {viewingApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{viewingApplication.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{viewingApplication.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{viewingApplication.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CV</Label>
                  <p className="font-medium">
                    <a
                      href={viewingApplication.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      {viewingApplication.cvFilename}
                    </a>
                  </p>
                </div>
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
                      <SelectItem value="REVIEWING">Reviewing</SelectItem>
                      <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                      <SelectItem value="INTERVIEWED">Interviewed</SelectItem>
                      <SelectItem value="OFFERED">Offered</SelectItem>
                      <SelectItem value="HIRED">Hired</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-muted-foreground">Applied</Label>
                  <p className="font-medium">
                    {new Date(viewingApplication.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes about this candidate..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setViewingApplication(null)}>
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
        open={!!deletingApplication}
        onOpenChange={() => setDeletingApplication(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this application from{' '}
              {deletingApplication?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingApplication && deleteMutation.mutate(deletingApplication.id)
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
