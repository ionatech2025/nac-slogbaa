import { Navigate } from 'react-router-dom'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { TraineeDashboardPage } from './TraineeDashboardPage.jsx'

export function DashboardPage() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />
  }

  const role = String(user.role ?? '').toUpperCase()
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }

  return <TraineeDashboardPage />
}
