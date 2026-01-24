import { useMutation } from '@tanstack/react-query'
import api from '@/lib/axios'

interface ApplicationSubmitData {
  name: string
  email: string
  phone: string
  jobId?: string
  cv: File
}

export function useSubmitApplication() {
  return useMutation({
    mutationFn: async (data: ApplicationSubmitData) => {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('phone', data.phone)
      if (data.jobId) formData.append('jobId', data.jobId)
      formData.append('cv', data.cv)

      const response = await api.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
  })
}
