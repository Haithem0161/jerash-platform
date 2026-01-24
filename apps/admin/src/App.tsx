import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/components/auth-provider'
import { ProtectedLayout } from '@/components/layout'
import { LoginPage } from '@/pages/login'
import { DashboardPage } from '@/pages/dashboard'
import { PartnersPage } from '@/pages/partners'
import { JointVenturesPage } from '@/pages/joint-ventures'
import { ServicesPage } from '@/pages/services'
import { GalleryPage } from '@/pages/gallery'
import { OfficesPage } from '@/pages/offices'
import { JobsPage } from '@/pages/jobs'
import { HeroSlidesPage } from '@/pages/hero-slides'
import { SettingsPage } from '@/pages/settings'
import { ContactSubmissionsPage } from '@/pages/submissions/contact'
import { JobApplicationsPage } from '@/pages/submissions/applications'
import { UsersPage } from '@/pages/users'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/joint-ventures" element={<JointVenturesPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/offices" element={<OfficesPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/hero-slides" element={<HeroSlidesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/submissions/contact" element={<ContactSubmissionsPage />} />
              <Route path="/submissions/applications" element={<JobApplicationsPage />} />
              <Route path="/users" element={<UsersPage />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
