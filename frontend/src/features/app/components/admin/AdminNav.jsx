import { useAuth } from '../../../iam/hooks/useAuth.js'
import { Link } from 'react-router-dom'

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1.5rem',
    background: 'var(--slogbaa-dark)',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logo: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#fff',
    textDecoration: 'none',
  },
  roleBadge: {
    padding: '0.2rem 0.5rem',
    borderRadius: 6,
    fontSize: '0.75rem',
    fontWeight: 500,
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  userLabel: {
    fontSize: '0.9375rem',
    color: 'rgba(255,255,255,0.9)',
  },
  signOut: {
    padding: '0.4rem 0.75rem',
    background: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 6,
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
}

export function AdminNav() {
  const { user, logout } = useAuth()
  const displayName = user?.fullName || user?.email || 'Staff'
  const roleLabel = user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'

  return (
    <header style={styles.nav}>
      <div style={styles.left}>
        <Link to="/admin" style={styles.logo}>
          SLOGBAA Admin
        </Link>
        <span style={styles.roleBadge}>{roleLabel}</span>
      </div>
      <div style={styles.right}>
        <span style={styles.userLabel}>{displayName}</span>
        <button type="button" style={styles.signOut} onClick={logout}>
          Sign out
        </button>
      </div>
    </header>
  )
}
