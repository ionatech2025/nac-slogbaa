import { BrowserRouter } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout.jsx'
import { AppRoutes } from './features/app/routes.jsx'
import { AuthProvider } from './features/iam/context/AuthContext.jsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
