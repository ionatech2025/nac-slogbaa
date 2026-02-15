import { useState, useEffect } from 'react'
import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.js'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { getDashboardOverview } from '../../../api/admin/dashboard.js'
import { changePassword as changePasswordApi } from '../../../api/admin/me.js'
import { createStaff as createStaffApi } from '../../../api/admin/staff.js'
import { AdminNav } from '../components/admin/AdminNav.jsx'
import { CreateStaffModal } from '../components/admin/CreateStaffModal.jsx'
import { UpdateCoursesModal } from '../components/admin/UpdateCoursesModal.jsx'
import { ChangePasswordModal } from '../components/admin/ChangePasswordModal.jsx'

const MODULES_SUPER_ADMIN = [
  { path: 'homepage', label: 'Homepage', icon: icons.home },
  { path: 'overview', label: 'Overview', icon: icons.overview },
  { path: 'learning', label: 'Learning', icon: icons.learning },
  { path: 'assessment', label: 'Assessment', icon: icons.assessment },
  { path: 'reports', label: 'Reports & Analytics', icon: icons.reports },
]

const MODULES_ADMIN = [
  { path: 'overview', label: 'Overview', icon: icons.overview },
  { path: 'reports', label: 'Reports & Analytics', icon: icons.reports },
]

const styles = {
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--slogbaa-bg)',
  },
  body: {
    flex: 1,
    display: 'flex',
    minHeight: 0,
  },
  sidebar: {
    width: 260,
    flexShrink: 0,
    background: 'var(--slogbaa-dark)',
    borderRight: '3px solid var(--slogbaa-orange)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.25rem 0',
    boxShadow: '2px 0 12px rgba(0,0,0,0.12)',
  },
  sidebarSection: {
    padding: '0 0 1rem',
  },
  sidebarSectionLast: {
    paddingBottom: 0,
  },
  sidebarSectionInner: {
    padding: '0 1rem',
  },
  sidebarLabel: {
    margin: '0 1rem 0.6rem',
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--slogbaa-orange)',
    borderBottom: '1px solid rgba(241, 134, 37, 0.35)',
    paddingBottom: '0.5rem',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1rem',
    marginBottom: 2,
    fontSize: '0.9375rem',
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    borderRadius: 6,
    transition: 'background 0.15s, color 0.15s',
  },
  navLinkIcon: {
    width: '1.1em',
    opacity: 0.9,
  },
  navLinkActive: {
    background: 'var(--slogbaa-orange)',
    color: '#fff',
    fontWeight: 600,
  },
  quickActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.6rem 1rem',
    marginBottom: 2,
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    fontSize: '0.9375rem',
    color: 'rgba(255,255,255,0.85)',
    cursor: 'pointer',
    borderRadius: 6,
    transition: 'background 0.15s, color 0.15s',
  },
  quickActionIcon: {
    width: '1.1em',
    opacity: 0.9,
  },
  quickActionBtnHover: {
    background: 'rgba(241, 134, 37, 0.2)',
    color: '#fff',
  },
  main: {
    flex: 1,
    overflow: 'auto',
    padding: '1.5rem 2rem',
    maxWidth: 1000,
    margin: '0 auto',
    width: '100%',
    background: 'var(--slogbaa-bg)',
    borderLeft: '1px solid var(--slogbaa-border)',
  },
  greeting: {
    margin: '0 0 0.5rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--slogbaa-text)',
  },
  greetingDivider: {
    height: 0,
    border: 'none',
    borderBottom: '2px solid var(--slogbaa-orange)',
    margin: '0 0 1.5rem',
  },
}

export function AdminLayout() {
  const { isAuthenticated, user, token } = useAuth()
  const [staff, setStaff] = useState([])
  const [trainees, setTrainees] = useState([])
  const [overviewLoading, setOverviewLoading] = useState(true)
  const [overviewError, setOverviewError] = useState(null)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    if (!token) return
    setOverviewLoading(true)
    setOverviewError(null)
    getDashboardOverview(token)
      .then((result) => {
        if (result.error) {
          setOverviewError(result.error)
          return
        }
        setStaff(result.data.staff ?? [])
        setTrainees(result.data.trainees ?? [])
      })
      .finally(() => setOverviewLoading(false))
  }, [token])

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />
  }

  const roleUpper = user.role && String(user.role).toUpperCase()
  const isSuperAdmin = roleUpper === 'SUPER_ADMIN'
  const isAdmin = roleUpper === 'ADMIN' || isSuperAdmin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  const displayName = user?.fullName || user?.email || 'Admin'
  const modules = isSuperAdmin ? MODULES_SUPER_ADMIN : MODULES_ADMIN

  const handleCreateStaff = async (data) => {
    const created = await createStaffApi(token, data)
    setStaff((prev) => [
      ...prev,
      {
        id: created.id,
        fullName: created.fullName,
        email: created.email,
        role: created.role,
      },
    ])
  }

  const handleChangePassword = async (data) => {
    await changePasswordApi(token, data)
  }

  const outletContext = {
    staff,
    trainees,
    overviewLoading,
    overviewError,
    handleCreateStaff,
    displayName,
  }

  return (
    <div style={styles.layout}>
      <AdminNav />
      <div style={styles.body}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarSection}>
            <p style={styles.sidebarLabel}>Sections</p>
            <div style={styles.sidebarSectionInner}>
              {modules.map(({ path, label, icon }) => (
                <NavLink
                  key={path}
                  to={`/admin/${path}`}
                  end={path === 'overview'}
                  style={({ isActive }) => ({
                    ...styles.navLink,
                    ...(isActive ? styles.navLinkActive : {}),
                  })}
                >
                  {icon && <FontAwesomeIcon icon={icon} style={styles.navLinkIcon} />}
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

          <div style={{ ...styles.sidebarSection, ...styles.sidebarSectionLast }}>
            <p style={styles.sidebarLabel}>Quick Actions</p>
            <div style={styles.sidebarSectionInner}>
              {isSuperAdmin && (
                <>
                  <button
                    type="button"
                    style={styles.quickActionBtn}
                    onClick={() => setModal('updateCourses')}
                  >
                    <FontAwesomeIcon icon={icons.updateCourses} style={styles.quickActionIcon} />
                    Update Courses
                  </button>
                  <button
                    type="button"
                    style={styles.quickActionBtn}
                    onClick={() => setModal('createStaff')}
                  >
                    <FontAwesomeIcon icon={icons.createStaff} style={styles.quickActionIcon} />
                    Create Staff
                  </button>
                </>
              )}
              <button
                type="button"
                style={styles.quickActionBtn}
                onClick={() => setModal('changePassword')}
              >
                <FontAwesomeIcon icon={icons.changePassword} style={styles.quickActionIcon} />
                Change Password
              </button>
            </div>
          </div>
        </aside>

        <main style={styles.main}>
          <h1 style={styles.greeting}>Welcome back, {displayName}! 👋</h1>
          <hr style={styles.greetingDivider} aria-hidden />
          <Outlet context={outletContext} />
        </main>
      </div>

      {modal === 'createStaff' && (
        <CreateStaffModal
          onClose={() => setModal(null)}
          onSubmit={handleCreateStaff}
        />
      )}
      {modal === 'updateCourses' && (
        <UpdateCoursesModal onClose={() => setModal(null)} />
      )}
      {modal === 'changePassword' && (
        <ChangePasswordModal
          onClose={() => setModal(null)}
          onSubmit={handleChangePassword}
        />
      )}
    </div>
  )
}
