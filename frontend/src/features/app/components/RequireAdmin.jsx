import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../iam/hooks/useAuth.js'

/**
 * Protects admin routes: redirects unauthenticated users to login
 * and trainees to /dashboard. Renders children (AdminLayout) for admins.
 */
export function RequireAdmin() {
  const { user, token } = useAuth()
  if (!token || !user) return <Navigate to="/auth/login" replace />
  const role = String(user.role ?? '').toUpperCase()
  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') return <Navigate to="/dashboard" replace />
  return <Outlet />
}
