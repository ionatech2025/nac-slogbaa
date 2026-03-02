import { BrowserRouter } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout.jsx'
import { AppRoutes } from './features/app/routes.jsx'
import { AuthProvider } from './features/iam/context/AuthContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
