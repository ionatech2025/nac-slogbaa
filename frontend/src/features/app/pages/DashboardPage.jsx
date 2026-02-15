import { Navigate } from 'react-router-dom'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { TraineeDashboardPage } from './TraineeDashboardPage.jsx'

export function DashboardPage() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />
  }

  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }

  return <TraineeDashboardPage />
}
