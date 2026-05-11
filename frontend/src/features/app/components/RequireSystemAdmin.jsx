import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../iam/hooks/useAuth.js'

export function RequireSystemAdmin() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />
  }

  const role = String(user.role ?? '').toUpperCase()
  if (role !== 'SYSTEM_ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
