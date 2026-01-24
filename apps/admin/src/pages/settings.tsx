import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { settingsApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SettingsForm {
  yearsExperience: string
  projectsCompleted: string
  employees: string
  linkedin: string
  poBox: string
}

interface StatsData {
  yearsExperience: number
  projectsCompleted: number
  employees: number
}

interface SocialData {
  linkedin: string
  poBox: string
}

export function SettingsPage() {
  const queryClient = useQueryClient()

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['settings', 'stats'],
    queryFn: () => settingsApi.getByGroup('stats'),
  })

  const { data: socialData, isLoading: socialLoading } = useQuery({
    queryKey: ['settings', 'social'],
    queryFn: () => settingsApi.getByGroup('social'),
  })

  const updateMutation = useMutation({
    mutationFn: async (settings: { key: string; value: string }[]) => {
      // Update each setting individually
      await Promise.all(
        settings.map(({ key, value }) => settingsApi.update(key, value))
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      toast.success('Settings updated successfully')
    },
    onError: () => toast.error('Failed to update settings'),
  })

  const form = useForm<SettingsForm>()

  // API returns { data: { key: value } } format
  const stats = (statsData as { data: StatsData } | undefined)?.data
  const social = (socialData as { data: SocialData } | undefined)?.data

  const onSubmit = (data: SettingsForm) => {
    const settings = [
      { key: 'stats.yearsExperience', value: String(data.yearsExperience) },
      { key: 'stats.projectsCompleted', value: String(data.projectsCompleted) },
      { key: 'stats.employees', value: String(data.employees) },
      { key: 'social.linkedin', value: data.linkedin || '' },
      { key: 'social.poBox', value: data.poBox || '' },
    ]
    updateMutation.mutate(settings)
  }

  const isLoading = statsLoading || socialLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage site-wide settings</p>
      </div>

      <Tabs defaultValue="stats">
        <TabsList>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="social">Social & Contact</TabsTrigger>
        </TabsList>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <TabsContent value="stats" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Statistics</CardTitle>
                <CardDescription>
                  These numbers are displayed on the homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Years of Experience</Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      defaultValue={stats?.yearsExperience ?? ''}
                      {...form.register('yearsExperience')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectsCompleted">Projects Completed</Label>
                    <Input
                      id="projectsCompleted"
                      type="number"
                      defaultValue={stats?.projectsCompleted ?? ''}
                      {...form.register('projectsCompleted')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employees">Number of Employees</Label>
                    <Input
                      id="employees"
                      type="number"
                      defaultValue={stats?.employees ?? ''}
                      {...form.register('employees')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Social & Contact</CardTitle>
                <CardDescription>
                  Social media links and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/company/..."
                    defaultValue={social?.linkedin ?? ''}
                    {...form.register('linkedin')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="poBox">P.O. Box</Label>
                  <Input
                    id="poBox"
                    placeholder="28211"
                    defaultValue={social?.poBox ?? ''}
                    {...form.register('poBox')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Settings
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}
