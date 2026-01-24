import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { ApiResponse, Office } from '@/types/api'

export function useOffices() {
  return useQuery({
    queryKey: ['offices'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Office[]>>('/offices')
      return data.data
    },
    staleTime: 1000 * 60 * 30,
  })
}
