import { createBrowserRouter } from 'react-router'
import { lazy, Suspense } from 'react'
import { RootLayout } from '@/components/layout/RootLayout'

// Eager load critical pages (small, frequently visited)
import { HomePage } from './pages/Home'
import { ServicesPage } from './pages/Services'
import { HSEPage } from './pages/HSE'
import { NotFoundPage } from './pages/NotFound'

// Lazy load heavier pages (forms, file upload, large galleries)
const GalleryPage = lazy(() => import('./pages/Gallery'))
const ContactPage = lazy(() => import('./pages/Contact'))
const CareersPage = lazy(() => import('./pages/Careers'))
const PartnersPage = lazy(() => import('./pages/Partners'))
const JointVenturesPage = lazy(() => import('./pages/JointVentures'))

// Simple loading spinner for lazy-loaded pages
function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

// Suspense wrapper for lazy components
function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'services',
        element: <ServicesPage />,
      },
      {
        path: 'hse',
        element: <HSEPage />,
      },
      {
        path: 'gallery',
        element: (
          <LazyPage>
            <GalleryPage />
          </LazyPage>
        ),
      },
      {
        path: 'contact',
        element: (
          <LazyPage>
            <ContactPage />
          </LazyPage>
        ),
      },
      {
        path: 'careers',
        element: (
          <LazyPage>
            <CareersPage />
          </LazyPage>
        ),
      },
      {
        path: 'partners',
        element: (
          <LazyPage>
            <PartnersPage />
          </LazyPage>
        ),
      },
      {
        path: 'joint-ventures',
        element: (
          <LazyPage>
            <JointVenturesPage />
          </LazyPage>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
