import axios from 'axios'
import type {
  Partner,
  JointVenture,
  Office,
  Service,
  ServiceCategory,
  GalleryImage,
  Job,
  HeroSlide,
  SiteSetting,
  ContactSubmission,
  JobApplication,
  User,
  MediaFile,
} from '@repo/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          })
          localStorage.setItem('accessToken', data.accessToken)
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
          return api(originalRequest)
        } catch {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    return data
  },
  logout: async (refreshToken: string) => {
    await api.post('/auth/logout', { refreshToken })
  },
  me: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },
}

// Standard CRUD helper for entities with /admin suffix pattern
// GET all: /{endpoint}/admin, GET one: /{endpoint}/{id}, POST: /{endpoint}/, PATCH/DELETE: /{endpoint}/{id}
function createStandardCrudApi<T>(endpoint: string) {
  return {
    getAll: async (params?: Record<string, unknown>) => {
      const { data } = await api.get<{ data: T[]; total?: number }>(
        `/${endpoint}/admin`,
        { params }
      )
      return data
    },
    getOne: async (id: string) => {
      const { data } = await api.get<T>(`/${endpoint}/${id}`)
      return data
    },
    create: async (payload: Partial<T>) => {
      const { data } = await api.post<T>(`/${endpoint}/`, payload)
      return data
    },
    update: async (id: string, payload: Partial<T>) => {
      const { data } = await api.patch<T>(`/${endpoint}/${id}`, payload)
      return data
    },
    delete: async (id: string) => {
      await api.delete(`/${endpoint}/${id}`)
    },
    reorder: async (items: { id: string; order: number }[]) => {
      await api.patch(`/${endpoint}/reorder`, { items })
    },
  }
}

// CRUD helper for entities with /admin/all and /admin/{id} pattern (services, jobs)
function createAdminPathCrudApi<T>(endpoint: string) {
  return {
    getAll: async (params?: Record<string, unknown>) => {
      const { data } = await api.get<{ data: T[]; total?: number }>(
        `/${endpoint}/admin/all`,
        { params }
      )
      return data
    },
    getOne: async (id: string) => {
      const { data } = await api.get<T>(`/${endpoint}/admin/${id}`)
      return data
    },
    create: async (payload: Partial<T>) => {
      const { data } = await api.post<T>(`/${endpoint}/`, payload)
      return data
    },
    update: async (id: string, payload: Partial<T>) => {
      const { data } = await api.patch<T>(`/${endpoint}/admin/${id}`, payload)
      return data
    },
    delete: async (id: string) => {
      await api.delete(`/${endpoint}/admin/${id}`)
    },
    reorder: async (items: { id: string; order: number }[]) => {
      await api.patch(`/${endpoint}/reorder`, { items })
    },
  }
}

// CRUD helper for fully admin-prefixed endpoints (users, media)
function createFullAdminCrudApi<T>(endpoint: string) {
  return {
    getAll: async (params?: Record<string, unknown>) => {
      const { data } = await api.get<{ data: T[]; total?: number }>(
        `/admin/${endpoint}/`,
        { params }
      )
      return data
    },
    getOne: async (id: string) => {
      const { data } = await api.get<T>(`/admin/${endpoint}/${id}`)
      return data
    },
    create: async (payload: Partial<T>) => {
      const { data } = await api.post<T>(`/admin/${endpoint}/`, payload)
      return data
    },
    update: async (id: string, payload: Partial<T>) => {
      const { data } = await api.patch<T>(`/admin/${endpoint}/${id}`, payload)
      return data
    },
    delete: async (id: string) => {
      await api.delete(`/admin/${endpoint}/${id}`)
    },
  }
}

// Entity APIs - Standard pattern (/{entity}/admin for list)
export const partnersApi = createStandardCrudApi<Partner>('partners')
export const jointVenturesApi = createStandardCrudApi<JointVenture>('joint-ventures')
export const officesApi = createStandardCrudApi<Office>('offices')
export const heroSlidesApi = createStandardCrudApi<HeroSlide>('hero-slides')
export const galleryApi = createStandardCrudApi<GalleryImage>('gallery')

// Entity APIs - Admin path pattern (/{entity}/admin/all for list)
export const servicesApi = createAdminPathCrudApi<Service>('services')
export const jobsApi = createAdminPathCrudApi<Job>('jobs')

// Service categories - special case
export const serviceCategoriesApi = {
  getAll: async () => {
    const { data } = await api.get<{ data: ServiceCategory[] }>('/services/categories/admin')
    return data
  },
  create: async (payload: Partial<ServiceCategory>) => {
    const { data } = await api.post<ServiceCategory>('/services/categories', payload)
    return data
  },
  update: async (id: string, payload: Partial<ServiceCategory>) => {
    const { data } = await api.patch<ServiceCategory>(`/services/categories/${id}`, payload)
    return data
  },
  delete: async (id: string) => {
    await api.delete(`/services/categories/${id}`)
  },
}

// Fully admin-prefixed endpoints
export const usersApi = createFullAdminCrudApi<User>('users')
export const mediaApi = createFullAdminCrudApi<MediaFile>('media')

// Settings API
export const settingsApi = {
  getByGroup: async (group: string) => {
    const { data } = await api.get<SiteSetting[]>(`/settings/${group}`)
    return data
  },
  getAll: async () => {
    const { data } = await api.get<SiteSetting[]>('/settings/admin/all')
    return data
  },
  update: async (key: string, value: string) => {
    const { data } = await api.patch(`/settings/${key}`, { value })
    return data
  },
}

// Contact submissions API
export const contactSubmissionsApi = {
  getAll: async (params?: Record<string, unknown>) => {
    const { data } = await api.get<{ data: ContactSubmission[]; total?: number }>(
      '/contact/admin',
      { params }
    )
    return data
  },
  getOne: async (id: string) => {
    const { data } = await api.get<ContactSubmission>(`/contact/admin/${id}`)
    return data
  },
  update: async (id: string, payload: Partial<ContactSubmission>) => {
    const { data } = await api.patch<ContactSubmission>(`/contact/admin/${id}`, payload)
    return data
  },
  delete: async (id: string) => {
    await api.delete(`/contact/admin/${id}`)
  },
  updateStatus: async (id: string, status: string, notes?: string) => {
    const { data } = await api.patch(`/contact/admin/${id}`, { status, notes })
    return data
  },
}

// Job applications API
export const jobApplicationsApi = {
  getAll: async (params?: Record<string, unknown>) => {
    const { data } = await api.get<{ data: JobApplication[]; total?: number }>(
      '/applications/admin',
      { params }
    )
    return data
  },
  getOne: async (id: string) => {
    const { data } = await api.get<JobApplication>(`/applications/admin/${id}`)
    return data
  },
  update: async (id: string, payload: Partial<JobApplication>) => {
    const { data } = await api.patch<JobApplication>(`/applications/admin/${id}`, payload)
    return data
  },
  delete: async (id: string) => {
    await api.delete(`/applications/admin/${id}`)
  },
  updateStatus: async (id: string, status: string, notes?: string) => {
    const { data } = await api.patch(`/applications/admin/${id}`, { status, notes })
    return data
  },
}

// Media upload
export const uploadMedia = async (file: File, folder = 'uploads') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const { data } = await api.post<{ data: MediaFile }>('/admin/media/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data.data
}

// Dashboard stats - we'll need to aggregate from individual endpoints
export const dashboardApi = {
  getStats: async () => {
    // Fetch counts from each endpoint
    const [partners, jointVentures, services, jobs, gallery, contact, applications] = await Promise.all([
      api.get('/partners/admin').catch(() => ({ data: { data: [] } })),
      api.get('/joint-ventures/admin').catch(() => ({ data: { data: [] } })),
      api.get('/services/admin/all').catch(() => ({ data: { data: [] } })),
      api.get('/jobs/admin/all').catch(() => ({ data: { data: [] } })),
      api.get('/gallery/admin').catch(() => ({ data: { data: [] } })),
      api.get('/contact/admin').catch(() => ({ data: { data: [] } })),
      api.get('/applications/admin').catch(() => ({ data: { data: [] } })),
    ])

    return {
      partners: partners.data?.data?.length || 0,
      jointVentures: jointVentures.data?.data?.length || 0,
      services: services.data?.data?.length || 0,
      jobs: jobs.data?.data?.length || 0,
      galleryImages: gallery.data?.data?.length || 0,
      contactSubmissions: contact.data?.data?.length || 0,
      jobApplications: applications.data?.data?.length || 0,
    }
  },
}
