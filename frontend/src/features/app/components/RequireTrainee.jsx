import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../iam/hooks/useAuth.js'

/**
 * Protects trainee routes: redirects unauthenticated users to login
 * and staff users to /admin. Renders children (TraineeLayout) for trainees.
 */
export function RequireTrainee() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />
  }

  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}
