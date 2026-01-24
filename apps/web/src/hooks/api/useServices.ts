import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { ApiResponse, ServiceCategory, Service } from '@/types/api'

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ServiceCategory[]>>('/services')
      return data.data
    },
    staleTime: 1000 * 60 * 10,
  })
}

// Helper to flatten services from categories
export function useFlatServices() {
  const { data: categories, ...rest } = useServices()
  const services = categories?.flatMap((cat) => cat.services) ?? []
  return { data: services, categories, ...rest }
}

export function useService(slug: string) {
  return useQuery({
    queryKey: ['services', slug],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Service>>(`/services/${slug}`)
      return data.data
    },
    enabled: !!slug,
  })
}
