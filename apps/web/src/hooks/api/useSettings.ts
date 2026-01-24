import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { ApiResponse, SiteSetting } from '@/types/api'

export function useSettings(group: string) {
  return useQuery({
    queryKey: ['settings', group],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<SiteSetting[]>>(`/settings/${group}`)
      return data.data
    },
    staleTime: 1000 * 60 * 30, // 30 min - rarely changes
  })
}

// Helper to get stat values
export function useStats() {
  const { data: settings, ...rest } = useSettings('stats')

  const stats = {
    yearsExperience: settings?.find((s) => s.key === 'stats.yearsExperience')?.value ?? '15',
    projectsCompleted: settings?.find((s) => s.key === 'stats.projectsCompleted')?.value ?? '500',
    employees: settings?.find((s) => s.key === 'stats.employees')?.value ?? '200',
  }

  return { stats, ...rest }
}
