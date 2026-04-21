import { useState, useEffect, useMemo } from 'react'
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon, icons } from '../../../shared/icons.jsx'
import { useAuth } from '../../iam/hooks/useAuth.js'
import { useAdminOverview, useAdminCourseCount, useAdminCourses } from '../../../lib/hooks/use-admin.js'
import { useDeleteStaff, useDeleteTrainee } from '../../../lib/hooks/use-admin-users.js'
import { changePassword as changePasswordApi } from '../../../api/admin/me.js'
import { createStaff as createStaffApi } from '../../../api/admin/staff.js'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { AdminNav } from '../components/admin/AdminNav.jsx'
import { CreateStaffModal } from '../components/admin/CreateStaffModal.jsx'
import { UpdateCoursesModal } from '../components/admin/UpdateCoursesModal.jsx'
import { ChangePasswordModal } from '../components/admin/ChangePasswordModal.jsx'
import { CommandPalette } from '../../../shared/components/CommandPalette.jsx'
import { useToast } from '../../../shared/hooks/useToast.js'

const MODULES_SUPER_ADMIN = [
  { path: 'homepage', label: 'Landing page', icon: icons.home },
  { path: 'overview', label: 'Overview', icon: icons.overview },
  { path: 'learning', label: 'Learning', icon: icons.learning },
  { path: 'coursemanagement', label: 'Course Management', icon: icons.course },
  { path: 'library', label: 'Library', icon: icons.library },
  { path: 'assessment', label: 'Assessment', icon: icons.assessment },
  { path: 'live-sessions', label: 'Live sessions', icon: icons.blockVideo },
  { path: 'reports', label: 'Reports & Analytics', icon: icons.reports },
]

const MODULES_ADMIN = [
  { path: 'overview', label: 'Overview', icon: icons.overview },
  { path: 'learning', label: 'Learning', icon: icons.learning },
  { path: 'library', label: 'Library', icon: icons.library },
  { path: 'assessment', label: 'Assessment', icon: icons.assessment },
  { path: 'live-sessions', label: 'Live sessions', icon: icons.blockVideo },
  { path: 'reports', label: 'Reports & Analytics', icon: icons.reports },
]

const baseStyles = {
  layout: { height: '100vh', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--slogbaa-bg)', overflow: 'hidden' },
  body: { flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' },
  sidebarSection: { padding: '0 0 1rem' },
  sidebarSectionLast: { paddingBottom: 0 },
  sidebarSectionInner: { padding: '0 1rem' },
  navLinkIcon: { width: '1.1em', opacity: 0.9 },
  quickActionIcon: { width: '1.1em', opacity: 0.9 },
}

const darkSidebarStyles = {
  sidebar: { width: 260, flexShrink: 0, height: '100%', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '1.25rem 0', boxShadow: '1px 0 12px rgba(0,0,0,0.08)', overflowY: 'auto', overflowX: 'hidden' },
  sidebarLabel: { margin: '0 1rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--slogbaa-text-muted)', borderBottom: '1px solid var(--slogbaa-border)', paddingBottom: '0.5rem' },
  navLink: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', minHeight: 44, marginBottom: 2, fontSize: '0.9375rem', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', borderRadius: 8, transition: 'background 0.15s, color 0.15s' },
  navLinkActive: { background: 'var(--primary-orange, #F58220)', color: '#fff', fontWeight: 600 },
  quickActionBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.7rem 1rem', minHeight: 44, marginBottom: 2, border: 'none', background: 'transparent', textAlign: 'left', fontSize: '0.9375rem', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', borderRadius: 8, transition: 'background 0.15s, color 0.15s' },
}

const lightSidebarStyles = {
  sidebar: { ...darkSidebarStyles.sidebar, background: 'var(--slogbaa-glass-bg)', backdropFilter: 'var(--slogbaa-glass-blur)', WebkitBackdropFilter: 'var(--slogbaa-glass-blur)', borderRight: '1px solid var(--slogbaa-glass-border)', boxShadow: 'var(--slogbaa-glass-shadow)' },
  sidebarLabel: { ...darkSidebarStyles.sidebarLabel, color: 'var(--slogbaa-text-muted)' },
  navLink: { ...darkSidebarStyles.navLink, color: 'var(--slogbaa-text)' },
  navLinkActive: { background: 'var(--primary-orange, #F58220)', color: '#fff', fontWeight: 600 },
  quickActionBtn: { ...darkSidebarStyles.quickActionBtn, color: 'var(--slogbaa-text)' },
}

const styles = {
  ...baseStyles,
  main: { flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden', padding: 0, maxWidth: 1000, margin: '0 auto', width: '100%', background: 'var(--slogbaa-bg)', borderLeft: '1px solid var(--slogbaa-border)' },
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
    borderLeft: '4px solid var(--primary-orange, #F58220)'
  },
  greetingDivider: { display: 'none' },
  mainContent: { padding: '1.5rem 2rem' },
}

export function AdminLayout() {
  const { isAuthenticated, user, token } = useAuth()
  const navigate = useNavigate()
  const [modal, setModal] = useState(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // TanStack Query — cached, auto-refetch, shared across child routes
  const { data: overviewData, isLoading: overviewLoading, error: overviewQueryError, refetch: refreshOverview } = useAdminOverview()
  const { data: courseCount = 0 } = useAdminCourseCount()
  const deleteStaffMutation = useDeleteStaff()
  const deleteTraineeMutation = useDeleteTrainee()

  const { data: pagedData } = useAdminCourses(0, 100)
  const courses = pagedData?.content ?? []

  const staff = overviewData?.data?.staff ?? []
  const trainees = overviewData?.data?.trainees ?? []
  const overviewError = overviewQueryError?.message ?? null

  // Ctrl+K / Cmd+K command palette + G-prefix keyboard shortcuts
  useEffect(() => {
    let gPressed = false
    let gTimer = null
    const handler = (e) => {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target?.isContentEditable) return
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
        return
      }
      if (e.key === 'g' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        gPressed = true
        clearTimeout(gTimer)
        gTimer = setTimeout(() => { gPressed = false }, 500)
        return
      }
      if (gPressed) {
        gPressed = false
        clearTimeout(gTimer)
        const routes = { o: '/admin/overview', r: '/admin/reports', l: '/admin/learning', b: '/admin/library', a: '/admin/assessment', c: '/admin/coursemanagement', v: '/admin/live-sessions' }
        if (routes[e.key]) { e.preventDefault(); navigate(routes[e.key]) }
      }
    }
    document.addEventListener('keydown', handler)
    return () => { document.removeEventListener('keydown', handler); clearTimeout(gTimer) }
  }, [navigate])

  if (!isAuthenticated || !user) return <Navigate to="/auth/login" replace />

  const roleUpper = user.role && String(user.role).toUpperCase()
  const isSuperAdmin = roleUpper === 'SUPER_ADMIN'
  const isAdmin = roleUpper === 'ADMIN' || isSuperAdmin
  if (!isAdmin) return <Navigate to="/dashboard" replace />

  const { theme } = useTheme()
  const sidebarStyles = theme === 'light' ? lightSidebarStyles : darkSidebarStyles
  const displayName = user?.fullName || user?.email || 'Admin'
  const modules = isSuperAdmin ? MODULES_SUPER_ADMIN : MODULES_ADMIN

  const toast = useToast()

  const handleCreateStaff = async (data) => {
    try {
      await createStaffApi(token, data)
      refreshOverview()
      toast.success('Staff member created.')
    } catch (e) {
      toast.error(e?.message ?? 'Failed to create staff.')
      throw e
    }
  }

  const handleChangePassword = async (data) => {
    try {
      await changePasswordApi(token, data)
      toast.success('Password changed.')
    } catch (e) {
      toast.error(e?.message ?? 'Failed to change password.')
      throw e
    }
  }

  const handleDeleteStaff = async (id) => {
    try {
      await deleteStaffMutation.mutateAsync(id)
      toast.success('Staff member deleted.')
    } catch (e) {
      toast.error(e?.message ?? 'Failed to delete staff.')
    }
  }

  const handleDeleteTrainee = async (id) => {
    try {
      await deleteTraineeMutation.mutateAsync(id)
      toast.success('Trainee deleted.')
    } catch (e) {
      toast.error(e?.message ?? 'Failed to delete trainee.')
    }
  }

  const outletContext = {
    staff, trainees, courseCount, overviewLoading, overviewError,
    handleCreateStaff, handleDeleteStaff, handleDeleteTrainee, refreshOverview,
    isSuperAdmin, displayName, token,
    currentUserId: user?.userId ?? null,
    currentUserEmail: user?.email ?? null,
  }

  const STATIC_COMMANDS = [
    { label: 'Go to Overview', group: 'Navigation', onSelect: () => navigate('/admin/overview'), shortcut: 'G O' },
    { label: 'Go to Reports & Analytics', group: 'Navigation', onSelect: () => navigate('/admin/reports'), shortcut: 'G R' },
    ...(isSuperAdmin ? [{ label: 'Go to Landing page', group: 'Navigation', onSelect: () => navigate('/admin/homepage') }] : []),
    { label: 'Go to Learning', group: 'Navigation', onSelect: () => navigate('/admin/learning'), shortcut: 'G L' },
    { label: 'Go to Library', group: 'Navigation', onSelect: () => navigate('/admin/library') },
    { label: 'Go to Assessment', group: 'Navigation', onSelect: () => navigate('/admin/assessment') },
    { label: 'Go to Live sessions', group: 'Navigation', onSelect: () => navigate('/admin/live-sessions'), shortcut: 'G V' },
    { label: 'Go to Course Management', group: 'Navigation', onSelect: () => navigate('/admin/coursemanagement') },
    ...(isSuperAdmin ? [
      { label: 'Create Staff', group: 'Actions', onSelect: () => setModal('createStaff') },
      { label: 'Update Courses', group: 'Actions', onSelect: () => setModal('updateCourses') },
    ] : []),
    { label: 'Change Password', group: 'Actions', onSelect: () => setModal('changePassword') },
  ]

  const paletteCommands = useMemo(() => {
    const staffCommands = (staff ?? []).map(s => ({
      label: s.fullName,
      subtitle: `Staff · ${s.email}`,
      group: 'People',
      onSelect: () => navigate(`/admin/users/staff/${s.id}`),
    }))

    const traineeCommands = (trainees ?? []).map(t => ({
      label: t.fullName,
      subtitle: `Trainee · ${t.email}${t.districtName ? ` · ${t.districtName}` : ''}`,
      group: 'People',
      onSelect: () => navigate(`/admin/users/trainee/${t.id}`),
    }))

    const courseCommands = (courses ?? []).map(c => ({
      label: c.title,
      subtitle: `Course · ${c.published ? 'Published' : 'Draft'} · ${c.moduleCount || 0} modules`,
      group: 'Courses',
      onSelect: () => navigate(`/admin/learning/${c.id}`),
    }))

    return [...STATIC_COMMANDS, ...staffCommands, ...traineeCommands, ...courseCommands]
  }, [staff, trainees, courses, isSuperAdmin, navigate])

  return (
    <div style={styles.layout}>
      <AdminNav />
      <div style={styles.body}>
        <aside className="admin-sidebar" style={sidebarStyles.sidebar}>
          <div style={styles.sidebarSection}>
            <p style={sidebarStyles.sidebarLabel}>Sections</p>
            <div style={styles.sidebarSectionInner}>
              {modules.map(({ path, label, icon }) => (
                <NavLink
                  key={path}
                  to={`/admin/${path}`}
                  end={path === 'overview'}
                  style={({ isActive }) => ({ ...sidebarStyles.navLink, ...(isActive ? sidebarStyles.navLinkActive : {}) })}
                >
                  {icon && <FontAwesomeIcon icon={icon} style={styles.navLinkIcon} />}
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

          <div style={{ padding: '0 1rem 1rem' }}>
            <button
              type="button"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem', cursor: 'pointer', textAlign: 'left' }}
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
            >
              <span style={{ flex: 1 }}>Search commands…</span>
              <kbd style={{ fontSize: '0.6875rem', padding: '0.1rem 0.35rem', borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', fontFamily: 'ui-monospace, monospace' }}>⌘K</kbd>
            </button>
          </div>

          <div style={{ ...styles.sidebarSection, ...styles.sidebarSectionLast }}>
            <p style={sidebarStyles.sidebarLabel}>Quick Actions</p>
            <div style={styles.sidebarSectionInner}>
              {isSuperAdmin && (
                <>
                  <button type="button" style={sidebarStyles.quickActionBtn} onClick={() => setModal('updateCourses')}>
                    <FontAwesomeIcon icon={icons.updateCourses} style={styles.quickActionIcon} /> Update Courses
                  </button>
                  <button type="button" style={sidebarStyles.quickActionBtn} onClick={() => setModal('createStaff')}>
                    <FontAwesomeIcon icon={icons.createStaff} style={styles.quickActionIcon} /> Create Staff
                  </button>
                </>
              )}
              <button type="button" style={sidebarStyles.quickActionBtn} onClick={() => setModal('changePassword')}>
                <FontAwesomeIcon icon={icons.changePassword} style={styles.quickActionIcon} /> Change Password
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 900 }}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
        {/* Mobile slide-out sidebar clone */}
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
              <p style={sidebarStyles.sidebarLabel}>Sections</p>
              <div style={baseStyles.sidebarSectionInner}>
                {modules.map(({ path, label, icon }) => (
                  <NavLink key={path} to={`/admin/${path}`} end={path === 'overview'} style={({ isActive }) => ({ ...sidebarStyles.navLink, ...(isActive ? sidebarStyles.navLinkActive : {}) })} onClick={() => setMobileMenuOpen(false)}>
                    {icon && <FontAwesomeIcon icon={icon} style={baseStyles.navLinkIcon} />}
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          </aside>
        )}

        <main className="admin-main-content" style={styles.main}>
          {/* Identity header: white with thick orange bottom border */}
          <header style={styles.identityHeader}>
            <button
              type="button"
              className="mobile-menu-btn"
              style={{ display: 'none', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.625rem 1rem', minHeight: 44, border: '1px solid var(--slogbaa-border)', borderRadius: 10, background: 'var(--slogbaa-surface)', color: 'var(--slogbaa-text)', fontSize: '0.9375rem', fontWeight: 500, cursor: 'pointer' }}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <FontAwesomeIcon icon={icons.viewList} /> Menu
            </button>
            <h1 style={styles.greeting}>Welcome back, {displayName}!</h1>
          </header>
          <div style={styles.mainContent}>
            <Outlet context={outletContext} />
          </div>
        </main>
      </div>

      {modal === 'createStaff' && <CreateStaffModal onClose={() => setModal(null)} onSubmit={handleCreateStaff} />}
      {modal === 'updateCourses' && <UpdateCoursesModal onClose={() => setModal(null)} />}
      {modal === 'changePassword' && <ChangePasswordModal onClose={() => setModal(null)} onSubmit={handleChangePassword} />}

      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          commands={paletteCommands}
        />
      )}
    </div>
  )
}
