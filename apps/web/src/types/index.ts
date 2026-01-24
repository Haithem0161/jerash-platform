// Common types used across the application

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, string[]>
}

// User types (placeholder)
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

// Common component props
export interface WithClassName {
  className?: string
}

export interface WithChildren {
  children: React.ReactNode
}

// Form types
export interface FormState {
  isSubmitting: boolean
  isSuccess: boolean
  error: string | null
}
