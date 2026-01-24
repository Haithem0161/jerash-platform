// Form Submission Types

export type SubmissionStatus = 'NEW' | 'READ' | 'RESPONDED' | 'ARCHIVED'
export type ApplicationStatus = 'NEW' | 'REVIEWING' | 'SHORTLISTED' | 'INTERVIEWED' | 'REJECTED' | 'HIRED' | 'ARCHIVED'

// Contact Form Submission
export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  department: ContactDepartment
  message: string
  status: SubmissionStatus
  notes: string | null
  respondedAt: string | null
  createdAt: string
  updatedAt: string
}

export type ContactDepartment = 'general' | 'technical' | 'careers' | 'other'

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  department: ContactDepartment
  message: string
}

export interface ContactSubmissionUpdate {
  status?: SubmissionStatus
  notes?: string
}

// Job Application
export interface JobApplication {
  id: string
  jobId: string | null
  name: string
  email: string
  phone: string
  cvUrl: string
  cvFilename: string
  status: ApplicationStatus
  notes: string | null
  reviewedAt: string | null
  createdAt: string
  updatedAt: string
  job?: {
    id: string
    slug: string
    titleEn: string
    titleAr: string
  } | null
}

export interface JobApplicationFormData {
  jobId?: string
  name: string
  email: string
  phone: string
  cv: File
}

export interface JobApplicationUpdate {
  status?: ApplicationStatus
  notes?: string
}
