import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { ApiResponse, JointVenture } from '@/types/api'

export function useJointVentures() {
  return useQuery({
    queryKey: ['joint-ventures'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<JointVenture[]>>('/joint-ventures')
      return data.data
    },
    staleTime: 1000 * 60 * 10,
  })
}
