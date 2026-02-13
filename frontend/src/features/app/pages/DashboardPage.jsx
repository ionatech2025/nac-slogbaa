import { Navigate } from 'react-router-dom'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { TraineeDashboardPage } from './TraineeDashboardPage.jsx'

const styles = {
  page: { padding: '2rem', maxWidth: 800, margin: '0 auto' },
  title: { margin: '0 0 0.5rem', fontSize: '1.5rem', color: 'var(--slogbaa-text)' },
  subtitle: { margin: '0 0 1.5rem', fontSize: '0.875rem', color: 'var(--slogbaa-text-muted)' },
  logout: {
    padding: '0.5rem 1rem',
    background: 'transparent',
    color: 'var(--slogbaa-blue)',
    border: '1px solid var(--slogbaa-blue)',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
}

function isStaff(role) {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

export function DashboardPage() {
  const { isAuthenticated, user, logout } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />
  }

  if (!isStaff(user.role)) {
    return <TraineeDashboardPage />
  }

  const greeting = user.fullName ? `Hello, ${user.fullName}` : user.email
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Admin dashboard</h1>
      <p style={styles.subtitle}>{greeting} · {user.role}</p>
      <p style={{ color: 'var(--slogbaa-text-muted)', fontSize: '0.875rem' }}>
        Admin dashboard content will be built here.
      </p>
      <button type="button" style={styles.logout} onClick={logout}>
        Sign out
      </button>
    </div>
  )
}
