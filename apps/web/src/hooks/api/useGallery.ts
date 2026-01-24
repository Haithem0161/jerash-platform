import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { PaginatedResponse, GalleryImage } from '@/types/api'

export function useGallery(page = 1, pageSize = 50) {
  return useQuery({
    queryKey: ['gallery', page, pageSize],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<GalleryImage>>('/gallery', {
        params: { page, pageSize },
      })
      return data
    },
    staleTime: 1000 * 60 * 10,
  })
}
