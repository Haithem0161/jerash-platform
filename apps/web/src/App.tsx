import { RouterProvider } from 'react-router'
import { Providers } from '@/components/providers'
import { router } from '@/routes'

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}

export default App
