import { lazy, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client.js'
import { AppLayout } from './layouts/AppLayout.jsx'
import { AppRoutes } from './features/app/routes.jsx'
import { AuthProvider } from './features/iam/context/AuthContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { LiveRegionProvider } from './shared/components/LiveRegion.jsx'
import { ToastContainer } from './shared/components/Toast.jsx'
import { ErrorBoundary } from './shared/components/ErrorBoundary.jsx'
import { ScrollToTop } from './shared/components/ScrollToTop.jsx'

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() => import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })))
  : () => null

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <ThemeProvider>
            <AuthProvider>
              <LiveRegionProvider>
                <AppLayout>
                  <AppRoutes />
                </AppLayout>
                <ToastContainer />
              </LiveRegionProvider>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
