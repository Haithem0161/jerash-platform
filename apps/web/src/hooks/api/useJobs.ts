import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { ApiResponse, Job } from '@/types/api'

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Job[]>>('/jobs')
      return data.data
    },
    staleTime: 1000 * 60 * 5, // 5 min - jobs may change more often
  })
}

export function useJob(slug: string) {
  return useQuery({
    queryKey: ['jobs', slug],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Job>>(`/jobs/${slug}`)
      return data.data
    },
    enabled: !!slug,
  })
}
