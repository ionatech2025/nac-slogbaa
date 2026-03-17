import { Link } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../../shared/icons.jsx'
import { useAuth } from '../../../iam/hooks/useAuth.js'
import { useTheme } from '../../../../contexts/ThemeContext.jsx'
import { Logo } from '../../../../shared/components/Logo.jsx'

const darkStyles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1.5rem',
    background: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(16px) saturate(170%)',
    WebkitBackdropFilter: 'blur(16px) saturate(170%)',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  logo: { textDecoration: 'none', display: 'inline-flex', alignItems: 'center' },
  roleBadge: {
    padding: '0.2rem 0.5rem',
    borderRadius: 6,
    fontSize: '0.75rem',
    fontWeight: 500,
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
  },
  userLabel: { fontSize: '0.9375rem', color: 'rgba(255,255,255,0.9)' },
  signOut: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 0.75rem',
    minHeight: 44,
    background: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 8,
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
}

const lightStyles = {
  nav: {
    ...darkStyles.nav,
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'var(--slogbaa-glass-blur)',
    WebkitBackdropFilter: 'var(--slogbaa-glass-blur)',
    color: 'var(--slogbaa-text)',
    borderBottom: '1px solid var(--slogbaa-glass-border)',
    boxShadow: 'var(--slogbaa-glass-shadow)',
  },
  logo: { ...darkStyles.logo },
  roleBadge: {
    ...darkStyles.roleBadge,
    background: 'rgba(37, 99, 235, 0.12)',
    color: 'var(--slogbaa-blue)',
  },
  userLabel: { ...darkStyles.userLabel, color: 'var(--slogbaa-text)' },
  signOut: {
    ...darkStyles.signOut,
    color: 'var(--slogbaa-text)',
    border: '1px solid var(--slogbaa-border)',
    borderRadius: 8,
  },
}

export function AdminNav() {
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const styles = isLight ? lightStyles : darkStyles

  const leftStyle = { display: 'flex', alignItems: 'center', gap: '1rem' }
  const rightStyle = { display: 'flex', alignItems: 'center', gap: '0.75rem' }

  return (
    <header style={styles.nav}>
      <div style={leftStyle}>
        <Link to="/admin" style={styles.logo}>
          <Logo
            variant="full"
            size={30}
            color={isLight ? 'dark' : 'white'}
            subtitle="Admin"
          />
        </Link>
        <span style={styles.roleBadge}>{user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}</span>
      </div>
      <div style={rightStyle}>
        <span style={styles.userLabel}>{user?.fullName || user?.email || 'Staff'}</span>
        <button type="button" style={styles.signOut} onClick={logout}>
          <FontAwesomeIcon icon={icons.signOut} />
          Sign out
        </button>
      </div>
    </header>
  )
}
