import { useQuery } from '@tanstack/react-query'
import {
  Handshake,
  Building2,
  Layers,
  Image,
  Briefcase,
  Mail,
  FileText,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { dashboardApi } from '@/lib/api'

const statCards = [
  { key: 'partners', label: 'Partners', icon: Handshake, color: 'text-blue-600' },
  { key: 'jointVentures', label: 'Joint Ventures', icon: Building2, color: 'text-purple-600' },
  { key: 'services', label: 'Services', icon: Layers, color: 'text-green-600' },
  { key: 'galleryImages', label: 'Gallery Images', icon: Image, color: 'text-yellow-600' },
  { key: 'jobs', label: 'Active Jobs', icon: Briefcase, color: 'text-orange-600' },
  { key: 'contactSubmissions', label: 'Messages', icon: Mail, color: 'text-red-600' },
  { key: 'jobApplications', label: 'Applications', icon: FileText, color: 'text-teal-600' },
] as const

export function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Jerash admin dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {stats?.[card.key] ?? 0}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Contact Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View and manage contact form submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Job Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Review job applications and CVs
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
