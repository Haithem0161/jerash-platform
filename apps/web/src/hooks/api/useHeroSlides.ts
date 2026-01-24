import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { ApiResponse, HeroSlide } from '@/types/api'

export function useHeroSlides() {
  return useQuery({
    queryKey: ['hero-slides'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<HeroSlide[]>>('/hero-slides')
      return data.data
    },
    staleTime: 1000 * 60 * 10, // 10 min - static content
  })
}
