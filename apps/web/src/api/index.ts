// API functions
// Add your API endpoints here

import { api } from '@/lib/axios'
import type { ApiResponse, PaginatedResponse, User } from '@/types'

// Example API functions (placeholder)
export const usersApi = {
  getAll: async (page = 1, pageSize = 10): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/users', { params: { page, pageSize } })
    return response.data
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> => {
    const response = await api.post('/users', data)
    return response.data
  },

  update: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.patch(`/users/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`)
  },
}
