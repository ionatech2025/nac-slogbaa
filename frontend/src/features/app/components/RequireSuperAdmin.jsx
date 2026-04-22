import { Navigate, Outlet, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../iam/hooks/useAuth.js'

/**
 * Protects superadmin-only routes: redirects regular admins to /admin/overview.
 */
export function RequireSuperAdmin() {
  const { user, token } = useAuth()
  const context = useOutletContext()
  
  if (!token || !user) return <Navigate to="/auth/login" replace />
  
  const role = String(user.role ?? '').toUpperCase()
  if (role !== 'SUPER_ADMIN') return <Navigate to="/admin/overview" replace />
  
  return <Outlet context={context} />
}
