import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { ApiResponse, Partner } from '@/types/api'

export function usePartners() {
  return useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Partner[]>>('/partners')
      return data.data
    },
    staleTime: 1000 * 60 * 10,
  })
}
