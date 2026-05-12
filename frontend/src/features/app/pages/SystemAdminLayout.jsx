import { useState } from 'react'
import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { AdminNav } from '../components/admin/AdminNav.jsx'

const MODULES = [
  { path: '', label: 'Dashboard', icon: icons.overview },
  { path: 'staff', label: 'Manage Staff', icon: icons.users },
]

const baseStyles = {
  layout: { height: '100vh', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--slogbaa-bg)', overflow: 'hidden' },
  body: { flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' },
  sidebarSection: { padding: '0 0 1rem' },
  sidebarSectionInner: { padding: '0 1rem' },
  navLinkIcon: { width: '1.1em', opacity: 0.9 },
}

const darkSidebarStyles = {
  sidebar: { width: 260, flexShrink: 0, height: '100%', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '1.25rem 0', boxShadow: '1px 0 12px rgba(0,0,0,0.08)', overflowY: 'auto', overflowX: 'hidden' },
  sidebarLabel: { margin: '0 1rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--slogbaa-text-muted)', borderBottom: '1px solid var(--slogbaa-border)', paddingBottom: '0.5rem' },
  navLink: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', minHeight: 44, marginBottom: 2, fontSize: '0.9375rem', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', borderRadius: 8, transition: 'background 0.15s, color 0.15s' },
  navLinkActive: { background: 'var(--slogbaa-blue)', color: '#fff', fontWeight: 600 },
}

const lightSidebarStyles = {
  sidebar: { ...darkSidebarStyles.sidebar, background: 'var(--slogbaa-glass-bg)', backdropFilter: 'var(--slogbaa-glass-blur)', WebkitBackdropFilter: 'var(--slogbaa-glass-blur)', borderRight: '1px solid var(--slogbaa-glass-border)', boxShadow: 'var(--slogbaa-glass-shadow)' },
  sidebarLabel: { ...darkSidebarStyles.sidebarLabel, color: 'var(--slogbaa-text-muted)' },
  navLink: { ...darkSidebarStyles.navLink, color: 'var(--slogbaa-text)' },
  navLinkActive: { background: 'var(--slogbaa-blue)', color: '#fff', fontWeight: 600 },
}

const styles = {
  ...baseStyles,
  main: { flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden', padding: 0, margin: '0 auto', width: '100%', background: 'var(--slogbaa-bg)', borderLeft: '1px solid var(--slogbaa-border)' },
  identityHeader: { 
    background: 'var(--slogbaa-glass-bg)', 
    backdropFilter: 'var(--slogbaa-glass-blur)',
    borderBottom: '1px solid var(--slogbaa-border)', 
    padding: '1.75rem 2.5rem', 
    marginBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  greeting: { 
    margin: 0, 
    fontSize: '1.75rem', 
    fontWeight: 800, 
    color: 'var(--slogbaa-text)',
    letterSpacing: '-0.025em',
    paddingLeft: '1rem',
    borderLeft: '4px solid var(--slogbaa-blue)'
  },
  mainContent: { padding: '1.5rem 2rem' },
}

export function SystemAdminLayout() {
  const { isAuthenticated, user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme } = useTheme()

  if (!isAuthenticated || !user) return <Navigate to="/auth/login" replace />

  const roleUpper = user.role && String(user.role).toUpperCase()
  if (roleUpper !== 'SYSTEM_ADMIN') return <Navigate to="/" replace />

  const sidebarStyles = theme === 'light' ? lightSidebarStyles : darkSidebarStyles
  const displayName = user?.fullName || user?.email || 'System Admin'

  return (
    <div style={styles.layout}>
      <AdminNav />
      <div style={styles.body}>
        <aside className="admin-sidebar" style={sidebarStyles.sidebar}>
          <div style={styles.sidebarSection}>
            <p style={sidebarStyles.sidebarLabel}>System Control</p>
            <div style={styles.sidebarSectionInner}>
              {MODULES.map(({ path, label, icon }) => (
                <NavLink
                  key={path}
                  to={`/system-admin${path ? '/' + path : ''}`}
                  end
                  style={({ isActive }) => ({ ...sidebarStyles.navLink, ...(isActive ? sidebarStyles.navLinkActive : {}) })}
                >
                  {icon && <FontAwesomeIcon icon={icon} style={styles.navLinkIcon} />}
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </aside>

        {mobileMenuOpen && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 900 }}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
        
        {mobileMenuOpen && (
          <aside
            style={{ ...sidebarStyles.sidebar, position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 901, width: 280, boxShadow: '4px 0 20px rgba(0,0,0,0.25)' }}
            className="admin-sidebar-mobile"
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.75rem 1rem 0' }}>
              <button type="button" onClick={() => setMobileMenuOpen(false)} style={{ border: 'none', background: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '1.25rem', cursor: 'pointer', padding: '0.5rem', minWidth: 44, minHeight: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }} aria-label="Close menu">
                <FontAwesomeIcon icon={icons.close} />
              </button>
            </div>
            <div style={baseStyles.sidebarSection}>
              <p style={sidebarStyles.sidebarLabel}>System Control</p>
              <div style={baseStyles.sidebarSectionInner}>
                {MODULES.map(({ path, label, icon }) => (
                  <NavLink key={path} to={`/system-admin${path ? '/' + path : ''}`} end style={({ isActive }) => ({ ...sidebarStyles.navLink, ...(isActive ? sidebarStyles.navLinkActive : {}) })} onClick={() => setMobileMenuOpen(false)}>
                    {icon && <FontAwesomeIcon icon={icon} style={baseStyles.navLinkIcon} />}
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          </aside>
        )}

        <main className="admin-main-content" style={styles.main}>
          <header style={styles.identityHeader}>
            <button
              type="button"
              className="mobile-menu-btn"
              style={{ display: 'none', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.625rem 1rem', minHeight: 44, border: '1px solid var(--slogbaa-border)', borderRadius: 10, background: 'var(--slogbaa-surface)', color: 'var(--slogbaa-text)', fontSize: '0.9375rem', fontWeight: 500, cursor: 'pointer' }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <FontAwesomeIcon icon={icons.viewList} /> Menu
            </button>
            <h1 style={styles.greeting}>Welcome, {displayName}</h1>
          </header>
          <div style={styles.mainContent}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
