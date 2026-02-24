import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { ApiResponse, Client } from '@/types/api'

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Client[]>>('/clients')
      return data.data
    },
    staleTime: 1000 * 60 * 10,
  })
}
